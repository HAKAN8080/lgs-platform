'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calculator, School, Bot, Target, TrendingUp, FileText, Sparkles, Clock, CalendarDays } from 'lucide-react'

const tools = [
  {
    name: 'LGS Puan Hesaplama',
    description: '2025 katsayılarıyla puan ve net hesapla',
    href: '/araclar/puan-hesaplama',
    icon: Calculator,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    name: 'Lise Taban Puanları',
    description: '2024 taban puanları ve kontenjanlar',
    href: '/araclar/taban-puanlari',
    icon: School,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    name: 'Tercih Robotu',
    description: 'Puanına göre okul önerileri al',
    href: '/araclar/tercih-robotu',
    icon: Bot,
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    name: 'Çalışma Programı Oluşturucu',
    description: 'Müsaitliğine göre kişisel haftalık program oluştur',
    href: '/icerik/calisma-programi',
    icon: CalendarDays,
    color: 'bg-purple-500/10 text-purple-500',
  },
]

const features = [
  {
    name: 'Net Takip',
    description: 'Deneme sınavlarını yükle, netlerini takip et',
    icon: TrendingUp,
  },
  {
    name: 'Konu Analizi',
    description: 'Güçlü ve zayıf konularını keşfet',
    icon: Target,
  },
  {
    name: 'Haftalık Plan',
    description: 'Kişiselleştirilmiş çalışma programı',
    icon: FileText,
  },
  {
    name: 'AI Koç',
    description: 'Yapay zeka destekli özel koçluk',
    icon: Sparkles,
  },
]

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const lgsDate = new Date('2026-06-14T10:00:00').getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = lgsDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative">
      {/* Countdown Widget - Sağ Üst Köşe */}
      <div className="fixed top-20 right-4 z-40 hidden sm:block">
        <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm p-3 shadow-lg text-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 justify-center">
            <Clock className="h-3 w-3" />
            <span>LGS 2026</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-primary/10 rounded-lg px-2 py-1">
              <div className="text-lg font-bold text-primary leading-none">{timeLeft.days}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Gün</div>
            </div>
            <div className="bg-primary/10 rounded-lg px-2 py-1">
              <div className="text-lg font-bold text-primary leading-none">{timeLeft.hours}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Saat</div>
            </div>
            <div className="bg-primary/10 rounded-lg px-2 py-1">
              <div className="text-lg font-bold text-primary leading-none">{timeLeft.minutes}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Dakika</div>
            </div>
            <div className="bg-primary/10 rounded-lg px-2 py-1">
              <div className="text-lg font-bold text-primary leading-none">{timeLeft.seconds}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Saniye</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              LGS&apos;ye Hazırlık
              <span className="text-primary"> Artık Daha Kolay</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Puan hesaplama, net takip, konu analizi ve AI destekli koçluk ile hayalindeki liseye bir adım daha yaklaş.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-4">
              <Link
                href="/araclar/puan-hesaplama"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Puan Hesapla
              </Link>
              <Link
                href="/kayit"
                className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Ücretsiz Başla
              </Link>
            </div>
            {/* Mobil sayaç */}
            <div className="mt-8 sm:hidden">
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Clock className="h-3 w-3" />
                <span>LGS 2026&apos;ya Kalan Süre</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                {[
                  { val: timeLeft.days, label: 'Gün' },
                  { val: timeLeft.hours, label: 'Saat' },
                  { val: timeLeft.minutes, label: 'Dk' },
                  { val: timeLeft.seconds, label: 'Sn' },
                ].map(({ val, label }) => (
                  <div key={label} className="bg-card border border-border rounded-lg px-3 py-2 min-w-[56px]">
                    <div className="text-xl font-bold text-primary">{val}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Ücretsiz Araçlar</h2>
            <p className="mt-4 text-muted-foreground">Hemen kullanmaya başla, kayıt gerektirmez</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
              >
                <div className={`inline-flex rounded-lg p-3 ${tool.color}`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Öğrenci Paneli</h2>
            <p className="mt-4 text-muted-foreground">Kayıt ol ve tüm özelliklere eriş</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Ücretsiz Kayıt Ol
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 p-8 sm:p-12">
            <div className="text-center">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Premium
              </span>
              <h2 className="mt-4 text-3xl font-bold text-foreground">Sınırsız AI Koç</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Yapay zeka destekli kişisel koçun ile LGS&apos;ye en iyi şekilde hazırlan. Soru sor, analiz al, plan yap.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">99₺</div>
                  <div className="text-sm text-muted-foreground">/ ay</div>
                </div>
                <Link
                  href="/premium"
                  className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Premium&apos;a Geç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
