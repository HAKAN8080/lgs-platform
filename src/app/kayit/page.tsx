'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth'
import { useAuth } from '@/contexts/auth-context'
import { UserPlus, Mail, Lock, User, Chrome, Loader2, Check } from 'lucide-react'

export default function KayitPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [lgsYear, setLgsYear] = useState('2025')
  const [targetScore, setTargetScore] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Zaten giriş yapmışsa yönlendir
  if (user) {
    router.push('/panel')
    return null
  }

  const validatePassword = (pass: string) => {
    const checks = {
      length: pass.length >= 6,
      hasNumber: /\d/.test(pass),
    }
    return checks
  }

  const passwordChecks = validatePassword(password)

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validasyonlar
    if (!displayName.trim()) {
      setError('İsim gerekli')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (!passwordChecks.length) {
      setError('Şifre en az 6 karakter olmalı')
      return
    }

    setLoading(true)

    try {
      await signUpWithEmail(email, password, displayName, {
        lgsYear,
        targetScore: targetScore ? parseInt(targetScore) : undefined
      })
      router.push('/panel')
    } catch (err: any) {
      console.error(err)
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu email adresi zaten kullanılıyor')
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz email adresi')
      } else if (err.code === 'auth/weak-password') {
        setError('Şifre çok zayıf')
      } else {
        setError('Kayıt olurken bir hata oluştu')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
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
        setError('Google ile kayıt olurken bir hata oluştu')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
          <CardDescription>
            Ücretsiz hesap oluştur ve LGS hazırlığına başla
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Adınız Soyadınız"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hangi yıl LGS&apos;ye gireceksin?</label>
              <select
                value={lgsYear}
                onChange={(e) => setLgsYear(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hedef Puan (opsiyonel)</label>
              <Input
                type="number"
                placeholder="Örn: 450"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                min="200"
                max="500"
              />
            </div>

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
              {password && (
                <div className="text-xs space-y-1 mt-2">
                  <div className={`flex items-center gap-1 ${passwordChecks.length ? 'text-green-500' : 'text-muted-foreground'}`}>
                    <Check className={`h-3 w-3 ${passwordChecks.length ? '' : 'opacity-50'}`} />
                    En az 6 karakter
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Şifre Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Şifreler eşleşmiyor</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Şifreler eşleşiyor
                </p>
              )}
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
                  <UserPlus className="h-4 w-4 mr-2" />
                  Kayıt Ol
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
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <Chrome className="h-4 w-4 mr-2" />
            Google ile Kayıt Ol
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Zaten hesabınız var mı?{' '}
            <Link href="/giris" className="text-primary hover:underline font-medium">
              Giriş Yap
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Kayıt olarak{' '}
            <Link href="/gizlilik" className="text-primary hover:underline">
              Gizlilik Politikası
            </Link>
            {' '}ve{' '}
            <Link href="/kullanim-sartlari" className="text-primary hover:underline">
              Kullanım Şartları
            </Link>
            &apos;nı kabul etmiş olursunuz.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
