'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Users,
  FileText,
  BarChart3,
  CheckCircle2,
  Mail,
  Lock,
  Phone,
  MapPin,
  Loader2,
  ArrowRight,
  School,
  GraduationCap,
  TrendingUp,
  Sparkles,
  ExternalLink
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Toplu Öğrenci Yönetimi',
    description: 'Tüm öğrencilerinizi tek panelden yönetin, sınıflara ayırın'
  },
  {
    icon: FileText,
    title: 'Optik Okuyucu Entegrasyonu',
    description: 'TXT dosyalarını yükleyin, anında net ve puan analizi alın'
  },
  {
    icon: BarChart3,
    title: 'Detaylı Raporlama',
    description: 'Sınıf bazlı, ders bazlı ve konu bazlı performans raporları'
  },
  {
    icon: TrendingUp,
    title: 'Gelişim Takibi',
    description: 'Öğrencilerin zaman içindeki gelişimini grafiklerle izleyin'
  }
]

const plans = [
  {
    name: 'Başlangıç',
    price: '299',
    students: '50',
    features: ['50 öğrenci', 'Temel raporlar', 'Email destek', 'Optik TXT parser']
  },
  {
    name: 'Profesyonel',
    price: '599',
    students: '200',
    popular: true,
    features: ['200 öğrenci', 'Gelişmiş raporlar', 'Öncelikli destek', 'AI soru üretici', 'Veli bildirimleri']
  },
  {
    name: 'Kurumsal',
    price: '999',
    students: 'Sınırsız',
    features: ['Sınırsız öğrenci', 'Özel raporlar', '7/24 destek', 'Tüm özellikler', 'API erişimi', 'Özel eğitim']
  }
]

export default function KurumsalPage() {
  const [mode, setMode] = useState<'info' | 'login' | 'register'>('info')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [kurumAdi, setKurumAdi] = useState('')
  const [kurumTuru, setKurumTuru] = useState('okul')
  const [yetkiliAdi, setYetkiliAdi] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [telefon, setTelefon] = useState('')
  const [il, setIl] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Demo: Simüle edilmiş giriş
    setTimeout(() => {
      setLoading(false)
      alert('Demo: Kurumsal panel yakında aktif olacak!')
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Demo: Simüle edilmiş kayıt
    setTimeout(() => {
      setLoading(false)
      alert('Demo: Başvurunuz alındı! En kısa sürede sizinle iletişime geçeceğiz.')
      setMode('info')
    }, 1000)
  }

  if (mode === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-purple-500" />
            </div>
            <CardTitle className="text-2xl">Kurumsal Giriş</CardTitle>
            <CardDescription>
              Okul veya dershane hesabınıza giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Kurumsal Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="kurum@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
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
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Building2 className="h-4 w-4 mr-2" />
                    Giriş Yap
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <button
                className="text-sm text-purple-500 hover:underline"
                onClick={() => setMode('register')}
              >
                Kurumunuz kayıtlı değil mi? Başvuru yapın
              </button>
              <p className="text-sm text-muted-foreground">
                <button onClick={() => setMode('info')} className="hover:underline">
                  Geri dön
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <School className="h-6 w-6 text-purple-500" />
            </div>
            <CardTitle className="text-2xl">Kurumsal Başvuru</CardTitle>
            <CardDescription>
              Okulunuz veya dershaneniz için hesap oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-foreground">Kurum Adı</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Örnek Anadolu Lisesi"
                      value={kurumAdi}
                      onChange={(e) => setKurumAdi(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Kurum Türü</label>
                  <select
                    value={kurumTuru}
                    onChange={(e) => setKurumTuru(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="okul">Ortaokul / Lise</option>
                    <option value="dershane">Dershane / Kurs</option>
                    <option value="etut">Etüt Merkezi</option>
                    <option value="ozel">Özel Ders</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">İl</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="İstanbul"
                      value={il}
                      onChange={(e) => setIl(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-foreground">Yetkili Adı Soyadı</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Ahmet Yılmaz"
                      value={yetkiliAdi}
                      onChange={(e) => setYetkiliAdi(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="kurum@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="0532 123 45 67"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-foreground">Şifre Belirleyin</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Başvuruyu Gönder
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Başvurunuz incelendikten sonra 24 saat içinde sizinle iletişime geçeceğiz.
              </p>
            </form>

            <div className="mt-6 text-center space-y-2">
              <button
                className="text-sm text-purple-500 hover:underline"
                onClick={() => setMode('login')}
              >
                Zaten hesabınız var mı? Giriş yapın
              </button>
              <p className="text-sm text-muted-foreground">
                <button onClick={() => setMode('info')} className="hover:underline">
                  Geri dön
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-500 mb-6">
              <Building2 className="h-4 w-4" />
              Okullar ve Dershaneler İçin
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              LGS Hazırlığını
              <span className="text-purple-500"> Kurumsal Yönetin</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Optik okuyucu entegrasyonu, toplu öğrenci yönetimi ve detaylı performans analizleri ile öğrencilerinizin başarısını artırın.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setMode('register')}
              >
                Ücretsiz Deneyin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setMode('login')}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Kurumsal Giriş
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Neden LGS Kurumsal?</h2>
            <p className="mt-4 text-muted-foreground">Kurumunuzun ihtiyaç duyduğu tüm araçlar tek platformda</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 sm:py-24 bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Kurumsal Araçlar</h2>
            <p className="mt-4 text-muted-foreground">Hemen kullanmaya başlayabileceğiniz ücretsiz araçlar</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            <a
              href="/araclar/txt-parser.html"
              className="group flex items-center gap-4 rounded-xl border bg-card p-6 transition-all hover:border-purple-500/50 hover:bg-purple-500/5"
            >
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-purple-500 transition-colors">
                  Optik TXT Parser
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Optixy formatındaki dosyaları analiz edin
                </p>
              </div>
              <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
            </a>
            <div className="group flex items-center gap-4 rounded-xl border bg-card p-6 opacity-60 cursor-not-allowed">
              <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-pink-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  AI Soru Üretici
                  <span className="ml-2 text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Yakında
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  MEB formatında özgün sorular üretin
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Paketler</h2>
            <p className="mt-4 text-muted-foreground">Kurumunuzun büyüklüğüne göre uygun paketi seçin</p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-purple-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-purple-500 px-3 py-1 text-xs font-medium text-white">
                      En Popüler
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}₺</span>
                    <span className="text-muted-foreground"> / ay</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.students} öğrenci kapasitesi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => setMode('register')}
                  >
                    Başvur
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 p-8 sm:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">Hemen Başlayın</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                14 gün ücretsiz deneme ile tüm özellikleri test edin. Kredi kartı gerekmez.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setMode('register')}
                >
                  Ücretsiz Deneyin
                </Button>
                <Link href="mailto:kurumsal@lgsplatform.com">
                  <Button size="lg" variant="outline">
                    Bize Ulaşın
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
