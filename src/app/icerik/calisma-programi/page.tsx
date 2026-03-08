'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/auth-context';
import {
  stratejiHesapla,
  gunlukProgramOlustur,
  type DersKey,
  type GunlukProgram,
  type StratejSonuc,
} from '@/lib/calculations/strateji-motoru';
import { Loader2, ChevronRight, ChevronLeft, Check, AlertTriangle, Database, PenLine } from 'lucide-react';

// ─── Sabitler ────────────────────────────────────────────────────────────────
const GUNLER = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const GUNLER_TAM = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const SAATLER = Array.from({ length: 15 }, (_, i) => i + 9);

const DERSLER_MANUEL: { key: DersKey; label: string; icon: string; max: number }[] = [
  { key: 'turkce',    label: 'Türkçe',    icon: '📖', max: 20 },
  { key: 'matematik', label: 'Matematik', icon: '📐', max: 20 },
  { key: 'fen',       label: 'Fen',       icon: '🔬', max: 20 },
  { key: 'inkilap',   label: 'İnkılap',   icon: '🏛️', max: 10 },
  { key: 'din',       label: 'Din',       icon: '☪️', max: 10 },
  { key: 'ingilizce', label: 'İngilizce', icon: '🌍', max: 10 },
];

const KEY_MAP: Record<string, DersKey> = {
  'Türkçe': 'turkce', 'turkce': 'turkce',
  'Matematik': 'matematik', 'matematik': 'matematik',
  'Fen Bilimleri': 'fen', 'Fen': 'fen', 'fen': 'fen',
  'T.C. İnkılap Tarihi': 'inkilap', 'İnkılap Tarihi': 'inkilap', 'inkilap': 'inkilap',
  'Din Kültürü': 'din', 'din': 'din',
  'İngilizce': 'ingilizce', 'ingilizce': 'ingilizce',
};

type Musaitlik = Record<string, number[]>;

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────
export default function CalismaProgramiPage() {
  const { user, loading: authLoading } = useAuth();
  const [adim, setAdim] = useState(1);

  // Adım 1
  const [musaitlik, setMusaitlik] = useState<Musaitlik>(() =>
    Object.fromEntries(GUNLER.map((g) => [g, []]))
  );
  const [programYukleniyor, setProgramYukleniyor] = useState(true);
  const [kaydediyor, setKaydediyor] = useState(false);
  const [adim1Hatalar, setAdim1Hatalar] = useState<string[]>([]);

  // Adım 2
  const [netMod, setNetMod] = useState<'otomatik' | 'manuel'>('otomatik');
  const [manuelNetler, setManuelNetler] = useState<Record<string, string>>(
    Object.fromEntries(DERSLER_MANUEL.map((d) => [d.key, '']))
  );
  const [denemelerYukleniyor, setDenemelerYukleniyor] = useState(false);
  const [denemeler, setDenemeler] = useState<Array<Record<DersKey, number>>>([]);

  // Adım 3
  const [sonuc, setSonuc] = useState<StratejSonuc | null>(null);
  const [gunlukProgram, setGunlukProgram] = useState<GunlukProgram | null>(null);

  // Mevcut programı yükle
  useEffect(() => {
    if (!user || !db) { setProgramYukleniyor(false); return; }
    const yukle = async () => {
      try {
        const ref = doc(db!, 'users', user.uid, 'calismaProgram', 'program');
        const snap = await getDoc(ref);
        if (snap.exists()) setMusaitlik(snap.data().musaitlik);
      } finally {
        setProgramYukleniyor(false);
      }
    };
    yukle();
  }, [user]);

  // Denemeleri yükle (adım 2 açılınca)
  useEffect(() => {
    if (adim !== 2 || !user || !db) return;
    setDenemelerYukleniyor(true);
    const yukle = async () => {
      try {
        const q = query(collection(db!, 'denemeler'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const list = snap.docs
          .map((d) => d.data())
          .sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
          .slice(0, 5)
          .map((d) => {
            const raw = d.netler as Record<string, number>;
            const norm: Partial<Record<DersKey, number>> = {};
            for (const [k, v] of Object.entries(raw)) {
              const mapped = KEY_MAP[k];
              if (mapped) norm[mapped] = v;
            }
            return norm as Record<DersKey, number>;
          });
        setDenemeler(list);
      } finally {
        setDenemelerYukleniyor(false);
      }
    };
    yukle();
  }, [adim, user]);

  // ─── Adım 1 ──────────────────────────────────────────────────────────────
  const toggleSaat = (gun: string, saat: number) => {
    setMusaitlik((prev) => {
      const mevcutlar = prev[gun];
      const yeni = mevcutlar.includes(saat)
        ? mevcutlar.filter((s) => s !== saat)
        : [...mevcutlar, saat].sort((a, b) => a - b);
      return { ...prev, [gun]: yeni };
    });
    setAdim1Hatalar([]);
  };

  const adim1Dogrula = (): string[] => {
    const h: string[] = [];
    GUNLER.forEach((gun, i) => {
      const s = musaitlik[gun];
      if (s.length > 0 && s.length < 2)
        h.push(`${GUNLER_TAM[i]}: en az 2 saat seçilmeli (${s.length} saat seçildi)`);
    });
    if (Object.values(musaitlik).every((s) => s.length === 0))
      h.push('En az bir gün için saat seçmelisin.');
    return h;
  };

  const adim1Ileri = async () => {
    const h = adim1Dogrula();
    if (h.length > 0) { setAdim1Hatalar(h); return; }
    if (!user || !db) { setAdim(2); return; }
    setKaydediyor(true);
    try {
      await setDoc(doc(db!, 'users', user.uid, 'calismaProgram', 'program'), {
        musaitlik,
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setKaydediyor(false);
      setAdim(2);
    }
  };

  // ─── Adım 2 ──────────────────────────────────────────────────────────────
  const adim2Ileri = () => {
    const inputDenemeler =
      netMod === 'otomatik'
        ? denemeler
        : [Object.fromEntries(
            DERSLER_MANUEL.map((d) => [d.key, parseFloat(manuelNetler[d.key] || '0') || 0])
          ) as Record<DersKey, number>];

    const hesaplanan = stratejiHesapla(inputDenemeler, musaitlik);
    setSonuc(hesaplanan);
    setGunlukProgram(gunlukProgramOlustur(hesaplanan.dersler, musaitlik));
    setAdim(3);
  };

  // ─── Yükleniyor ──────────────────────────────────────────────────────────
  if (authLoading || programYukleniyor) {
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

  const toplamSaat = Object.values(musaitlik).reduce((t, s) => t + s.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Çalışma Programı Oluşturucu</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          3 adımda kişiselleştirilmiş haftalık ders programını oluştur.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: 'Müsaitlik' },
          { n: 2, label: 'Net Girişi' },
          { n: 3, label: 'Program' },
        ].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                adim > n
                  ? 'bg-primary border-primary text-primary-foreground'
                  : adim === n
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-muted-foreground/30 text-muted-foreground/50'
              }`}>
                {adim > n ? <Check className="w-4 h-4" /> : n}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                adim === n ? 'text-foreground' : 'text-muted-foreground/60'
              }`}>{label}</span>
            </div>
            {i < arr.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${adim > n ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── ADIM 1: Müsaitlik ─────────────────────────────────────────────── */}
      {adim === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Çalışabileceğin saat bloklarını işaretle (günlük min 2 saat).</p>
            <div className="flex gap-3 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{toplamSaat} saat/hafta</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border bg-card shadow-sm mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="w-16 py-3 px-3 text-left text-muted-foreground font-normal">Saat</th>
                  {GUNLER.map((gun) => (
                    <th key={gun} className="py-3 px-2 text-center font-semibold text-foreground min-w-[52px]">
                      <div>{gun}</div>
                      {musaitlik[gun].length > 0 && (
                        <div className="text-xs font-normal text-primary mt-0.5">{musaitlik[gun].length}s</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAATLER.map((saat) => (
                  <tr key={saat} className="border-b last:border-0 hover:bg-accent/30">
                    <td className="py-2 px-3 text-muted-foreground text-xs">{String(saat).padStart(2, '0')}:00</td>
                    {GUNLER.map((gun) => {
                      const secili = musaitlik[gun].includes(saat);
                      return (
                        <td key={gun} className="py-1.5 px-2 text-center">
                          <button
                            onClick={() => toggleSaat(gun, saat)}
                            className={`w-9 h-7 rounded-md transition-all text-xs font-medium ${
                              secili
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary'
                            }`}
                          >
                            {secili ? '✓' : ''}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {adim1Hatalar.length > 0 && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600 font-medium mb-1">
                <AlertTriangle className="w-4 h-4" />
                Düzeltilmesi gerekenler:
              </div>
              <ul className="list-disc list-inside text-red-500 text-sm space-y-0.5">
                {adim1Hatalar.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={adim1Ileri}
              disabled={kaydediyor}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              {kaydediyor ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              İleri
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── ADIM 2: Net Girişi ────────────────────────────────────────────── */}
      {adim === 2 && (
        <div>
          {/* Mod seçici */}
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg w-fit">
            <button
              onClick={() => setNetMod('otomatik')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                netMod === 'otomatik' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Database className="w-4 h-4" />
              Karneden Oluştur
            </button>
            <button
              onClick={() => setNetMod('manuel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                netMod === 'manuel' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PenLine className="w-4 h-4" />
              Manuel Gir
            </button>
          </div>

          {netMod === 'otomatik' && (
            <div className="bg-card border rounded-xl p-5 mb-6">
              {denemelerYukleniyor ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin w-6 h-6 text-primary" />
                </div>
              ) : denemeler.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Henüz karne/deneme verisi yok. Manuel giriş sekmesini kullan.
                </p>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Son <span className="font-medium text-foreground">{denemeler.length} deneme</span> bulundu.
                    Bu veriler strateji hesabında kullanılacak.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DERSLER_MANUEL.map((d) => {
                      const ort = denemeler.length > 0
                        ? denemeler.reduce((s, den) => s + (den[d.key] ?? 0), 0) / denemeler.length
                        : 0;
                      return (
                        <div key={d.key} className="bg-muted/40 rounded-lg px-3 py-2.5">
                          <div className="text-xs text-muted-foreground">{d.icon} {d.label}</div>
                          <div className="font-semibold text-foreground mt-0.5">
                            {ort.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">/ {d.max} net</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {netMod === 'manuel' && (
            <div className="bg-card border rounded-xl p-5 mb-6">
              <p className="text-sm text-muted-foreground mb-4">Her ders için ortalama net gir:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {DERSLER_MANUEL.map((d) => (
                  <div key={d.key}>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      {d.icon} {d.label} <span className="text-muted-foreground/60">(max {d.max})</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={d.max}
                      step={0.1}
                      value={manuelNetler[d.key]}
                      onChange={(e) => setManuelNetler((prev) => ({ ...prev, [d.key]: e.target.value }))}
                      placeholder={`0 – ${d.max}`}
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setAdim(1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-lg border hover:bg-accent transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Geri
            </button>
            <button
              onClick={adim2Ileri}
              disabled={netMod === 'otomatik' && denemeler.length === 0}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Programı Oluştur
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── ADIM 3: Program ───────────────────────────────────────────────── */}
      {adim === 3 && sonuc && (
        <div>
          {/* Haftalık özet */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-card border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{sonuc.toplamMusaitSaat}</div>
              <div className="text-xs text-muted-foreground mt-1">Toplam Saat</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{sonuc.anaSaatHavuzu}</div>
              <div className="text-xs text-blue-400 mt-1">Ana Dersler</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{sonuc.araSaatHavuzu}</div>
              <div className="text-xs text-purple-400 mt-1">Ara Dersler</div>
            </div>
          </div>

          {/* Haftalık ders dağılımı */}
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Haftalık Dağılım</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {sonuc.dersler.filter((d) => d.onerilen > 0).map((d) => (
              <div key={d.key} className="bg-card border rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{d.icon}</span>
                  <span className="text-sm font-medium text-foreground">{d.label}</span>
                </div>
                <span className="text-sm font-bold text-primary">{d.onerilen}s</span>
              </div>
            ))}
          </div>

          {/* Günlük program */}
          {gunlukProgram && Object.keys(gunlukProgram).length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Günlük Program</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(gunlukProgram).map(([gun, slotlar]) => (
                  <div key={gun} className="bg-card border rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b bg-muted/40 flex items-center justify-between">
                      <span className="font-semibold text-foreground">{gun}</span>
                      <span className="text-xs text-muted-foreground">{slotlar.length} saat</span>
                    </div>
                    <div className="divide-y">
                      {slotlar.map((slot) => (
                        <div key={slot.saat} className="flex items-center gap-3 px-4 py-2.5">
                          <span className="text-xs text-muted-foreground w-12 shrink-0">
                            {String(slot.saat).padStart(2, '0')}:00
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${slot.color}`}>
                            {slot.icon} {slot.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setAdim(2)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-lg border hover:bg-accent transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Geri
            </button>
            <button
              onClick={() => { setAdim(1); setSonuc(null); setGunlukProgram(null); }}
              className="flex items-center gap-2 bg-muted hover:bg-accent text-foreground px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              Yeniden Oluştur
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
