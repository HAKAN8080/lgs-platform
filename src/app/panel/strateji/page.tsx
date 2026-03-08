'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/auth-context';
import { stratejiHesapla, type StratejSonuc, type DersKey } from '@/lib/calculations/strateji-motoru';
import { Loader2, AlertTriangle, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';

const TREND_ICON = {
  'düşüş': <TrendingDown className="w-4 h-4 text-red-500" />,
  'artış': <TrendingUp className="w-4 h-4 text-green-500" />,
  'stabil': <Minus className="w-4 h-4 text-gray-400" />,
  'yetersiz_veri': <Minus className="w-4 h-4 text-gray-300" />,
};

const SEVIYE_STIL: Record<string, string> = {
  'Kritik': 'bg-red-500/10 text-red-600 border-red-500/20',
  'Zayıf':  'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'Orta':   'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  'İyi':    'bg-green-500/10 text-green-600 border-green-500/20',
};

export default function StratejiPage() {
  const { user, loading: authLoading } = useAuth();
  const [sonuc, setSonuc] = useState<StratejSonuc | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');

  useEffect(() => {
    if (!user || !db) {
      setYukleniyor(false);
      return;
    }

    const yukle = async () => {
      try {
        // Son 3 denemeyi çek (client-side sıralama - index gerektirmez)
        const q = query(
          collection(db!, 'denemeler'),
          where('userId', '==', user.uid)
        );
        const snap = await getDocs(q);
        const tumDenemeler = snap.docs
          .map((d) => d.data())
          .sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
          .slice(0, 5);
        // Karne verilerinde key'ler tam isim olabilir, normalize et
        const KEY_MAP: Record<string, DersKey> = {
          'Türkçe': 'turkce', 'turkce': 'turkce',
          'Matematik': 'matematik', 'matematik': 'matematik',
          'Fen Bilimleri': 'fen', 'Fen': 'fen', 'fen': 'fen',
          'T.C. İnkılap Tarihi': 'inkilap', 'İnkılap Tarihi': 'inkilap', 'inkilap': 'inkilap',
          'Din Kültürü': 'din', 'din': 'din',
          'İngilizce': 'ingilizce', 'ingilizce': 'ingilizce',
        };
        const denemeler = tumDenemeler.map((d) => {
          const raw = d.netler as Record<string, number>;
          const normalized: Partial<Record<DersKey, number>> = {};
          for (const [k, v] of Object.entries(raw)) {
            const mapped = KEY_MAP[k];
            if (mapped) normalized[mapped] = v;
          }
          return normalized as Record<DersKey, number>;
        });

        // Müsaitlik programını çek
        const programRef = doc(db!, 'users', user.uid, 'calismaProgram', 'program');
        const programSnap = await getDoc(programRef);
        const musaitlik = programSnap.exists() ? programSnap.data().musaitlik : {};

        setSonuc(stratejiHesapla(denemeler, musaitlik));
      } catch (e) {
        console.error(e);
        setHata('Veriler yüklenirken bir hata oluştu.');
      } finally {
        setYukleniyor(false);
      }
    };

    yukle();
  }, [user]);

  if (authLoading || yukleniyor) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        Giriş yapmanız gerekiyor.
      </div>
    );
  }

  if (hata) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500 gap-2">
        <AlertTriangle className="w-5 h-5" />
        {hata}
      </div>
    );
  }

  if (!sonuc) return null;

  const { dersler, toplamMusaitSaat, anaSaatHavuzu, araSaatHavuzu, genelMesaj } = sonuc;
  const anaGrup = dersler.filter((d) => d.grup === 'ana');
  const araGrup = dersler.filter((d) => d.grup === 'ara');
  const uyarilar = dersler.filter((d) => d.uyari);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Haftalık Çalışma Stratejisi</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Son 5 deneme sonucuna ve çalışma programına göre hesaplanmıştır.
        </p>
      </div>

      {/* Genel mesaj */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
        <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-foreground">{genelMesaj}</p>
      </div>

      {/* Uyarılar */}
      {uyarilar.length > 0 && (
        <div className="mb-6 space-y-2">
          {uyarilar.map((d) => (
            <div key={d.key} className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{d.uyari}</p>
            </div>
          ))}
        </div>
      )}

      {/* Havuz özeti */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{toplamMusaitSaat}</div>
          <div className="text-xs text-muted-foreground mt-1">Toplam Saat / Hafta</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{anaSaatHavuzu}</div>
          <div className="text-xs text-blue-400 mt-1">Ana Dersler</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{araSaatHavuzu}</div>
          <div className="text-xs text-purple-400 mt-1">Ara Dersler</div>
        </div>
      </div>

      {/* Ana dersler */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Ana Dersler
        </h2>
        <div className="space-y-3">
          {anaGrup.map((d) => (
            <DersKarti key={d.key} ders={d} />
          ))}
        </div>
      </div>

      {/* Ara dersler */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Ara Dersler
        </h2>
        <div className="space-y-3">
          {araGrup.map((d) => (
            <DersKarti key={d.key} ders={d} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DersKarti({ ders }: { ders: StratejSonuc['dersler'][0] }) {
  const barGenislik = Math.min(100, ders.netYuzdesi);

  return (
    <div className="bg-card border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{ders.icon}</span>
          <div>
            <div className="font-semibold text-foreground">{ders.label}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SEVIYE_STIL[ders.seviye]}`}>
                {ders.seviye}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {TREND_ICON[ders.trend]}
                {ders.trend === 'yetersiz_veri' ? 'veri yok' : ders.trend}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">{ders.onerilen} saat</div>
          <div className="text-xs text-muted-foreground">/ hafta</div>
        </div>
      </div>

      {/* Net bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              ders.seviye === 'Kritik' ? 'bg-red-500' :
              ders.seviye === 'Zayıf'  ? 'bg-orange-500' :
              ders.seviye === 'Orta'   ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${barGenislik}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {ders.ortalamaNet} / {ders.maxNet} net
        </span>
      </div>
    </div>
  );
}
