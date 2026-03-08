export type DersKey = 'turkce' | 'matematik' | 'fen' | 'inkilap' | 'din' | 'ingilizce';

export type Seviye = 'Kritik' | 'Zayıf' | 'Orta' | 'İyi';
export type Trend = 'düşüş' | 'artış' | 'stabil' | 'yetersiz_veri';

export interface DersStrateji {
  key: DersKey;
  label: string;
  icon: string;
  grup: 'ana' | 'ara';
  maxNet: number;
  ortalamaNet: number;
  netYuzdesi: number;
  seviye: Seviye;
  trend: Trend;
  oncelikPuani: number;
  onerilen: number; // saat/hafta
  uyari?: string;
}

export interface StratejSonuc {
  dersler: DersStrateji[];
  toplamMusaitSaat: number;
  anaSaatHavuzu: number;
  araSaatHavuzu: number;
  genelMesaj: string;
}

const DERS_BILGI: Record<DersKey, { label: string; icon: string; grup: 'ana' | 'ara'; maxNet: number }> = {
  turkce:   { label: 'Türkçe',    icon: '📖', grup: 'ana', maxNet: 20 },
  matematik:{ label: 'Matematik', icon: '📐', grup: 'ana', maxNet: 20 },
  fen:      { label: 'Fen',       icon: '🔬', grup: 'ana', maxNet: 20 },
  inkilap:  { label: 'İnkılap',   icon: '🏛️', grup: 'ara', maxNet: 10 },
  din:      { label: 'Din',       icon: '☪️', grup: 'ara', maxNet: 10 },
  ingilizce:{ label: 'İngilizce', icon: '🌍', grup: 'ara', maxNet: 10 },
};

const SEVIYE_PUAN: Record<Seviye, number> = {
  'Kritik': 4,
  'Zayıf':  3,
  'Orta':   2,
  'İyi':    1,
};

function seviyeHesapla(netYuzdesi: number): Seviye {
  if (netYuzdesi < 50) return 'Kritik';
  if (netYuzdesi < 70) return 'Zayıf';
  if (netYuzdesi < 85) return 'Orta';
  return 'İyi';
}

function trendHesapla(netler: number[]): Trend {
  if (netler.length < 2) return 'yetersiz_veri';
  const son = netler[netler.length - 1];
  const oncekiOrt = netler.slice(0, -1).reduce((a, b) => a + b, 0) / (netler.length - 1);
  const fark = son - oncekiOrt;
  // Farkı max net'e göre değil doğrudan net farkı olarak kullanıyoruz
  if (fark <= -1.5) return 'düşüş';
  if (fark >= 1.5)  return 'artış';
  return 'stabil';
}

export interface GunlukSlot {
  saat: number;
  dersKey: DersKey;
  label: string;
  icon: string;
  color: string;
}

export type GunlukProgram = Record<string, GunlukSlot[]>;

const DERS_RENK: Record<DersKey, string> = {
  turkce:    'bg-blue-500/20 text-blue-700 border-blue-500/30',
  matematik: 'bg-red-500/20 text-red-700 border-red-500/30',
  fen:       'bg-green-500/20 text-green-700 border-green-500/30',
  inkilap:   'bg-orange-500/20 text-orange-700 border-orange-500/30',
  din:       'bg-purple-500/20 text-purple-700 border-purple-500/30',
  ingilizce: 'bg-cyan-500/20 text-cyan-700 border-cyan-500/30',
};

const GUNLER_SIRA = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export function gunlukProgramOlustur(
  dersler: DersStrateji[],
  musaitlik: Record<string, number[]>
): GunlukProgram {
  const aktifGunler = GUNLER_SIRA
    .filter((g) => musaitlik[g]?.length > 0)
    .map((g) => ({ gun: g, saatler: [...musaitlik[g]].sort((a, b) => a - b) }));

  if (aktifGunler.length === 0) return {};

  // Her günün kalan boş slotları (tüketilecek)
  const bosSaatler: Record<string, number[]> = {};
  aktifGunler.forEach(({ gun, saatler }) => { bosSaatler[gun] = [...saatler]; });

  const program: GunlukProgram = {};
  aktifGunler.forEach(({ gun }) => { program[gun] = []; });

  // Günde kaç saat atandı (ders bazlı) — max 2 kontrolü için
  const gunDersAtama: Record<string, Record<string, number>> = {};
  aktifGunler.forEach(({ gun }) => { gunDersAtama[gun] = {}; });

  // Ana önce, sonra ara; her grup içinde saat büyükten küçüğe
  const sortedDersler = [...dersler]
    .filter((d) => d.onerilen > 0)
    .sort((a, b) => {
      if (a.grup !== b.grup) return a.grup === 'ana' ? -1 : 1;
      return b.onerilen - a.onerilen;
    });

  // Bitişik slot çifti bul ve ayır
  const bitisikCiftBul = (slots: number[]): [number, number] | null => {
    for (let i = 0; i < slots.length - 1; i++) {
      if (slots[i + 1] === slots[i] + 1) {
        return [slots.splice(i, 1)[0], slots.splice(i, 1)[0]];
      }
    }
    return null;
  };

  // Tek slot ayır (ilk boş)
  const tekSlotAl = (slots: number[]): number | null => {
    if (slots.length === 0) return null;
    return slots.splice(0, 1)[0];
  };

  const slot = (gun: string, saat: number, ders: DersStrateji) => {
    program[gun].push({ saat, dersKey: ders.key, label: ders.label, icon: ders.icon, color: DERS_RENK[ders.key] });
    gunDersAtama[gun][ders.key] = (gunDersAtama[gun][ders.key] ?? 0) + 1;
  };

  for (const ders of sortedDersler) {
    let kalan = ders.onerilen;
    const nDays = aktifGunler.length;
    let dayIdx = 0;
    let dongu = 0;

    while (kalan > 0 && dongu < nDays * 4) {
      dongu++;
      const gun = aktifGunler[dayIdx % nDays].gun;
      dayIdx++;

      const atananBuGun = gunDersAtama[gun][ders.key] ?? 0;
      if (atananBuGun >= 2) continue; // bu güne zaten max 2 atandı
      if (bosSaatler[gun].length === 0) continue;

      const kalanAtanabilir = Math.min(2 - atananBuGun, kalan);

      if (kalanAtanabilir >= 2) {
        // Bitişik 2 saat dene
        const cift = bitisikCiftBul(bosSaatler[gun]);
        if (cift) {
          slot(gun, cift[0], ders);
          slot(gun, cift[1], ders);
          kalan -= 2;
        } else {
          // Bitişik bulunamadı, tek ver
          const tek = tekSlotAl(bosSaatler[gun]);
          if (tek !== null) { slot(gun, tek, ders); kalan -= 1; }
        }
      } else {
        // 1 saat ver
        const tek = tekSlotAl(bosSaatler[gun]);
        if (tek !== null) { slot(gun, tek, ders); kalan -= 1; }
      }
    }

    // Eğer hâlâ kalan varsa max 2 sınırı aşarak yerleştir
    dayIdx = 0; dongu = 0;
    while (kalan > 0 && dongu < nDays * 4) {
      dongu++;
      const gun = aktifGunler[dayIdx % nDays].gun;
      dayIdx++;
      if (bosSaatler[gun].length === 0) continue;
      const tek = tekSlotAl(bosSaatler[gun]);
      if (tek !== null) { slot(gun, tek, ders); kalan -= 1; }
    }
  }

  // Saate göre sırala
  for (const gun of Object.keys(program)) {
    program[gun].sort((a, b) => a.saat - b.saat);
  }

  return program;
}

export function stratejiHesapla(
  denemeler: Array<Record<DersKey, number>>, // son 3 deneme, her biri {turkce: net, ...}
  musaitlik: Record<string, number[]>        // {Pzt: [9,10,...], ...}
): StratejSonuc {
  // Toplam müsait saat
  const toplamMusaitSaat = Object.values(musaitlik).reduce((t, s) => t + s.length, 0);

  // Her ders için ortalama net ve trend hesapla
  const dersler: DersStrateji[] = (Object.keys(DERS_BILGI) as DersKey[]).map((key) => {
    const bilgi = DERS_BILGI[key];
    const netDizisi = denemeler.map((d) => d[key] ?? 0);
    const ortalamaNet = netDizisi.length > 0
      ? netDizisi.reduce((a, b) => a + b, 0) / netDizisi.length
      : 0;
    const netYuzdesi = (ortalamaNet / bilgi.maxNet) * 100;
    const seviye = seviyeHesapla(netYuzdesi);
    const trend = trendHesapla(netDizisi);

    // Ağırlık = (100 - netYuzdesi) → zayıf ders daha fazla saat alır
    // Minimum 5 puan taban (hiç sıfıra düşmesin)
    // Trend düzeltmesi: düşüş +15, artış -10 (nispi fark yaratır)
    let oncelikPuani = Math.max(5, 100 - netYuzdesi);
    if (trend === 'düşüş') oncelikPuani = Math.min(100, oncelikPuani + 15);
    if (trend === 'artış') oncelikPuani = Math.max(5, oncelikPuani - 10);

    return {
      key,
      label: bilgi.label,
      icon: bilgi.icon,
      grup: bilgi.grup,
      maxNet: bilgi.maxNet,
      ortalamaNet: Math.round(ortalamaNet * 10) / 10,
      netYuzdesi: Math.round(netYuzdesi),
      seviye,
      trend,
      oncelikPuani,
      onerilen: 0,
    };
  });

  // 4:1 havuz dağılımı (tam sayıya yuvarla)
  const anaSaatHavuzu = Math.round((toplamMusaitSaat * 4) / 5);
  const araSaatHavuzu = Math.round((toplamMusaitSaat * 1) / 5);

  // Grup içi dağılım
  const anaGrup = dersler.filter((d) => d.grup === 'ana');
  const araGrup = dersler.filter((d) => d.grup === 'ara');

  const dagilimHesapla = (grup: DersStrateji[], havuz: number) => {
    const n = grup.length;
    // Minimum = eşit dağılımın 1/3'ü (ders sayısı ve havuza göre otomatik ölçeklenir)
    const minSaat = Math.max(1, Math.ceil(havuz / n / 3));
    const toplamPuan = grup.reduce((t, d) => t + d.oncelikPuani, 0);

    grup.forEach((d) => {
      d.onerilen = Math.max(minSaat, Math.round((havuz * d.oncelikPuani) / toplamPuan));
    });

    // Minimum ekleme nedeniyle havuzu aşarsa en yüksek saat alan dersten azalt
    let toplam = grup.reduce((t, d) => t + d.onerilen, 0);
    while (toplam > havuz) {
      const maxDers = grup.reduce((a, b) => b.onerilen > a.onerilen ? b : a);
      if (maxDers.onerilen <= minSaat) break;
      maxDers.onerilen--;
      toplam--;
    }
  };

  dagilimHesapla(anaGrup, anaSaatHavuzu);
  dagilimHesapla(araGrup, araSaatHavuzu);

  // Ara ders Kritik uyarısı
  araGrup.forEach((d) => {
    if (d.seviye === 'Kritik') {
      d.uyari = `${d.label} kritik seviyede — ara ders havuzunun tamamını bu derse ver.`;
    }
  });

  // Genel mesaj
  const kritikler = dersler.filter((d) => d.seviye === 'Kritik').map((d) => d.label);
  let genelMesaj = '';
  if (toplamMusaitSaat === 0) {
    genelMesaj = 'Çalışma programın henüz belirlenmemiş. Önce müsaitlik takvimini doldur.';
  } else if (denemeler.length === 0) {
    genelMesaj = 'Strateji üretmek için en az 1 deneme sonucu gerekiyor.';
  } else if (kritikler.length > 0) {
    genelMesaj = `${kritikler.join(', ')} kritik seviyede. Bu derslere öncelik ver.`;
  } else {
    genelMesaj = 'Genel durumun iyi görünüyor. Zayıf derslerine odaklanarak devam et.';
  }

  return {
    dersler: dersler.sort((a, b) => b.oncelikPuani - a.oncelikPuani),
    toplamMusaitSaat,
    anaSaatHavuzu,
    araSaatHavuzu,
    genelMesaj,
  };
}
