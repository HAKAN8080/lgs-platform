import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './config'

const googleProvider = new GoogleAuthProvider()

// Firebase yapılandırılmamışsa hata fırlat
function checkFirebaseConfigured() {
  if (!isFirebaseConfigured || !auth || !db) {
    throw new Error('Firebase yapılandırılmamış. Lütfen .env.local dosyasını oluşturun.')
  }
}

// Email ile kayıt
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  studentInfo?: { lgsYear?: string; targetScore?: number }
): Promise<UserCredential> {
  checkFirebaseConfigured()
  const userCredential = await createUserWithEmailAndPassword(auth!, email, password)

  // Profili güncelle
  await updateProfile(userCredential.user, { displayName })

  // Firestore'a kullanıcı bilgilerini kaydet
  await createUserDocument(userCredential.user, { displayName, ...studentInfo })

  return userCredential
}

// Email ile giriş
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  checkFirebaseConfigured()
  return signInWithEmailAndPassword(auth!, email, password)
}

// Google ile giriş
export async function signInWithGoogle(): Promise<UserCredential> {
  checkFirebaseConfigured()
  const userCredential = await signInWithPopup(auth!, googleProvider)

  // İlk giriş ise Firestore'a kaydet
  const userDoc = await getDoc(doc(db!, 'users', userCredential.user.uid))
  if (!userDoc.exists()) {
    await createUserDocument(userCredential.user)
  }

  return userCredential
}

// Çıkış
export async function signOut(): Promise<void> {
  if (!auth) return
  return firebaseSignOut(auth)
}

// Şifre sıfırlama
export async function resetPassword(email: string): Promise<void> {
  checkFirebaseConfigured()
  return sendPasswordResetEmail(auth!, email)
}

// Firestore'a kullanıcı dökümanı oluştur
async function createUserDocument(
  user: User,
  additionalData?: { displayName?: string; lgsYear?: string; targetScore?: number }
): Promise<void> {
  if (!db) return
  const userRef = doc(db, 'users', user.uid)

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: additionalData?.displayName || user.displayName || '',
    photoURL: user.photoURL || null,
    subscription: {
      plan: 'free',
      status: 'active',
    },
    profile: {
      lgsYear: additionalData?.lgsYear || null,
      targetScore: additionalData?.targetScore || null,
      province: null,
      district: null,
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await setDoc(userRef, userData)
}

// Kullanıcı verilerini getir
export async function getUserData(uid: string) {
  if (!db) return null
  const userDoc = await getDoc(doc(db, 'users', uid))
  return userDoc.exists() ? userDoc.data() : null
}
