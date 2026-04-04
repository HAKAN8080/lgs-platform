// LGS Soru Dağılımları 2018-2025
// Kaynak: kaganakademi.com.tr

export interface TopicData {
  topic: string;
  years: Record<number, number>;
}

export interface SubjectDistribution {
  subject: string;
  icon: string;
  color: string;
  questionCount: number;
  topics: TopicData[];
}

export const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] as const;

export const LGS_QUESTION_DISTRIBUTION: SubjectDistribution[] = [
  {
    subject: "Türkçe",
    icon: "📖",
    color: "#3B82F6",
    questionCount: 20,
    topics: [
      { topic: "Sözcükte Anlam", years: { 2018: 2, 2019: 2, 2020: 1, 2021: 2, 2022: 2, 2023: 1, 2024: 1, 2025: 2 } },
      { topic: "Deyimler ve Atasözleri", years: { 2018: 1, 2019: 0, 2020: 0, 2021: 2, 2022: 0, 2023: 0, 2024: 1, 2025: 0 } },
      { topic: "Cümlede Anlam", years: { 2018: 2, 2019: 2, 2020: 2, 2021: 2, 2022: 1, 2023: 3, 2024: 3, 2025: 2 } },
      { topic: "Sözel Mantık / Görsel Okuma", years: { 2018: 1, 2019: 7, 2020: 6, 2021: 4, 2022: 5, 2023: 5, 2024: 3, 2025: 3 } },
      { topic: "Parçada Anlam", years: { 2018: 8, 2019: 3, 2020: 3, 2021: 10, 2022: 6, 2023: 5, 2024: 6, 2025: 6 } },
      { topic: "Söz Sanatları", years: { 2018: 0, 2019: 0, 2020: 1, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 1 } },
      { topic: "Metin Türleri", years: { 2018: 1, 2019: 1, 2020: 2, 2021: 0, 2022: 1, 2023: 1, 2024: 1, 2025: 0 } },
      { topic: "Noktalama İşaretleri", years: { 2018: 1, 2019: 1, 2020: 1, 2021: 0, 2022: 1, 2023: 1, 2024: 1, 2025: 1 } },
      { topic: "Yazım Kuralları", years: { 2018: 1, 2019: 1, 2020: 1, 2021: 0, 2022: 1, 2023: 1, 2024: 1, 2025: 1 } },
      { topic: "Fiilimsiler", years: { 2018: 1, 2019: 1, 2020: 1, 2021: 0, 2022: 0, 2023: 1, 2024: 1, 2025: 0 } },
      { topic: "Cümlenin Öğeleri", years: { 2018: 0, 2019: 0, 2020: 1, 2021: 0, 2022: 1, 2023: 1, 2024: 0, 2025: 0 } },
      { topic: "Cümle Türleri", years: { 2018: 1, 2019: 1, 2020: 1, 2021: 0, 2022: 0, 2023: 1, 2024: 1, 2025: 1 } },
      { topic: "Anlatım Bozukluğu", years: { 2018: 1, 2019: 1, 2020: 0, 2021: 0, 2022: 2, 2023: 0, 2024: 1, 2025: 1 } },
      { topic: "Fiilde Çatı", years: { 2018: 0, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 1 } },
      { topic: "Düşünceyi Geliştirme Yolları", years: { 2018: 0, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 1 } },
    ]
  },
  {
    subject: "Matematik",
    icon: "🔢",
    color: "#8B5CF6",
    questionCount: 20,
    topics: [
      { topic: "Üslü Sayılar", years: { 2018: 2, 2019: 2, 2020: 4, 2021: 3, 2022: 2, 2023: 4, 2024: 2, 2025: 2 } },
      { topic: "Köklü Sayılar", years: { 2018: 2, 2019: 2, 2020: 3, 2021: 2, 2022: 2, 2023: 5, 2024: 2, 2025: 2 } },
      { topic: "Çarpanlar ve Katlar", years: { 2018: 1, 2019: 1, 2020: 3, 2021: 3, 2022: 1, 2023: 3, 2024: 1, 2025: 1 } },
      { topic: "Olasılık", years: { 2018: 1, 2019: 1, 2020: 3, 2021: 1, 2022: 1, 2023: 2, 2024: 1, 2025: 1 } },
      { topic: "Veri Analizi", years: { 2018: 0, 2019: 1, 2020: 3, 2021: 2, 2022: 1, 2023: 2, 2024: 1, 2025: 1 } },
      { topic: "Eşitsizlikler", years: { 2018: 2, 2019: 1, 2020: 0, 2021: 2, 2022: 2, 2023: 0, 2024: 2, 2025: 2 } },
      { topic: "Cebirsel İfadeler ve Özdeşlikler", years: { 2018: 3, 2019: 3, 2020: 4, 2021: 2, 2022: 2, 2023: 4, 2024: 2, 2025: 2 } },
      { topic: "Doğrusal Denklemler ve Eğim", years: { 2018: 3, 2019: 4, 2020: 0, 2021: 2, 2022: 3, 2023: 0, 2024: 3, 2025: 3 } },
      { topic: "Dönüşüm Geometrisi", years: { 2018: 1, 2019: 1, 2020: 0, 2021: 0, 2022: 1, 2023: 0, 2024: 1, 2025: 1 } },
      { topic: "Geometrik Cisimler", years: { 2018: 2, 2019: 1, 2020: 0, 2021: 0, 2022: 1, 2023: 0, 2024: 1, 2025: 1 } },
      { topic: "Üçgenler", years: { 2018: 1, 2019: 2, 2020: 0, 2021: 2, 2022: 2, 2023: 0, 2024: 3, 2025: 3 } },
      { topic: "Eşlik ve Benzerlik", years: { 2018: 2, 2019: 1, 2020: 0, 2021: 1, 2022: 2, 2023: 0, 2024: 1, 2025: 1 } },
    ]
  },
  {
    subject: "Fen Bilimleri",
    icon: "🔬",
    color: "#10B981",
    questionCount: 20,
    topics: [
      { topic: "Mevsimler ve İklim", years: { 2018: 1, 2019: 1, 2020: 3, 2021: 2, 2022: 1, 2023: 3, 2024: 1, 2025: 1 } },
      { topic: "DNA ve Genetik Kod", years: { 2018: 2, 2019: 2, 2020: 8, 2021: 5, 2022: 4, 2023: 8, 2024: 4, 2025: 3 } },
      { topic: "Basınç", years: { 2018: 0, 2019: 2, 2020: 5, 2021: 2, 2022: 2, 2023: 5, 2024: 2, 2025: 2 } },
      { topic: "Madde ve Endüstri", years: { 2018: 6, 2019: 6, 2020: 4, 2021: 5, 2022: 5, 2023: 4, 2024: 5, 2025: 5 } },
      { topic: "Basit Makineler", years: { 2018: 2, 2019: 2, 2020: 0, 2021: 2, 2022: 2, 2023: 0, 2024: 2, 2025: 2 } },
      { topic: "Enerji Dönüşümleri ve Çevre Bilimi", years: { 2018: 3, 2019: 4, 2020: 0, 2021: 4, 2022: 4, 2023: 0, 2024: 4, 2025: 4 } },
      { topic: "Elektrik Yükleri ve Elektrik Enerjisi", years: { 2018: 3, 2019: 3, 2020: 0, 2021: 0, 2022: 2, 2023: 0, 2024: 2, 2025: 3 } },
      { topic: "Hücre Bölünmesi ve Kalıtım", years: { 2018: 1, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
      { topic: "Işığın Kırılması", years: { 2018: 1, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
      { topic: "Ses", years: { 2018: 1, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
    ]
  },
  {
    subject: "T.C. İnkılap Tarihi",
    icon: "📜",
    color: "#F59E0B",
    questionCount: 10,
    topics: [
      { topic: "Bir Kahraman Doğuyor", years: { 2018: 1, 2019: 1, 2020: 3, 2021: 1, 2022: 1, 2023: 5, 2024: 1, 2025: 0 } },
      { topic: "Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar", years: { 2018: 1, 2019: 2, 2020: 4, 2021: 2, 2022: 2, 2023: 2, 2024: 2, 2025: 5 } },
      { topic: "Milli Bir Destan: Ya İstiklal, Ya Ölüm", years: { 2018: 1, 2019: 2, 2020: 3, 2021: 2, 2022: 2, 2023: 3, 2024: 2, 2025: 2 } },
      { topic: "Atatürkçülük ve Çağdaşlaşan Türkiye", years: { 2018: 5, 2019: 4, 2020: 0, 2021: 3, 2022: 3, 2023: 0, 2024: 4, 2025: 2 } },
      { topic: "Demokratikleşme Çabaları", years: { 2018: 0, 2019: 0, 2020: 0, 2021: 1, 2022: 1, 2023: 0, 2024: 1, 2025: 1 } },
      { topic: "Atatürk Dönemi Dış Politika", years: { 2018: 1, 2019: 1, 2020: 0, 2021: 1, 2022: 1, 2023: 0, 2024: 0, 2025: 0 } },
      { topic: "Atatürk'ün Ölümü ve Sonrası", years: { 2018: 1, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
    ]
  },
  {
    subject: "Din Kültürü",
    icon: "🕌",
    color: "#EC4899",
    questionCount: 10,
    topics: [
      { topic: "Kader İnancı", years: { 2018: 1, 2019: 1, 2020: 1, 2021: 1, 2022: 3, 2023: 4, 2024: 2, 2025: 3 } },
      { topic: "Bir Peygamber Tanıyorum: Hz. Musa", years: { 2018: 0, 2019: 0, 2020: 3, 2021: 2, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
      { topic: "Zekat ve Sadaka", years: { 2018: 1, 2019: 3, 2020: 3, 2021: 3, 2022: 2, 2023: 3, 2024: 2, 2025: 2 } },
      { topic: "Din ve Hayat", years: { 2018: 2, 2019: 0, 2020: 3, 2021: 3, 2022: 4, 2023: 3, 2024: 2, 2025: 2 } },
      { topic: "Hz. Muhammed'in Örnekliği", years: { 2018: 1, 2019: 3, 2020: 0, 2021: 0, 2022: 1, 2023: 0, 2024: 2, 2025: 2 } },
      { topic: "Kur'an-ı Kerim ve Özellikleri", years: { 2018: 2, 2019: 2, 2020: 0, 2021: 1, 2022: 0, 2023: 0, 2024: 2, 2025: 1 } },
      { topic: "İslam'ın Paylaşma ve Yardımlaşmaya Verdiği Önem", years: { 2018: 1, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
      { topic: "İslam Dinine Göre Kötü Davranışlar", years: { 2018: 1, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
      { topic: "İnsanın Paylaşma ve Yardımlaşma İhtiyacı (Tevekkül)", years: { 2018: 0, 2019: 1, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
      { topic: "Hac İbadeti", years: { 2018: 1, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
    ]
  },
  {
    subject: "İngilizce",
    icon: "🌍",
    color: "#06B6D4",
    questionCount: 10,
    topics: [
      { topic: "Friendship", years: { 2018: 2, 2019: 1, 2020: 1, 2021: 1, 2022: 2, 2023: 4, 2024: 2, 2025: 2 } },
      { topic: "Teen Life", years: { 2018: 1, 2019: 3, 2020: 3, 2021: 1, 2022: 1, 2023: 0, 2024: 1, 2025: 1 } },
      { topic: "In The Kitchen", years: { 2018: 1, 2019: 1, 2020: 1, 2021: 2, 2022: 1, 2023: 2, 2024: 1, 2025: 1 } },
      { topic: "On The Phone", years: { 2018: 0, 2019: 1, 2020: 1, 2021: 1, 2022: 1, 2023: 2, 2024: 1, 2025: 1 } },
      { topic: "The Internet", years: { 2018: 1, 2019: 1, 2020: 1, 2021: 1, 2022: 1, 2023: 2, 2024: 2, 2025: 1 } },
      { topic: "Adventures", years: { 2018: 1, 2019: 1, 2020: 1, 2021: 1, 2022: 1, 2023: 0, 2024: 2, 2025: 1 } },
      { topic: "Tourism", years: { 2018: 3, 2019: 0, 2020: 0, 2021: 1, 2022: 1, 2023: 0, 2024: 0, 2025: 1 } },
      { topic: "Chores", years: { 2018: 1, 2019: 1, 2020: 1, 2021: 1, 2022: 1, 2023: 0, 2024: 0, 2025: 1 } },
      { topic: "Science", years: { 2018: 0, 2019: 1, 2020: 1, 2021: 1, 2022: 1, 2023: 0, 2024: 1, 2025: 1 } },
      { topic: "Natural Forces", years: { 2018: 0, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0 } },
    ]
  },
];

// Toplam soru sayısını hesapla
export function getTotalQuestions(subject: SubjectDistribution, year: number): number {
  return subject.topics.reduce((sum, topic) => sum + (topic.years[year] || 0), 0);
}

// Konunun toplam soru sayısını hesapla
export function getTopicTotal(topic: TopicData): number {
  return Object.values(topic.years).reduce((sum, count) => sum + count, 0);
}

// En çok çıkan konuları bul
export function getMostFrequentTopics(subject: SubjectDistribution, limit: number = 5): { topic: string; total: number }[] {
  return subject.topics
    .map(t => ({ topic: t.topic, total: getTopicTotal(t) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

// Yıla göre en çok çıkan konuları bul
export function getTopTopicsForYear(year: number, limit: number = 10): { subject: string; topic: string; count: number; color: string }[] {
  const allTopics: { subject: string; topic: string; count: number; color: string }[] = [];

  for (const subject of LGS_QUESTION_DISTRIBUTION) {
    for (const topic of subject.topics) {
      const count = topic.years[year] || 0;
      if (count > 0) {
        allTopics.push({
          subject: subject.subject,
          topic: topic.topic,
          count,
          color: subject.color
        });
      }
    }
  }

  return allTopics.sort((a, b) => b.count - a.count).slice(0, limit);
}
