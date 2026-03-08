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

function saatiFormatla(saat: number): string {
  const tam = Math.floor(saat);
  const dk = Math.round((saat - tam) * 60);
  if (dk === 0) return `${tam} saat`;
  return `${tam} saat ${dk} dk`;
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
    const toplamPuan = grup.reduce((t, d) => t + d.oncelikPuani, 0);
    grup.forEach((d) => {
      d.onerilen = Math.round((havuz * d.oncelikPuani) / toplamPuan);
    });
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
