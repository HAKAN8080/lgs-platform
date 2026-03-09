'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth, usePremium } from '@/contexts/auth-context'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, serverTimestamp, writeBatch, doc, query, where, getDocs } from 'firebase/firestore'
import {
  Plus,
  Save,
  Download,
  Upload,
  Loader2,
  CheckCircle,
  ArrowLeft,
  FileSpreadsheet,
  AlertCircle,
  X
} from 'lucide-react'
import Link from 'next/link'
import * as XLSX from 'xlsx'

const DERSLER = [
  { key: 'turkce', label: 'Türkçe', icon: '📖', max: 20, color: '#3B82F6' },
  { key: 'matematik', label: 'Matematik', icon: '🔢', max: 20, color: '#8B5CF6' },
  { key: 'fen', label: 'Fen Bilimleri', icon: '🔬', max: 20, color: '#10B981' },
  { key: 'inkilap', label: 'İnkılap Tarihi', icon: '📜', max: 10, color: '#F59E0B' },
  { key: 'din', label: 'Din Kültürü', icon: '🕌', max: 10, color: '#EC4899' },
  { key: 'ingilizce', label: 'İngilizce', icon: '🌍', max: 10, color: '#06B6D4' },
]

// LGS Katsayıları
const KATSAYILAR = {
  turkce: 4.349,
  matematik: 4.254,
  fen: 4.123,
  inkilap: 1.667,
  din: 1.899,
  ingilizce: 1.508,
}
const SABIT = 194.752

interface DersInput {
  dogru: number
  yanlis: number
}

interface UploadedDeneme {
  yayinAdi: string
  denemeAdi: string
  tarih: string
  dersler: Record<string, DersInput>
  netler: Record<string, number>
  toplamNet: number
  puan: number
}

interface UploadResult {
  success: number
  failed: number
  errors: string[]
}

const FREE_LIMIT = 5

export default function DenemeEklePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { isPremium } = usePremium()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tip, setTip] = useState<'deneme' | 'izleme'>('deneme')
  const [yayinAdi, setYayinAdi] = useState('')
  const [denemeAdi, setDenemeAdi] = useState('')
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0])
  const [dersler, setDersler] = useState<Record<string, DersInput>>(
    Object.fromEntries(DERSLER.map(d => [d.key, { dogru: 0, yanlis: 0 }]))
  )
  // İzleme için
  const [izlemeDers, setIzlemeDers] = useState<string>('turkce')
  const [izlemeSoruSayisi, setIzlemeSoruSayisi] = useState<number>(20)

  // İzleme dersi değişince soru sayısını o dersin max'ına otomatik sıfırla
  useEffect(() => {
    const dersMax = DERSLER.find(d => d.key === izlemeDers)?.max ?? 20
    setIzlemeSoruSayisi(dersMax)
    setDersler(prev => ({ ...prev, [izlemeDers]: { dogru: 0, yanlis: 0 } }))
  }, [izlemeDers])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [denemeCount, setDenemeCount] = useState(0)
  const [countLoading, setCountLoading] = useState(true)

  // CSV Upload state
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [previewData, setPreviewData] = useState<UploadedDeneme[] | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/giris')
    }
  }, [user, authLoading, router])

  // Deneme sayısını kontrol et
  useEffect(() => {
    const checkDenemeCount = async () => {
      if (!user || !db) {
        setCountLoading(false)
        return
      }

      try {
        const q = query(
          collection(db, 'denemeler'),
          where('userId', '==', user.uid)
        )
        const snapshot = await getDocs(q)
        setDenemeCount(snapshot.size)
      } catch (err) {
        console.error(err)
      } finally {
        setCountLoading(false)
      }
    }

    if (user) {
      checkDenemeCount()
    }
  }, [user])

  const isLimitReached = !isPremium && denemeCount >= FREE_LIMIT

  const handleDersChange = (ders: string, field: 'dogru' | 'yanlis', value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0)
    const maxValue = tip === 'izleme' ? izlemeSoruSayisi : (DERSLER.find(d => d.key === ders)?.max || 20)

    setDersler(prev => {
      const current = prev[ders]
      const otherField = field === 'dogru' ? 'yanlis' : 'dogru'
      const otherValue = current[otherField]
      const maxAllowed = maxValue - otherValue
      const clampedValue = Math.min(numValue, maxAllowed)

      return {
        ...prev,
        [ders]: {
          ...current,
          [field]: clampedValue
        }
      }
    })
  }

  // Net ve Puan Hesaplama
  const hesapla = () => {
    if (tip === 'izleme') {
      const { dogru, yanlis } = dersler[izlemeDers] ?? { dogru: 0, yanlis: 0 }
      const net = Math.max(0, dogru - yanlis / 3)
      const basariYuzde = izlemeSoruSayisi > 0 ? (net / izlemeSoruSayisi) * 100 : 0
      const netler: Record<string, number> = { [izlemeDers]: net }
      return { netler, toplamNet: net, puan: 0, basariYuzde }
    }
    let toplamNet = 0
    let puanKatkisi = 0
    const netler: Record<string, number> = {}
    for (const ders of DERSLER) {
      const { dogru, yanlis } = dersler[ders.key]
      const net = Math.max(0, dogru - yanlis / 3)
      netler[ders.key] = net
      toplamNet += net
      puanKatkisi += net * KATSAYILAR[ders.key as keyof typeof KATSAYILAR]
    }
    const puan = Math.min(500, Math.max(200, puanKatkisi + SABIT))
    return { netler, toplamNet, puan, basariYuzde: 0 }
  }

  const { netler, toplamNet, puan, basariYuzde } = hesapla()

  const handleSave = async () => {
    if (!user || !db) {
      setError('Giriş yapmalısınız')
      return
    }

    if (isLimitReached) {
      setError('Ücretsiz planda en fazla 5 deneme ekleyebilirsiniz. Premium\'a geçin!')
      return
    }

    if (!yayinAdi.trim() || !denemeAdi.trim()) {
      setError('Yayın adı ve deneme adı gerekli')
      return
    }

    setSaving(true)
    setError('')

    try {
      // DUPLIKASYON KONTROLÜ: Aynı yayın + deneme + tarih var mı?
      const dupCheckQuery = query(
        collection(db, 'denemeler'),
        where('userId', '==', user.uid),
        where('yayinAdi', '==', yayinAdi.trim()),
        where('denemeAdi', '==', denemeAdi.trim()),
        where('tarih', '==', tarih)
      )
      const dupSnapshot = await getDocs(dupCheckQuery)

      if (!dupSnapshot.empty) {
        setError(`Bu deneme zaten kayıtlı! "${yayinAdi.trim()} - ${denemeAdi.trim()}" (${new Date(tarih).toLocaleDateString('tr-TR')})`)
        setSaving(false)
        return
      }

      const denemeData: Record<string, unknown> = {
        userId: user.uid,
        tip: tip,
        yayinAdi: yayinAdi.trim(),
        denemeAdi: denemeAdi.trim(),
        tarih: tarih,
        dersler: dersler,
        netler: netler,
        toplamNet: toplamNet,
        puan: puan,
        createdAt: serverTimestamp(),
      }
      if (tip === 'izleme') {
        denemeData.soruSayisi = { [izlemeDers]: izlemeSoruSayisi }
      }

      console.log('Deneme kaydediliyor:', denemeData)
      const docRef = await addDoc(collection(db, 'denemeler'), denemeData)
      console.log('Deneme kaydedildi! ID:', docRef.id)

      setSaved(true)
      setTimeout(() => {
        router.push('/panel')
      }, 1500)
    } catch (err) {
      console.error('Kayıt hatası:', err)
      setError('Kayıt sırasında bir hata oluştu: ' + (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const downloadTemplate = () => {
    const headers = ['Yayın Adı', 'Deneme Adı', 'Tarih', 'Türkçe D', 'Türkçe Y', 'Matematik D', 'Matematik Y', 'Fen D', 'Fen Y', 'İnkılap D', 'İnkılap Y', 'Din D', 'Din Y', 'İngilizce D', 'İngilizce Y']
    const example1 = ['Özdebir', 'TG-5', '2025-03-01', 18, 2, 15, 3, 17, 1, 8, 1, 9, 0, 8, 1]
    const example2 = ['Nar', 'Deneme 3', '2025-03-05', 16, 4, 18, 2, 14, 4, 9, 1, 8, 2, 7, 2]

    const worksheet = XLSX.utils.aoa_to_sheet([headers, example1, example2])

    // Sütun genişliklerini ayarla
    worksheet['!cols'] = [
      { wch: 12 }, // Yayın Adı
      { wch: 12 }, // Deneme Adı
      { wch: 12 }, // Tarih
      { wch: 10 }, { wch: 10 }, // Türkçe
      { wch: 12 }, { wch: 12 }, // Matematik
      { wch: 8 }, { wch: 8 }, // Fen
      { wch: 10 }, { wch: 10 }, // İnkılap
      { wch: 8 }, { wch: 8 }, // Din
      { wch: 12 }, { wch: 12 }, // İngilizce
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Denemeler')

    XLSX.writeFile(workbook, 'deneme_sablonu.xlsx')
  }

  // Deneme verisi hesapla
  const calculateDenemeData = (derslerInput: Record<string, DersInput>): { netler: Record<string, number>, toplamNet: number, puan: number } => {
    let toplamNet = 0
    let puanKatkisi = 0
    const netler: Record<string, number> = {}

    for (const ders of DERSLER) {
      const { dogru, yanlis } = derslerInput[ders.key]
      const net = Math.max(0, dogru - yanlis / 3)
      netler[ders.key] = net
      toplamNet += net
      puanKatkisi += net * KATSAYILAR[ders.key as keyof typeof KATSAYILAR]
    }

    const puan = Math.min(500, Math.max(200, puanKatkisi + SABIT))
    return { netler, toplamNet, puan }
  }

  // Tarihi YYYY-MM-DD formatına çevir
  const formatDate = (value: any): string => {
    if (!value) return ''

    // Eğer zaten string ve doğru formatta ise
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value
    }

    // Excel tarih numarası ise
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value)
      if (date) {
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
      }
    }

    // String tarih formatlarını dene
    if (typeof value === 'string') {
      // GG.AA.YYYY veya GG/AA/YYYY formatı
      const dmyMatch = value.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/)
      if (dmyMatch) {
        return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`
      }
    }

    return ''
  }

  // Excel dosyasını parse et
  const parseExcelFile = (data: ArrayBuffer): { data: UploadedDeneme[], errors: string[] } => {
    const workbook = XLSX.read(data, { type: 'array', cellDates: true })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][]

    const errors: string[] = []
    const result: UploadedDeneme[] = []

    // İlk satır header, atla
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (!row || row.length === 0) continue

      const yayinAdi = String(row[0] || '').trim()
      const denemeAdi = String(row[1] || '').trim()
      const tarih = formatDate(row[2])

      if (!yayinAdi || !denemeAdi) {
        errors.push(`Satır ${i + 1}: Yayın adı veya deneme adı boş`)
        continue
      }

      if (!tarih) {
        errors.push(`Satır ${i + 1}: Geçersiz tarih`)
        continue
      }

      const derslerInput: Record<string, DersInput> = {}
      let hasError = false

      // Ders değerlerini parse et
      const dersMapping = [
        { key: 'turkce', dIdx: 3, yIdx: 4, max: 20 },
        { key: 'matematik', dIdx: 5, yIdx: 6, max: 20 },
        { key: 'fen', dIdx: 7, yIdx: 8, max: 20 },
        { key: 'inkilap', dIdx: 9, yIdx: 10, max: 10 },
        { key: 'din', dIdx: 11, yIdx: 12, max: 10 },
        { key: 'ingilizce', dIdx: 13, yIdx: 14, max: 10 },
      ]

      for (const mapping of dersMapping) {
        const dogru = parseInt(row[mapping.dIdx]) || 0
        const yanlis = parseInt(row[mapping.yIdx]) || 0

        if (dogru < 0 || yanlis < 0) {
          errors.push(`Satır ${i + 1}: Negatif değer`)
          hasError = true
          break
        }

        if (dogru + yanlis > mapping.max) {
          errors.push(`Satır ${i + 1}: Toplam max aşımı`)
          hasError = true
          break
        }

        derslerInput[mapping.key] = { dogru, yanlis }
      }

      if (hasError) continue

      const { netler, toplamNet, puan } = calculateDenemeData(derslerInput)

      result.push({
        yayinAdi,
        denemeAdi,
        tarih,
        dersler: derslerInput,
        netler,
        toplamNet,
        puan
      })
    }

    return { data: result, errors }
  }

  // Dosya yükleme handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setUploadResult(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const { data, errors } = parseExcelFile(arrayBuffer)

        if (data.length === 0) {
          setError('Geçerli deneme verisi bulunamadı')
          if (errors.length > 0) {
            setError(`Hatalar: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`)
          }
          return
        }

        setPreviewData(data)
        if (errors.length > 0) {
          setError(`${errors.length} satırda hata var, ${data.length} deneme yüklenebilir`)
        }
      } catch (err) {
        console.error(err)
        setError('Excel dosyası okunamadı')
      }
    }

    reader.onerror = () => {
      setError('Dosya okuma hatası')
    }

    reader.readAsArrayBuffer(file)

    // Input'u sıfırla (aynı dosya tekrar seçilebilsin)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Toplu kaydetme
  const handleBulkSave = async () => {
    if (!user || !db || !previewData || previewData.length === 0) return

    // Limit kontrolü
    if (!isPremium) {
      const remaining = FREE_LIMIT - denemeCount
      if (remaining <= 0) {
        setError('Ücretsiz planda en fazla 5 deneme ekleyebilirsiniz. Premium\'a geçin!')
        return
      }
      if (previewData.length > remaining) {
        setError(`Ücretsiz planda ${remaining} deneme daha ekleyebilirsiniz. Fazla olanlar kaydedilmeyecek.`)
      }
    }

    setUploading(true)
    setError('')

    try {
      const batch = writeBatch(db)
      const denemelerRef = collection(db, 'denemeler')

      // Free kullanıcılar için limit uygula
      const dataToSave = isPremium ? previewData : previewData.slice(0, FREE_LIMIT - denemeCount)

      for (const deneme of dataToSave) {
        const docRef = doc(denemelerRef)
        batch.set(docRef, {
          userId: user.uid,
          yayinAdi: deneme.yayinAdi,
          denemeAdi: deneme.denemeAdi,
          tarih: deneme.tarih,
          dersler: deneme.dersler,
          netler: deneme.netler,
          toplamNet: deneme.toplamNet,
          puan: deneme.puan,
          createdAt: serverTimestamp(),
        })
      }

      await batch.commit()

      setUploadResult({
        success: dataToSave.length,
        failed: previewData.length - dataToSave.length,
        errors: []
      })
      setPreviewData(null)

      // 2 saniye sonra panele yönlendir
      setTimeout(() => {
        router.push('/panel')
      }, 2000)
    } catch (err) {
      console.error(err)
      setError('Toplu kayıt sırasında hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  // Preview'ı iptal et
  const cancelPreview = () => {
    setPreviewData(null)
    setError('')
    setUploadResult(null)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Deneme Kaydedildi!</h2>
          <p className="text-muted-foreground mt-2">Panele yönlendiriliyorsunuz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/panel">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Deneme Ekle</h1>
            <p className="text-muted-foreground">Yeni deneme sonucu gir</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tip Seçici */}
            <div className="flex gap-2 p-1 bg-muted rounded-xl w-fit">
              {(['deneme', 'izleme'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTip(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    tip === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'deneme' ? '📋 Deneme' : '🎯 İzleme'}
                </button>
              ))}
            </div>
            {tip === 'izleme' && (
              <div className="text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                İzleme sınavları tek/çift dersli olup LGS puanı hesaplanmaz. Başarı % gösterilir.
              </div>
            )}

            {/* Deneme Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle>{tip === 'izleme' ? 'İzleme Bilgileri' : 'Deneme Bilgileri'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Yayın Adı</label>
                    <Input
                      placeholder="Özdebir, Nar, 345..."
                      value={yayinAdi}
                      onChange={(e) => setYayinAdi(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Deneme Adı</label>
                    <Input
                      placeholder="TG-5, Deneme 3..."
                      value={denemeAdi}
                      onChange={(e) => setDenemeAdi(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tarih</label>
                  <Input
                    type="date"
                    value={tarih}
                    onChange={(e) => setTarih(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ders Netleri */}
            <Card>
              <CardHeader>
                <CardTitle>Doğru / Yanlış</CardTitle>
                <CardDescription>
                  {tip === 'izleme'
                    ? 'Hangi ders, kaç soru — doğru/yanlış girin'
                    : 'Her ders için doğru ve yanlış sayısını girin'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tip === 'izleme' ? (
                  /* ── İZLEME MODU ── */
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Ders</label>
                        <select
                          value={izlemeDers}
                          onChange={e => setIzlemeDers(e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                          {DERSLER.map(d => (
                            <option key={d.key} value={d.key}>{d.icon} {d.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Toplam Soru Sayısı</label>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          value={izlemeSoruSayisi}
                          onChange={e => setIzlemeSoruSayisi(Math.max(1, parseInt(e.target.value) || 1))}
                          className="text-center"
                        />
                      </div>
                    </div>
                    {(() => {
                      const ders = DERSLER.find(d => d.key === izlemeDers)!
                      const net = netler[izlemeDers] || 0
                      return (
                        <div className="grid grid-cols-5 gap-2 items-center p-3 bg-muted/40 rounded-xl">
                          <div className="col-span-2 flex items-center gap-2">
                            <span className="text-xl">{ders.icon}</span>
                            <span className="font-semibold text-foreground">{ders.label}</span>
                          </div>
                          <Input
                            type="number"
                            min={0}
                            max={izlemeSoruSayisi}
                            value={dersler[izlemeDers].dogru || ''}
                            onChange={e => handleDersChange(izlemeDers, 'dogru', e.target.value)}
                            className="text-center h-10 bg-green-500/5 border-green-500/30"
                            placeholder="Doğru"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={izlemeSoruSayisi - dersler[izlemeDers].dogru}
                            value={dersler[izlemeDers].yanlis || ''}
                            onChange={e => handleDersChange(izlemeDers, 'yanlis', e.target.value)}
                            className="text-center h-10 bg-red-500/5 border-red-500/30"
                            placeholder="Yanlış"
                          />
                          <div className="text-center">
                            <span className="text-sm font-bold" style={{ color: ders.color }}>
                              {net.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                ) : (
                  /* ── DENEME MODU ── */
                  <>
                    <div className="grid grid-cols-5 gap-2 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <div className="col-span-2">Ders</div>
                      <div className="text-center">Doğru</div>
                      <div className="text-center">Yanlış</div>
                      <div className="text-center">Net</div>
                    </div>
                    <div className="space-y-3">
                      {DERSLER.map((ders) => {
                        const net = netler[ders.key] || 0
                        return (
                          <div key={ders.key} className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-2 flex items-center gap-2">
                              <span className="text-lg">{ders.icon}</span>
                              <div>
                                <span className="font-medium text-foreground text-sm">{ders.label}</span>
                                <span className="text-xs text-muted-foreground ml-1">({ders.max})</span>
                              </div>
                            </div>
                            <Input
                              type="number" min={0} max={ders.max}
                              value={dersler[ders.key].dogru || ''}
                              onChange={e => handleDersChange(ders.key, 'dogru', e.target.value)}
                              className="text-center h-10 bg-green-500/5 border-green-500/30 focus:border-green-500"
                              placeholder="0"
                            />
                            <Input
                              type="number" min={0} max={ders.max - dersler[ders.key].dogru}
                              value={dersler[ders.key].yanlis || ''}
                              onChange={e => handleDersChange(ders.key, 'yanlis', e.target.value)}
                              className="text-center h-10 bg-red-500/5 border-red-500/30 focus:border-red-500"
                              placeholder="0"
                            />
                            <div className="text-center">
                              <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md text-sm font-bold"
                                style={{ backgroundColor: `${ders.color}15`, color: ders.color }}>
                                {net.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Kaydet
              </Button>
            </div>
          </div>

          {/* Sidebar - Sonuç ve Şablon */}
          <div className="space-y-6">
            {/* Sonuç */}
            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Hesaplanan Sonuç</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tip === 'izleme' ? (
                  <>
                    <div className="text-center p-4 rounded-lg bg-background/60">
                      <div className="text-xs text-muted-foreground uppercase mb-1">Net</div>
                      <div className="text-3xl font-black text-primary">{toplamNet.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">/ {izlemeSoruSayisi} soru</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background/60">
                      <div className="text-xs text-muted-foreground uppercase mb-1">Başarı %</div>
                      <div className="text-4xl font-black text-emerald-500">%{basariYuzde.toFixed(1)}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center p-4 rounded-lg bg-background/60">
                      <div className="text-xs text-muted-foreground uppercase mb-1">Toplam Net</div>
                      <div className="text-3xl font-black text-primary">{toplamNet.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">/ 90</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background/60">
                      <div className="text-xs text-muted-foreground uppercase mb-1">LGS Puan</div>
                      <div className="text-4xl font-black text-green-500">{puan.toFixed(2)}</div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Şablon ve Yükleme */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Toplu Yükleme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Birden fazla deneme eklemek için şablonu indir, doldur ve yükle.
                </p>
                <Button variant="outline" onClick={downloadTemplate} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Şablonu İndir
                </Button>

                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Excel Yükle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CSV Preview Modal */}
        {previewData && previewData.length > 0 && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Yüklenecek Denemeler</CardTitle>
                  <CardDescription>{previewData.length} deneme bulundu</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={cancelPreview}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[60vh]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2">Yayın</th>
                      <th className="text-left py-2 px-2">Deneme</th>
                      <th className="text-left py-2 px-2">Tarih</th>
                      <th className="text-center py-2 px-2">Net</th>
                      <th className="text-center py-2 px-2">Puan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((deneme, idx) => (
                      <tr key={idx} className="border-b border-border/50">
                        <td className="py-2 px-2">{deneme.yayinAdi}</td>
                        <td className="py-2 px-2">{deneme.denemeAdi}</td>
                        <td className="py-2 px-2">{deneme.tarih}</td>
                        <td className="text-center py-2 px-2 font-medium text-primary">
                          {deneme.toplamNet.toFixed(2)}
                        </td>
                        <td className="text-center py-2 px-2 font-bold text-green-500">
                          {deneme.puan.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
              <div className="p-4 border-t border-border flex gap-3">
                <Button variant="outline" onClick={cancelPreview} className="flex-1">
                  İptal
                </Button>
                <Button onClick={handleBulkSave} disabled={uploading} className="flex-1">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {previewData.length} Deneme Kaydet
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Upload Success */}
        {uploadResult && uploadResult.success > 0 && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground">
                  {uploadResult.success} Deneme Kaydedildi!
                </h2>
                <p className="text-muted-foreground mt-2">Panele yönlendiriliyorsunuz...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
