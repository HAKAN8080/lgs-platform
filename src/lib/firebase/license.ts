import { doc, getDoc, setDoc, updateDoc, getDocs, collection, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

// Admin email listesi
export const ADMIN_EMAILS = ['admin@thorius.com.tr']

export interface License {
  code: string
  plan: 'premium' | 'premium_plus'
  used: boolean
  usedBy: string | null
  usedByEmail: string | null
  usedAt: Date | null
  createdAt: Date
  expiresAt?: Date | null // null = LGS'ye kadar geçerli
  note?: string | null
}

export interface ActivationResult {
  success: boolean
  message: string
}

/**
 * Lisans kodunu doğrula ve aktive et
 */
export async function activateLicense(
  code: string,
  userId: string,
  userEmail: string
): Promise<ActivationResult> {
  if (!db) {
    return { success: false, message: 'Veritabanı bağlantısı kurulamadı' }
  }

  // Kodu normalize et (büyük harf, boşlukları kaldır)
  const normalizedCode = code.trim().toUpperCase().replace(/\s/g, '')

  if (!normalizedCode || normalizedCode.length < 8) {
    return { success: false, message: 'Geçersiz lisans kodu formatı' }
  }

  try {
    // Lisans kodunu bul
    const licenseRef = doc(db, 'licenses', normalizedCode)
    const licenseSnap = await getDoc(licenseRef)

    if (!licenseSnap.exists()) {
      return { success: false, message: 'Lisans kodu bulunamadı' }
    }

    const license = licenseSnap.data() as License

    // Zaten kullanılmış mı?
    if (license.used) {
      if (license.usedBy === userId) {
        return { success: false, message: 'Bu lisans zaten hesabınızda aktif' }
      }
      return { success: false, message: 'Bu lisans kodu daha önce kullanılmış' }
    }

    // Lisansı aktive et
    await updateDoc(licenseRef, {
      used: true,
      usedBy: userId,
      usedByEmail: userEmail,
      usedAt: serverTimestamp(),
    })

    // Kullanıcının subscription'ını güncelle
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      'subscription.plan': license.plan || 'premium',
      'subscription.status': 'active',
      'subscription.activatedAt': serverTimestamp(),
      'subscription.licenseCode': normalizedCode,
    })

    return {
      success: true,
      message: 'Premium başarıyla aktive edildi! Sayfayı yenileyin.'
    }
  } catch (error) {
    console.error('Lisans aktivasyon hatası:', error)
    return { success: false, message: 'Bir hata oluştu, lütfen tekrar deneyin' }
  }
}

/**
 * Kullanıcının lisans durumunu kontrol et
 */
export async function checkUserLicense(userId: string): Promise<{
  hasPremium: boolean
  plan: string | null
  licenseCode: string | null
}> {
  if (!db) {
    return { hasPremium: false, plan: null, licenseCode: null }
  }

  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return { hasPremium: false, plan: null, licenseCode: null }
    }

    const userData = userSnap.data()
    const subscription = userData.subscription || {}

    return {
      hasPremium: subscription.plan === 'premium' || subscription.plan === 'premium_plus',
      plan: subscription.plan || 'free',
      licenseCode: subscription.licenseCode || null,
    }
  } catch (error) {
    console.error('Lisans kontrol hatası:', error)
    return { hasPremium: false, plan: null, licenseCode: null }
  }
}

/**
 * Rastgele lisans kodu oluştur
 */
export function generateLicenseCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Karışıklık olmaması için 0,O,1,I hariç
  const segments = []
  for (let s = 0; s < 3; s++) {
    let segment = ''
    for (let i = 0; i < 4; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments.push(segment)
  }
  return `LGS-${segments.join('-')}`
}

/**
 * Yeni lisans kodu oluştur ve kaydet (Admin)
 */
export async function createLicense(
  plan: 'premium' | 'premium_plus' = 'premium',
  note?: string
): Promise<{ success: boolean; code?: string; message: string }> {
  if (!db) {
    return { success: false, message: 'Veritabanı bağlantısı kurulamadı' }
  }

  try {
    const code = generateLicenseCode()
    const licenseRef = doc(db, 'licenses', code)

    await setDoc(licenseRef, {
      code,
      plan,
      used: false,
      usedBy: null,
      usedByEmail: null,
      usedAt: null,
      note: note || null,
      createdAt: serverTimestamp(),
    })

    return { success: true, code, message: 'Lisans kodu oluşturuldu' }
  } catch (error) {
    console.error('Lisans oluşturma hatası:', error)
    return { success: false, message: 'Lisans oluşturulamadı' }
  }
}

/**
 * Tüm lisansları getir (Admin)
 */
export async function getAllLicenses(): Promise<License[]> {
  if (!db) return []

  try {
    const licensesRef = collection(db, 'licenses')
    const q = query(licensesRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      usedAt: doc.data().usedAt?.toDate?.() || null,
    })) as License[]
  } catch (error) {
    console.error('Lisansları getirme hatası:', error)
    return []
  }
}

/**
 * Admin mi kontrol et
 */
export function isAdmin(email: string | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
