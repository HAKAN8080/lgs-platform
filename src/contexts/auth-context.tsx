'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase/config'
import { getUserData } from '@/lib/firebase/auth'
import {
  type PlanType,
  type FeatureKey,
  hasAccess,
  getFeatureStatus,
  FEATURE_LIMITS,
} from '@/lib/constants/plans'

// Plan mapping: eski sistem -> yeni sistem
const PLAN_MAPPING: Record<string, PlanType> = {
  'free': 'basic',
  'basic': 'basic',
  'premium': 'pro',
  'pro': 'pro',
  'premium_plus': 'elite',
  'elite': 'elite',
  'kurumsal': 'kurumsal',
}

interface UserData {
  uid: string
  email: string | null
  displayName: string
  photoURL: string | null
  subscription: {
    plan: 'free' | 'premium' | 'premium_plus' | 'basic' | 'pro' | 'elite' | 'kurumsal'
    status: string
  }
  profile: {
    lgsYear: string | null
    targetScore: number | null
    province: string | null
    district: string | null
  }
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  error: null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Firebase yapılandırılmamışsa, loading'i false yap ve çık
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setUser(firebaseUser)

        if (firebaseUser) {
          try {
            const data = await getUserData(firebaseUser.uid)
            setUserData(data as UserData | null)
          } catch (err) {
            console.error('Error fetching user data:', err)
            setError('Kullanıcı bilgileri yüklenemedi')
          }
        } else {
          setUserData(null)
        }

        setLoading(false)
      },
      (err) => {
        console.error('Auth state error:', err)
        setError('Kimlik doğrulama hatası')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userData, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Plan hook'u - yeni sistem
export function usePlan() {
  const { userData } = useAuth()
  const rawPlan = userData?.subscription.plan || 'free'
  const plan: PlanType = PLAN_MAPPING[rawPlan] || 'basic'

  return {
    plan,
    isBasic: plan === 'basic',
    isPro: plan === 'pro',
    isElite: plan === 'elite',
    isKurumsal: plan === 'kurumsal',
    // Eski uyumluluk için
    isPremium: plan === 'pro' || plan === 'elite',
    isPremiumPlus: plan === 'elite',
  }
}

// Özellik erişim hook'u
export function useFeature(feature: FeatureKey) {
  const { plan } = usePlan()

  const canAccess = hasAccess(plan, feature)
  const status = getFeatureStatus(plan, feature)
  const limit = FEATURE_LIMITS[feature]?.[plan] ?? -1

  return {
    canAccess,
    status,
    limit,
    isLimited: status === 'limited',
    isLocked: status === 'locked',
    isComingSoon: status === 'coming_soon',
  }
}

// Birden fazla özellik kontrolü
export function useFeatures(features: FeatureKey[]) {
  const { plan } = usePlan()

  return features.map(feature => ({
    feature,
    canAccess: hasAccess(plan, feature),
    status: getFeatureStatus(plan, feature),
  }))
}

// Premium kontrolü için yardımcı hook (geriye uyumluluk)
export function usePremium() {
  const { userData } = useAuth()
  const rawPlan = userData?.subscription.plan || 'free'
  const plan: PlanType = PLAN_MAPPING[rawPlan] || 'basic'

  return {
    isPremium: plan === 'pro' || plan === 'elite',
    isPremiumPlus: plan === 'elite',
    plan: plan,
  }
}
