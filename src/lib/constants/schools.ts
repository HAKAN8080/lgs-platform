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

// 2025 LGS Taban Puanları - Kaynak: kazanabilirsin.com (MEB Resmi Verileri)
// Toplam öğrenci sayısı: ~1.200.000
export const SCHOOLS_DATA: School[] = [
  // =====================
  // EN YÜKSEK PUANLI LİSELER (500 puan)
  // =====================
  { il: "İstanbul", ilce: "Fatih", lise: "İstanbul Erkek Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 500.00, yuzdelik: 0.01, siralama: 120, kontenjan: 150 },
  { il: "İstanbul", ilce: "Beyoğlu", lise: "Galatasaray Üniversitesi Lisesi", tur: "Anadolu Lisesi", dil: "Fransızca", puan: 500.00, yuzdelik: 0.01, siralama: 120, kontenjan: 100 },
  { il: "İstanbul", ilce: "Beşiktaş", lise: "Kabataş Erkek Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 500.00, yuzdelik: 0.01, siralama: 120, kontenjan: 60 },
  { il: "İstanbul", ilce: "Beşiktaş", lise: "Kabataş Erkek Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 500.00, yuzdelik: 0.01, siralama: 120, kontenjan: 90 },

  // =====================
  // FEN LİSELERİ (2025)
  // =====================
  { il: "İstanbul", ilce: "Kadıköy", lise: "İstanbul Atatürk Fen Lisesi", tur: "Fen Lisesi", dil: "Almanca", puan: 495.35, yuzdelik: 0.09, siralama: 1080, kontenjan: 30 },
  { il: "İstanbul", ilce: "Kadıköy", lise: "İstanbul Atatürk Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 493.96, yuzdelik: 0.14, siralama: 1680, kontenjan: 120 },
  { il: "İstanbul", ilce: "Fatih", lise: "Çapa Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 487.93, yuzdelik: 0.40, siralama: 4800, kontenjan: 150 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Validebağ Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 477.21, yuzdelik: 1.05, siralama: 12600, kontenjan: 90 },
  { il: "İstanbul", ilce: "Kartal", lise: "Yüksel-İlhan Alanyalı Fen Lisesi", tur: "Fen Lisesi", dil: "Almanca", puan: 473.14, yuzdelik: 1.30, siralama: 15600, kontenjan: 90 },
  { il: "İstanbul", ilce: "Beylikdüzü", lise: "Yaşar Acar Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 470.75, yuzdelik: 1.57, siralama: 18840, kontenjan: 150 },
  { il: "İstanbul", ilce: "Büyükçekmece", lise: "Şehit Münir Alkan Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 469.01, yuzdelik: 1.74, siralama: 20880, kontenjan: 150 },
  { il: "İstanbul", ilce: "Maltepe", lise: "Şehit İlhan Varank Fen Lisesi", tur: "Fen Lisesi", dil: "Almanca", puan: 468.88, yuzdelik: 1.75, siralama: 21000, kontenjan: 60 },
  { il: "İstanbul", ilce: "Kartal", lise: "Yüksel-İlhan Alanyalı Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 466.10, yuzdelik: 2.00, siralama: 24000, kontenjan: 90 },
  { il: "İstanbul", ilce: "Küçükçekmece", lise: "Doğan Cüceloğlu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 462.36, yuzdelik: 2.38, siralama: 28560, kontenjan: 150 },
  { il: "İstanbul", ilce: "Ataşehir", lise: "Ahmet Keleşoğlu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 461.54, yuzdelik: 2.46, siralama: 29520, kontenjan: 210 },
  { il: "İstanbul", ilce: "Maltepe", lise: "Şehit İlhan Varank Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 461.51, yuzdelik: 2.47, siralama: 29640, kontenjan: 90 },
  { il: "İstanbul", ilce: "Ümraniye", lise: "Prof. Dr. Nabi Avcı Fen Lisesi", tur: "Fen Lisesi", dil: "Almanca", puan: 461.43, yuzdelik: 2.47, siralama: 29640, kontenjan: 30 },
  { il: "İstanbul", ilce: "Başakşehir", lise: "Hacı Şöhret Demiröz Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 459.41, yuzdelik: 2.65, siralama: 31800, kontenjan: 120 },
  { il: "İstanbul", ilce: "Ümraniye", lise: "Prof. Dr. Nabi Avcı Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 459.33, yuzdelik: 2.66, siralama: 31920, kontenjan: 90 },
  { il: "İstanbul", ilce: "Pendik", lise: "Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 458.86, yuzdelik: 2.70, siralama: 32400, kontenjan: 120 },
  { il: "İstanbul", ilce: "Bağcılar", lise: "Prof. Dr. Necmettin Erbakan Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 452.13, yuzdelik: 3.44, siralama: 41280, kontenjan: 150 },
  { il: "İstanbul", ilce: "Maltepe", lise: "Maltepe Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 450.59, yuzdelik: 3.62, siralama: 43440, kontenjan: 150 },
  { il: "İstanbul", ilce: "Silivri", lise: "Prof. Dr. Fuat Sezgin Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 446.95, yuzdelik: 4.10, siralama: 49200, kontenjan: 90 },
  { il: "İstanbul", ilce: "Sultanbeyli", lise: "Sultanbeyli Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 444.21, yuzdelik: 4.50, siralama: 54000, kontenjan: 120 },
  { il: "İstanbul", ilce: "Beykoz", lise: "Beykoz Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 440.45, yuzdelik: 5.00, siralama: 60000, kontenjan: 90 },
  { il: "İstanbul", ilce: "Sancaktepe", lise: "Sancaktepe Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 439.80, yuzdelik: 5.10, siralama: 61200, kontenjan: 120 },
  { il: "İstanbul", ilce: "Esenyurt", lise: "Esenyurt Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 438.74, yuzdelik: 5.25, siralama: 63000, kontenjan: 150 },
  { il: "İstanbul", ilce: "Çatalca", lise: "Çatalca Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 437.72, yuzdelik: 5.40, siralama: 64800, kontenjan: 90 },
  { il: "İstanbul", ilce: "Arnavutköy", lise: "Arnavutköy Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 435.50, yuzdelik: 5.75, siralama: 69000, kontenjan: 90 },
  { il: "İstanbul", ilce: "Şile", lise: "Dr. Vasıf Topçu Fen Lisesi", tur: "Fen Lisesi", dil: "İngilizce", puan: 414.10, yuzdelik: 9.50, siralama: 114000, kontenjan: 60 },

  // =====================
  // ANADOLU LİSELERİ - EN YÜKSEK PUANLILAR (2025)
  // =====================
  { il: "İstanbul", ilce: "Fatih", lise: "Cağaloğlu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 493.96, yuzdelik: 0.14, siralama: 1680, kontenjan: 120 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Hüseyin Avni Sözen Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 493.96, yuzdelik: 0.14, siralama: 1680, kontenjan: 30 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Haydarpaşa Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 487.77, yuzdelik: 0.46, siralama: 5520, kontenjan: 60 },
  { il: "İstanbul", ilce: "Beşiktaş", lise: "Beşiktaş Sakıp Sabancı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 486.22, yuzdelik: 0.51, siralama: 6120, kontenjan: 90 },
  { il: "İstanbul", ilce: "Kadıköy", lise: "Kadıköy Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 485.28, yuzdelik: 0.56, siralama: 6720, kontenjan: 180 },
  { il: "İstanbul", ilce: "Fatih", lise: "Vefa Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 481.23, yuzdelik: 0.83, siralama: 9960, kontenjan: 150 },
  { il: "İstanbul", ilce: "Beşiktaş", lise: "Beşiktaş Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 478.34, yuzdelik: 0.97, siralama: 11640, kontenjan: 90 },
  { il: "İstanbul", ilce: "Kartal", lise: "Burak Bora Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 477.63, yuzdelik: 1.01, siralama: 12120, kontenjan: 90 },
  { il: "İstanbul", ilce: "Fatih", lise: "Pertevniyal Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 475.66, yuzdelik: 1.21, siralama: 14520, kontenjan: 150 },
  { il: "İstanbul", ilce: "Kadıköy", lise: "Göztepe Mimar Sinan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 473.50, yuzdelik: 1.35, siralama: 16200, kontenjan: 120 },
  { il: "İstanbul", ilce: "Maltepe", lise: "Dr. Sadık Ahmet Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 471.20, yuzdelik: 1.55, siralama: 18600, kontenjan: 150 },
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Adnan Menderes Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 468.91, yuzdelik: 1.76, siralama: 21120, kontenjan: 240 },
  { il: "İstanbul", ilce: "Ataşehir", lise: "Ataşehir Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 467.50, yuzdelik: 1.90, siralama: 22800, kontenjan: 180 },
  { il: "İstanbul", ilce: "Fatih", lise: "Şehremini Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 465.26, yuzdelik: 2.09, siralama: 25080, kontenjan: 120 },
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Bahçelievler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "Almanca", puan: 464.55, yuzdelik: 2.15, siralama: 25800, kontenjan: 120 },
  { il: "İstanbul", ilce: "Beşiktaş", lise: "Beşiktaş Atatürk Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 462.28, yuzdelik: 2.38, siralama: 28560, kontenjan: 150 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Üsküdar Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 460.50, yuzdelik: 2.55, siralama: 30600, kontenjan: 180 },
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Bahçelievler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 459.36, yuzdelik: 2.66, siralama: 31920, kontenjan: 90 },
  { il: "İstanbul", ilce: "Şişli", lise: "Nişantaşı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 456.94, yuzdelik: 2.92, siralama: 35040, kontenjan: 60 },
  { il: "İstanbul", ilce: "Pendik", lise: "Pendik Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 455.80, yuzdelik: 3.05, siralama: 36600, kontenjan: 180 },
  { il: "İstanbul", ilce: "Ümraniye", lise: "Ümraniye Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 454.20, yuzdelik: 3.20, siralama: 38400, kontenjan: 210 },
  { il: "İstanbul", ilce: "Küçükçekmece", lise: "Halkalı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 452.50, yuzdelik: 3.40, siralama: 40800, kontenjan: 180 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Hasan Polatkan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 446.91, yuzdelik: 4.10, siralama: 49200, kontenjan: 240 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Yeşilköy Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 446.67, yuzdelik: 4.12, siralama: 49440, kontenjan: 210 },
  { il: "İstanbul", ilce: "Zeytinburnu", lise: "Zeytinburnu Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 445.30, yuzdelik: 4.30, siralama: 51600, kontenjan: 180 },
  { il: "İstanbul", ilce: "Güngören", lise: "Güngören Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 443.80, yuzdelik: 4.50, siralama: 54000, kontenjan: 150 },
  { il: "İstanbul", ilce: "Eyüpsultan", lise: "Eyüp Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 442.20, yuzdelik: 4.70, siralama: 56400, kontenjan: 180 },
  { il: "İstanbul", ilce: "Sarıyer", lise: "Sarıyer Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 440.80, yuzdelik: 4.95, siralama: 59400, kontenjan: 150 },
  { il: "İstanbul", ilce: "Gaziosmanpaşa", lise: "Gaziosmanpaşa Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 438.50, yuzdelik: 5.30, siralama: 63600, kontenjan: 210 },
  { il: "İstanbul", ilce: "Kağıthane", lise: "Kağıthane Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 436.80, yuzdelik: 5.55, siralama: 66600, kontenjan: 180 },
  { il: "İstanbul", ilce: "Bayrampaşa", lise: "Bayrampaşa Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 435.20, yuzdelik: 5.80, siralama: 69600, kontenjan: 180 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Florya Tevfik Ercan Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 431.20, yuzdelik: 6.40, siralama: 76800, kontenjan: 270 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Ataköy Cumhuriyet Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 428.69, yuzdelik: 6.80, siralama: 81600, kontenjan: 300 },
  { il: "İstanbul", ilce: "Sultangazi", lise: "Sultangazi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 426.50, yuzdelik: 7.15, siralama: 85800, kontenjan: 240 },
  { il: "İstanbul", ilce: "Esenler", lise: "Esenler Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 424.30, yuzdelik: 7.50, siralama: 90000, kontenjan: 210 },
  { il: "İstanbul", ilce: "Ataşehir", lise: "Habire Yahşi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 422.20, yuzdelik: 7.80, siralama: 93600, kontenjan: 270 },
  { il: "İstanbul", ilce: "Başakşehir", lise: "Başakşehir Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 420.50, yuzdelik: 8.10, siralama: 97200, kontenjan: 300 },
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Dede Korkut Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 418.60, yuzdelik: 8.40, siralama: 100800, kontenjan: 300 },
  { il: "İstanbul", ilce: "Ataşehir", lise: "TEB Ataşehir Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 415.96, yuzdelik: 8.85, siralama: 106200, kontenjan: 240 },
  { il: "İstanbul", ilce: "Tuzla", lise: "Tuzla Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 414.50, yuzdelik: 9.10, siralama: 109200, kontenjan: 210 },
  { il: "İstanbul", ilce: "Beylikdüzü", lise: "Beylikdüzü Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 412.80, yuzdelik: 9.40, siralama: 112800, kontenjan: 270 },
  { il: "İstanbul", ilce: "Avcılar", lise: "Süleyman Nazif Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 410.56, yuzdelik: 9.80, siralama: 117600, kontenjan: 330 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Yahya Kemal Beyatlı Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 410.38, yuzdelik: 9.82, siralama: 117840, kontenjan: 270 },
  { il: "İstanbul", ilce: "Çekmeköy", lise: "Çekmeköy Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 408.50, yuzdelik: 10.15, siralama: 121800, kontenjan: 210 },
  { il: "İstanbul", ilce: "Bağcılar", lise: "Mehmet Niyazi Altuğ Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 395.45, yuzdelik: 12.50, siralama: 150000, kontenjan: 360 },
  { il: "İstanbul", ilce: "Bağcılar", lise: "Dr. Kemal Naci Ekşi Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 390.11, yuzdelik: 13.50, siralama: 162000, kontenjan: 330 },
  { il: "İstanbul", ilce: "Arnavutköy", lise: "Şehit Selçuk Gürdal Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 387.79, yuzdelik: 14.00, siralama: 168000, kontenjan: 300 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Kandilli Kız Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 383.76, yuzdelik: 14.80, siralama: 177600, kontenjan: 180 },
  { il: "İstanbul", ilce: "Esenyurt", lise: "Esenyurt Anadolu Lisesi", tur: "Anadolu Lisesi", dil: "İngilizce", puan: 375.50, yuzdelik: 17.00, siralama: 204000, kontenjan: 360 },

  // =====================
  // SOSYAL BİLİMLER LİSELERİ (2025)
  // =====================
  { il: "İstanbul", ilce: "Bahçelievler", lise: "Prof. Dr. Mümtaz Turhan Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 406.84, yuzdelik: 9.61, siralama: 115320, kontenjan: 120 },
  { il: "İstanbul", ilce: "Beylikdüzü", lise: "Vali Muammer Güler Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 391.58, yuzdelik: 12.15, siralama: 145800, kontenjan: 150 },
  { il: "İstanbul", ilce: "Pendik", lise: "Gönüllü Hizmet Vakfı İnal Aydınoğlu Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 388.34, yuzdelik: 12.70, siralama: 152400, kontenjan: 120 },
  { il: "İstanbul", ilce: "Kadıköy", lise: "Kadıköy Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 385.20, yuzdelik: 13.40, siralama: 160800, kontenjan: 90 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Üsküdar Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 378.50, yuzdelik: 15.50, siralama: 186000, kontenjan: 90 },
  { il: "İstanbul", ilce: "Fatih", lise: "Fatih Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 372.80, yuzdelik: 17.50, siralama: 210000, kontenjan: 120 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Bakırköy Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 368.40, yuzdelik: 19.00, siralama: 228000, kontenjan: 120 },
  { il: "İstanbul", ilce: "Şile", lise: "Şile Oya-Ali Osman Keçici Sosyal Bilimler Lisesi", tur: "Sosyal Bilimler", dil: "İngilizce", puan: 332.40, yuzdelik: 23.66, siralama: 283920, kontenjan: 60 },

  // =====================
  // İMAM HATİP LİSELERİ (Fen-Sosyal Programları - 2025)
  // =====================
  { il: "İstanbul", ilce: "Kartal", lise: "Kartal Anadolu İmam Hatip Lisesi (Fen-Sosyal)", tur: "Imam Hatip", dil: "Arapça", puan: 482.44, yuzdelik: 0.69, siralama: 8280, kontenjan: 150 },
  { il: "İstanbul", ilce: "Kadıköy", lise: "Kadıköy Anadolu İmam Hatip Lisesi (Fen-Sosyal)", tur: "Imam Hatip", dil: "Arapça", puan: 474.21, yuzdelik: 1.30, siralama: 15600, kontenjan: 30 },
  { il: "İstanbul", ilce: "Başakşehir", lise: "M.Emin Saraç Anadolu İmam Hatip Lisesi (Fen-Sosyal)", tur: "Imam Hatip", dil: "Arapça", puan: 470.21, yuzdelik: 1.64, siralama: 19680, kontenjan: 60 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "İstanbul Ticaret Odası Marmara Anadolu İmam Hatip (Fen-Sosyal)", tur: "Imam Hatip", dil: "Arapça", puan: 466.77, yuzdelik: 1.94, siralama: 23280, kontenjan: 30 },
  { il: "İstanbul", ilce: "Beyoğlu", lise: "Beyoğlu Anadolu İmam Hatip Lisesi (Fen-Sosyal)", tur: "Imam Hatip", dil: "Arapça", puan: 461.75, yuzdelik: 2.43, siralama: 29160, kontenjan: 30 },
  { il: "İstanbul", ilce: "Fatih", lise: "Fatih Anadolu İmam Hatip Lisesi", tur: "Imam Hatip", dil: "Arapça", puan: 455.50, yuzdelik: 3.10, siralama: 37200, kontenjan: 360 },
  { il: "İstanbul", ilce: "Üsküdar", lise: "Üsküdar Anadolu İmam Hatip Lisesi", tur: "Imam Hatip", dil: "Arapça", puan: 448.20, yuzdelik: 3.95, siralama: 47400, kontenjan: 420 },
  { il: "İstanbul", ilce: "Pendik", lise: "Pendik Anadolu İmam Hatip Lisesi", tur: "Imam Hatip", dil: "Arapça", puan: 442.80, yuzdelik: 4.65, siralama: 55800, kontenjan: 300 },
  { il: "İstanbul", ilce: "Ümraniye", lise: "Ümraniye Anadolu İmam Hatip Lisesi", tur: "Imam Hatip", dil: "Arapça", puan: 438.50, yuzdelik: 5.30, siralama: 63600, kontenjan: 270 },
  { il: "İstanbul", ilce: "Sultanbeyli", lise: "Sultanbeyli Anadolu İmam Hatip Lisesi", tur: "Imam Hatip", dil: "Arapça", puan: 432.70, yuzdelik: 6.20, siralama: 74400, kontenjan: 330 },
  { il: "İstanbul", ilce: "Bağcılar", lise: "Bağcılar Anadolu İmam Hatip Lisesi", tur: "Imam Hatip", dil: "Arapça", puan: 425.40, yuzdelik: 7.35, siralama: 88200, kontenjan: 390 },
  { il: "İstanbul", ilce: "Esenyurt", lise: "Esenyurt Anadolu İmam Hatip Lisesi", tur: "Imam Hatip", dil: "Arapça", puan: 418.20, yuzdelik: 8.45, siralama: 101400, kontenjan: 420 },

  // =====================
  // MESLEKİ VE TEKNİK ANADOLU LİSELERİ (Bilişim/Teknik - 2025)
  // =====================
  { il: "İstanbul", ilce: "Başakşehir", lise: "Baykar Milli Teknoloji Mesleki ve Teknik Anadolu Lisesi", tur: "Meslek Lisesi", dil: "İngilizce", puan: 489.63, yuzdelik: 0.19, siralama: 2280, kontenjan: 18 },
  { il: "İstanbul", ilce: "Pendik", lise: "Teknopark İstanbul Mesleki ve Teknik Anadolu Lisesi (Siber Güvenlik)", tur: "Meslek Lisesi", dil: "İngilizce", puan: 473.07, yuzdelik: 1.32, siralama: 15840, kontenjan: 30 },
  { il: "İstanbul", ilce: "Şişli", lise: "Yıldız Teknik Üniversitesi Maçka Mesleki ve Teknik Anadolu Lisesi", tur: "Meslek Lisesi", dil: "İngilizce", puan: 423.40, yuzdelik: 7.60, siralama: 91200, kontenjan: 30 },
  { il: "İstanbul", ilce: "Kadıköy", lise: "Kadıköy Mesleki ve Teknik Anadolu Lisesi", tur: "Meslek Lisesi", dil: "İngilizce", puan: 385.00, yuzdelik: 13.45, siralama: 161400, kontenjan: 450 },
  { il: "İstanbul", ilce: "Küçükçekmece", lise: "Halkalı Mesleki ve Teknik Anadolu Lisesi", tur: "Meslek Lisesi", dil: "İngilizce", puan: 365.00, yuzdelik: 20.50, siralama: 246000, kontenjan: 540 },
  { il: "İstanbul", ilce: "Ataşehir", lise: "Ataşehir Mesleki ve Teknik Anadolu Lisesi", tur: "Meslek Lisesi", dil: "İngilizce", puan: 358.50, yuzdelik: 23.00, siralama: 276000, kontenjan: 480 },
  { il: "İstanbul", ilce: "Bakırköy", lise: "Bakırköy Mesleki ve Teknik Anadolu Lisesi", tur: "Meslek Lisesi", dil: "İngilizce", puan: 352.80, yuzdelik: 25.50, siralama: 306000, kontenjan: 420 },
];

export function getSchoolTypeColor(type: string): string {
  const schoolType = SCHOOL_TYPES.find(t => t.value === type);
  return schoolType?.color || '#6B7280';
}
