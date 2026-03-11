'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, ArrowRight, CheckCircle, XCircle, MinusCircle } from 'lucide-react'
import Link from 'next/link'

export default function LGSNetHesaplamaPage() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/icerik" className="hover:text-foreground">İçerik</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">LGS Net Hesaplama</span>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Hesaplama</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            LGS Net Hesaplama Nasıl Yapılır?
          </h1>
          <p className="text-lg text-muted-foreground">
            LGS net hesaplama formülü, yanlışın etkisi ve örnek hesaplamalar.
          </p>
        </header>

        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Online Net Hesaplama</h3>
                <p className="text-sm text-muted-foreground">Hızlı hesaplama aracı</p>
              </div>
              <Link href="/araclar/puan-hesaplama">
                <Button>
                  <Calculator className="h-4 w-4 mr-2" />
                  Net Hesapla
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Net Hesaplama Formülü
          </h2>

          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-xl font-mono font-bold text-primary mb-4">
                  Net = Doğru - (Yanlış ÷ 3)
                </p>
                <div className="flex justify-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Doğru: +1 net</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span>Yanlış: -0.33 net</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MinusCircle className="h-5 w-5 text-gray-500" />
                    <span>Boş: 0 net</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Örnek Hesaplamalar
          </h2>

          <div className="space-y-4 mb-6">
            <Card>
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground mb-2">Örnek 1: Matematik</h3>
                <p className="text-muted-foreground mb-2">18 doğru, 6 yanlış, 0 boş</p>
                <p className="font-mono text-primary">Net = 18 - (6 ÷ 3) = 18 - 2 = <strong>16 Net</strong></p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground mb-2">Örnek 2: Türkçe</h3>
                <p className="text-muted-foreground mb-2">15 doğru, 3 yanlış, 2 boş</p>
                <p className="font-mono text-primary">Net = 15 - (3 ÷ 3) = 15 - 1 = <strong>14 Net</strong></p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground mb-2">Örnek 3: Fen Bilimleri</h3>
                <p className="text-muted-foreground mb-2">20 doğru, 0 yanlış, 0 boş</p>
                <p className="font-mono text-primary">Net = 20 - (0 ÷ 3) = 20 - 0 = <strong>20 Net (Full)</strong></p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Yanlışın Etkisi
          </h2>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
              3 Yanlış = 1 Doğru Kaybı
            </p>
            <p className="text-sm text-muted-foreground">
              Her 3 yanlış cevap, 1 doğru cevabınızı götürür. Emin olmadığınız sorularda
              boş bırakmak daha mantıklı olabilir.
            </p>
          </div>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">
            Ne Zaman Boş Bırakmalı?
          </h3>

          <ul className="space-y-2 mb-6 list-none pl-0">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span><strong>Cevapla:</strong> 2 veya daha az şık elediysen (%50+ şans)</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <span><strong>Boş bırak:</strong> 4 şık de eşit görünüyorsa (%25 şans)</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Ders Bazlı Maksimum Netler
          </h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-accent">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Ders</th>
                  <th className="px-4 py-3 text-center font-semibold">Soru Sayısı</th>
                  <th className="px-4 py-3 text-center font-semibold">Max Net</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">Türkçe</td>
                  <td className="px-4 py-3 text-center">20</td>
                  <td className="px-4 py-3 text-center font-bold text-primary">20</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3">Matematik</td>
                  <td className="px-4 py-3 text-center">20</td>
                  <td className="px-4 py-3 text-center font-bold text-primary">20</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">Fen Bilimleri</td>
                  <td className="px-4 py-3 text-center">20</td>
                  <td className="px-4 py-3 text-center font-bold text-primary">20</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3">T.C. İnkılap Tarihi</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="px-4 py-3 text-center font-bold text-primary">10</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">Din Kültürü</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="px-4 py-3 text-center font-bold text-primary">10</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3">İngilizce</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="px-4 py-3 text-center font-bold text-primary">10</td>
                </tr>
                <tr className="border-t border-border font-bold bg-primary/10">
                  <td className="px-4 py-3">TOPLAM</td>
                  <td className="px-4 py-3 text-center">90</td>
                  <td className="px-4 py-3 text-center text-primary">90</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Net Gelişimini Takip Et</h3>
            <p className="text-muted-foreground mb-4">Deneme sonuçlarını gir, grafiklerle izle</p>
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
