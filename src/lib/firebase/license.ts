import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

export interface License {
  code: string
  plan: 'premium' | 'premium_plus'
  used: boolean
  usedBy: string | null
  usedByEmail: string | null
  usedAt: Date | null
  createdAt: Date
  expiresAt?: Date | null // null = LGS'ye kadar geçerli
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
