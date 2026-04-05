'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calculator, School, Bot, Target, TrendingUp, FileText, Sparkles, Clock, CalendarDays, ArrowRight, CheckCircle, FileSpreadsheet, Wand2, Building2 } from 'lucide-react'

const tools = [
  {
    name: 'LGS Puan Hesaplama',
    description: '2025 katsayılarıyla net ve puan hesapla',
    href: '/araclar/puan-hesaplama',
    icon: Calculator,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'hover:border-blue-500/40',
  },
  {
    name: 'Lise Taban Puanları',
    description: '2025 taban puanları ve kontenjanları sorgula',
    href: '/araclar/taban-puanlari',
    icon: School,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'hover:border-emerald-500/40',
  },
  {
    name: 'Tercih Robotu',
    description: 'Puanına göre girebileceğin okulları keşfet',
    href: '/araclar/tercih-robotu',
    icon: Bot,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'hover:border-orange-500/40',
  },
  {
    name: 'Çalışma Programı',
    description: 'Müsaitliğine göre kişisel haftalık plan oluştur',
    href: '/icerik/calisma-programi',
    icon: CalendarDays,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/40',
  },
  {
    name: 'Optik TXT Parser',
    description: 'Optixy TXT dosyalarını analiz et',
    href: '/araclar/txt-parser.html',
    icon: FileSpreadsheet,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    border: 'hover:border-cyan-500/40',
  },
  {
    name: 'AI Soru Üretici',
    description: 'MEB stilinde AI destekli soru üret',
    href: '/araclar/lgs-soru-uretici.html',
    icon: Wand2,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    border: 'hover:border-pink-500/40',
  },
]

const stats = [
  { value: '14', label: 'Şehir' },
  { value: '300+', label: 'Okul Verisi' },
  { value: '6', label: 'Ücretsiz Araç' },
  { value: '2026', label: 'LGS Yılı' },
]

const features = [
  { name: 'Net Takip', description: 'Deneme sınavı netlerin grafikle takip et', icon: TrendingUp },
  { name: 'Konu Analizi', description: 'Güçlü ve zayıf konularını keşfet', icon: Target },
  { name: 'Haftalık Plan', description: 'Kişiselleştirilmiş çalışma programı', icon: FileText },
  { name: 'AI Koç', description: 'Yapay zeka destekli özel koçluk', icon: Sparkles },
]

const highlights = [
  'Kayıt gerektirmez',
  'Tamamen ücretsiz',
  '2025 güncel verileri',
]

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const lgsDate = new Date('2026-06-13T09:30:00').getTime()
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const diff = lgsDate - now
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        })
      }
    }
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      {/* Sayaç — Sağ Üst Köşe (masaüstü) */}
      <div className="fixed top-20 right-4 z-40 hidden lg:block">
        <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm p-3 shadow-lg text-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 justify-center">
            <Clock className="h-3 w-3" />
            <span>LGS 2026</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { val: timeLeft.days, label: 'Gün' },
              { val: timeLeft.hours, label: 'Saat' },
              { val: timeLeft.minutes, label: 'Dk' },
              { val: timeLeft.seconds, label: 'Sn' },
            ].map(({ val, label }) => (
              <div key={label} className="bg-primary/10 rounded-lg px-2 py-1">
                <div className="text-lg font-bold text-primary leading-none">{val}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-12 pb-0 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">

            {/* Sol: metin */}
            <div className="pb-12 sm:pb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">LGS 2026 Hazırlık Platformu</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                Hayalindeki Liseye
                <span className="block text-primary mt-1">En Kısa Yoldan</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                Puan hesaplama, taban puan sorgulama ve tercih robotu — hepsi ücretsiz, hepsi tek platformda.
              </p>

              <ul className="mt-4 space-y-1.5">
                {highlights.map(h => (
                  <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/araclar/puan-hesaplama"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  Puan Hesapla <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/kayit"
                  className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  Ücretsiz Başla
                </Link>
              </div>

              {/* Mobil sayaç */}
              <div className="mt-8 lg:hidden">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> LGS 2026&apos;ya kalan süre
                </p>
                <div className="flex gap-2">
                  {[
                    { val: timeLeft.days, label: 'Gün' },
                    { val: timeLeft.hours, label: 'Saat' },
                    { val: timeLeft.minutes, label: 'Dk' },
                    { val: timeLeft.seconds, label: 'Sn' },
                  ].map(({ val, label }) => (
                    <div key={label} className="bg-card border border-border rounded-lg px-3 py-2 min-w-[56px] text-center">
                      <div className="text-xl font-bold text-primary">{val}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ: görsel */}
            <div className="hidden lg:flex items-end justify-center">
              <div className="relative w-full h-[400px] rounded-tl-3xl rounded-tr-3xl overflow-hidden shadow-2xl border-t border-l border-r border-border">
                <Image
                  src="https://cdnpub.egitim.com/egitim_com/public//uploads/content-section/3fd49af43c1fc8ae5670a91658d1d21febfde5cd.webp"
                  alt="Eğitim"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── İSTATİSTİK BANDI ─── */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
            {stats.map(s => (
              <div key={s.label} className="flex flex-col items-center py-6 px-4">
                <span className="text-3xl font-extrabold text-primary">{s.value}</span>
                <span className="mt-1 text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÜCRETSİZ ARAÇLAR ─── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Araçlar</span>
            <h2 className="mt-2 text-3xl font-bold text-foreground">Ücretsiz Araçlar</h2>
            <p className="mt-3 text-muted-foreground">Hemen kullanmaya başla, kayıt gerektirmez</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className={`group relative rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${tool.border}`}
              >
                <div className={`inline-flex rounded-xl p-3 ${tool.bg}`}>
                  <tool.icon className={`h-6 w-6 ${tool.color}`} />
                </div>
                <h3 className={`mt-4 text-base font-semibold text-foreground group-hover:${tool.color} transition-colors`}>
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${tool.color}`}>
                  Kullan <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÖĞRENCİ PANELİ ─── */}
      <section className="py-14 sm:py-20 bg-accent/40">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Panel</span>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Öğrenci Paneli</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Ücretsiz hesap oluştur, deneme sonuçlarını kaydet, gelişimini takip et.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f) => (
                  <div key={f.name} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{f.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{f.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/kayit"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Ücretsiz Kayıt Ol
              </Link>
            </div>
            <div className="hidden lg:block relative h-[380px] rounded-2xl overflow-hidden border border-border shadow-xl">
              <Image
                src="https://cdnpub.egitim.com/egitim_com/public//uploads/content-section/00dc10c52bad7c13e3f1b137b20be487f284dc36.webp"
                alt="Öğrenci çalışma"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── PREMİUM ─── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 p-8 sm:p-12 text-center border border-primary/20">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Premium
            </span>
            <h2 className="mt-4 text-3xl font-bold text-foreground">LGS 2026&apos;ya Kadar Sınırsız Erişim</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Sınırsız deneme girişi, detaylı net takip, kişiselleştirilmiş strateji ve daha fazlası. Tek seferlik ödeme, abonelik yok.
            </p>
            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">499₺</span>
                  <span className="text-3xl font-bold text-foreground">299₺</span>
                </div>
                <div className="text-sm text-muted-foreground">tek seferlik</div>
              </div>
              <Link
                href="/premium"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Hemen Al
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              LGS 2026 (Haziran) tarihine kadar geçerli • 1.092.206+ öğrenci arasında fark yarat
            </p>
          </div>
        </div>
      </section>

      {/* Kurumsal Section */}
      <section className="py-16 sm:py-24 bg-accent/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-500 mb-4">
                  <Building2 className="h-4 w-4" />
                  Okullar ve Dershaneler İçin
                </div>
                <h2 className="text-3xl font-bold text-foreground">Kurumsal Çözümler</h2>
                <p className="mt-4 text-muted-foreground max-w-xl">
                  Optik okuyucu entegrasyonu, toplu öğrenci yönetimi ve detaylı performans analizleri ile öğrencilerinizin başarısını artırın.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/kurumsal"
                  className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors text-center"
                >
                  Kurumsal Başvuru
                </Link>
                <Link
                  href="/kurumsal"
                  className="rounded-lg border border-purple-500/50 px-6 py-3 text-sm font-semibold text-purple-500 hover:bg-purple-500/10 transition-colors text-center"
                >
                  Detaylı Bilgi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
