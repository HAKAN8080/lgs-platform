'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth, usePremium } from '@/contexts/auth-context';
import {
  stratejiHesapla,
  gunlukProgramOlustur,
  type DersKey,
  type GunlukProgram,
  type StratejSonuc,
} from '@/lib/calculations/strateji-motoru';
import {
  Loader2, ChevronRight, ChevronLeft, Check, AlertTriangle,
  Database, PenLine, Sparkles, Lock, CalendarDays, BarChart3,
  Clock, Zap, ArrowRight,
} from 'lucide-react';

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

// ─── Premium Teaser Slaytları ─────────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    icon: Clock,
    baslik: 'Müsaitliğini Gir',
    aciklama: 'Hangi günler, hangi saatler çalışabileceğini belirt.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    preview: (
      <div className="mt-4 rounded-xl border border-border bg-card/60 p-4 text-sm">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((g, i) => (
            <div key={g} className="text-center text-xs font-semibold text-muted-foreground">{g}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[3, 2, 4, 2, 3, 5, 0].map((saat, i) => (
            <div key={i} className={`rounded-lg py-2 text-center text-xs font-bold ${saat > 0 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground/30'}`}>
              {saat > 0 ? `${saat}s` : '–'}
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <div className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">19 saat/hafta</div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: BarChart3,
    baslik: 'Deneme Verilerini Kullan',
    aciklama: 'Mevcut deneme netlerinle strateji otomatik hesaplanır.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    preview: (
      <div className="mt-4 rounded-xl border border-border bg-card/60 p-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Türkçe', val: 14.2, max: 20, color: 'bg-blue-500' },
            { label: 'Matematik', val: 8.7, max: 20, color: 'bg-orange-500' },
            { label: 'Fen', val: 11.3, max: 20, color: 'bg-emerald-500' },
            { label: 'İnkılap', val: 7.1, max: 10, color: 'bg-purple-500' },
            { label: 'Din', val: 6.4, max: 10, color: 'bg-pink-500' },
            { label: 'İngilizce', val: 5.9, max: 10, color: 'bg-yellow-500' },
          ].map((d) => (
            <div key={d.label} className="bg-muted/50 rounded-lg p-2.5">
              <div className="text-[10px] text-muted-foreground mb-1">{d.label}</div>
              <div className="text-sm font-bold text-foreground">{d.val}</div>
              <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(d.val / d.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    icon: CalendarDays,
    baslik: 'Haftalık Program Oluşturulur',
    aciklama: 'Zayıf derslere daha fazla süre — AI destekli optimizasyon.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    preview: (
      <div className="mt-4 rounded-xl border border-border bg-card/60 p-3">
        <div className="space-y-1.5">
          {[
            { gun: 'Pazartesi', bloklar: [{ ders: '📐 Matematik', color: 'bg-orange-500/20 text-orange-400' }, { ders: '📖 Türkçe', color: 'bg-blue-500/20 text-blue-400' }] },
            { gun: 'Salı', bloklar: [{ ders: '🔬 Fen', color: 'bg-emerald-500/20 text-emerald-400' }, { ders: '📐 Matematik', color: 'bg-orange-500/20 text-orange-400' }] },
            { gun: 'Çarşamba', bloklar: [{ ders: '📖 Türkçe', color: 'bg-blue-500/20 text-blue-400' }, { ders: '🌍 İngilizce', color: 'bg-yellow-500/20 text-yellow-400' }] },
            { gun: 'Perşembe', bloklar: [{ ders: '📐 Matematik', color: 'bg-orange-500/20 text-orange-400' }] },
          ].map((g) => (
            <div key={g.gun} className="flex items-center gap-2">
              <div className="text-[10px] text-muted-foreground w-16 shrink-0">{g.gun}</div>
              <div className="flex gap-1.5 flex-wrap">
                {g.bloklar.map((b, i) => (
                  <span key={i} className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${b.color}`}>{b.ders}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4,
    icon: Zap,
    baslik: 'LGS\'ye Göre Yoğunluk',
    aciklama: 'LGS tarihine yaklaştıkça program otomatik yoğunlaşır.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    preview: (
      <div className="mt-4 rounded-xl border border-border bg-card/60 p-4">
        <div className="flex items-end justify-between gap-1 h-24">
          {[
            { label: 'Oca', h: 30 }, { label: 'Şub', h: 40 }, { label: 'Mar', h: 50 },
            { label: 'Nis', h: 65 }, { label: 'May', h: 80 }, { label: 'Haz', h: 100 },
          ].map((m) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-primary/30 hover:bg-primary/50 transition-colors"
                style={{ height: `${m.h}%` }}
              />
              <div className="text-[9px] text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-xs text-amber-500 font-medium">LGS: Haziran 2026</div>
      </div>
    ),
  },
];

// ─── Premium Teaser Bileşeni ──────────────────────────────────────────────
function PremiumTeaser() {
  const [aktif, setAktif] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAktif(p => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[aktif];
  const Icon = slide.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Başlık */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Premium Özellik</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Çalışma Programı Oluşturucu</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          3 adımda kişiselleştirilmiş haftalık LGS çalışma programı
        </p>
      </div>

      {/* Slayt */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg min-h-[320px]">
        <div className="flex items-center gap-3 mb-1">
          <div className={`p-2.5 rounded-xl ${slide.bg}`}>
            <Icon className={`h-5 w-5 ${slide.color}`} />
          </div>
          <div>
            <div className="font-semibold text-foreground">{slide.baslik}</div>
            <div className="text-xs text-muted-foreground">{slide.aciklama}</div>
          </div>
        </div>
        {slide.preview}
      </div>

      {/* Nokta göstergesi */}
      <div className="flex justify-center gap-2 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setAktif(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === aktif ? 'w-6 bg-primary' : 'w-2 bg-border'}`}
          />
        ))}
      </div>

      {/* Özellik listesi */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {[
          'AI destekli optimizasyon',
          'Deneme verilerinden otomatik strateji',
          'Günlük saat saat program',
          'LGS\'ye göre yoğunluk ayarı',
        ].map((f) => (
          <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            {f}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 border border-primary/20 p-6 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Premium&apos;a geç, kilidi aç</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Tüm premium özelliklere sınırsız eriş</p>
        <div className="flex items-center justify-center gap-4">
          <div>
            <span className="text-2xl font-bold text-foreground">99₺</span>
            <span className="text-sm text-muted-foreground"> / ay</span>
          </div>
          <Link
            href="/premium"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Premium&apos;a Geç <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────
export default function CalismaProgramiPage() {
  const { user, loading: authLoading } = useAuth();
  const { isPremium } = usePremium();
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

  // ─── Yükleniyor ──────────────────────────────────────────────────────────
  if (authLoading || (user && programYukleniyor)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  // Giriş yapılmamış → teaser göster (kayıt olmaya yönlendir)
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <PremiumTeaser />
      </div>
    );
  }

  // Premium değil → teaser göster
  if (!isPremium) {
    return <PremiumTeaser />;
  }

  // ─── Premium kullanıcı: gerçek araç ──────────────────────────────────────
  const toplamSaat = Object.values(musaitlik).reduce((t, s) => t + s.length, 0);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-foreground">Çalışma Programı Oluşturucu</h1>
          <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">Premium</span>
        </div>
        <p className="text-muted-foreground text-sm">3 adımda kişiselleştirilmiş haftalık ders programını oluştur.</p>
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
                adim > n ? 'bg-primary border-primary text-primary-foreground'
                  : adim === n ? 'border-primary text-primary bg-primary/10'
                  : 'border-muted-foreground/30 text-muted-foreground/50'
              }`}>
                {adim > n ? <Check className="w-4 h-4" /> : n}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${adim === n ? 'text-foreground' : 'text-muted-foreground/60'}`}>{label}</span>
            </div>
            {i < arr.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${adim > n ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── ADIM 1 ── */}
      {adim === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Çalışabileceğin saat bloklarını işaretle (günlük min 2 saat).</p>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium text-sm">{toplamSaat} saat/hafta</span>
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
              İleri <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── ADIM 2 ── */}
      {adim === 2 && (
        <div>
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg w-fit">
            <button
              onClick={() => setNetMod('otomatik')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                netMod === 'otomatik' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Database className="w-4 h-4" />Karneden Oluştur
            </button>
            <button
              onClick={() => setNetMod('manuel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                netMod === 'manuel' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PenLine className="w-4 h-4" />Manuel Gir
            </button>
          </div>

          {netMod === 'otomatik' && (
            <div className="bg-card border rounded-xl p-5 mb-6">
              {denemelerYukleniyor ? (
                <div className="flex justify-center py-6"><Loader2 className="animate-spin w-6 h-6 text-primary" /></div>
              ) : denemeler.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">Henüz karne/deneme verisi yok. Manuel giriş sekmesini kullan.</p>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Son <span className="font-medium text-foreground">{denemeler.length} deneme</span> bulundu.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DERSLER_MANUEL.map((d) => {
                      const ort = denemeler.reduce((s, den) => s + (den[d.key] ?? 0), 0) / denemeler.length;
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
                      type="number" min={0} max={d.max} step={0.1}
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
            <button onClick={() => setAdim(1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-lg border hover:bg-accent transition-colors text-sm">
              <ChevronLeft className="w-4 h-4" />Geri
            </button>
            <button
              onClick={adim2Ileri}
              disabled={netMod === 'otomatik' && denemeler.length === 0}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Programı Oluştur <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── ADIM 3 ── */}
      {adim === 3 && sonuc && (
        <div>
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
            <button onClick={() => setAdim(2)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2.5 rounded-lg border hover:bg-accent transition-colors text-sm">
              <ChevronLeft className="w-4 h-4" />Geri
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
