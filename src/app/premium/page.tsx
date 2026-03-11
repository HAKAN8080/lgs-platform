'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth, usePremium } from '@/contexts/auth-context'
import { activateLicense } from '@/lib/firebase/license'
import {
  Crown,
  Check,
  Sparkles,
  TrendingUp,
  Target,
  Calendar,
  FileText,
  Loader2,
  Key,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  X,
} from 'lucide-react'
import Link from 'next/link'

const premiumFeatures = [
  {
    icon: FileText,
    title: 'Sınırsız Deneme Girişi',
    description: 'İstediğin kadar deneme ve karne yükle',
  },
  {
    icon: TrendingUp,
    title: 'Detaylı Net Takip',
    description: 'Grafikler ve trend analizleri ile gelişimini izle',
  },
  {
    icon: Calendar,
    title: 'Kişiselleştirilmiş Strateji',
    description: 'Deneme sonuçlarına göre haftalık çalışma planı',
  },
  {
    icon: Target,
    title: 'Hedef Okul Takibi',
    description: 'Hedef okuluna ne kadar yakınsın, anlık görüntüle',
  },
  {
    icon: Sparkles,
    title: 'AI Koç (Yakında)',
    description: 'Yapay zeka destekli kişisel koçluk ve öneriler',
  },
]

const freeFeatures = [
  '5 deneme girişi',
  '5 karne yükleme',
  'Net takip (temel)',
  'Puan hesaplama',
  'Taban puanları görüntüleme',
]

const premiumBenefits = [
  'Sınırsız deneme ve karne',
  'Detaylı analiz ve grafikler',
  'Haftalık strateji önerileri',
  'Hedef okul karşılaştırması',
  'Öncelikli destek',
  'LGS\'ye kadar geçerli',
]

export default function PremiumPage() {
  const { user } = useAuth()
  const { isPremium, plan } = usePremium()
  const [showLisansModal, setShowLisansModal] = useState(false)
  const [lisansKodu, setLisansKodu] = useState('')
  const [lisansLoading, setLisansLoading] = useState(false)
  const [lisansResult, setLisansResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleLisansAktivasyonu = async () => {
    if (!user || !lisansKodu.trim()) return
    setLisansLoading(true)
    setLisansResult(null)
    try {
      const result = await activateLicense(lisansKodu, user.uid, user.email || '')
      setLisansResult(result)
      if (result.success) {
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch {
      setLisansResult({ success: false, message: 'Bir hata oluştu' })
    } finally {
      setLisansLoading(false)
    }
  }

  // Zaten premium ise
  if (isPremium) {
    return (
      <div className="min-h-screen py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Crown className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Premium Aktif! 🎉
              </h1>
              <p className="text-muted-foreground mb-6">
                {plan === 'premium_plus' ? 'Premium+ ' : 'Premium '}
                üyeliğiniz aktif. Tüm özelliklere erişebilirsiniz.
              </p>
              <Link href="/panel">
                <Button>
                  Panele Dön
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Crown className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Premium</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            LGS Hazırlığını Bir Üst Seviyeye Taşı
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sınırsız deneme girişi, detaylı analizler ve kişiselleştirilmiş strateji önerileri ile hedefine ulaş.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-xl">Ücretsiz</CardTitle>
              <CardDescription>Başlangıç için ideal</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">0₺</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-muted-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/kayit" className="block mt-6">
                <Button variant="outline" className="w-full">
                  Ücretsiz Başla
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary/50 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                ÖNERİLEN
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Premium
              </CardTitle>
              <CardDescription>LGS&apos;ye kadar tam erişim</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">299₺</span>
                <span className="text-muted-foreground ml-2">tek seferlik</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {premiumBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-3">
                <a
                  href="https://thorius.com.tr/urun/lgs-premium/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Satın Al
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
                {user && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { setLisansKodu(''); setLisansResult(null); setShowLisansModal(true); }}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Lisans Kodu Gir
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Premium ile Neler Kazanırsın?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Sıkça Sorulan Sorular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Premium ne kadar süre geçerli?</h4>
              <p className="text-sm text-muted-foreground">
                Premium üyelik, LGS sınavına (Haziran 2026) kadar geçerlidir. Tek seferlik ödeme ile sınav gününe kadar tüm özelliklere erişebilirsiniz.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Ödeme nasıl yapılır?</h4>
              <p className="text-sm text-muted-foreground">
                Kredi kartı veya banka kartı ile güvenli ödeme yapabilirsiniz. Ödeme işlemleri PayTR altyapısı ile gerçekleştirilir.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Lisans kodu nasıl kullanılır?</h4>
              <p className="text-sm text-muted-foreground">
                Satın alma sonrası email adresinize gönderilen lisans kodunu, paneldeki &quot;Lisans Kodu Gir&quot; butonuna tıklayarak aktive edebilirsiniz.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">İade politikası nedir?</h4>
              <p className="text-sm text-muted-foreground">
                Satın almadan sonraki 7 gün içinde, lisans kodunu kullanmadıysanız tam iade alabilirsiniz. Destek için iletişime geçin.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lisans Modal */}
      {showLisansModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Premium Aktivasyonu
              </h3>
              <button onClick={() => setShowLisansModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                Satın aldığınız lisans kodunu girin. Kod email ile gönderilmiştir.
              </p>
              <input
                type="text"
                value={lisansKodu}
                onChange={e => setLisansKodu(e.target.value.toUpperCase())}
                placeholder="Örn: XXXX-XXXX-XXXX"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono tracking-wider text-center"
                maxLength={20}
              />
              {lisansResult && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  lisansResult.success
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {lisansResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {lisansResult.message}
                </div>
              )}
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setShowLisansModal(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                İptal
              </button>
              <button
                onClick={handleLisansAktivasyonu}
                disabled={lisansLoading || !lisansKodu.trim()}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {lisansLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
                Aktive Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
