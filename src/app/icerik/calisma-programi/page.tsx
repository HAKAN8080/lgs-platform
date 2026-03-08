'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';

const GUNLER = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const GUNLER_TAM = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const SAATLER = Array.from({ length: 15 }, (_, i) => i + 9); // 9–23

type Musaitlik = Record<string, number[]>;

export default function CalismaProgramiPage() {
  const { user, loading: authLoading } = useAuth();
  const [musaitlik, setMusaitlik] = useState<Musaitlik>(() =>
    Object.fromEntries(GUNLER.map((g) => [g, []]))
  );
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediyor, setKaydediyor] = useState(false);
  const [uyari, setUyari] = useState(false);
  const [basari, setBasari] = useState(false);
  const [hatalar, setHatalar] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setYukleniyor(false);
      return;
    }
    const yukle = async () => {
      try {
        if (!db) { setYukleniyor(false); return; }
        const ref = doc(db, 'users', user.uid, 'calismaProgram', 'program');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setMusaitlik(snap.data().musaitlik);
        }
      } finally {
        setYukleniyor(false);
      }
    };
    yukle();
  }, [user]);

  const toggle = (gun: string, saat: number) => {
    setMusaitlik((prev) => {
      const mevcutlar = prev[gun];
      const yeni = mevcutlar.includes(saat)
        ? mevcutlar.filter((s) => s !== saat)
        : [...mevcutlar, saat].sort((a, b) => a - b);
      return { ...prev, [gun]: yeni };
    });
    setBasari(false);
  };

  const dogrula = (): string[] => {
    const hatalar: string[] = [];
    GUNLER.forEach((gun, i) => {
      const saatler = musaitlik[gun];
      if (saatler.length > 0 && saatler.length < 2) {
        hatalar.push(`${GUNLER_TAM[i]}: en az 2 saat seçilmeli (şu an ${saatler.length} saat)`);
      }
    });
    return hatalar;
  };

  const kaydetOnay = () => {
    const h = dogrula();
    if (h.length > 0) {
      setHatalar(h);
      return;
    }
    setHatalar([]);
    setUyari(true);
  };

  const kaydet = async () => {
    setUyari(false);
    setKaydediyor(true);
    try {
      if (!db) return;
      const ref = doc(db, 'users', user!.uid, 'calismaProgram', 'program');
      await setDoc(ref, {
        musaitlik,
        updatedAt: new Date().toISOString(),
      });
      setBasari(true);
    } catch (e) {
      console.error(e);
    } finally {
      setKaydediyor(false);
    }
  };

  const toplamSaat = Object.values(musaitlik).reduce((t, s) => t + s.length, 0);
  const aktifGunler = GUNLER.filter((g) => musaitlik[g].length > 0).length;

  if (authLoading || yukleniyor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Giriş yapmanız gerekiyor.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Çalışma Programı Oluşturucu</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Çalışabileceğin saat bloklarını işaretle. Her aktif gün için en az 2 saat seçilmeli.
        </p>
      </div>

      {/* Özet */}
      <div className="flex gap-4 mb-6">
        <div className="bg-blue-500/10 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold text-blue-600">{toplamSaat} saat</span>
          <span className="text-blue-400 ml-1">/ hafta</span>
        </div>
        <div className="bg-purple-500/10 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold text-purple-600">{aktifGunler} gün</span>
          <span className="text-purple-400 ml-1">aktif</span>
        </div>
      </div>

      {/* Takvim */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="w-16 py-3 px-3 text-left text-muted-foreground font-normal">Saat</th>
              {GUNLER.map((gun) => (
                <th key={gun} className="py-3 px-2 text-center font-semibold text-foreground min-w-[60px]">
                  <div>{gun}</div>
                  {musaitlik[gun].length > 0 && (
                    <div className="text-xs font-normal text-blue-500 mt-0.5">
                      {musaitlik[gun].length}s
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAATLER.map((saat) => (
              <tr key={saat} className="border-b last:border-0 hover:bg-accent/30">
                <td className="py-2 px-3 text-muted-foreground text-xs whitespace-nowrap">
                  {String(saat).padStart(2, '0')}:00
                </td>
                {GUNLER.map((gun) => {
                  const secili = musaitlik[gun].includes(saat);
                  return (
                    <td key={gun} className="py-1.5 px-2 text-center">
                      <button
                        onClick={() => toggle(gun, saat)}
                        className={`w-10 h-8 rounded-md transition-all duration-150 text-xs font-medium
                          ${secili
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

      {/* Hata mesajları */}
      {hatalar.length > 0 && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
            <AlertTriangle className="w-4 h-4" />
            Düzeltilmesi gerekenler:
          </div>
          <ul className="list-disc list-inside text-red-500 text-sm space-y-1">
            {hatalar.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}

      {/* Başarı */}
      {basari && (
        <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2 text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          Program başarıyla kaydedildi.
        </div>
      )}

      {/* Kaydet butonu */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={kaydetOnay}
          disabled={kaydediyor}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          {kaydediyor ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Programı Kaydet
        </button>
      </div>

      {/* Uyarı modal */}
      {uyari && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 border">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-foreground">Mevcut program silinecek</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-5">
              Önceki çalışma programın üzerine yazılacak. Devam etmek istiyor musun?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setUyari(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={kaydet}
                className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
              >
                Evet, Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
