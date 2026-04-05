// Plan Tipleri
export type PlanType = 'basic' | 'pro' | 'elite' | 'kurumsal'

// Özellik Tanımları
export type FeatureKey =
  // BASIC özellikler
  | 'puan_hesaplama'
  | 'net_hesaplama'
  | 'taban_puanlari'
  | 'tercih_robotu'
  | 'deneme_yukleme'
  | 'karne_yukleme'
  | 'temel_analiz'
  | 'temel_net_takip'
  // PRO özellikler
  | 'sinirsiz_deneme'
  | 'sinirsiz_karne'
  | 'gelismis_analiz'
  | 'konu_bazli_analiz'
  | 'haftalik_strateji'
  | 'zayif_konu_tespiti'
  | 'net_takip_grafik'
  | 'hedef_okul_takibi'
  | 'dinamik_calisma_plani'
  | 'pdf_okuyucu'
  | 'txt_okuyucu'
  // ELITE özellikler
  | 'ai_koc'
  | 'ai_strateji'
  | 'ai_soru_uretici'
  | 'sinav_tahmini'
  | 'kisisel_taktikler'
  | 'ebeveyn_raporu'
  | 'performans_skoru'
  | 'adaptif_ogrenme'
  | 'haftalik_ai_rapor'
  | 'hata_tekrar_sistemi'
  // KURUMSAL özellikler
  | 'optik_okuma'
  | 'sinif_yonetimi'
  | 'ogrenci_yonetimi'
  | 'toplu_deneme_yukleme'
  | 'konu_eksik_haritasi'
  | 'ogrenci_risk_skoru'
  | 'ai_sinif_analizi'
  | 'otomatik_odev_atama'
  | 'kurum_dashboard'

// Özellik Durumları
export type FeatureStatus = 'active' | 'limited' | 'locked' | 'coming_soon'

// Özellik Detayları
export interface FeatureDetail {
  key: FeatureKey
  name: string
  description: string
  status: FeatureStatus
  limit?: number // limitli özellikler için
}

// Plan Detayları
export interface PlanDetail {
  key: PlanType
  name: string
  description: string
  price: number // 0 = ücretsiz
  priceLabel: string
  badge?: string
  color: string
  features: FeatureDetail[]
}

// Özellik erişim kontrolü
export function hasAccess(userPlan: PlanType, feature: FeatureKey): boolean {
  const access = FEATURE_ACCESS[feature]
  if (!access) return false
  return access.includes(userPlan)
}

// Özellik durumu kontrolü
export function getFeatureStatus(userPlan: PlanType, feature: FeatureKey): FeatureStatus {
  const planIndex = PLAN_HIERARCHY.indexOf(userPlan)
  const featureInfo = ALL_FEATURES.find(f => f.key === feature)

  if (!featureInfo) return 'locked'
  if (featureInfo.status === 'coming_soon') return 'coming_soon'

  if (hasAccess(userPlan, feature)) {
    // Limitli mi kontrol et
    if (userPlan === 'basic' && BASIC_LIMITED_FEATURES.includes(feature)) {
      return 'limited'
    }
    if (userPlan === 'pro' && PRO_LIMITED_FEATURES.includes(feature)) {
      return 'limited'
    }
    return 'active'
  }

  return 'locked'
}

// Plan hiyerarşisi (düşükten yükseğe)
export const PLAN_HIERARCHY: PlanType[] = ['basic', 'pro', 'elite', 'kurumsal']

// Her özelliğe hangi planlar erişebilir
export const FEATURE_ACCESS: Record<FeatureKey, PlanType[]> = {
  // BASIC (herkes erişebilir)
  puan_hesaplama: ['basic', 'pro', 'elite', 'kurumsal'],
  net_hesaplama: ['basic', 'pro', 'elite', 'kurumsal'],
  taban_puanlari: ['basic', 'pro', 'elite', 'kurumsal'],
  tercih_robotu: ['basic', 'pro', 'elite', 'kurumsal'],
  deneme_yukleme: ['basic', 'pro', 'elite', 'kurumsal'],
  karne_yukleme: ['basic', 'pro', 'elite', 'kurumsal'],
  temel_analiz: ['basic', 'pro', 'elite', 'kurumsal'],
  temel_net_takip: ['basic', 'pro', 'elite', 'kurumsal'],

  // PRO ve üstü
  sinirsiz_deneme: ['pro', 'elite', 'kurumsal'],
  sinirsiz_karne: ['pro', 'elite', 'kurumsal'],
  gelismis_analiz: ['pro', 'elite', 'kurumsal'],
  konu_bazli_analiz: ['pro', 'elite', 'kurumsal'],
  haftalik_strateji: ['pro', 'elite', 'kurumsal'],
  zayif_konu_tespiti: ['pro', 'elite', 'kurumsal'],
  net_takip_grafik: ['pro', 'elite', 'kurumsal'],
  hedef_okul_takibi: ['pro', 'elite', 'kurumsal'],
  dinamik_calisma_plani: ['pro', 'elite', 'kurumsal'],
  pdf_okuyucu: ['pro', 'elite', 'kurumsal'],
  txt_okuyucu: ['pro', 'elite', 'kurumsal'],

  // ELITE ve üstü
  ai_koc: ['elite', 'kurumsal'],
  ai_strateji: ['elite', 'kurumsal'],
  ai_soru_uretici: ['elite', 'kurumsal'],
  sinav_tahmini: ['elite', 'kurumsal'],
  kisisel_taktikler: ['elite', 'kurumsal'],
  ebeveyn_raporu: ['elite', 'kurumsal'],
  performans_skoru: ['elite', 'kurumsal'],
  adaptif_ogrenme: ['elite', 'kurumsal'],
  haftalik_ai_rapor: ['elite', 'kurumsal'],
  hata_tekrar_sistemi: ['elite', 'kurumsal'],

  // Sadece KURUMSAL
  optik_okuma: ['kurumsal'],
  sinif_yonetimi: ['kurumsal'],
  ogrenci_yonetimi: ['kurumsal'],
  toplu_deneme_yukleme: ['kurumsal'],
  konu_eksik_haritasi: ['kurumsal'],
  ogrenci_risk_skoru: ['kurumsal'],
  ai_sinif_analizi: ['kurumsal'],
  otomatik_odev_atama: ['kurumsal'],
  kurum_dashboard: ['kurumsal'],
}

// BASIC'te limitli özellikler
export const BASIC_LIMITED_FEATURES: FeatureKey[] = [
  'deneme_yukleme', // max 5
  'karne_yukleme',  // max 5
]

// PRO'da limitli özellikler
export const PRO_LIMITED_FEATURES: FeatureKey[] = [
  'pdf_okuyucu',    // günde 10
  'txt_okuyucu',    // günde 10
]

// Limit değerleri
export const FEATURE_LIMITS: Partial<Record<FeatureKey, Record<PlanType, number>>> = {
  deneme_yukleme: { basic: 5, pro: -1, elite: -1, kurumsal: -1 }, // -1 = sınırsız
  karne_yukleme: { basic: 5, pro: -1, elite: -1, kurumsal: -1 },
  pdf_okuyucu: { basic: 0, pro: 10, elite: -1, kurumsal: -1 },
  txt_okuyucu: { basic: 0, pro: 10, elite: -1, kurumsal: -1 },
}

// Tüm özellikler listesi
export const ALL_FEATURES: FeatureDetail[] = [
  // BASIC
  { key: 'puan_hesaplama', name: 'LGS Puan Hesaplama', description: 'Anlık puan hesaplama', status: 'active' },
  { key: 'net_hesaplama', name: 'Net Hesaplama', description: 'Doğru/yanlış net hesabı', status: 'active' },
  { key: 'taban_puanlari', name: 'Taban Puanları', description: 'Lise taban puanları ve yüzdelik dilim', status: 'active' },
  { key: 'tercih_robotu', name: 'Tercih Robotu', description: 'Puana uygun okul önerileri', status: 'active' },
  { key: 'deneme_yukleme', name: 'Deneme Yükleme', description: 'Deneme sonuçlarını kaydet', status: 'active', limit: 5 },
  { key: 'karne_yukleme', name: 'Karne Yükleme', description: 'PDF karne yükle ve analiz et', status: 'active', limit: 5 },
  { key: 'temel_analiz', name: 'Temel Analiz', description: 'Ders bazlı başarı oranı', status: 'active' },
  { key: 'temel_net_takip', name: 'Net Takip', description: 'Temel net takibi', status: 'active' },

  // PRO
  { key: 'sinirsiz_deneme', name: 'Sınırsız Deneme', description: 'Deneme yükleme limiti yok', status: 'active' },
  { key: 'sinirsiz_karne', name: 'Sınırsız Karne', description: 'Karne yükleme limiti yok', status: 'active' },
  { key: 'gelismis_analiz', name: 'Gelişmiş Analiz', description: 'Detaylı performans analizi', status: 'active' },
  { key: 'konu_bazli_analiz', name: 'Konu Bazlı Analiz', description: 'Her konu için ayrı analiz', status: 'active' },
  { key: 'haftalik_strateji', name: 'Haftalık Strateji', description: 'Kişiselleştirilmiş çalışma planı', status: 'active' },
  { key: 'zayif_konu_tespiti', name: 'Zayıf Konu Tespiti', description: 'Eksik konuları otomatik bul', status: 'active' },
  { key: 'net_takip_grafik', name: 'Gelişim Grafikleri', description: 'Detaylı net ve puan grafikleri', status: 'active' },
  { key: 'hedef_okul_takibi', name: 'Hedef Okul Takibi', description: 'Hedef okula ne kadar yakınsın', status: 'active' },
  { key: 'dinamik_calisma_plani', name: 'Dinamik Çalışma Planı', description: 'Performansa göre güncellenen plan', status: 'active' },
  { key: 'pdf_okuyucu', name: 'PDF Okuyucu', description: 'PDF dosyalarını analiz et', status: 'active', limit: 10 },
  { key: 'txt_okuyucu', name: 'TXT Okuyucu', description: 'Metin dosyalarını analiz et', status: 'active', limit: 10 },

  // ELITE
  { key: 'ai_koc', name: 'AI Koç', description: 'Yapay zeka destekli kişisel koç', status: 'active' },
  { key: 'ai_strateji', name: 'AI Strateji', description: 'AI ile optimize edilmiş strateji', status: 'active' },
  { key: 'ai_soru_uretici', name: 'AI Soru Üretici', description: 'Zayıf konulara özel sorular', status: 'active' },
  { key: 'sinav_tahmini', name: 'Sınav Tahmini', description: 'LGS puan ve yüzdelik tahmini', status: 'active' },
  { key: 'kisisel_taktikler', name: 'Kişisel Taktikler', description: 'Sana özel çalışma taktikleri', status: 'active' },
  { key: 'ebeveyn_raporu', name: 'Ebeveyn Raporu', description: 'Veli için detaylı rapor', status: 'active' },
  { key: 'performans_skoru', name: 'Performans Skoru', description: 'Genel hazırlık seviyesi', status: 'active' },
  { key: 'adaptif_ogrenme', name: 'Adaptif Öğrenme', description: 'Seviyene göre uyarlanan içerik', status: 'coming_soon' },
  { key: 'haftalik_ai_rapor', name: 'Haftalık AI Rapor', description: 'Her hafta AI analiz raporu', status: 'active' },
  { key: 'hata_tekrar_sistemi', name: 'Hata Tekrar Sistemi', description: 'Yanlış soruları tekrar çöz', status: 'coming_soon' },

  // KURUMSAL
  { key: 'optik_okuma', name: 'Optik Okuma', description: 'Toplu sınav okuma', status: 'active' },
  { key: 'sinif_yonetimi', name: 'Sınıf Yönetimi', description: 'Sınıf ve şube yönetimi', status: 'active' },
  { key: 'ogrenci_yonetimi', name: 'Öğrenci Yönetimi', description: 'Öğrenci takibi', status: 'active' },
  { key: 'toplu_deneme_yukleme', name: 'Toplu Deneme Yükleme', description: 'Excel ile toplu yükleme', status: 'active' },
  { key: 'konu_eksik_haritasi', name: 'Konu Eksik Haritası', description: 'Sınıf bazlı eksik analizi', status: 'coming_soon' },
  { key: 'ogrenci_risk_skoru', name: 'Öğrenci Risk Skoru', description: 'Başarısızlık riski takibi', status: 'coming_soon' },
  { key: 'ai_sinif_analizi', name: 'AI Sınıf Analizi', description: 'Sınıf için AI önerileri', status: 'coming_soon' },
  { key: 'otomatik_odev_atama', name: 'Otomatik Ödev Atama', description: 'Eksiklere göre ödev', status: 'coming_soon' },
  { key: 'kurum_dashboard', name: 'Kurum Dashboard', description: 'Genel kurum performansı', status: 'active' },
]

// Plan Tanımları
export const PLANS: PlanDetail[] = [
  {
    key: 'basic',
    name: 'Basic',
    description: 'LGS hazırlığına başla',
    price: 0,
    priceLabel: 'Ücretsiz',
    color: 'gray',
    features: ALL_FEATURES.filter(f =>
      FEATURE_ACCESS[f.key].includes('basic') &&
      !FEATURE_ACCESS[f.key].every(p => p !== 'basic')
    ).map(f => ({
      ...f,
      status: f.key === 'deneme_yukleme' || f.key === 'karne_yukleme' ? 'limited' as FeatureStatus : f.status,
      limit: f.key === 'deneme_yukleme' || f.key === 'karne_yukleme' ? 5 : undefined
    }))
  },
  {
    key: 'pro',
    name: 'Pro',
    description: 'AI destekli günlük koçluk',
    price: 299,
    priceLabel: '299₺',
    badge: 'Popüler',
    color: 'blue',
    features: ALL_FEATURES.filter(f =>
      FEATURE_ACCESS[f.key].includes('pro') &&
      !['optik_okuma', 'sinif_yonetimi', 'ogrenci_yonetimi', 'toplu_deneme_yukleme', 'konu_eksik_haritasi', 'ogrenci_risk_skoru', 'ai_sinif_analizi', 'otomatik_odev_atama', 'kurum_dashboard'].includes(f.key)
    )
  },
  {
    key: 'elite',
    name: 'Elite',
    description: 'Full AI öğretmen deneyimi',
    price: 599,
    priceLabel: '599₺',
    badge: 'En Kapsamlı',
    color: 'purple',
    features: ALL_FEATURES.filter(f =>
      FEATURE_ACCESS[f.key].includes('elite') &&
      !['optik_okuma', 'sinif_yonetimi', 'ogrenci_yonetimi', 'toplu_deneme_yukleme', 'konu_eksik_haritasi', 'ogrenci_risk_skoru', 'ai_sinif_analizi', 'otomatik_odev_atama', 'kurum_dashboard'].includes(f.key)
    )
  },
]

// Bireysel planlar için kilitli özellikler (UI'da göster ama aktif etme)
export const BASIC_LOCKED_FEATURES: FeatureKey[] = [
  'ai_koc',
  'gelismis_analiz',
  'dinamik_calisma_plani',
]

export const PRO_LOCKED_FEATURES: FeatureKey[] = [
  'ai_soru_uretici',
  'hata_tekrar_sistemi',
  'sinav_tahmini',
]
