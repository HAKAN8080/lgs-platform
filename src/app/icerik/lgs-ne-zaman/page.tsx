'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LGSNeZamanPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const lgsDate = new Date('2026-06-14T10:00:00')

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = lgsDate.getTime() - now

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/icerik" className="hover:text-foreground">İçerik</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">LGS Ne Zaman?</span>
        </nav>

        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            LGS 2026 Ne Zaman? Geri Sayım
          </h1>
          <p className="text-lg text-muted-foreground">
            LGS 2026 sınav tarihi ve kalan süre
          </p>
        </header>

        {/* Countdown */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
          <CardContent className="py-8">
            <div className="text-center mb-6">
              <p className="text-muted-foreground mb-2">LGS 2026&apos;ya Kalan Süre</p>
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">{timeLeft.days}</div>
                  <div className="text-xs text-muted-foreground">Gün</div>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">{timeLeft.hours}</div>
                  <div className="text-xs text-muted-foreground">Saat</div>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">{timeLeft.minutes}</div>
                  <div className="text-xs text-muted-foreground">Dakika</div>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">{timeLeft.seconds}</div>
                  <div className="text-xs text-muted-foreground">Saniye</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            LGS 2026 Sınav Tarihi
          </h2>

          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">14 Haziran 2026 Pazar</p>
                  <p className="text-muted-foreground">Saat 10:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            LGS 2026 Önemli Tarihler
          </h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-accent">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Etkinlik</th>
                  <th className="px-4 py-3 text-left font-semibold">Tarih</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">Başvuru Başlangıcı</td>
                  <td className="px-4 py-3">Nisan 2026 (Tahmini)</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3">Başvuru Bitişi</td>
                  <td className="px-4 py-3">Mayıs 2026 (Tahmini)</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-primary">LGS Sınavı</td>
                  <td className="px-4 py-3 font-semibold text-primary">14 Haziran 2026</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3">Sonuç Açıklanması</td>
                  <td className="px-4 py-3">Temmuz 2026 (Tahmini)</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">Tercih Dönemi</td>
                  <td className="px-4 py-3">Temmuz-Ağustos 2026</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            LGS Sınav Süresi ve Formatı
          </h2>

          <ul className="space-y-2 mb-6 list-none pl-0">
            <li className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <span><strong>Süre:</strong> 120 dakika (2 saat)</span>
            </li>
            <li className="flex items-start gap-2">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <span><strong>Soru Sayısı:</strong> 90 soru</span>
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <span><strong>Oturum:</strong> Tek oturum</span>
            </li>
          </ul>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">Soru Dağılımı</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <Card><CardContent className="py-4 text-center"><div className="text-2xl font-bold text-primary">20</div><div className="text-sm text-muted-foreground">Türkçe</div></CardContent></Card>
            <Card><CardContent className="py-4 text-center"><div className="text-2xl font-bold text-primary">20</div><div className="text-sm text-muted-foreground">Matematik</div></CardContent></Card>
            <Card><CardContent className="py-4 text-center"><div className="text-2xl font-bold text-primary">20</div><div className="text-sm text-muted-foreground">Fen Bilimleri</div></CardContent></Card>
            <Card><CardContent className="py-4 text-center"><div className="text-2xl font-bold text-primary">10</div><div className="text-sm text-muted-foreground">İnkılap Tarihi</div></CardContent></Card>
            <Card><CardContent className="py-4 text-center"><div className="text-2xl font-bold text-primary">10</div><div className="text-sm text-muted-foreground">Din Kültürü</div></CardContent></Card>
            <Card><CardContent className="py-4 text-center"><div className="text-2xl font-bold text-primary">10</div><div className="text-sm text-muted-foreground">İngilizce</div></CardContent></Card>
          </div>
        </article>

        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Hazırlığa Başla</h3>
            <p className="text-muted-foreground mb-4">Kalan süreyi en iyi şekilde değerlendir</p>
            <Link href="/kayit">
              <Button>
                Ücretsiz Başla
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
