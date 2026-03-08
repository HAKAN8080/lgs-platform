'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase/config'
import { getUserData } from '@/lib/firebase/auth'

interface UserData {
  uid: string
  email: string | null
  displayName: string
  photoURL: string | null
  subscription: {
    plan: 'free' | 'premium' | 'premium_plus'
    status: string
  }
  profile: {
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

// Premium kontrolü için yardımcı hook
export function usePremium() {
  const { userData } = useAuth()
  return {
    isPremium: userData?.subscription.plan === 'premium' || userData?.subscription.plan === 'premium_plus',
    isPremiumPlus: userData?.subscription.plan === 'premium_plus',
    plan: userData?.subscription.plan || 'free',
  }
}
