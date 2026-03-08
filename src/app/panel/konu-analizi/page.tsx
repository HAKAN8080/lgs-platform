'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { LGS_QUESTION_DISTRIBUTION } from '@/lib/constants/question-distribution'
import {
  ArrowLeft,
  Target,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  Award,
  XCircle
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
  icon: string
  color: string
  toplamDeneme: number
  konular: KonuPerformans[]
}

export default function KonuAnaliziPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dersAnalizleri, setDersAnalizleri] = useState<DersAnaliz[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/giris')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchKonuAnalizi = async () => {
      console.log('fetchKonuAnalizi called', { user: !!user, db: !!db })

      if (!user || !db) {
        console.log('No user or db, setting loading to false')
        setLoading(false)
        return
      }

      try {
        // Hem karneleri hem denemeleri çek (konu detayları her ikisinde de olabilir)
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

        // Tüm dokümanları birleştir
        const allDocs = [...karneSnapshot.docs, ...denemeSnapshot.docs]

        if (allDocs.length === 0) {
          setError('Henüz karne yüklemediniz. Konu analizi için PDF karne yüklemeniz gerekiyor.')
          setLoading(false)
          return
        }

        // Kümülatif konu performansını hesapla
        const konuMap = new Map<string, KonuPerformans>()

        allDocs.forEach(doc => {
          const data = doc.data()
          const dersler = data.dersler || {}

          Object.entries(dersler).forEach(([dersKey, dersData]: [string, any]) => {
            const konular = dersData.konular || []

            konular.forEach((konu: any) => {
              const key = `${dersKey}::${konu.konu}`

              if (konuMap.has(key)) {
                const existing = konuMap.get(key)!
                existing.dogru += konu.dogru || 0
                existing.yanlis += konu.yanlis || 0
                existing.toplamSoru += konu.soruSayisi || 0
                existing.denemeSayisi += 1
                existing.basariYuzdesi = existing.toplamSoru > 0
                  ? (existing.dogru / existing.toplamSoru) * 100
                  : 0
              } else {
                // Ders bilgisini bul
                const dersInfo = LGS_QUESTION_DISTRIBUTION.find(d => {
                  const dersName = d.subject.toLowerCase().replace(/\s+/g, '')
                  const key = dersKey.toLowerCase().replace(/\s+/g, '')
                  return dersName.includes(key) || key.includes(dersName.substring(0, 3))
                })

                konuMap.set(key, {
                  konu: konu.konu,
                  ders: dersKey,
                  dersColor: dersInfo?.color || '#888888',
                  toplamSoru: konu.soruSayisi || 0,
                  dogru: konu.dogru || 0,
                  yanlis: konu.yanlis || 0,
                  basariYuzdesi: konu.basariYuzdesi || 0,
                  denemeSayisi: 1
                })
              }
            })
          })
        })

        // Ders bazında grupla
        const dersMap = new Map<string, DersAnaliz>()

        Array.from(konuMap.values()).forEach(konuPerf => {
          const dersInfo = LGS_QUESTION_DISTRIBUTION.find(d => {
            const dersName = d.subject.toLowerCase().replace(/\s+/g, '')
            const key = konuPerf.ders.toLowerCase().replace(/\s+/g, '')
            return dersName.includes(key) || key.includes(dersName.substring(0, 3))
          })

          const dersKey = konuPerf.ders

          if (!dersMap.has(dersKey)) {
            dersMap.set(dersKey, {
              ders: dersInfo?.subject || konuPerf.ders,
              icon: dersInfo?.icon || '📚',
              color: dersInfo?.color || '#888888',
              toplamDeneme: allDocs.length,
              konular: []
            })
          }

          dersMap.get(dersKey)!.konular.push(konuPerf)
        })

        // Her dersin konularını başarı yüzdesine göre sırala
        const analizler = Array.from(dersMap.values()).map(ders => ({
          ...ders,
          konular: ders.konular.sort((a, b) => a.basariYuzdesi - b.basariYuzdesi)
        }))

        setDersAnalizleri(analizler)
      } catch (err) {
        console.error('Konu analizi hatası:', err)
        setError('Konu analizi yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchKonuAnalizi()
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Kullanıcı bilgileri yükleniyor...</p>
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

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/panel">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Konu Analizi</h1>
            <p className="text-muted-foreground">Güçlü ve zayıf konularını keşfet</p>
          </div>
        </div>

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

        {/* Ders Analizleri */}
        {dersAnalizleri.length > 0 && (
          <div className="space-y-6">
            {dersAnalizleri.map((ders) => {
              const zayifKonular = ders.konular.filter(k => k.basariYuzdesi < 50)
              const gucluKonular = ders.konular.filter(k => k.basariYuzdesi >= 70)

              return (
                <Card key={ders.ders}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{ders.icon}</span>
                      <span>{ders.ders}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        ({ders.konular.length} konu)
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {ders.toplamDeneme} denemeden kümülatif analiz
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Zayıf Konular */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingDown className="h-5 w-5 text-red-500" />
                          <h3 className="font-semibold text-foreground">
                            Zayıf Konular ({zayifKonular.length})
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {zayifKonular.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Zayıf konu yok! 🎉</p>
                          ) : (
                            zayifKonular.map((konu) => (
                              <div
                                key={konu.konu}
                                className="p-3 rounded-lg border border-border bg-red-500/5 hover:bg-red-500/10 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-foreground text-sm">{konu.konu}</span>
                                  <span className="text-xs font-bold text-red-500">
                                    %{konu.basariYuzdesi.toFixed(0)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="text-green-600">{konu.dogru}D</span>
                                  <span className="text-red-600">{konu.yanlis}Y</span>
                                  <span>/ {konu.toplamSoru} soru</span>
                                  <span>• {konu.denemeSayisi} deneme</span>
                                </div>
                                {/* Progress bar */}
                                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-red-500 transition-all"
                                    style={{ width: `${konu.basariYuzdesi}%` }}
                                  />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Güçlü Konular */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <h3 className="font-semibold text-foreground">
                            Güçlü Konular ({gucluKonular.length})
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {gucluKonular.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              Henüz güçlü konu yok, çalışmaya devam et! 💪
                            </p>
                          ) : (
                            gucluKonular
                              .sort((a, b) => b.basariYuzdesi - a.basariYuzdesi)
                              .map((konu) => (
                                <div
                                  key={konu.konu}
                                  className="p-3 rounded-lg border border-border bg-green-500/5 hover:bg-green-500/10 transition-colors"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-foreground text-sm">{konu.konu}</span>
                                    <span className="text-xs font-bold text-green-500">
                                      %{konu.basariYuzdesi.toFixed(0)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="text-green-600">{konu.dogru}D</span>
                                    <span className="text-red-600">{konu.yanlis}Y</span>
                                    <span>/ {konu.toplamSoru} soru</span>
                                    <span>• {konu.denemeSayisi} deneme</span>
                                  </div>
                                  {/* Progress bar */}
                                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500 transition-all"
                                      style={{ width: `${konu.basariYuzdesi}%` }}
                                    />
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tüm Konular */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="font-semibold text-foreground mb-3">Tüm Konular</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {ders.konular.map((konu) => (
                          <div
                            key={konu.konu}
                            className="p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-foreground truncate">{konu.konu}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {konu.dogru}/{konu.toplamSoru}
                                </span>
                                <span
                                  className="text-xs font-bold"
                                  style={{
                                    color: konu.basariYuzdesi >= 70
                                      ? '#10B981'
                                      : konu.basariYuzdesi >= 50
                                      ? '#F59E0B'
                                      : '#EF4444'
                                  }}
                                >
                                  %{konu.basariYuzdesi.toFixed(0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
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
                Konu bazında analiz için PDF karne yüklemeniz gerekiyor.
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
