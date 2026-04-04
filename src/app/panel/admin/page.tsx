'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import {
  createLicense,
  getAllLicenses,
  isAdmin,
  type License,
} from '@/lib/firebase/license'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore'
import { LGS_COEFFICIENTS, LGS_CONSTANT } from '@/lib/calculations/lgs-score'
import {
  Key,
  Loader2,
  Plus,
  Copy,
  Check,
  Shield,
  AlertTriangle,
  User,
  Calendar,
  RefreshCw,
  Calculator,
} from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [licenses, setLicenses] = useState<License[]>([])
  const [loadingLicenses, setLoadingLicenses] = useState(true)
  const [creating, setCreating] = useState(false)
  const [note, setNote] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  // Puan migration state
  const [migrationLoading, setMigrationLoading] = useState(false)
  const [migrationResult, setMigrationResult] = useState<{ success: boolean; message: string; count?: number } | null>(null)

  // Admin kontrolü
  const userIsAdmin = isAdmin(user?.email || null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/giris')
    }
  }, [user, loading, router])

  // Lisansları yükle
  useEffect(() => {
    const loadLicenses = async () => {
      if (!userIsAdmin) return
      setLoadingLicenses(true)
      const data = await getAllLicenses()
      setLicenses(data)
      setLoadingLicenses(false)
    }

    if (user && userIsAdmin) {
      loadLicenses()
    }
  }, [user, userIsAdmin])

  // Yeni lisans oluştur
  const handleCreateLicense = async () => {
    setCreating(true)
    setMessage(null)
    const result = await createLicense('premium', note)
    if (result.success && result.code) {
      setMessage({ type: 'success', text: `Lisans oluşturuldu: ${result.code}` })
      setNote('')
      // Listeyi yenile
      const data = await getAllLicenses()
      setLicenses(data)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setCreating(false)
  }

  // Kodu kopyala
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Tüm denemelerin puanlarını 2025 katsayılarıyla yeniden hesapla
  const handleRecalculateScores = async () => {
    if (!db) return

    const confirmed = confirm(
      'Tüm denemelerin puanları 2025 LGS katsayılarıyla yeniden hesaplanacak. Devam etmek istiyor musunuz?'
    )
    if (!confirmed) return

    setMigrationLoading(true)
    setMigrationResult(null)

    try {
      const denemelerRef = collection(db, 'denemeler')
      const snapshot = await getDocs(denemelerRef)

      let updatedCount = 0
      const batch = writeBatch(db)

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data()
        const netler = data.netler as Record<string, number> | undefined

        if (!netler) return

        // Yeni puanı hesapla
        let puanKatkisi = 0
        for (const [ders, net] of Object.entries(netler)) {
          const coef = LGS_COEFFICIENTS[ders as keyof typeof LGS_COEFFICIENTS]
          if (coef) {
            puanKatkisi += net * coef
          }
        }
        const yeniPuan = Math.min(500, Math.max(200, puanKatkisi + LGS_CONSTANT))

        // Batch update
        batch.update(doc(db!, 'denemeler', docSnap.id), { puan: yeniPuan })
        updatedCount++
      })

      await batch.commit()

      setMigrationResult({
        success: true,
        message: `${updatedCount} denemenin puanı başarıyla güncellendi!`,
        count: updatedCount
      })
    } catch (error) {
      console.error('Migration hatası:', error)
      setMigrationResult({
        success: false,
        message: 'Güncelleme sırasında bir hata oluştu.'
      })
    } finally {
      setMigrationLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Admin değilse erişim engelle
  if (!userIsAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Erişim Engellendi</h2>
            <p className="text-muted-foreground mb-4">
              Bu sayfaya erişim yetkiniz bulunmamaktadır.
            </p>
            <Button onClick={() => router.push('/panel')}>Panele Dön</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const usedCount = licenses.filter(l => l.used).length
  const unusedCount = licenses.filter(l => !l.used).length

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">Lisans kodu yönetimi</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-foreground">{licenses.length}</div>
              <div className="text-sm text-muted-foreground">Toplam Lisans</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-500">{unusedCount}</div>
              <div className="text-sm text-muted-foreground">Kullanılmamış</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-500">{usedCount}</div>
              <div className="text-sm text-muted-foreground">Kullanılmış</div>
            </CardContent>
          </Card>
        </div>

        {/* Puan Güncelleme */}
        <Card className="mb-8 border-orange-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-orange-500" />
              Puan Hesaplama Güncelleme
            </CardTitle>
            <CardDescription>
              Tüm denemelerin puanlarını 2025 LGS katsayılarıyla yeniden hesapla
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-4">
              <p className="text-sm text-orange-500">
                <strong>MEB Resmi Katsayıları:</strong> Türkçe: 4.348, Matematik: 4.2538, Fen: 4.123, İnkılap: 1.666, Din: 1.899, İngilizce: 1.5075 | Sabit: 194.75
              </p>
            </div>
            <Button
              onClick={handleRecalculateScores}
              disabled={migrationLoading}
              variant="outline"
              className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
            >
              {migrationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Tüm Puanları Yeniden Hesapla
            </Button>
            {migrationResult && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                migrationResult.success
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {migrationResult.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Yeni Lisans Oluştur */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Yeni Lisans Oluştur
            </CardTitle>
            <CardDescription>
              Satış sonrası müşteriye gönderilecek lisans kodu oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Not (opsiyonel, örn: müşteri adı)"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <Button onClick={handleCreateLicense} disabled={creating}>
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Oluştur
              </Button>
            </div>
            {message && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {message.text}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lisans Listesi */}
        <Card>
          <CardHeader>
            <CardTitle>Lisans Kodları</CardTitle>
            <CardDescription>
              Tüm lisans kodları ve durumları
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLicenses ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : licenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Henüz lisans kodu oluşturulmamış
              </div>
            ) : (
              <div className="space-y-3">
                {licenses.map((license) => (
                  <div
                    key={license.code}
                    className={`p-4 rounded-lg border ${
                      license.used
                        ? 'border-blue-500/30 bg-blue-500/5'
                        : 'border-green-500/30 bg-green-500/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <code className="font-mono text-lg font-bold text-foreground">
                          {license.code}
                        </code>
                        <button
                          onClick={() => handleCopy(license.code)}
                          className="p-1.5 rounded hover:bg-accent transition-colors"
                          title="Kopyala"
                        >
                          {copiedCode === license.code ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          license.used
                            ? 'bg-blue-500/20 text-blue-500'
                            : 'bg-green-500/20 text-green-500'
                        }`}>
                          {license.used ? 'Kullanıldı' : 'Aktif'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {license.createdAt instanceof Date
                          ? license.createdAt.toLocaleDateString('tr-TR')
                          : 'Tarih yok'}
                      </span>
                      {license.used && license.usedByEmail && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {license.usedByEmail}
                        </span>
                      )}
                      {license.note && (
                        <span className="text-foreground/70">
                          Not: {license.note}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
