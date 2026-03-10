export interface School {
  il: string;
  ilce: string;
  lise: string;
  tur: 'Fen Lisesi' | 'Anadolu Lisesi' | 'Meslek Lisesi' | 'Imam Hatip' | 'Sosyal Bilimler';
  dil: string;
  puan: number;
  yuzdelik: number;
  siralama: number;
  kontenjan: number;
}

export const SCHOOL_TYPES = [
  { value: 'Fen Lisesi', label: 'Fen Lisesi', color: '#059669' },
  { value: 'Anadolu Lisesi', label: 'Anadolu Lisesi', color: '#3B82F6' },
  { value: 'Sosyal Bilimler', label: 'Sosyal Bilimler', color: '#8B5CF6' },
  { value: 'Imam Hatip', label: 'İmam Hatip', color: '#F59E0B' },
  { value: 'Meslek Lisesi', label: 'Meslek Lisesi', color: '#6B7280' },
] as const;

// 2025 LGS Taban Puanları - Kaynak: pervinkaplan.com (Ağustos 2025 ilk yerleştirme)
export const SCHOOLS_DATA: School[] = [
  // =====================
  // EN YÜKSEK PUANLI LİSELER (500 puan)
  // =====================
  { il: "İstanbul", ilce: "Fatih", lise: "İstanbul Erkek Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 500.00, yuzdelik: 0.01, siralama: 1, kontenjan: 150 },
  { il: "İstanbul", ilce: "Beyoğlu", lise: "Galatasaray Lisesi", tur: "Anadolu Lisesi", dil: "Fransızca", puan: 500.00, yuzdelik: 0.01, siralama: 1, kontenjan: 96 },
  { il: "İstanbul", ilce: "Beşiktaş", lise: "Kabataş Erkek Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 500.00, yuzdelik: 0.01, siralama: 1, kontenjan: 120 },
  { il: "İstanbul", ilce: "Beşiktaş", lise: "Kabataş Erkek Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 500.00, yuzdelik: 0.01, siralama: 1, kontenjan: 120 },

  // =====================
  // FEN LİSELERİ (2025)
  // =====================
  { il: "İstanbul", ilce: "Kadıköy", lise: "İstanbul Atatürk Fen Lisesi", tur: "Fen Lisesi", dil: "Almanca", puan: 495.35, yuzdelik: 0.02, siralama: 200, kontenjan: 120 },
  { il: "İstanbul", ilce: "Kadıköy", lise: "İstanbul Atatürk Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 493.96, yuzdelik: 0.03, siralama: 350, kontenjan: 120 },
  { il: "İstanbul", ilce: "Fatih", lise: "Çapa Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 487.93, yuzdelik: 0.08, siralama: 950, kontenjan: 150 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Validebağ Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 477.21, yuzdelik: 0.25, siralama: 3000, kontenjan: 120 },
  { il: "İstanbul", ilce: "Kartal", lise: "Yüksel-İlhan Alanyalı Fen Lisesi", tur: "Fen Lisesi", dil: "Almanca", puan: 473.14, yuzdelik: 0.35, siralama: 4200, kontenjan: 90 },
  { il: "İstanbul", ilce: "Beylikdüzü", lise: "Yaşar Acar Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 470.75, yuzdelik: 0.45, siralama: 5400, kontenjan: 120 },
  { il: "İstanbul", ilce: "Büyükçekmece", lise: "Şehit Münir Alkan Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 469.01, yuzdelik: 0.50, siralama: 6000, kontenjan: 120 },
  { il: "İstanbul", ilce: "Maltepe", lise: "Şehit İlhan Varank Fen Lisesi", tur: "Fen Lisesi", dil: "Almanca", puan: 468.88, yuzdelik: 0.52, siralama: 6200, kontenjan: 90 },
  { il: "İstanbul", ilce: "Kartal", lise: "Yüksel-İlhan Alanyalı Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 466.10, yuzdelik: 0.60, siralama: 7200, kontenjan: 90 },
  { il: "İstanbul", ilce: "Küçükçekmece", lise: "Doğan Cüceloğlu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 462.36, yuzdelik: 0.80, siralama: 9600, kontenjan: 150 },
  { il: "İstanbul", ilce: "Ataşehir", lise: "Ahmet Keleşoğlu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 461.54, yuzdelik: 0.85, siralama: 10200, kontenjan: 120 },
  { il: "İstanbul", ilce: "Maltepe", lise: "Şehit İlhan Varank Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 461.51, yuzdelik: 0.85, siralama: 10200, kontenjan: 90 },
  { il: "İstanbul", ilce: "Ümraniye", lise: "Prof. Dr. Nabi Avcı Fen Lisesi", tur: "Fen Lisesi", dil: "Almanca", puan: 461.43, yuzdelik: 0.86, siralama: 10300, kontenjan: 90 },
  { il: "İstanbul", ilce: "Başakşehir", lise: "Hacı Şöhret Demiröz Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 459.41, yuzdelik: 1.00, siralama: 12000, kontenjan: 150 },
  { il: "İstanbul", ilce: "Ümraniye", lise: "Prof. Dr. Nabi Avcı Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 459.33, yuzdelik: 1.00, siralama: 12000, kontenjan: 90 },
  { il: "İstanbul", ilce: "Pendik", lise: "Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 458.86, yuzdelik: 1.05, siralama: 12600, kontenjan: 120 },
  { il: "İstanbul", ilce: "Bağcılar", lise: "Prof. Dr. Necmettin Erbakan Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 452.13, yuzdelik: 1.50, siralama: 18000, kontenjan: 120 },
  { il: "İstanbul", ilce: "Maltepe", lise: "Maltepe Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 450.59, yuzdelik: 1.65, siralama: 19800, kontenjan: 120 },
  { il: "İstanbul", ilce: "Silivri", lise: "Prof Dr. Fuat Sezgin Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 446.95, yuzdelik: 2.00, siralama: 24000, kontenjan: 90 },
  { il: "İstanbul", ilce: "Beykoz", lise: "Beykoz Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 440.45, yuzdelik: 2.60, siralama: 31200, kontenjan: 90 },
  { il: "İstanbul", ilce: "Esenyurt", lise: "Esenyurt Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 438.74, yuzdelik: 2.80, siralama: 33600, kontenjan: 150 },
  { il: "İstanbul", ilce: "Çatalca", lise: "Çatalca Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 437.72, yuzdelik: 2.90, siralama: 34800, kontenjan: 90 },
  { il: "İstanbul", ilce: "Şile", lise: "Dr. Vasıf Topçu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 414.10, yuzdelik: 6.00, siralama: 72000, kontenjan: 60 },

  // =====================
  // ANADOLU LİSELERİ - EN YÜKSEK PUANLILAR (2025)
  // =====================
  { il: "İstanbul", ilce: "Fatih", lise: "Cağaloğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 493.96, yuzdelik: 0.03, siralama: 350, kontenjan: 90 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Hüseyin Avni Sözen Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 489.02, yuzdelik: 0.06, siralama: 720, kontenjan: 150 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Haydarpaşa Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 487.77, yuzdelik: 0.07, siralama: 840, kontenjan: 120 },
  { il: "İstanbul", ilce: "Beşiktaş", lise: "Beşiktaş Sakıp Sabancı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 486.22, yuzdelik: 0.09, siralama: 1080, kontenjan: 180 },
  { il: "İstanbul", ilce: "Fatih", lise: "Vefa Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 481.23, yuzdelik: 0.15, siralama: 1800, kontenjan: 150 },
  { il: "İstanbul", ilce: "Beşiktaş", lise: "Beşiktaş Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 478.34, yuzdelik: 0.20, siralama: 2400, kontenjan: 210 },
  { il: "İstanbul", ilce: "Fatih", lise: "Pertevniyal Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 475.66, yuzdelik: 0.28, siralama: 3360, kontenjan: 180 },
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Adnan Menderes Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 468.91, yuzdelik: 0.50, siralama: 6000, kontenjan: 240 },
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Bahçelievler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 464.55, yuzdelik: 0.70, siralama: 8400, kontenjan: 120 },
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Bahçelievler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 459.36, yuzdelik: 1.00, siralama: 12000, kontenjan: 180 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Hasan Polatkan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 446.91, yuzdelik: 2.00, siralama: 24000, kontenjan: 240 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Yeşilköy Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 446.67, yuzdelik: 2.02, siralama: 24200, kontenjan: 210 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Florya Tevfik Ercan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 431.20, yuzdelik: 3.50, siralama: 42000, kontenjan: 270 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Ataköy Cumhuriyet Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 428.69, yuzdelik: 3.80, siralama: 45600, kontenjan: 300 },
  { il: "İstanbul", ilce: "Ataşehir", lise: "Habire Yahşi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 422.20, yuzdelik: 4.50, siralama: 54000, kontenjan: 270 },
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Dede Korkut Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 418.60, yuzdelik: 5.00, siralama: 60000, kontenjan: 300 },
  { il: "İstanbul", ilce: "Ataşehir", lise: "TEB Ataşehir Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 415.96, yuzdelik: 5.50, siralama: 66000, kontenjan: 240 },
  { il: "İstanbul", ilce: "Avcılar", lise: "Süleyman Nazif Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 410.56, yuzdelik: 6.50, siralama: 78000, kontenjan: 330 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Yahya Kemal Beyatlı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 410.38, yuzdelik: 6.55, siralama: 78600, kontenjan: 270 },
  { il: "İstanbul", ilce: "Bağcılar", lise: "Mehmet Niyazi Altuğ Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 395.45, yuzdelik: 10.00, siralama: 120000, kontenjan: 360 },
  { il: "İstanbul", ilce: "Bağcılar", lise: "Dr. Kemal Naci Ekşi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 390.11, yuzdelik: 12.00, siralama: 144000, kontenjan: 330 },
  { il: "İstanbul", ilce: "Arnavutköy", lise: "Şehit Selçuk Gürdal Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 387.79, yuzdelik: 13.00, siralama: 156000, kontenjan: 300 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Kandilli Kız Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 383.76, yuzdelik: 14.50, siralama: 174000, kontenjan: 180 },

  // =====================
  // SOSYAL BİLİMLER LİSELERİ (2025)
  // =====================
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Prof. Dr. Mümtaz Turhan Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 406.84, yuzdelik: 7.00, siralama: 84000, kontenjan: 120 },
  { il: "İstanbul", ilce: "Beylikdüzü", lise: "Vali Muammer Güler Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 391.58, yuzdelik: 11.50, siralama: 138000, kontenjan: 120 },
  { il: "İstanbul", ilce: "Pendik", lise: "Gönüllü Hizmet Vakfı İnal Aydınoğlu Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 388.34, yuzdelik: 12.80, siralama: 153600, kontenjan: 90 },
  { il: "İstanbul", ilce: "Şile", lise: "Şile Oya-Ali Osman Keçici Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 332.40, yuzdelik: 35.00, siralama: 420000, kontenjan: 60 },

  // =====================
  // İMAM HATİP LİSELERİ (Örnek)
  // =====================
  { il: "İstanbul", ilce: "Fatih", lise: "Fatih Anadolu İmam Hatip Lisesi", tur: "Imam Hatip", dil: "Arapça", puan: 420.00, yuzdelik: 4.80, siralama: 57600, kontenjan: 360 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Üsküdar Anadolu İmam Hatip Lisesi", tur: "Imam Hatip", dil: "Arapça", puan: 405.00, yuzdelik: 7.20, siralama: 86400, kontenjan: 420 },

  // =====================
  // MESLEK LİSELERİ (Örnek)
  // =====================
  { il: "İstanbul", ilce: "Kadıköy", lise: "Kadıköy Mesleki ve Teknik Anadolu Lisesi", tur: "Meslek Lisesi", dil: "İngilizce", puan: 385.00, yuzdelik: 14.00, siralama: 168000, kontenjan: 450 },
  { il: "İstanbul", ilce: "Küçükçekmece", lise: "Halkalı Mesleki ve Teknik Anadolu Lisesi", tur: "Meslek Lisesi", dil: "İngilizce", puan: 365.00, yuzdelik: 22.00, siralama: 264000, kontenjan: 540 },

  // =====================
  // DİĞER İLLER YAKINDA EKLENECEK
  // Kaynak: kazanabilirsin.com / pervinkaplan.com
  // =====================
];

export function getSchoolTypeColor(type: string): string {
  const schoolType = SCHOOL_TYPES.find(t => t.value === type);
  return schoolType?.color || '#6B7280';
}
