'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, BookOpen, Target, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LGSCalismaProgramiPage() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/icerik" className="hover:text-foreground">İçerik</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">LGS Çalışma Programı</span>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-500">2026 Rehber</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            LGS Çalışma Programı Nasıl Yapılır?
          </h1>
          <p className="text-lg text-muted-foreground">
            Etkili çalışma programı oluşturma, haftalık plan örneği ve verimli ders çalışma teknikleri.
          </p>
        </header>

        <Card className="mb-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Haftalık Strateji Aracı</h3>
                <p className="text-sm text-muted-foreground">Kişiselleştirilmiş çalışma planı oluştur</p>
              </div>
              <Link href="/araclar/haftalik-strateji">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Plan Oluştur
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Çalışma Programı Neden Önemli?
          </h2>

          <p className="text-muted-foreground mb-4">
            LGS&apos;de başarı için düzenli ve planlı çalışmak şart. Rastgele çalışmak yerine
            bir program dahilinde ilerlemek hem motivasyonunu korur hem de tüm konuları
            zamanında bitirmeni sağlar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Programlı Çalışma
                </h3>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Tüm dersler dengeli</li>
                  <li>• Konular zamanında biter</li>
                  <li>• Motivasyon yüksek</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Programsız Çalışma
                </h3>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Bazı dersler eksik</li>
                  <li>• Son hafta panik</li>
                  <li>• Motivasyon düşük</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Günlük Çalışma Süresi
          </h2>

          <p className="text-muted-foreground mb-4">
            Kalan süreye göre günlük çalışma süresini ayarlamalısın:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-accent">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Dönem</th>
                  <th className="px-4 py-3 text-center font-semibold">Hafta İçi</th>
                  <th className="px-4 py-3 text-center font-semibold">Hafta Sonu</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3">6+ ay kala</td>
                  <td className="px-4 py-3 text-center">2-3 saat</td>
                  <td className="px-4 py-3 text-center">4-5 saat</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3">3-6 ay kala</td>
                  <td className="px-4 py-3 text-center">3-4 saat</td>
                  <td className="px-4 py-3 text-center">5-6 saat</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-orange-500">Son 3 ay</td>
                  <td className="px-4 py-3 text-center font-semibold">4-5 saat</td>
                  <td className="px-4 py-3 text-center font-semibold">6-8 saat</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-4 py-3 font-semibold text-red-500">Son 1 ay</td>
                  <td className="px-4 py-3 text-center font-semibold">5-6 saat</td>
                  <td className="px-4 py-3 text-center font-semibold">8+ saat</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              <strong>Önemli:</strong> Kaliteli çalışma, uzun ama verimsiz çalışmadan daha iyidir.
              45 dakika çalış, 10 dakika mola ver (Pomodoro tekniği).
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Haftalık Program Örneği
          </h2>

          <p className="text-muted-foreground mb-4">
            Aşağıdaki örnek programı kendi ihtiyaçlarına göre düzenleyebilirsin:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-border rounded-lg text-sm">
              <thead className="bg-accent">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Gün</th>
                  <th className="px-3 py-2 text-left font-semibold">16:00-17:30</th>
                  <th className="px-3 py-2 text-left font-semibold">18:00-19:30</th>
                  <th className="px-3 py-2 text-left font-semibold">20:00-21:00</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 font-medium">Pazartesi</td>
                  <td className="px-3 py-2 text-blue-500">Matematik</td>
                  <td className="px-3 py-2 text-green-500">Türkçe</td>
                  <td className="px-3 py-2 text-purple-500">İngilizce</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-3 py-2 font-medium">Salı</td>
                  <td className="px-3 py-2 text-orange-500">Fen Bilimleri</td>
                  <td className="px-3 py-2 text-blue-500">Matematik</td>
                  <td className="px-3 py-2 text-red-500">İnkılap Tarihi</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 font-medium">Çarşamba</td>
                  <td className="px-3 py-2 text-green-500">Türkçe</td>
                  <td className="px-3 py-2 text-orange-500">Fen Bilimleri</td>
                  <td className="px-3 py-2 text-gray-500">Din Kültürü</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-3 py-2 font-medium">Perşembe</td>
                  <td className="px-3 py-2 text-blue-500">Matematik</td>
                  <td className="px-3 py-2 text-green-500">Türkçe</td>
                  <td className="px-3 py-2 text-purple-500">İngilizce</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 font-medium">Cuma</td>
                  <td className="px-3 py-2 text-orange-500">Fen Bilimleri</td>
                  <td className="px-3 py-2 text-blue-500">Matematik</td>
                  <td className="px-3 py-2 text-red-500">İnkılap Tarihi</td>
                </tr>
                <tr className="border-t border-border bg-accent/50">
                  <td className="px-3 py-2 font-medium">Cumartesi</td>
                  <td className="px-3 py-2 text-primary" colSpan={2}>Deneme Sınavı (10:00-12:00)</td>
                  <td className="px-3 py-2 text-muted-foreground">Analiz</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2 font-medium">Pazar</td>
                  <td className="px-3 py-2 text-muted-foreground" colSpan={2}>Eksik Konu Tekrarı</td>
                  <td className="px-3 py-2 text-muted-foreground">Dinlenme</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Ders Dağılımı Önerileri
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="py-4">
                <h3 className="font-semibold text-blue-500 mb-2">Matematik (Haftada 6 saat)</h3>
                <p className="text-sm text-muted-foreground">
                  En ağırlıklı ders. Her gün en az 1 saat çalış. Problem çözme pratiği şart.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <h3 className="font-semibold text-green-500 mb-2">Türkçe (Haftada 5 saat)</h3>
                <p className="text-sm text-muted-foreground">
                  Paragraf çözümü ve dil bilgisi dengeli olmalı. Bol okuma yap.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <h3 className="font-semibold text-orange-500 mb-2">Fen Bilimleri (Haftada 5 saat)</h3>
                <p className="text-sm text-muted-foreground">
                  Fizik, Kimya, Biyoloji dengeli. Formülleri ezberle, deney sorularına dikkat.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <h3 className="font-semibold text-purple-500 mb-2">Diğer Dersler (Haftada 4 saat)</h3>
                <p className="text-sm text-muted-foreground">
                  İnkılap, Din Kültürü, İngilizce. Konu tekrarı ve test çözümü yeterli.
                </p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Verimli Çalışma İpuçları
          </h2>

          <ul className="space-y-3 mb-6 list-none pl-0">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span><strong>Pomodoro Tekniği:</strong> 45 dakika çalış, 10 dakika mola ver</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span><strong>Aktif Öğrenme:</strong> Sadece okuma yerine soru çöz, not al</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span><strong>Tekrar:</strong> Çözdüğün yanlışları not al, haftalık tekrar et</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span><strong>Deneme Sınavı:</strong> Haftada en az 1 deneme çöz, analiz et</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <span><strong>Uyku:</strong> Günde 7-8 saat uyu, gece geç çalışma</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
            Son 90 Gün Stratejisi
          </h2>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
              Son 3 Ay Kritik Dönem!
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Yeni konu öğrenmeyi minimize et</li>
              <li>• Tekrar ve pekiştirmeye odaklan</li>
              <li>• Her hafta 2-3 deneme çöz</li>
              <li>• Yanlış defteri tut, her hafta tekrar et</li>
              <li>• Zayıf konulara öncelik ver</li>
            </ul>
          </div>
        </article>

        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Çalışmanı Takip Et</h3>
            <p className="text-muted-foreground mb-4">Deneme sonuçlarını gir, gelişimini izle</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/araclar/haftalik-strateji">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Haftalık Plan
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
