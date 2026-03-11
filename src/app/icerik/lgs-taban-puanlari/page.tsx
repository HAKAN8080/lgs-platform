'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { School, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function LGSTabanPuanlariPage() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/icerik" className="hover:text-foreground">İçerik</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">LGS Taban Puanları</span>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 mb-4">
            <School className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-500">2025 Verileri</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            LGS Taban Puanları 2025
          </h1>
          <p className="text-lg text-muted-foreground">
            İstanbul liseleri taban puanları, yüzdelik dilimler ve kontenjanlar.
          </p>
        </header>

        <Card className="mb-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Detaylı Taban Puanları</h3>
                <p className="text-sm text-muted-foreground">Filtreleme ve arama özellikli tablo</p>
              </div>
              <Link href="/araclar/taban-puanlari">
                <Button className="bg-green-600 hover:bg-green-700">
                  <School className="h-4 w-4 mr-2" />
                  Taban Puanları Tablosu
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            En Yüksek Puanlı Liseler (2025)
          </h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-accent">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Lise</th>
                  <th className="px-4 py-3 text-left font-semibold">İlçe</th>
                  <th className="px-4 py-3 text-center font-semibold">Taban Puan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium">İstanbul Erkek Lisesi</td>
                  <td className="px-4 py-3 text-muted-foreground">Fatih</td>
                  <td className="px-4 py-3 text-center font-bold text-green-500">500.00</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3 font-medium">Galatasaray Lisesi</td>
                  <td className="px-4 py-3 text-muted-foreground">Beyoğlu</td>
                  <td className="px-4 py-3 text-center font-bold text-green-500">500.00</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium">Kabataş Erkek Lisesi</td>
                  <td className="px-4 py-3 text-muted-foreground">Beşiktaş</td>
                  <td className="px-4 py-3 text-center font-bold text-green-500">500.00</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3 font-medium">İstanbul Atatürk Fen Lisesi</td>
                  <td className="px-4 py-3 text-muted-foreground">Kadıköy</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-500">495.35</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium">Cağaloğlu Anadolu Lisesi</td>
                  <td className="px-4 py-3 text-muted-foreground">Fatih</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-500">493.96</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Lise Türlerine Göre Taban Puanlar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground">Fen Liseleri</h3>
                <p className="text-2xl font-bold text-green-500">414 - 495</p>
                <p className="text-sm text-muted-foreground">En yüksek puanlı okul türü</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground">Anadolu Liseleri</h3>
                <p className="text-2xl font-bold text-blue-500">383 - 500</p>
                <p className="text-sm text-muted-foreground">En geniş puan aralığı</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground">Sosyal Bilimler</h3>
                <p className="text-2xl font-bold text-purple-500">332 - 407</p>
                <p className="text-sm text-muted-foreground">Sözel ağırlıklı</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground">İmam Hatip</h3>
                <p className="text-2xl font-bold text-orange-500">405 - 420</p>
                <p className="text-sm text-muted-foreground">Anadolu İmam Hatip</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Puan-Sıralama İlişkisi
          </h2>

          <p className="text-muted-foreground mb-4">
            2025 LGS&apos;de yaklaşık 1.1 milyon öğrenci sınava girdi. Puan ve sıralama ilişkisi:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-accent">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold">Puan</th>
                  <th className="px-4 py-3 text-center font-semibold">Sıralama</th>
                  <th className="px-4 py-3 text-left font-semibold">Yerleşebileceği Okul Türü</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-center font-bold text-green-500">490+</td>
                  <td className="px-4 py-3 text-center">İlk 1.000</td>
                  <td className="px-4 py-3">Proje okulları, en iyi Fen Liseleri</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3 text-center font-bold text-blue-500">470-490</td>
                  <td className="px-4 py-3 text-center">1.000 - 10.000</td>
                  <td className="px-4 py-3">Fen Liseleri, iyi Anadolu Liseleri</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-center font-bold text-purple-500">450-470</td>
                  <td className="px-4 py-3 text-center">10.000 - 30.000</td>
                  <td className="px-4 py-3">Kaliteli Anadolu Liseleri</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3 text-center font-bold text-orange-500">400-450</td>
                  <td className="px-4 py-3 text-center">30.000 - 150.000</td>
                  <td className="px-4 py-3">Orta düzey Anadolu Liseleri</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Hedefini Belirle</h3>
            <p className="text-muted-foreground mb-4">Net takip yap, hedef okuluna ulaş</p>
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
