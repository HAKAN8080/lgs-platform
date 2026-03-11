'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { LGS_QUESTION_DISTRIBUTION } from '@/lib/constants/question-distribution'
import {
  ArrowLeft,
  Target,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  Filter,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface KonuPerformans {
  konu: string
  ders: string
  dersColor: string
  toplamSoru: number
  dogru: number
  yanlis: number
  basariYuzdesi: number
  denemeSayisi: number
}

interface DersAnaliz {
  ders: string
  dersKey: string
  icon: string
  color: string
  toplamDeneme: number
  toplamDogru: number
  toplamYanlis: number
  toplamSoru: number
  genelBasari: number
  konular: KonuPerformans[]
}

interface Deneme {
  id: string
  tarih: string
  sinavAdi?: string
  yayinAdi?: string
  denemeAdi?: string
  dersler: Record<string, {
    dogru: number
    yanlis: number
    net: number
    konular?: Array<{
      konu: string
      soruSayisi: number
      dogru: number
      yanlis: number
      basariYuzdesi: number
    }>
  }>
  createdAt: any
}

type FilterOption = 'son5' | 'son10' | 'son20' | 'tumu'

export default function KonuAnaliziPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [denemeler, setDenemeler] = useState<Deneme[]>([])
  const [dersAnalizleri, setDersAnalizleri] = useState<DersAnaliz[]>([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<FilterOption>('son10')
  const [selectedDers, setSelectedDers] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/giris')
    }
  }, [user, authLoading, router])

  // Denemeleri çek
  useEffect(() => {
    const fetchDenemeler = async () => {
      if (!user || !db) {
        setLoading(false)
        return
      }

      try {
        // Hem karneleri hem denemeleri çek
        const karneQuery = query(
          collection(db, 'karneler'),
          where('userId', '==', user.uid)
        )
        const denemeQuery = query(
          collection(db, 'denemeler'),
          where('userId', '==', user.uid)
        )

        const [karneSnapshot, denemeSnapshot] = await Promise.all([
          getDocs(karneQuery),
          getDocs(denemeQuery)
        ])

        // Tüm dokümanları birleştir ve tarihe göre sırala
        const allDocs = [...karneSnapshot.docs, ...denemeSnapshot.docs]
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Deneme))
          .sort((a, b) => {
            const dateA = a.tarih ? new Date(a.tarih).getTime() : 0
            const dateB = b.tarih ? new Date(b.tarih).getTime() : 0
            return dateB - dateA // En yeniden eskiye
          })

        // Duplikasyonları temizle (aynı tarih + sınav adı)
        const uniqueDocs = allDocs.filter((doc, index, self) => {
          const key = `${doc.tarih}-${doc.sinavAdi || doc.yayinAdi}`
          return index === self.findIndex(d => `${d.tarih}-${d.sinavAdi || d.yayinAdi}` === key)
        })

        setDenemeler(uniqueDocs)

        if (uniqueDocs.length === 0) {
          setError('Henüz karne yüklemediniz. Konu analizi için PDF karne yüklemeniz gerekiyor.')
        }
      } catch (err) {
        console.error('Deneme çekme hatası:', err)
        setError('Veriler yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDenemeler()
    }
  }, [user])

  // Filtrelenmiş denemelere göre analiz yap
  useEffect(() => {
    if (denemeler.length === 0) return

    // Filtreye göre denemeleri seç
    let filteredDenemeler = [...denemeler]
    switch (filter) {
      case 'son5':
        filteredDenemeler = denemeler.slice(0, 5)
        break
      case 'son10':
        filteredDenemeler = denemeler.slice(0, 10)
        break
      case 'son20':
        filteredDenemeler = denemeler.slice(0, 20)
        break
      case 'tumu':
      default:
        filteredDenemeler = denemeler
    }

    // Kümülatif konu performansını hesapla
    const konuMap = new Map<string, KonuPerformans>()
    const dersStatsMap = new Map<string, { dogru: number; yanlis: number; soru: number }>()

    filteredDenemeler.forEach(deneme => {
      const dersler = deneme.dersler || {}

      Object.entries(dersler).forEach(([dersKey, dersData]: [string, any]) => {
        // Ders istatistiklerini topla
        if (!dersStatsMap.has(dersKey)) {
          dersStatsMap.set(dersKey, { dogru: 0, yanlis: 0, soru: 0 })
        }
        const dersStats = dersStatsMap.get(dersKey)!
        dersStats.dogru += dersData.dogru || 0
        dersStats.yanlis += dersData.yanlis || 0
        dersStats.soru += (dersData.dogru || 0) + (dersData.yanlis || 0)

        // Konu detaylarını işle
        const konular = dersData.konular || []

        konular.forEach((konu: any) => {
          const key = `${dersKey}::${konu.konu}`

          if (konuMap.has(key)) {
            const existing = konuMap.get(key)!
            existing.dogru += konu.dogru || 0
            existing.yanlis += konu.yanlis || 0
            existing.toplamSoru += konu.soruSayisi || (konu.dogru + konu.yanlis) || 0
            existing.denemeSayisi += 1
            existing.basariYuzdesi = existing.toplamSoru > 0
              ? (existing.dogru / existing.toplamSoru) * 100
              : 0
          } else {
            // Ders bilgisini bul
            const dersInfo = LGS_QUESTION_DISTRIBUTION.find(d => {
              const dersName = d.subject.toLowerCase().replace(/\s+/g, '')
              const normalizedKey = dersKey.toLowerCase().replace(/\s+/g, '')
              return dersName.includes(normalizedKey) || normalizedKey.includes(dersName.substring(0, 3))
            })

            const soruSayisi = konu.soruSayisi || (konu.dogru + konu.yanlis) || 0

            konuMap.set(key, {
              konu: konu.konu,
              ders: dersKey,
              dersColor: dersInfo?.color || '#888888',
              toplamSoru: soruSayisi,
              dogru: konu.dogru || 0,
              yanlis: konu.yanlis || 0,
              basariYuzdesi: soruSayisi > 0 ? ((konu.dogru || 0) / soruSayisi) * 100 : 0,
              denemeSayisi: 1
            })
          }
        })
      })
    })

    // Ders bazında grupla - önce tüm dersleri oluştur (konu olsun olmasın)
    const dersMap = new Map<string, DersAnaliz>()

    // Önce dersStatsMap'ten tüm dersleri oluştur
    Array.from(dersStatsMap.entries()).forEach(([dersKey, dersStats]) => {
      const dersInfo = LGS_QUESTION_DISTRIBUTION.find(d => {
        const dersName = d.subject.toLowerCase().replace(/\s+/g, '')
        const normalizedKey = dersKey.toLowerCase().replace(/\s+/g, '')
        return dersName.includes(normalizedKey) || normalizedKey.includes(dersName.substring(0, 3))
      })

      dersMap.set(dersKey, {
        ders: dersInfo?.subject || dersKey,
        dersKey: dersKey,
        icon: dersInfo?.icon || '📚',
        color: dersInfo?.color || '#888888',
        toplamDeneme: filteredDenemeler.length,
        toplamDogru: dersStats.dogru,
        toplamYanlis: dersStats.yanlis,
        toplamSoru: dersStats.soru,
        genelBasari: dersStats.soru > 0 ? (dersStats.dogru / dersStats.soru) * 100 : 0,
        konular: []
      })
    })

    // Sonra konu detaylarını ekle (varsa)
    Array.from(konuMap.values()).forEach(konuPerf => {
      if (dersMap.has(konuPerf.ders)) {
        dersMap.get(konuPerf.ders)!.konular.push(konuPerf)
      }
    })

    // Her dersin konularını başarı yüzdesine göre sırala (en düşük önce)
    const analizler = Array.from(dersMap.values())
      .map(ders => ({
        ...ders,
        konular: ders.konular.sort((a, b) => a.basariYuzdesi - b.basariYuzdesi)
      }))
      .sort((a, b) => {
        // Ana dersler önce (Türkçe, Mat, Fen)
        const order = ['turkce', 'matematik', 'fen', 'inkilap', 'din', 'ingilizce']
        return order.indexOf(a.dersKey) - order.indexOf(b.dersKey)
      })

    setDersAnalizleri(analizler)
  }, [denemeler, filter])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Konu analizi yükleniyor...</p>
        </div>
      </div>
    )
  }

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: 'son5', label: 'Son 5 Sınav' },
    { value: 'son10', label: 'Son 10 Sınav' },
    { value: 'son20', label: 'Son 20 Sınav' },
    { value: 'tumu', label: 'Tümü' },
  ]

  // Seçili dersin detaylı analizi
  const selectedDersAnaliz = selectedDers
    ? dersAnalizleri.find(d => d.dersKey === selectedDers)
    : null

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/panel">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Konu Analizi</h1>
              <p className="text-muted-foreground">
                {denemeler.length} sınavdan zayıf konuları keşfet
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Analiz Aralığı:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={filter === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                    {option.value !== 'tumu' && (
                      <span className="ml-1 text-xs opacity-70">
                        ({Math.min(denemeler.length, parseInt(option.value.replace('son', '')))} sınav)
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-6 border-orange-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-orange-500">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">{error}</p>
                  {error.includes('karne') && (
                    <Link href="/panel/karne-ekle" className="text-sm underline mt-1 inline-block">
                      Karne Yükle
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ders Kartları - Özet */}
        {dersAnalizleri.length > 0 && !selectedDers && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {dersAnalizleri.map((ders) => {
              const zayifKonular = ders.konular.filter(k => k.basariYuzdesi < 50)
              const ortaKonular = ders.konular.filter(k => k.basariYuzdesi >= 50 && k.basariYuzdesi < 70)
              const gucluKonular = ders.konular.filter(k => k.basariYuzdesi >= 70)

              return (
                <Card
                  key={ders.dersKey}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedDers(ders.dersKey)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{ders.icon}</span>
                        <span className="text-lg">{ders.ders}</span>
                      </div>
                      <span
                        className="text-lg font-bold"
                        style={{
                          color: ders.genelBasari >= 70 ? '#10B981' : ders.genelBasari >= 50 ? '#F59E0B' : '#EF4444'
                        }}
                      >
                        %{ders.genelBasari.toFixed(0)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span className="text-green-500">{ders.toplamDogru}D</span>
                      <span className="text-red-500">{ders.toplamYanlis}Y</span>
                      <span className="text-muted-foreground">/ {ders.toplamSoru} soru</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${ders.genelBasari}%`,
                          backgroundColor: ders.genelBasari >= 70 ? '#10B981' : ders.genelBasari >= 50 ? '#F59E0B' : '#EF4444'
                        }}
                      />
                    </div>

                    {/* Konu özeti */}
                    <div className="flex items-center gap-3 text-xs">
                      {zayifKonular.length > 0 && (
                        <span className="flex items-center gap-1 text-red-500">
                          <TrendingDown className="h-3 w-3" />
                          {zayifKonular.length} zayıf
                        </span>
                      )}
                      {ortaKonular.length > 0 && (
                        <span className="flex items-center gap-1 text-amber-500">
                          {ortaKonular.length} orta
                        </span>
                      )}
                      {gucluKonular.length > 0 && (
                        <span className="flex items-center gap-1 text-green-500">
                          <TrendingUp className="h-3 w-3" />
                          {gucluKonular.length} güçlü
                        </span>
                      )}
                    </div>

                    {/* En zayıf konu */}
                    {zayifKonular.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-1">En Zayıf Konu:</div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground truncate">
                            {zayifKonular[0].konu}
                          </span>
                          <span className="text-xs font-bold text-red-500">
                            %{zayifKonular[0].basariYuzdesi.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Seçili Ders Detayı */}
        {selectedDersAnaliz && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedDers(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedDersAnaliz.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedDersAnaliz.ders}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedDersAnaliz.konular.length} konu • {selectedDersAnaliz.toplamDeneme} sınav
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-3xl font-bold"
                  style={{
                    color: selectedDersAnaliz.genelBasari >= 70 ? '#10B981' : selectedDersAnaliz.genelBasari >= 50 ? '#F59E0B' : '#EF4444'
                  }}
                >
                  %{selectedDersAnaliz.genelBasari.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedDersAnaliz.toplamDogru}D / {selectedDersAnaliz.toplamYanlis}Y
                </div>
              </div>
            </div>

            {/* Zayıf Konular - Detaylı */}
            <Card className="border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <TrendingDown className="h-5 w-5" />
                  Zayıf Konular (&lt;50%)
                </CardTitle>
                <CardDescription>
                  Bu konulara öncelik vererek çalışmalısın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDersAnaliz.konular
                    .filter(k => k.basariYuzdesi < 50)
                    .map((konu, idx) => (
                      <div
                        key={konu.konu}
                        className="p-4 rounded-lg border border-red-500/20 bg-red-500/5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-red-500">#{idx + 1}</span>
                            <span className="font-medium text-foreground">{konu.konu}</span>
                          </div>
                          <span className="text-xl font-bold text-red-500">
                            %{konu.basariYuzdesi.toFixed(0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm mb-2">
                          <span className="text-green-600">{konu.dogru} doğru</span>
                          <span className="text-red-600">{konu.yanlis} yanlış</span>
                          <span className="text-muted-foreground">/ {konu.toplamSoru} soru</span>
                          <span className="text-muted-foreground">• {konu.denemeSayisi} sınav</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 transition-all"
                            style={{ width: `${konu.basariYuzdesi}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  {selectedDersAnaliz.konular.filter(k => k.basariYuzdesi < 50).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Zayıf konu yok! 🎉
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Orta Konular */}
            <Card className="border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-500">
                  <BarChart3 className="h-5 w-5" />
                  Orta Seviye Konular (50-70%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-2">
                  {selectedDersAnaliz.konular
                    .filter(k => k.basariYuzdesi >= 50 && k.basariYuzdesi < 70)
                    .map((konu) => (
                      <div
                        key={konu.konu}
                        className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground text-sm">{konu.konu}</span>
                          <span className="text-sm font-bold text-amber-500">
                            %{konu.basariYuzdesi.toFixed(0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="text-green-600">{konu.dogru}D</span>
                          <span className="text-red-600">{konu.yanlis}Y</span>
                          <span>/ {konu.toplamSoru}</span>
                        </div>
                      </div>
                    ))}
                  {selectedDersAnaliz.konular.filter(k => k.basariYuzdesi >= 50 && k.basariYuzdesi < 70).length === 0 && (
                    <p className="text-muted-foreground py-2 col-span-2 text-center">
                      Orta seviye konu yok
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Güçlü Konular */}
            <Card className="border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <TrendingUp className="h-5 w-5" />
                  Güçlü Konular (≥70%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {selectedDersAnaliz.konular
                    .filter(k => k.basariYuzdesi >= 70)
                    .sort((a, b) => b.basariYuzdesi - a.basariYuzdesi)
                    .map((konu) => (
                      <div
                        key={konu.konu}
                        className="p-3 rounded-lg border border-green-500/20 bg-green-500/5"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground text-sm">{konu.konu}</span>
                          <span className="text-sm font-bold text-green-500">
                            %{konu.basariYuzdesi.toFixed(0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="text-green-600">{konu.dogru}D</span>
                          <span className="text-red-600">{konu.yanlis}Y</span>
                        </div>
                      </div>
                    ))}
                  {selectedDersAnaliz.konular.filter(k => k.basariYuzdesi >= 70).length === 0 && (
                    <p className="text-muted-foreground py-2 col-span-full text-center">
                      Henüz güçlü konu yok, çalışmaya devam! 💪
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Data */}
        {!loading && !error && dersAnalizleri.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Konu Analizi Hazır Değil
              </h3>
              <p className="text-muted-foreground mb-6">
                Konu bazında analiz için konu detaylı PDF karne yüklemeniz gerekiyor.
              </p>
              <Link href="/panel/karne-ekle">
                <Button>
                  <Target className="h-4 w-4 mr-2" />
                  Karne Yükle
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
