'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth, usePremium } from '@/contexts/auth-context'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import {
  Upload,
  Loader2,
  CheckCircle,
  ArrowLeft,
  FileText,
  AlertCircle,
  X
} from 'lucide-react'
import Link from 'next/link'
import { LGS_QUESTION_DISTRIBUTION } from '@/lib/constants/question-distribution'

const DERSLER = [
  { key: 'turkce', label: 'Türkçe', aliases: ['TÜRKÇE', 'TÜR'] },
  { key: 'matematik', label: 'Matematik', aliases: ['MATEMATİK', 'MAT'] },
  { key: 'fen', label: 'Fen Bilimleri', aliases: ['FEN BİLİMLERİ', 'FEN', 'FEN BİLGİSİ'] },
  { key: 'inkilap', label: 'İnkılap Tarihi', aliases: ['İNK.', 'İNK', 'İNKILAP', 'TARİH', 'SOSYAL', 'SOSYAL BİLGİLER', 'T.C.'] },
  { key: 'din', label: 'Din Kültürü', aliases: ['DİN KÜLTÜRÜ', 'DİN', 'DİN K'] },
  { key: 'ingilizce', label: 'İngilizce', aliases: ['İNGİLİZCE', 'İNG', 'YABANCI DİL'] },
]

// Ders key'ini subject name'e map etme
const DERS_TO_SUBJECT_MAP: Record<string, string> = {
  turkce: 'Türkçe',
  matematik: 'Matematik',
  fen: 'Fen Bilimleri',
  inkilap: 'T.C. İnkılap Tarihi',
  din: 'Din Kültürü',
  ingilizce: 'İngilizce',
}

interface KonuAnalizi {
  konu: string
  soruSayisi: number
  dogru: number
  yanlis: number
  basariYuzdesi: number
}

interface DersAnalizi {
  ders: string
  soruSayisi: number
  dogru: number
  yanlis: number
  net: number
  konular: KonuAnalizi[]
}

interface ParsedKarne {
  sinavAdi: string
  tarih: string
  puan: number
  dersler: DersAnalizi[]
  format: 'form_akademi' | 'ucdortbes' | 'hiz' | 'unknown'
}

export default function KarneEklePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { isPremium } = usePremium()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [parsedData, setParsedData] = useState<ParsedKarne | null>(null)
  const [pdfText, setPdfText] = useState('')
  const [denemeCount, setDenemeCount] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/giris')
    }
  }, [user, authLoading, router])

  // Deneme sayısını kontrol et
  useEffect(() => {
    const fetchDenemeCount = async () => {
      if (!user || !db) return

      try {
        const q = query(collection(db, 'denemeler'), where('userId', '==', user.uid))
        const snapshot = await getDocs(q)
        setDenemeCount(snapshot.size)
      } catch (err) {
        console.error('Deneme sayısı alınamadı:', err)
      }
    }

    if (user) {
      fetchDenemeCount()
    }
  }, [user])

  // PDF'den metin çıkar
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Legacy build kullan (browser-only, canvas gerektirmez)
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js')

      // Local worker kullan
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

      const arrayBuffer = await file.arrayBuffer()

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer)
      })

      const pdf = await loadingTask.promise
      console.log('PDF loaded, pages:', pdf.numPages)

      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n'
      }

      console.log('PDF text extracted, length:', fullText.length)
      return fullText
    } catch (err) {
      console.error('PDF extraction error:', err)
      throw err
    }
  }

  // Formatı tespit et
  const detectFormat = (text: string): 'form_akademi' | 'ucdortbes' | 'hiz' | 'unknown' => {
    // Form Akademi: Tablo formatı + "DERSLERE VE KONULARA GÖRE" + "SORU SAYISI" + "DOĞRU CEVAP"
    if ((text.includes('DERSLERE VE KONULARA GÖRE SINAV ANALİZİ') || text.includes('FORM AKADEMİ')) &&
        text.includes('SORU SAYISI') && text.includes('DOĞRU CEVAP')) {
      return 'form_akademi'
    }
    if (text.includes('HIZ') && text.includes('DERS ANALİZİ')) {
      return 'hiz'
    }
    if (text.includes('ÜÇDÖRTBEŞ') || text.includes('345')) {
      return 'ucdortbes'
    }
    if (text.includes('DC ÖC SN') || text.includes('KONU ANALİZİ')) {
      return 'hiz'
    }
    return 'unknown'
  }

  // Ders netlerini parse et
  const parseDersNetleri = (text: string, format?: string): { ders: string, dogru: number, yanlis: number, net: number }[] => {
    const results: { ders: string, dogru: number, yanlis: number, net: number }[] = []

    // FORM AKADEMİ Formatı: Tablo şeklinde
    if (format === 'form_akademi') {
      console.log('Form Akademi formatı tespit edildi, tablo parsing yapılıyor...')

      // PDF'den DOĞRU CEVAP ve YANLIŞ CEVAP bölümlerini bul
      const dogruIndex = text.indexOf('DOĞRU CEVAP')
      const yanlisIndex = text.indexOf('YANLIŞ CEVAP')

      if (dogruIndex !== -1) {
        console.log('DOĞRU CEVAP bölümü (100 karakter):', text.substring(dogruIndex, dogruIndex + 100))
      }
      if (yanlisIndex !== -1) {
        console.log('YANLIŞ CEVAP bölümü (100 karakter):', text.substring(yanlisIndex, yanlisIndex + 100))
      }

      // Daha esnek regex - farklı whitespace türlerini kabul et
      const dogruMatch = text.match(/DOĞRU\s+CEVAP\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i)
      // YANLIŞ CEVAP satırını bul
      const yanlisMatch = text.match(/YANLIŞ\s+CEVAP\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i)

      console.log('dogruMatch:', dogruMatch ? 'BULUNDU' : 'BULUNAMADI')
      console.log('yanlisMatch:', yanlisMatch ? 'BULUNDU' : 'BULUNAMADI')

      if (dogruMatch && yanlisMatch) {
        // Dersler sırası: TÜRKÇE, MATEMATİK, DİN KÜLTÜRÜ, FEN BİLGİSİ, SOSYAL BİLGİLER, YABANCI DİL
        const dersler = ['turkce', 'matematik', 'din', 'fen', 'inkilap', 'ingilizce']
        const dersLabels = ['TÜRKÇE', 'MATEMATİK', 'DİN KÜLTÜRÜ', 'FEN BİLGİSİ', 'SOSYAL BİLGİLER', 'YABANCI DİL']

        for (let i = 0; i < 6; i++) {
          const dogru = parseInt(dogruMatch[i + 1]) || 0
          const yanlis = parseInt(yanlisMatch[i + 1]) || 0
          const net = dogru - yanlis / 3

          console.log(`Form Akademi: ${dersLabels[i]} → D:${dogru} Y:${yanlis} N:${net.toFixed(2)}`)

          results.push({
            ders: dersler[i],
            dogru,
            yanlis,
            net
          })
        }
      }

      return results
    }

    // HIZ Formatı: "TÜRKÇE 8.SINIF   20   20   0   0   20,00   11,63"
    // Format: Ders Adı | Soru Sayısı | Doğru | Yanlış | Boş | Net | Genel Ort
    // Tüm olası ders adı varyasyonlarını yakala
    const hizPattern = /(?:TÜRKÇE|MATEMATİK|FEN BİLİMLERİ|FEN|İNK\.|İNKILAP|T\.C\.|DİN KÜLTÜRÜ|DİN|İNGİLİZCE|SOSYAL)\s*(?:8\.SINIF|VE ATATÜRKÇÜLÜK|KÜLTÜRÜ|BİLİMLERİ)?[^\d]*?(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+[,.]?\d*)/gi

    let match
    while ((match = hizPattern.exec(text)) !== null) {
      const dersAdiRaw = text.substring(match.index, match.index + 50).split(/\s+\d/)[0].trim()
      const dersAdi = dersAdiRaw.toUpperCase()
      const soruSayisi = parseInt(match[1]) || 0
      const dogru = parseInt(match[2]) || 0
      const yanlis = parseInt(match[3]) || 0
      const net = parseFloat(match[5].replace(',', '.')) || (dogru - yanlis / 3)

      console.log('HIZ ders bulundu:', { dersAdiRaw, dersAdi, soruSayisi, dogru, yanlis, net })

      // Ders adını normalize et - Önce en spesifik eşleşmeleri kontrol et
      let normalizedDers = ''

      // Tam eşleşme için önce kontrol et
      if (dersAdi.includes('DİN KÜLTÜRÜ') || dersAdi.includes('DİN')) {
        normalizedDers = 'din'
      } else if (dersAdi.includes('İNK.') || dersAdi.includes('İNKILAP') || dersAdi.includes('ATATÜRKÇÜLÜK')) {
        normalizedDers = 'inkilap'
      } else if (dersAdi.includes('FEN BİLİMLERİ') || dersAdi.includes('FEN')) {
        normalizedDers = 'fen'
      } else if (dersAdi.includes('MATEMATİK')) {
        normalizedDers = 'matematik'
      } else if (dersAdi.includes('İNGİLİZCE')) {
        normalizedDers = 'ingilizce'
      } else if (dersAdi.includes('TÜRKÇE')) {
        normalizedDers = 'turkce'
      }

      if (normalizedDers) {
        console.log(`  → "${dersAdi}" mapped to "${normalizedDers}"`)
      } else {
        console.warn(`  ⚠️ Ders adı eşleştirilemedi: "${dersAdi}"`)
      }

      if (normalizedDers && !results.find(r => r.ders === normalizedDers)) {
        results.push({
          ders: normalizedDers,
          dogru,
          yanlis,
          net
        })
      }
    }

    // Eğer HIZ formatı çalışmadıysa diğer formatları dene
    if (results.length === 0) {
      const patterns = [
        // Format: TÜRKÇE 20 16 4 ... 14,67
        /(?:TÜRKÇE|MATEMATİK|FEN|DİN|İNGİLİZCE|İNK|SOSYAL)[^\d]*(\d+)\s+(\d+)\s+(\d+)\s+(?:\d+\s+)?(\d+[,.]?\d*)/gi,
        // Format: Türkçe 20 20 0 20,00
        /(Türkçe|Matematik|Fen|Din|İngilizce|Tarih)[^\d]*(\d+)\s+(\d+)\s+(\d+)\s+(?:\d+\s+)?(\d+[,.]?\d*)/gi,
      ]

      for (const pattern of patterns) {
        let match
        while ((match = pattern.exec(text)) !== null) {
          const dersAdi = match[1].toUpperCase()
          const dogru = parseInt(match[2]) || parseInt(match[3])
          const yanlis = parseInt(match[3]) || parseInt(match[4])

          // Ders adını normalize et
          let normalizedDers = ''
          for (const ders of DERSLER) {
            if (ders.aliases.some(alias => dersAdi.includes(alias))) {
              normalizedDers = ders.key
              break
            }
          }

          if (normalizedDers && !results.find(r => r.ders === normalizedDers)) {
            results.push({
              ders: normalizedDers,
              dogru,
              yanlis,
              net: dogru - yanlis / 3
            })
          }
        }
      }
    }

    return results
  }

  // LGS katsayıları
  const LGS_KATSAYILAR = {
    turkce: 4.349,
    matematik: 4.254,
    fen: 4.123,
    inkilap: 1.667,
    din: 1.899,
    ingilizce: 1.508,
  }
  const LGS_SABIT = 194.752

  // Puanı parse et veya hesapla
  const parsePuan = (text: string, dersNetleri: { ders: string, net: number }[]): number => {
    // Önce PDF'den LGS puanını bulmayı dene
    const puanMatch = text.match(/(?:PUAN|LGS Puanı)[:\s]*(\d{3}[,.]?\d*)/i)
    if (puanMatch) {
      const puan = parseFloat(puanMatch[1].replace(',', '.'))
      // Makul aralıkta mı kontrol et (200-500)
      if (puan >= 200 && puan <= 500) {
        return puan
      }
    }

    // Bulunamadıysa netlerden hesapla
    let puanKatkisi = 0
    for (const dn of dersNetleri) {
      const katsayi = LGS_KATSAYILAR[dn.ders as keyof typeof LGS_KATSAYILAR]
      if (katsayi) {
        puanKatkisi += dn.net * katsayi
      }
    }

    const hesaplananPuan = Math.min(500, Math.max(200, puanKatkisi + LGS_SABIT))
    return hesaplananPuan
  }

  // Sınav adını parse et
  const parseSinavAdi = (text: string): string => {
    const patterns = [
      /Sınav Adı[:\s]+([^\n]+?)(?:\s+DERS|\s+Ders|$)/i,
      /SINAV ADI[:\s]+([^\n]+?)(?:\s+DERS|\s+Ders|$)/i,
      /(HIZ[^\n]+?SINAVI[^\d]+\d+)/i,
      /(TÜRKİYE GENELİ[^\n]+?DENEME[^\d]+\d+)/i,
      /(LGS[^\n]*DENEME[^\d]+\d+)/i,
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        let sinavAdi = match[1].trim()
        // "DERS ANALİZİ" gibi kısımları temizle
        sinavAdi = sinavAdi.replace(/\s+DERS\s+ANALİZİ.*$/i, '')
        sinavAdi = sinavAdi.replace(/\s+Ders\s+Soru.*$/i, '')
        return sinavAdi.slice(0, 100)
      }
    }
    return 'Bilinmeyen Sınav'
  }

  // Tarihi parse et
  const parseTarih = (text: string): string => {
    const patterns = [
      /(\d{1,2}[./]\d{1,2}[./]\d{4})/,
      /(\d{4}-\d{2}-\d{2})/,
      /Sınav Tarihi[:\s]+(\d{1,2}[./]\d{1,2}[./]\d{4})/i,
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        // YYYY-MM-DD formatına çevir
        const dateStr = match[1]
        if (dateStr.includes('-')) {
          return dateStr
        }
        const parts = dateStr.split(/[./]/)
        if (parts.length === 3) {
          const [day, month, year] = parts
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
      }
    }
    return new Date().toISOString().split('T')[0]
  }

  // Konu bazında parsing yap
  const parseKonularFromText = (text: string, dersKey: string): KonuAnalizi[] => {
    const subjectName = DERS_TO_SUBJECT_MAP[dersKey]
    const subjectData = LGS_QUESTION_DISTRIBUTION.find(s => s.subject === subjectName)
    if (!subjectData) return []

    const konular: KonuAnalizi[] = []

    // Her konu için PDF'de ara
    for (const topicData of subjectData.topics) {
      const topic = topicData.topic

      // Konu adını normalize et (türkçe karakterler, boşluklar vs)
      const normalizedTopic = topic
        .toUpperCase()
        .replace(/İ/g, 'I')
        .replace(/Ş/g, 'S')
        .replace(/Ğ/g, 'G')
        .replace(/Ü/g, 'U')
        .replace(/Ö/g, 'O')
        .replace(/Ç/g, 'C')

      // PDF'de konu adını ara - farklı formatlar için
      // Format 1: "Üslü İfadeler 2 1 1" (SS D Y formatı)
      // Format 2: "Üslü İfadeler D:2 Y:1"
      // Format 3: Tablo formatı

      const patterns = [
        // Pattern 1: Konu adı + sayılar (SS D Y veya D Y)
        new RegExp(`${normalizedTopic}[^\\d]*(\\d+)\\s+(\\d+)\\s+(\\d+)`, 'i'),
        // Pattern 2: Sadece D Y (2 sayı)
        new RegExp(`${normalizedTopic}[^\\d]*(\\d+)\\s+(\\d+)(?!\\d)`, 'i'),
      ]

      for (const pattern of patterns) {
        const match = text.match(pattern)
        if (match) {
          let dogru = 0
          let yanlis = 0

          if (match.length === 4) {
            // SS D Y formatı
            dogru = parseInt(match[2]) || 0
            yanlis = parseInt(match[3]) || 0
          } else if (match.length === 3) {
            // D Y formatı
            dogru = parseInt(match[1]) || 0
            yanlis = parseInt(match[2]) || 0
          }

          const soruSayisi = dogru + yanlis
          if (soruSayisi > 0) {
            konular.push({
              konu: topic,
              soruSayisi,
              dogru,
              yanlis,
              basariYuzdesi: soruSayisi > 0 ? (dogru / soruSayisi) * 100 : 0
            })
            break // Bu konu için eşleşme bulundu, diğer pattern'lere gerek yok
          }
        }
      }
    }

    return konular
  }

  // Konu analizini parse et
  const parseKonuAnalizi = (text: string, format: string): DersAnalizi[] => {
    const dersNetleri = parseDersNetleri(text, format)

    return dersNetleri.map(dn => {
      const konular = parseKonularFromText(text, dn.ders)

      return {
        ders: dn.ders,
        soruSayisi: dn.ders === 'turkce' || dn.ders === 'matematik' || dn.ders === 'fen' ? 20 : 10,
        dogru: dn.dogru,
        yanlis: dn.yanlis,
        net: dn.net,
        konular
      }
    })
  }

  // PDF yükleme handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Lütfen PDF dosyası yükleyin')
      return
    }

    setError('')
    setParsedData(null)
    setParsing(true)

    try {
      console.log('PDF yükleniyor:', file.name, file.size)
      const text = await extractTextFromPDF(file)
      console.log('Extracted text preview:', text.slice(0, 500))
      setPdfText(text)

      if (!text || text.trim().length < 50) {
        setError('PDF içeriği okunamadı veya boş')
        return
      }

      const format = detectFormat(text)
      console.log('Detected format:', format)

      const sinavAdi = parseSinavAdi(text)
      const tarih = parseTarih(text)
      const dersler = parseKonuAnalizi(text, format)

      // Dersler parse edildikten sonra puan hesapla
      const dersNetleri = parseDersNetleri(text, format)
      const puan = parsePuan(text, dersNetleri)

      console.log('Parsed data:', { sinavAdi, tarih, puan, derslerCount: dersler.length, dersNetleriCount: dersNetleri.length })

      setParsedData({
        sinavAdi,
        tarih,
        puan,
        dersler,
        format
      })
    } catch (err: any) {
      console.error('PDF parse hatası:', err)
      setError(`PDF okunamadı: ${err.message || 'Bilinmeyen hata'}`)
    } finally {
      setParsing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Kaydet
  const handleSave = async () => {
    if (!user || !db || !parsedData) return

    setUploading(true)
    setError('')

    try {
      // Yayın adını parse et
      const sinavParts = parsedData.sinavAdi.split(' ')
      const yayinAdi = sinavParts[0] || 'Bilinmeyen'
      const denemeAdi = sinavParts.slice(1).join(' ') || parsedData.sinavAdi

      // DUPLIKASYON KONTROLÜ: Aynı yayın + deneme + tarih var mı?
      const dupCheckQuery = query(
        collection(db, 'denemeler'),
        where('userId', '==', user.uid),
        where('yayinAdi', '==', yayinAdi),
        where('denemeAdi', '==', denemeAdi),
        where('tarih', '==', parsedData.tarih)
      )
      const dupSnapshot = await getDocs(dupCheckQuery)

      if (!dupSnapshot.empty) {
        setError(`Bu deneme zaten kayıtlı! "${yayinAdi} - ${denemeAdi}" (${new Date(parsedData.tarih).toLocaleDateString('tr-TR')})`)
        setUploading(false)
        return
      }

      // DENEME LIMIT KONTROLÜ: Ücretsiz kullanıcılar için 5 deneme sınırı
      if (!isPremium) {
        const denemelerQuery = query(
          collection(db, 'denemeler'),
          where('userId', '==', user.uid)
        )
        const denemelerSnapshot = await getDocs(denemelerQuery)

        if (denemelerSnapshot.size >= 5) {
          setError('Ücretsiz planda maksimum 5 deneme yükleyebilirsiniz. Premium\'a geçerek sınırsız deneme yükleyin.')
          setUploading(false)
          return
        }
      }

      // Devam et...
      // Ders verilerini hazırla
      const derslerData = parsedData.dersler.reduce((acc, d) => {
        acc[d.ders] = {
          dogru: d.dogru,
          yanlis: d.yanlis,
          net: d.net,
          konular: d.konular // Konu detaylarını da kaydet
        }
        return acc
      }, {} as Record<string, any>)

      const toplamNet = parsedData.dersler.reduce((sum, d) => sum + d.net, 0)

      // Net bilgilerini de hazırla (denemeler için)
      const netler = parsedData.dersler.reduce((acc, d) => {
        acc[d.ders] = d.net
        return acc
      }, {} as Record<string, number>)

      // 1. Karne olarak kaydet (konu detaylı)
      const karneData = {
        userId: user.uid,
        type: 'karne',
        sinavAdi: parsedData.sinavAdi,
        tarih: parsedData.tarih,
        puan: parsedData.puan,
        format: parsedData.format,
        dersler: derslerData,
        toplamNet: toplamNet,
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, 'karneler'), karneData)
      console.log('Karne kaydedildi')

      // 2. Deneme olarak da kaydet (panelde görünsün)
      const denemeData = {
        userId: user.uid,
        yayinAdi: yayinAdi,
        denemeAdi: denemeAdi,
        tarih: parsedData.tarih,
        dersler: derslerData, // Konu detaylarıyla birlikte
        netler: netler,
        toplamNet: toplamNet,
        puan: parsedData.puan,
        kaynak: 'karne', // Karneden geldiğini belirt
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, 'denemeler'), denemeData)
      console.log('Deneme olarak da kaydedildi')

      setSaved(true)
      setTimeout(() => {
        router.push('/panel')
      }, 1500)
    } catch (err) {
      console.error(err)
      setError('Kayıt sırasında hata oluştu: ' + (err as Error).message)
    } finally {
      setUploading(false)
    }
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
          <h2 className="text-2xl font-bold text-foreground">Karne Kaydedildi!</h2>
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
            <h1 className="text-2xl font-bold text-foreground">Karne Yükle</h1>
            <p className="text-muted-foreground">PDF karne yükleyerek konu analizi yap</p>
          </div>
        </div>

        {/* Limit Warning */}
        {!isPremium && denemeCount >= 5 && (
          <Card className="mb-6 border-orange-500/50 bg-orange-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-orange-500">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Deneme limiti doldu ({denemeCount}/5)</p>
                  <p className="text-sm text-muted-foreground">
                    Daha fazla deneme yüklemek için{' '}
                    <Link href="/premium" className="underline">
                      Premium&apos;a geçin
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PDF Yükle
              </CardTitle>
              <CardDescription>
                Form Akademi, ÜçDörtBeş, HIZ formatlarını destekler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
              >
                {parsing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-muted-foreground">PDF okunuyor...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-foreground font-medium">PDF Seç</span>
                    <span className="text-sm text-muted-foreground">veya sürükle bırak</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Desteklenen Formatlar */}
              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-medium text-foreground">Desteklenen Formatlar:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Form Akademi (Konu Analizli Karne)</li>
                  <li>• ÜçDörtBeş (345) LGS</li>
                  <li>• HIZ / Sinan Kuzucu</li>
                  <li>• Özdebir, Nar Test, Fenomen</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Önizleme</CardTitle>
            </CardHeader>
            <CardContent>
              {parsedData ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-accent/50">
                    <div className="text-sm text-muted-foreground">Sınav Adı</div>
                    <div className="font-medium text-foreground">{parsedData.sinavAdi}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="text-sm text-muted-foreground">Tarih</div>
                      <div className="font-medium text-foreground">
                        {new Date(parsedData.tarih).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/50">
                      <div className="text-sm text-muted-foreground">Puan</div>
                      <div className="font-bold text-green-500 text-xl">
                        {parsedData.puan.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Ders Netleri */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Ders Netleri</h4>
                    {parsedData.dersler.map(ders => {
                      const dersInfo = DERSLER.find(d => d.key === ders.ders)
                      return (
                        <div key={ders.ders} className="flex justify-between items-center p-2 rounded bg-accent/30">
                          <span className="text-foreground">{dersInfo?.label || ders.ders}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-500">{ders.dogru}D</span>
                            <span className="text-red-500">{ders.yanlis}Y</span>
                            <span className="font-bold text-primary">{ders.net.toFixed(2)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Format: {parsedData.format}
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={uploading || (!isPremium && denemeCount >= 5)}
                    className="w-full"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {!isPremium && denemeCount >= 5 ? 'Limit Doldu' : 'Kaydet'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  PDF yüklendiğinde önizleme burada görünecek
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
