'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth, usePlan } from '@/contexts/auth-context'
import { activateLicense } from '@/lib/firebase/license'
import { PLANS, type PlanType, type FeatureStatus } from '@/lib/constants/plans'
import {
  Crown,
  Check,
  Sparkles,
  Lock,
  Clock,
  Loader2,
  Key,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  X,
  Zap,
  Star,
} from 'lucide-react'
import Link from 'next/link'

// Plan renkleri
const PLAN_COLORS: Record<PlanType, { bg: string; border: string; badge: string; icon: string }> = {
  basic: {
    bg: 'from-gray-500/5 to-transparent',
    border: 'border-gray-500/20',
    badge: 'bg-gray-500/10 text-gray-500',
    icon: 'text-gray-500',
  },
  pro: {
    bg: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-500',
    icon: 'text-blue-500',
  },
  elite: {
    bg: 'from-purple-500/10 via-pink-500/5 to-transparent',
    border: 'border-purple-500/30',
    badge: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-500',
    icon: 'text-purple-500',
  },
  kurumsal: {
    bg: 'from-green-500/10 to-transparent',
    border: 'border-green-500/30',
    badge: 'bg-green-500/10 text-green-500',
    icon: 'text-green-500',
  },
}

// Plan ikonları
const PLAN_ICONS: Record<PlanType, typeof Zap> = {
  basic: Zap,
  pro: Star,
  elite: Crown,
  kurumsal: Crown,
}

// Özellik durumu ikonu
function FeatureStatusIcon({ status }: { status: FeatureStatus }) {
  switch (status) {
    case 'active':
      return <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
    case 'limited':
      return <Check className="h-4 w-4 text-yellow-500 flex-shrink-0" />
    case 'locked':
      return <Lock className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
    case 'coming_soon':
      return <Clock className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
    default:
      return <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
  }
}

export default function PremiumPage() {
  const { user } = useAuth()
  const { plan: userPlan, isPro, isElite } = usePlan()
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
  if (isPro || isElite) {
    return (
      <div className="min-h-screen py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Card className={`bg-gradient-to-r ${isElite ? 'from-purple-500/10 via-pink-500/10 to-transparent' : 'from-blue-500/10 to-transparent'} border-primary/20`}>
            <CardContent className="py-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Crown className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {isElite ? 'Elite' : 'Pro'} Üyelik Aktif!
              </h1>
              <p className="text-muted-foreground mb-6">
                {isElite ? 'Elite' : 'Pro'} üyeliğiniz aktif. Tüm özelliklere erişebilirsiniz.
              </p>
              <Link href="/panel">
                <Button>Panele Dön</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Planlar</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            LGS Hazırlığını Bir Üst Seviyeye Taşı
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            İhtiyacına uygun planı seç, hedefine ulaş. Tüm planlar LGS sınavına kadar geçerlidir.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => {
            const colors = PLAN_COLORS[plan.key]
            const Icon = PLAN_ICONS[plan.key]
            const isCurrentPlan = userPlan === plan.key
            const isRecommended = plan.key === 'pro'

            return (
              <Card
                key={plan.key}
                className={`relative bg-gradient-to-b ${colors.bg} ${colors.border} ${
                  isRecommended ? 'ring-2 ring-blue-500/50 scale-[1.02]' : ''
                } transition-all duration-300 hover:shadow-lg`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`${colors.badge} text-xs font-semibold px-3 py-1 rounded-full`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg bg-background/50 ${colors.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.priceLabel}</span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground ml-2">tek seferlik</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Özellikler */}
                  <ul className="space-y-2.5">
                    {plan.features.slice(0, 8).map((feature) => (
                      <li
                        key={feature.key}
                        className={`flex items-start gap-2 text-sm ${
                          feature.status === 'locked' || feature.status === 'coming_soon'
                            ? 'text-muted-foreground/60'
                            : 'text-foreground'
                        }`}
                      >
                        <FeatureStatusIcon status={feature.status} />
                        <span>
                          {feature.name}
                          {feature.limit && feature.status === 'limited' && (
                            <span className="text-muted-foreground ml-1">({feature.limit} adet)</span>
                          )}
                          {feature.status === 'coming_soon' && (
                            <span className="text-muted-foreground ml-1">(Yakında)</span>
                          )}
                        </span>
                      </li>
                    ))}
                    {plan.features.length > 8 && (
                      <li className="text-sm text-muted-foreground pl-6">
                        +{plan.features.length - 8} özellik daha...
                      </li>
                    )}
                  </ul>

                  {/* CTA Buton */}
                  <div className="pt-4 space-y-2">
                    {isCurrentPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mevcut Plan
                      </Button>
                    ) : plan.price === 0 ? (
                      <Link href="/kayit" className="block">
                        <Button variant="outline" className="w-full">
                          Ücretsiz Başla
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <a
                          href={`https://thorius.com.tr/urun/lgs-${plan.key}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button
                            className={`w-full ${
                              plan.key === 'elite'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                : ''
                            }`}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Satın Al
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </a>
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-muted-foreground"
                            onClick={() => {
                              setLisansKodu('')
                              setLisansResult(null)
                              setShowLisansModal(true)
                            }}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Lisans Kodu Gir
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Karşılaştırma Tablosu */}
        <Card className="mb-12 overflow-hidden">
          <CardHeader>
            <CardTitle>Plan Karşılaştırması</CardTitle>
            <CardDescription>Tüm özellikleri detaylı karşılaştır</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium">Özellik</th>
                    <th className="text-center p-4 font-medium">Basic</th>
                    <th className="text-center p-4 font-medium text-blue-500">Pro</th>
                    <th className="text-center p-4 font-medium text-purple-500">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Temel Özellikler */}
                  <tr className="border-b border-border/50">
                    <td className="p-4">Puan & Net Hesaplama</td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Taban Puanları</td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Deneme Yükleme</td>
                    <td className="text-center p-4 text-muted-foreground">5 adet</td>
                    <td className="text-center p-4 text-blue-500">Sınırsız</td>
                    <td className="text-center p-4 text-purple-500">Sınırsız</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Karne/PDF Yükleme</td>
                    <td className="text-center p-4 text-muted-foreground">5 adet</td>
                    <td className="text-center p-4 text-blue-500">Sınırsız</td>
                    <td className="text-center p-4 text-purple-500">Sınırsız</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Konu Bazlı Analiz</td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Haftalık Strateji</td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Zayıf Konu Tespiti</td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4">Gelişim Grafikleri</td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4 font-medium">AI Koç</td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4 font-medium">AI Soru Üretici</td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4 font-medium">Sınav Tahmini</td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4 font-medium">Ebeveyn Raporu</td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Lock className="h-4 w-4 text-muted-foreground/50 mx-auto" /></td>
                    <td className="text-center p-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Sıkça Sorulan Sorular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Planlar ne kadar süre geçerli?</h4>
              <p className="text-sm text-muted-foreground">
                Tüm planlar LGS sınavına (Haziran 2026) kadar geçerlidir. Tek seferlik ödeme ile sınav gününe kadar tüm özelliklere erişebilirsiniz.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Plan yükseltme yapabilir miyim?</h4>
              <p className="text-sm text-muted-foreground">
                Evet, istediğiniz zaman daha üst bir plana geçebilirsiniz. Mevcut planınızın kalan değeri yeni plana sayılır.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Ödeme nasıl yapılır?</h4>
              <p className="text-sm text-muted-foreground">
                Kredi kartı veya banka kartı ile güvenli ödeme yapabilirsiniz. Ödeme işlemleri PayTR altyapısı ile gerçekleştirilir.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">İade politikası nedir?</h4>
              <p className="text-sm text-muted-foreground">
                Satın almadan sonraki 7 gün içinde, lisans kodunu kullanmadıysanız tam iade alabilirsiniz.
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
                Plan Aktivasyonu
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
