'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calculator, BookOpen, Target, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function LGSPuanHesaplamaPage() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/icerik" className="hover:text-foreground">İçerik</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">LGS Puan Hesaplama</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">2026 Güncel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            LGS 2026 Puan Hesaplama Nasıl Yapılır?
          </h1>
          <p className="text-lg text-muted-foreground">
            LGS puan hesaplama formülü, katsayılar ve adım adım hesaplama rehberi.
            Deneme sınavı netlerinizi girin, tahmini LGS puanınızı öğrenin.
          </p>
        </header>

        {/* CTA Box */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Hemen Puanını Hesapla</h3>
                <p className="text-sm text-muted-foreground">Online puan hesaplama aracımızı kullan</p>
              </div>
              <Link href="/araclar/puan-hesaplama">
                <Button>
                  <Calculator className="h-4 w-4 mr-2" />
                  Puan Hesapla
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            LGS Puan Hesaplama Formülü
          </h2>

          <p className="text-muted-foreground mb-4">
            LGS (Liselere Geçiş Sistemi) puanı, öğrencilerin merkezi sınavda aldıkları ham puanların
            belirli katsayılarla çarpılması ve sabit bir değerin eklenmesiyle hesaplanır.
            2026 yılında uygulanacak formül şu şekildedir:
          </p>

          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-lg font-mono font-bold text-primary mb-2">
                  LGS Puanı = (Toplam Net × Katsayı) + Sabit Değer
                </p>
                <p className="text-sm text-muted-foreground">
                  Puan aralığı: 100 - 500
                </p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            LGS Ders Katsayıları (2025-2026)
          </h2>

          <p className="text-muted-foreground mb-4">
            Her dersin soru sayısı ve katsayısı farklıdır. Sözel ve sayısal dersler eşit ağırlıkta değerlendirilir:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-accent">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Ders</th>
                  <th className="px-4 py-3 text-center font-semibold">Soru Sayısı</th>
                  <th className="px-4 py-3 text-center font-semibold">Katsayı</th>
                  <th className="px-4 py-3 text-center font-semibold">Max Puan Katkısı</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">Türkçe</td>
                  <td className="px-4 py-3 text-center">20</td>
                  <td className="px-4 py-3 text-center">4.349</td>
                  <td className="px-4 py-3 text-center text-primary font-semibold">86.98</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3">Matematik</td>
                  <td className="px-4 py-3 text-center">20</td>
                  <td className="px-4 py-3 text-center">4.254</td>
                  <td className="px-4 py-3 text-center text-primary font-semibold">85.08</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">Fen Bilimleri</td>
                  <td className="px-4 py-3 text-center">20</td>
                  <td className="px-4 py-3 text-center">4.349</td>
                  <td className="px-4 py-3 text-center text-primary font-semibold">86.98</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3">T.C. İnkılap Tarihi</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="px-4 py-3 text-center">4.254</td>
                  <td className="px-4 py-3 text-center text-primary font-semibold">42.54</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">Din Kültürü</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="px-4 py-3 text-center">4.254</td>
                  <td className="px-4 py-3 text-center text-primary font-semibold">42.54</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3">İngilizce</td>
                  <td className="px-4 py-3 text-center">10</td>
                  <td className="px-4 py-3 text-center">4.254</td>
                  <td className="px-4 py-3 text-center text-primary font-semibold">42.54</td>
                </tr>
                <tr className="border-t border-border font-bold bg-primary/10">
                  <td className="px-4 py-3">TOPLAM</td>
                  <td className="px-4 py-3 text-center">90</td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="px-4 py-3 text-center text-primary">~386.66</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              <strong>Not:</strong> Sabit değer eklendiğinde maksimum puan 500&apos;e ulaşır.
              Yanlış cevaplar 3 doğruyu götürür (1 yanlış = 1/3 net düşüşü).
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Net Hesaplama
          </h2>

          <p className="text-muted-foreground mb-4">
            Net hesaplama formülü oldukça basittir:
          </p>

          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-lg font-mono font-bold text-primary mb-2">
                  Net = Doğru Sayısı - (Yanlış Sayısı ÷ 3)
                </p>
                <p className="text-sm text-muted-foreground">
                  Boş bırakılan sorular neti etkilemez
                </p>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">Örnek Hesaplama</h3>

          <p className="text-muted-foreground mb-4">
            Bir öğrenci Matematik&apos;te 15 doğru, 3 yanlış yapmış olsun:
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span>Net = 15 - (3 ÷ 3) = 15 - 1 = <strong>14 Net</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span>Puan Katkısı = 14 × 4.254 = <strong>59.56 puan</strong></span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Puan-Yüzdelik Dilim Tablosu
          </h2>

          <p className="text-muted-foreground mb-4">
            2025 LGS verilerine göre yaklaşık puan-sıralama ilişkisi:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-accent">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Puan Aralığı</th>
                  <th className="px-4 py-3 text-center font-semibold">Yaklaşık Sıralama</th>
                  <th className="px-4 py-3 text-center font-semibold">Yüzdelik Dilim</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-green-500">480-500</td>
                  <td className="px-4 py-3 text-center">1 - 5.000</td>
                  <td className="px-4 py-3 text-center">%0.5</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3 font-semibold text-blue-500">450-480</td>
                  <td className="px-4 py-3 text-center">5.000 - 30.000</td>
                  <td className="px-4 py-3 text-center">%0.5 - %3</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-purple-500">400-450</td>
                  <td className="px-4 py-3 text-center">30.000 - 150.000</td>
                  <td className="px-4 py-3 text-center">%3 - %15</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3 font-semibold text-orange-500">350-400</td>
                  <td className="px-4 py-3 text-center">150.000 - 400.000</td>
                  <td className="px-4 py-3 text-center">%15 - %40</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-red-500">300-350</td>
                  <td className="px-4 py-3 text-center">400.000 - 700.000</td>
                  <td className="px-4 py-3 text-center">%40 - %70</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Sıkça Sorulan Sorular
          </h2>

          <div className="space-y-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">LGS&apos;de boş bırakmak mı yanlış yapmak mı daha iyi?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Emin olmadığınız sorularda boş bırakmak daha mantıklıdır. 3 yanlış 1 doğruyu götürür,
                  yani %25&apos;ten az şansınız varsa boş bırakın.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Kaç netle kaç puan gelir?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yaklaşık olarak: 90 net = 500 puan, 80 net = 475 puan, 70 net = 445 puan,
                  60 net = 410 puan, 50 net = 375 puan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">LGS puanı nasıl yükseltilir?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Düzenli deneme çözerek eksik konuları tespit edin. Türkçe ve Fen derslerine
                  ağırlık verin çünkü katsayıları daha yüksek. Net takip yaparak ilerlemenizi izleyin.
                </p>
              </CardContent>
            </Card>
          </div>
        </article>

        {/* Bottom CTA */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Deneme Sonuçlarını Takip Et
            </h3>
            <p className="text-muted-foreground mb-4">
              Ücretsiz hesap oluştur, denemelerini gir, net gelişimini grafiklerle izle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/araclar/puan-hesaplama">
                <Button variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  Puan Hesapla
                </Button>
              </Link>
              <Link href="/kayit">
                <Button>
                  Ücretsiz Başla
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
