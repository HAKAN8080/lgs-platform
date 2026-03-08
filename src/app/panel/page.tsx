'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth, usePremium } from '@/contexts/auth-context'
import { signOut } from '@/lib/firebase/auth'
import { db } from '@/lib/firebase/config'
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import {
  User,
  LogOut,
  Calculator,
  TrendingUp,
  Target,
  FileText,
  Sparkles,
  Crown,
  Upload,
  BarChart3,
  Calendar,
  Loader2,
  Plus,
  Trash2,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface Deneme {
  id: string
  yayinAdi: string
  denemeAdi: string
  tarih: string
  toplamNet: number
  puan: number
  netler: Record<string, number>
}

const quickTools = [
  {
    name: 'Puan Hesapla',
    href: '/araclar/puan-hesaplama',
    icon: Calculator,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    name: 'Taban Puanları',
    href: '/araclar/taban-puanlari',
    icon: BarChart3,
    color: 'bg-green-500/10 text-green-500',
  },
]

const panelFeatures = [
  {
    name: 'Deneme Yükle',
    description: 'Excel veya PDF formatında deneme sonuçlarını yükle',
    href: '/panel/deneme-yukle',
    icon: Upload,
    color: 'bg-purple-500/10 text-purple-500',
    comingSoon: true,
  },
  {
    name: 'Net Takip',
    description: 'Deneme sınavlarındaki net gelişimini takip et',
    href: '/panel/net-takip',
    icon: TrendingUp,
    color: 'bg-green-500/10 text-green-500',
    comingSoon: true,
  },
  {
    name: 'Konu Analizi',
    description: 'Güçlü ve zayıf konularını keşfet',
    href: '/panel/konu-analizi',
    icon: Target,
    color: 'bg-orange-500/10 text-orange-500',
    comingSoon: true,
  },
  {
    name: 'Haftalık Strateji',
    description: 'Deneme sonuçlarına göre kişiselleştirilmiş çalışma stratejisi',
    href: '/panel/strateji',
    icon: Calendar,
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    name: 'AI Koç',
    description: 'Yapay zeka destekli kişisel koçluk',
    href: '/panel/ai-koc',
    icon: Sparkles,
    color: 'bg-pink-500/10 text-pink-500',
    premium: true,
    comingSoon: true,
  },
]

export default function PanelPage() {
  const router = useRouter()
  const { user, userData, loading } = useAuth()
  const { isPremium, plan } = usePremium()
  const [denemeler, setDenemeler] = useState<Deneme[]>([])
  const [loadingDenemeler, setLoadingDenemeler] = useState(true)
  const [daysUntilLGS, setDaysUntilLGS] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/giris')
    }
  }, [user, loading, router])

  // LGS'ye kalan günleri hesapla
  useEffect(() => {
    const calculateDaysUntilLGS = () => {
      const lgsYear = userData?.profile?.lgsYear
      if (!lgsYear) return

      // LGS tarihleri (Haziran ayının 2. Pazar günü genelde)
      const lgsDates: Record<string, string> = {
        '2026': '2026-06-14',
        '2027': '2027-06-13',
        '2028': '2028-06-11',
      }

      const lgsDate = lgsDates[lgsYear]
      if (!lgsDate) return

      const now = new Date().getTime()
      const target = new Date(lgsDate + 'T10:00:00').getTime()
      const difference = target - now
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))

      setDaysUntilLGS(days > 0 ? days : 0)
    }

    if (userData) {
      calculateDaysUntilLGS()
      const timer = setInterval(calculateDaysUntilLGS, 1000 * 60 * 60) // Her saat güncelle
      return () => clearInterval(timer)
    }
  }, [userData])

  // Denemeleri çek
  useEffect(() => {
    const fetchDenemeler = async () => {
      if (!user || !db) {
        console.log('fetchDenemeler: No user or db')
        setLoadingDenemeler(false)
        return
      }

      try {
        console.log('fetchDenemeler: Querying for userId:', user.uid)
        const q = query(
          collection(db, 'denemeler'),
          where('userId', '==', user.uid)
        )
        const snapshot = await getDocs(q)
        console.log('fetchDenemeler: Got', snapshot.size, 'documents')
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Deneme[]

        // Client-side sıralama (Firebase index gerekmez)
        data.sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())

        console.log('fetchDenemeler: Denemeler:', data)
        setDenemeler(data)
      } catch (err) {
        console.error('Denemeler yüklenemedi:', err)
      } finally {
        setLoadingDenemeler(false)
      }
    }

    if (user) {
      fetchDenemeler()
    }
  }, [user])

  const handleDeleteDeneme = async (id: string) => {
    if (!db || !confirm('Bu denemeyi silmek istediğinize emin misiniz?')) return

    try {
      await deleteDoc(doc(db, 'denemeler', id))
      setDenemeler(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      console.error('Silme hatası:', err)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Merhaba, {userData?.displayName || user.displayName || 'Öğrenci'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              LGS hazırlığına devam et
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              plan === 'premium_plus'
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500'
                : plan === 'premium'
                ? 'bg-purple-500/20 text-purple-500'
                : 'bg-muted text-muted-foreground'
            }`}>
              {plan === 'premium_plus' ? 'Premium+' : plan === 'premium' ? 'Premium' : 'Ücretsiz'}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {quickTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${tool.color}`}>
                <tool.icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-foreground">{tool.name}</span>
            </Link>
          ))}
        </div>

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profil Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* LGS Countdown Banner */}
            {userData?.profile?.lgsYear && daysUntilLGS > 0 && (
              <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      LGS {userData.profile.lgsYear}&apos;ya
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {daysUntilLGS} gün kaldı
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium text-foreground truncate">{user.email}</div>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-sm text-muted-foreground">Hedef Puan</div>
                <div className="font-medium text-foreground">
                  {userData?.profile?.targetScore || 'Belirlenmedi'}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="text-sm text-muted-foreground">Üyelik</div>
                <div className="font-medium text-foreground capitalize">{plan}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Denemelerim */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Denemelerim
              </CardTitle>
              <CardDescription>
                {!isPremium && `${denemeler.length}/5 deneme kullanıldı`}
                {isPremium && `${denemeler.length} deneme`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href="/panel/karne-ekle">
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Karne (PDF)
                </Button>
              </Link>
              <Link href="/panel/deneme-ekle">
                <Button size="sm" disabled={!isPremium && denemeler.length >= 5}>
                  <Plus className="h-4 w-4 mr-2" />
                  Deneme Ekle
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loadingDenemeler ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : denemeler.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Henüz deneme eklenmemiş
              </div>
            ) : (
              <div className="space-y-3">
                {denemeler.slice(0, 10).map((deneme) => (
                  <div
                    key={deneme.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-accent/30 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{deneme.yayinAdi}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-foreground">{deneme.denemeAdi}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(deneme.tarih).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Net</div>
                        <div className="font-bold text-primary">{deneme.toplamNet.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Puan</div>
                        <div className="font-bold text-green-500">{deneme.puan.toFixed(2)}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDeneme(deneme.id)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {denemeler.length > 10 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{denemeler.length - 10} deneme daha
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel Features */}
        <h2 className="text-xl font-bold text-foreground mb-4">Panel Özellikleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {panelFeatures.map((feature) => (
            <Card
              key={feature.name}
              className={`relative ${feature.comingSoon ? 'opacity-60' : 'hover:border-primary/50 transition-colors cursor-pointer'}`}
            >
              {feature.comingSoon && (
                <span className="absolute top-3 right-3 text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  Yakında
                </span>
              )}
              {feature.premium && !isPremium && (
                <span className="absolute top-3 right-3 text-xs font-medium bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Premium
                </span>
              )}
              <CardHeader className="pb-2">
                <div className={`inline-flex p-2 rounded-lg w-fit ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
                {!feature.comingSoon && (
                  <Link href={feature.href} className="absolute inset-0" aria-label={feature.name} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium CTA */}
        {!isPremium && (
          <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
            <CardContent className="py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Premium&apos;a Geç</h3>
                    <p className="text-muted-foreground">
                      AI Koç, sınırsız analiz ve daha fazlası
                    </p>
                  </div>
                </div>
                <Link href="/premium">
                  <Button>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Premium&apos;a Geç
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
