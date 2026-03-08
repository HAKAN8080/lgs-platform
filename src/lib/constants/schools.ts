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
  // ANKARA
  // =====================
  { il: "Ankara", ilce: "Akyurt", lise: "Yıldırım Beyazıt Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 342.49, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Altındağ", lise: "Altındağ Yıldırım Beyazıt Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 435.61, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Altındağ", lise: "Ankara Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 429.33, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Altındağ", lise: "Gazi Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 416.17, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Altındağ", lise: "Piri Reis Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 402.25, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Altındağ", lise: "Sabahattin Zaim Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 361.04, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Beypazarı", lise: "Hatice-Cemil Ercan Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 394.91, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Ankara Atatürk Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 462.68, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Ankara Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 494.51, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Ankara Türk Telekom Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 409.08, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Ayhan Sümer Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 433.50, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Ayrancı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Çince", puan: 432.02, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Ayrancı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 443.29, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Betül Can Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 436.56, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Cumhuriyet Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 477.33, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Dr. Binnaz Ege-Dr. Rıdvan Ege Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 457.81, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Gazi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 462.45, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Hacı Ömer Tarman Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 450.78, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Hacı Ömer Tarman Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 454.34, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Hasan Ali Yücel Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 391.82, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Mehmet Emin Resulzade Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 461.49, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Prof. Dr. Aziz Sancar Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 493.80, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çankaya", lise: "Ümitköy Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 432.21, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çubuk", lise: "Çubuk Yıldırım Beyazıt Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 344.27, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Çubuk", lise: "Meliha Hasanali Bostan Çubuk Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 416.98, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Elmadağ", lise: "Gazi Şahin Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 324.60, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Elmadağ", lise: "Hasanoğlan Atatürk Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 400.84, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Etimesgut", lise: "Özkent Akbilek Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 470.75, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Etimesgut", lise: "Sezai Karakoç Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 381.90, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Etimesgut", lise: "Şehit Oğuzhan Yaşar Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 456.26, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Etimesgut", lise: "Şehit Ömer Halisdemir Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 429.00, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Gölbaşı", lise: "Gölbaşı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 418.19, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Güdül", lise: "Hasan Hüseyin Akdede Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 326.80, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Kahramankazan", lise: "Mustafa Hakan Güvençer Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 430.66, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Kalecik", lise: "Mehmet Doğan Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 355.58, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Keçiören", lise: "Aktepe Şehit Köksal Kaşaltı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 411.31, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Keçiören", lise: "Aydınlıkevler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 430.97, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Keçiören", lise: "Keçiören Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 387.86, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Keçiören", lise: "Keçiören Vatansever Şehit Tümgeneral Aydoğan Aydın Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 476.40, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Keçiören", lise: "Vecihi Hürkuş Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 449.26, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Mamak", lise: "Başkent Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 395.96, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Mamak", lise: "Çağrıbey Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 405.84, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Mamak", lise: "Mamak Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 445.09, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Mamak", lise: "Yavuz Sultan Selim Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 420.05, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Nallıhan", lise: "Bilal Güngör Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 334.03, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Polatlı", lise: "Polatlı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 365.51, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Polatlı", lise: "Polatlı TOBB Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 417.22, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Pursaklar", lise: "Ankara Pursaklar Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 489.02, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Pursaklar", lise: "Pursaklar Ayyıldız Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 416.25, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Sincan", lise: "Ankara Erman Ilıcak Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 481.89, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Sincan", lise: "Fatih Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 423.58, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Sincan", lise: "Süleyman Demirel Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 435.34, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Şereflikoçhisar", lise: "Yavuz Sultan Selim Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 367.22, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Yenimahalle", lise: "Atatürk Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 481.73, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Yenimahalle", lise: "Mustafa Azmi Doğan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 436.03, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Yenimahalle", lise: "Nermin Mehmet Çekiç Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 452.00, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Ankara", ilce: "Yenimahalle", lise: "Yenimahalle Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 474.69, yuzdelik: 0, siralama: 0, kontenjan: 0 },

  // =====================
  // İZMİR
  // =====================
  { il: "İzmir", ilce: "Aliağa", lise: "Alp Oğuz Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 406.60, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Balçova", lise: "Balçova Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 420.43, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Balçova", lise: "Balçova Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 419.98, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Bayındır", lise: "Ülfet Onart Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 308.20, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Bergama", lise: "Cumhuriyet Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 346.57, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Bergama", lise: "Yusuf Kemalettin Perin Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 437.89, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Bornova", lise: "Bornova Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 484.16, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Bornova", lise: "Bornova Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Fransızca", puan: 480.17, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Bornova", lise: "Bornova Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 476.40, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Bornova", lise: "İzmir Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 493.96, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Bornova", lise: "Yunus Emre Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 453.99, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Bornova", lise: "Yunus Emre Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 447.73, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Buca", lise: "Buca Fatma Saygın Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 458.40, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Buca", lise: "Buca İnci-Özer Tırnaklı Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 475.67, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Buca", lise: "Buca Mehmet Akif Ersoy Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 406.77, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Çeşme", lise: "Hacı Murat-Hatice Özsoy Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 345.23, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Çiğli", lise: "Çiğli Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 456.69, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Çiğli", lise: "Sezai Karakoç Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 428.01, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Gaziemir", lise: "Gaziemir Nevvar Salih İşgören Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 441.76, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Güzelbahçe", lise: "Güzelbahçe 60.Yıl Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 441.78, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Karabağlar", lise: "İzmir Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 435.13, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Karabağlar", lise: "İzmir Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 427.46, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Karabağlar", lise: "Övgü Terzibaşıoğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 451.29, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Karşıyaka", lise: "Alev Alatlı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 442.94, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Karşıyaka", lise: "Karşıyaka Cihat Kora Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 473.05, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Karşıyaka", lise: "Karşıyaka Cihat Kora Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 463.71, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Karşıyaka", lise: "15 Temmuz Şehitler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 438.24, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Konak", lise: "Atatürk Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 493.96, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Konak", lise: "Atatürk Lisesi", tur: "Anadolu Lisesi", dil: "Fransızca", puan: 484.01, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Konak", lise: "Atatürk Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 484.69, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Konak", lise: "İzmir Kız Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 474.82, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Konak", lise: "İzmir Kız Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 468.12, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Konak", lise: "Konak Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 431.38, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Menderes", lise: "Menderes Fatma-Ramazan Büküşoğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 415.51, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Menemen", lise: "Şehit Ahmet Özsoy Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 443.99, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Narlıdere", lise: "Narlıdere Cahide-Ahmet Dalyanoğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 401.31, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Ödemiş", lise: "Ödemiş Ayhan Kökmen Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 438.22, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Ödemiş", lise: "Ödemiş Ticaret Odası Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 389.45, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Seferihisar", lise: "Seferihisar Necat Hepkon Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 330.69, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Selçuk", lise: "Borsa İstanbul Şehit Ömer Halisdemir Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 302.05, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Tire", lise: "Tire Belgin Atila Çallıoğlu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 448.09, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Tire", lise: "Tire Kutsan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 383.89, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Tire", lise: "Tire Öğretmen Melahat Aksoy Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 359.44, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Torbalı", lise: "Torbalı Sema Karhan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 407.68, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Urla", lise: "İzmir Cengiz Aytmatov Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 372.55, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "İzmir", ilce: "Urla", lise: "Urla Hakan Çeken Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 345.96, yuzdelik: 0, siralama: 0, kontenjan: 0 },

  // =====================
  // BURSA
  // =====================
  { il: "Bursa", ilce: "Gemlik", lise: "Gemlik Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 421.57, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Gemlik", lise: "Gemport Gemlik Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 372.76, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Gürsu", lise: "Yıldız Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 387.65, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "İnegöl", lise: "Halil İnalcık Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 361.40, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "İnegöl", lise: "İnegöl Mediha-Hayri Çelik Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 448.54, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "İnegöl", lise: "Zeki Konukoğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 402.35, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "İznik", lise: "İznik Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 343.43, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Karacabey", lise: "Karacabey Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 351.24, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Karacabey", lise: "Karacabey Ulviye Matlı Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 424.82, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Mudanya", lise: "Turhan Tayan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 427.80, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Mustafakemalpaşa", lise: "İbrahim Önal Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 412.14, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Mustafakemalpaşa", lise: "Sedat Karan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 353.77, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Nilüfer", lise: "Ahmet Erdem Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 459.81, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Nilüfer", lise: "Nilüfer Borsa İstanbul Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 483.28, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Nilüfer", lise: "Özlüce Şehit Aykut Yurtsever Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 437.11, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Nilüfer", lise: "Tofaş Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 489.38, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Orhangazi", lise: "Orhangazi Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 402.81, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Osmangazi", lise: "BTSO Ali Osman Sönmez Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 393.49, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Osmangazi", lise: "BTSO Hüseyin Sungur Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 397.28, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Osmangazi", lise: "Bursa Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 473.28, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Osmangazi", lise: "Bursa Erkek Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 438.99, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Osmangazi", lise: "Bursa Kız Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 410.71, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Osmangazi", lise: "Mümin Canbaz Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 470.21, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Osmangazi", lise: "Osmangazi Gazi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 446.84, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Osmangazi", lise: "Şükrü Şankaya Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 454.63, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Yıldırım", lise: "Bursa Ahmet Vefik Paşa Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 404.80, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Yıldırım", lise: "Ulubatlı Hasan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 433.39, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Yıldırım", lise: "Yıldırım Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 447.57, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Bursa", ilce: "Yıldırım", lise: "6 Nisan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 409.20, yuzdelik: 0, siralama: 0, kontenjan: 0 },

  // =====================
  // ANTALYA
  // =====================
  { il: "Antalya", ilce: "Aksu", lise: "Aksu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 446.65, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Alanya", lise: "Hasan Çolak Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 422.00, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Alanya", lise: "Hüseyin Girenes Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 453.84, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Alanya", lise: "Kestel Sultan Alparslan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 393.54, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Alanya", lise: "Türkler Borsa İstanbul Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 334.26, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Döşemealtı", lise: "Antalya Erünal Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 386.03, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Döşemealtı", lise: "Yusuf Ziya Öner Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 482.98, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Elmalı", lise: "İbrahim Bedrettin Elmalı Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 385.23, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Finike", lise: "Finike Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 337.60, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Gazipaşa", lise: "Gazipaşa Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 428.73, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Kaş", lise: "Turan Erdoğan Yılmaz Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 394.99, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Kemer", lise: "Göynük Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 426.61, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Kemer", lise: "Ünal Aysal Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 378.56, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Kepez", lise: "Antalya Türkiye Odalar ve Borsalar Birliği Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 455.18, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Kepez", lise: "Gülveren Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 435.41, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Kepez", lise: "Neriman-Erol Yılmaz Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 398.29, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Konyaaltı", lise: "Dr. İlhami Tankut Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 439.59, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Korkuteli", lise: "Fatma Mehmet Cadıl Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 406.39, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Kumluca", lise: "Havva-Sedat Avcıoğlu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 415.77, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Kumluca", lise: "Kumluca Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 377.62, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Manavgat", lise: "Manavgat Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 416.58, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Manavgat", lise: "Namık Karamancı Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 453.33, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Muratpaşa", lise: "Adem-Tolunay Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 458.27, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Muratpaşa", lise: "Antalya Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 471.08, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Muratpaşa", lise: "Antalya Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 420.82, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Serik", lise: "Ertuğrul Gazi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 365.57, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Antalya", ilce: "Serik", lise: "Serik Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 415.58, yuzdelik: 0, siralama: 0, kontenjan: 0 },

  // =====================
  // KOCAELİ
  // =====================
  { il: "Kocaeli", ilce: "Başiskele", lise: "Kocaeli Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 407.41, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Başiskele", lise: "Servetiye Cephesi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 425.30, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Çayırova", lise: "Çayırova Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 400.65, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Çayırova", lise: "15 Temmuz Şehitler Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 433.04, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Darıca", lise: "Darıca Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 442.66, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Darıca", lise: "Sırasöğütler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 410.83, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Derince", lise: "Merkez Bankası Derince Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 435.01, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Gebze", lise: "Kanuni Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 377.15, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Gebze", lise: "Şehit Öğretmen Necmeddin Kuyucu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 416.36, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Gebze", lise: "Yücel Boru Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 456.10, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Gölcük", lise: "Gölcük Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 388.43, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Gölcük", lise: "Gölcük Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 452.23, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "İzmit", lise: "Kocaeli Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 479.63, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "İzmit", lise: "Muammer Dereli Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 468.31, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "İzmit", lise: "Şehit Özcan Kan Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 462.84, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "İzmit", lise: "24 Kasım Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 410.89, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Kandıra", lise: "Kandıra Akçakoca Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 304.99, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Karamürsel", lise: "Karamürsel Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 328.15, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Kartepe", lise: "Ertuğrulgazi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 409.10, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Kartepe", lise: "Kocaeli Ali Fuat Başgil Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 381.87, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Körfez", lise: "Med Marine Tuncer Şen Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 443.24, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Kocaeli", ilce: "Körfez", lise: "Yarımca Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 398.22, yuzdelik: 0, siralama: 0, kontenjan: 0 },

  // =====================
  // KONYA
  // =====================
  { il: "Konya", ilce: "Akşehir", lise: "Akşehir Hacı Sıddıka Baysal Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 426.83, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Akşehir", lise: "Akşehir Tarık Buğra Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 320.25, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Beyşehir", lise: "Beyşehir Cahit Zarifoğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 359.85, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Beyşehir", lise: "Fetullah Bayır Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 412.04, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Bozkır", lise: "Bozkır Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 316.23, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Cihanbeyli", lise: "Cihanbeyli Güven Belgin Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 341.11, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Çumra", lise: "Haydar-Fadim Kocaer Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 388.98, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Ereğli", lise: "Ereğli Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 433.24, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Ereğli", lise: "Ereğli Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 392.53, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Ereğli", lise: "İvriz Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 319.64, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Ilgın", lise: "Ilgın Ticaret Borsası Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 406.49, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Kadınhanı", lise: "Kadınhanı Zeki Altındağ Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 278.72, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Karapınar", lise: "Karapınar İbrahim Gündüz Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 358.74, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Karapınar", lise: "Karapınar Murat Kurum Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 411.87, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Karatay", lise: "Karatay Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 460.35, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Karatay", lise: "Karatay TOKİ Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 423.18, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Karatay", lise: "Konya Türk Telekom Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 386.58, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Kulu", lise: "Kulu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 292.60, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Kulu", lise: "Kulu Fahrettin Koca Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 383.02, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Meram", lise: "Konya Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 408.04, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Meram", lise: "Meram Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 452.64, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Meram", lise: "Meram Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 479.86, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Sarayönü", lise: "Sarayönü Mehmet-Emine Akdoğan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 240.22, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Selçuklu", lise: "Dolapoğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 432.82, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Selçuklu", lise: "Dolapoğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 431.40, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Selçuklu", lise: "Osman Nuri Hekimoğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 437.26, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Selçuklu", lise: "Selçuklu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 441.47, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Selçuklu", lise: "Selçuklu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 467.79, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Seydişehir", lise: "Seydişehir Seyyid Harun Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 386.22, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Konya", ilce: "Seydişehir", lise: "Şehit Muhsin Kiremitçi Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 413.75, yuzdelik: 0, siralama: 0, kontenjan: 0 },

  // =====================
  // ADANA
  // =====================
  { il: "Adana", ilce: "Ceyhan", lise: "Ceyhan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 337.99, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Ceyhan", lise: "Ceyhan Ticaret Borsası Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 313.97, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Ceyhan", lise: "Eczacı Bahattin-Sevinç Erdinç Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 418.65, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Ceyhan", lise: "Şehit Zeynep Sağır Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 375.69, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Çukurova", lise: "Adana Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 465.24, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Çukurova", lise: "ÇEAS Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 452.97, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Çukurova", lise: "İsmail Safa Özler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 446.79, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Çukurova", lise: "İsmail Safa Özler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 448.24, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Çukurova", lise: "Piri Reis Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 438.87, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Çukurova", lise: "Sungurbey Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 424.66, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Kozan", lise: "Fatih Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 393.85, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Kozan", lise: "Kozan Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 439.38, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Sarıçam", lise: "Adana Ticaret Odası Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 427.60, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Sarıçam", lise: "Bahtiyar Vahabzade Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 351.08, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Seyhan", lise: "Adana Erkek Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 345.32, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Seyhan", lise: "Adana Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 485.89, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Seyhan", lise: "Gazi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 411.87, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Seyhan", lise: "Seyhan Borsa İstanbul Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 476.40, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Seyhan", lise: "Seyhan Danişment Gazi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 403.08, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Yüreğir", lise: "Seyhan Rotary Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 412.74, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Yüreğir", lise: "TOKİ Köprülü Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 379.95, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Yüreğir", lise: "Yüreğir Halıcılar Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 387.17, yuzdelik: 0, siralama: 0, kontenjan: 0 },
  { il: "Adana", ilce: "Yüreğir", lise: "75.Yıl Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 397.03, yuzdelik: 0, siralama: 0, kontenjan: 0 },
];

export function getSchoolTypeColor(type: string): string {
  const schoolType = SCHOOL_TYPES.find(t => t.value === type);
  return schoolType?.color || '#6B7280';
}
