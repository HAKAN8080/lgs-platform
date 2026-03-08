'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInWithEmail, signInWithGoogle, resetPassword } from '@/lib/firebase/auth'
import { useAuth } from '@/contexts/auth-context'
import { LogIn, Mail, Lock, Chrome, Loader2, ArrowLeft } from 'lucide-react'

export default function GirisPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [showReset, setShowReset] = useState(false)

  // Zaten giriş yapmışsa yönlendir
  if (user) {
    router.push('/panel')
    return null
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmail(email, password)
      router.push('/panel')
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/user-not-found') {
        setError('Bu email ile kayıtlı kullanıcı bulunamadı')
      } else if (err.code === 'auth/wrong-password') {
        setError('Hatalı şifre')
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz email adresi')
      } else {
        setError('Giriş yapılırken bir hata oluştu')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
      router.push('/panel')
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google girişi iptal edildi')
      } else {
        setError('Google ile giriş yapılırken bir hata oluştu')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await resetPassword(email)
      setResetSent(true)
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/user-not-found') {
        setError('Bu email ile kayıtlı kullanıcı bulunamadı')
      } else {
        setError('Şifre sıfırlama emaili gönderilemedi')
      }
    } finally {
      setLoading(false)
    }
  }

  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Şifre Sıfırlama</CardTitle>
            <CardDescription>
              Email adresinize şifre sıfırlama bağlantısı göndereceğiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-muted-foreground">
                  Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReset(false)
                    setResetSent(false)
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Giriş Sayfasına Dön
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Sıfırlama Bağlantısı Gönder'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowReset(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri Dön
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Giriş Yap</CardTitle>
          <CardDescription>
            Hesabınıza giriş yaparak tüm özelliklere erişin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setShowReset(true)}
              >
                Şifremi Unuttum
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">veya</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Chrome className="h-4 w-4 mr-2" />
            Google ile Devam Et
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Hesabınız yok mu?{' '}
            <Link href="/kayit" className="text-primary hover:underline font-medium">
              Kayıt Ol
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
