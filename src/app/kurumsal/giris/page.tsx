'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'

// Demo kurumsal kullanıcılar
const DEMO_USERS = [
  {
    username: 'demo',
    password: 'demo123',
    kurumAdi: 'Demo Dershane',
    yetkili: 'Ahmet Yılmaz',
    email: 'demo@dershane.com'
  },
  {
    username: 'atakent',
    password: 'atakent2026',
    kurumAdi: 'Atakent Forum Eğitim Kurumları',
    yetkili: 'Deniz Sağlam',
    email: 'info@atakentforum.com'
  },
  {
    username: 'admin',
    password: 'admin123',
    kurumAdi: 'Yönetici Hesabı',
    yetkili: 'Sistem Yöneticisi',
    email: 'admin@lgsplatform.com'
  },
]

export default function KurumsalGirisPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Kullanıcı adı ve şifre gereklidir')
      return
    }

    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    const user = DEMO_USERS.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    )

    if (user) {
      // Session'ı localStorage'a kaydet
      const sessionData = {
        username: user.username,
        kurumAdi: user.kurumAdi,
        yetkili: user.yetkili,
        email: user.email,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem('kurumsal_session', JSON.stringify(sessionData))

      // Panel'e yönlendir
      router.push('/kurumsal/panel')
    } else {
      setError('Kullanıcı adı veya şifre hatalı')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-purple-950/20 p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/kurumsal"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kurumsal Sayfaya Dön
        </Link>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Kurumsal Giriş</h1>
            <p className="text-purple-200 mt-1">Dershane ve kurum yöneticileri için</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 rounded-lg border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Kullanıcı adınızı girin"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border border-border bg-background px-4 pr-11 text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Şifrenizi girin"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="px-6 pb-6">
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <h3 className="text-sm font-medium text-foreground mb-2">Demo Hesapları</h3>
              <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
                <div className="flex justify-between">
                  <span>demo / demo123</span>
                  <span className="text-purple-500">Demo Dershane</span>
                </div>
                <div className="flex justify-between">
                  <span>atakent / atakent2026</span>
                  <span className="text-purple-500">Atakent Forum</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Hesabınız yok mu?{' '}
              <Link href="/kurumsal#iletisim" className="text-purple-500 hover:text-purple-400 font-medium">
                Bizimle iletişime geçin
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Giriş bilgileriniz güvenli bir şekilde şifrelenmektedir.
        </p>
      </div>
    </div>
  )
}
