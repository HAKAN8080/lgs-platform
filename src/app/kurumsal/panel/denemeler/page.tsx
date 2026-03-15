'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Eye,
  X,
  Loader2,
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  ChevronDown,
  Filter,
  Trophy,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react'

interface OgrenciSonuc {
  id: string
  ogrenciNo: string
  ad: string
  soyad: string
  sinif: string
  turkce: number
  matematik: number
  fen: number
  sosyal: number
  din: number
  ingilizce: number
  toplamNet: number
  puan: number
}

interface Deneme {
  id: string
  yayinAdi: string
  denemeAdi: string
  tarih: string
  siniflar: string[]
  katilim: number
  ortalamaNet: number
  enYuksekNet: number
  enDusukNet: number
  sonuclar: OgrenciSonuc[]
}

// Demo deneme verileri
const demoDenemeListesi: Deneme[] = [
  {
    id: '1',
    yayinAdi: 'HİZ',
    denemeAdi: '8.SINIF TG GELİŞİM DEĞERLENDİRME SINAVI - 5',
    tarih: '2026-03-12',
    siniflar: ['8-A', '8-B'],
    katilim: 52,
    ortalamaNet: 68.5,
    enYuksekNet: 89.25,
    enDusukNet: 32.5,
    sonuclar: [
      { id: '1', ogrenciNo: '2024001', ad: 'Ela Deniz', soyad: 'Uğur', sinif: '8-A', turkce: 18, matematik: 16, fen: 17, sosyal: 9, din: 9, ingilizce: 9, toplamNet: 78, puan: 445.32 },
      { id: '2', ogrenciNo: '2024002', ad: 'Ahmet', soyad: 'Yılmaz', sinif: '8-A', turkce: 15, matematik: 14, fen: 15, sosyal: 8, din: 8, ingilizce: 8, toplamNet: 68, puan: 412.15 },
      { id: '3', ogrenciNo: '2024003', ad: 'Zeynep', soyad: 'Kaya', sinif: '8-B', turkce: 17, matematik: 18, fen: 16, sosyal: 9, din: 10, ingilizce: 9, toplamNet: 79, puan: 448.90 },
      { id: '4', ogrenciNo: '2024004', ad: 'Can', soyad: 'Demir', sinif: '8-B', turkce: 12, matematik: 10, fen: 11, sosyal: 6, din: 7, ingilizce: 6, toplamNet: 52, puan: 358.45 },
      { id: '5', ogrenciNo: '2024005', ad: 'Elif', soyad: 'Çelik', sinif: '8-A', turkce: 19, matematik: 17, fen: 18, sosyal: 10, din: 9, ingilizce: 10, toplamNet: 83, puan: 462.78 },
    ]
  },
  {
    id: '2',
    yayinAdi: 'PARAF',
    denemeAdi: '8.SINIF TG MOR MÜFREDAT İZLEME - 2',
    tarih: '2026-03-10',
    siniflar: ['8-A', '8-B'],
    katilim: 48,
    ortalamaNet: 65.2,
    enYuksekNet: 85.5,
    enDusukNet: 28.75,
    sonuclar: []
  },
  {
    id: '3',
    yayinAdi: '3D',
    denemeAdi: '8.SINIF TG GİD - 3',
    tarih: '2026-03-07',
    siniflar: ['8-A', '8-B'],
    katilim: 54,
    ortalamaNet: 71.3,
    enYuksekNet: 91.0,
    enDusukNet: 35.25,
    sonuclar: []
  },
  {
    id: '4',
    yayinAdi: 'HİZ',
    denemeAdi: '7.SINIF TG GELİŞİM DEĞERLENDİRME SINAVI - 5',
    tarih: '2026-03-12',
    siniflar: ['7-A', '7-B'],
    katilim: 58,
    ortalamaNet: 62.8,
    enYuksekNet: 82.5,
    enDusukNet: 25.0,
    sonuclar: []
  },
]

const yayinlar = ['HİZ', 'PARAF', '3D', 'OKYANUS', 'ÇANTA', 'ÜNLÜLER KARMASI']

export default function DenemelerPage() {
  const [denemeler, setDenemeler] = useState<Deneme[]>(demoDenemeListesi)
  const [searchQuery, setSearchQuery] = useState('')
  const [yayinFilter, setYayinFilter] = useState('')
  const [selectedDeneme, setSelectedDeneme] = useState<Deneme | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTxtModal, setShowTxtModal] = useState(false)

  // TXT Parse state
  const [txtData, setTxtData] = useState('')
  const [txtParsed, setTxtParsed] = useState<OgrenciSonuc[]>([])
  const [txtError, setTxtError] = useState('')
  const [newDeneme, setNewDeneme] = useState({
    yayinAdi: 'HİZ',
    denemeAdi: '',
    tarih: new Date().toISOString().split('T')[0],
  })
  const [saving, setSaving] = useState(false)

  // Filtrelenmiş denemeler
  const filteredDenemeler = useMemo(() => {
    return denemeler.filter((d) => {
      const matchesSearch =
        searchQuery === '' ||
        d.denemeAdi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.yayinAdi.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesYayin = yayinFilter === '' || d.yayinAdi === yayinFilter

      return matchesSearch && matchesYayin
    })
  }, [denemeler, searchQuery, yayinFilter])

  // İstatistikler
  const stats = useMemo(() => {
    const toplamKatilim = denemeler.reduce((acc, d) => acc + d.katilim, 0)
    const ortalamaNet = denemeler.reduce((acc, d) => acc + d.ortalamaNet, 0) / denemeler.length
    return { toplamDeneme: denemeler.length, toplamKatilim, ortalamaNet }
  }, [denemeler])

  // TXT Parse fonksiyonu
  const parseTxtData = (text: string) => {
    setTxtError('')
    const lines = text.trim().split('\n').filter(l => l.trim())

    if (lines.length === 0) {
      setTxtError('Veri bulunamadı')
      return
    }

    const parsed: OgrenciSonuc[] = []
    const errors: string[] = []

    lines.forEach((line, index) => {
      // Optixy TXT formatı: sabit genişlikli alanlar
      // Basitleştirilmiş format: Ad Soyad | No | Türkçe | Mat | Fen | Sosyal | Din | İng
      const parts = line.split(/[\t|;,]/).map(p => p.trim())

      if (parts.length >= 8) {
        const turkce = parseFloat(parts[2]) || 0
        const mat = parseFloat(parts[3]) || 0
        const fen = parseFloat(parts[4]) || 0
        const sosyal = parseFloat(parts[5]) || 0
        const din = parseFloat(parts[6]) || 0
        const ing = parseFloat(parts[7]) || 0
        const toplamNet = turkce + mat + fen + sosyal + din + ing

        // Basit puan hesaplama (örnek formül)
        const puan = 200 + (toplamNet * 3.1)

        parsed.push({
          id: `parse_${index}`,
          ad: parts[0].split(' ')[0] || '',
          soyad: parts[0].split(' ').slice(1).join(' ') || parts[0],
          ogrenciNo: parts[1] || `AUTO_${index}`,
          sinif: '8-A',
          turkce,
          matematik: mat,
          fen,
          sosyal,
          din,
          ingilizce: ing,
          toplamNet,
          puan: Math.min(500, Math.max(200, puan)),
        })
      } else if (parts.length >= 2) {
        errors.push(`Satır ${index + 1}: Yetersiz veri`)
      }
    })

    if (errors.length > 0 && parsed.length === 0) {
      setTxtError(errors.slice(0, 3).join('\n'))
    }

    setTxtParsed(parsed)
  }

  // Deneme kaydet
  const handleSaveDeneme = () => {
    if (!newDeneme.denemeAdi || txtParsed.length === 0) {
      alert('Deneme adı ve sonuç verisi gerekli!')
      return
    }

    setSaving(true)
    setTimeout(() => {
      const deneme: Deneme = {
        id: Date.now().toString(),
        yayinAdi: newDeneme.yayinAdi,
        denemeAdi: newDeneme.denemeAdi,
        tarih: newDeneme.tarih,
        siniflar: [...new Set(txtParsed.map(s => s.sinif))],
        katilim: txtParsed.length,
        ortalamaNet: txtParsed.reduce((acc, s) => acc + s.toplamNet, 0) / txtParsed.length,
        enYuksekNet: Math.max(...txtParsed.map(s => s.toplamNet)),
        enDusukNet: Math.min(...txtParsed.map(s => s.toplamNet)),
        sonuclar: txtParsed,
      }

      setDenemeler(prev => [deneme, ...prev])
      setShowTxtModal(false)
      setTxtData('')
      setTxtParsed([])
      setNewDeneme({ yayinAdi: 'HİZ', denemeAdi: '', tarih: new Date().toISOString().split('T')[0] })
      setSaving(false)
    }, 500)
  }

  // Deneme sil
  const handleDeleteDeneme = (id: string) => {
    if (!confirm('Bu denemeyi silmek istediğinize emin misiniz?')) return
    setDenemeler(prev => prev.filter(d => d.id !== id))
  }

  // CSV indir
  const handleDownloadResults = (deneme: Deneme) => {
    if (deneme.sonuclar.length === 0) {
      alert('Bu denemenin sonuç verisi yok')
      return
    }

    const headers = ['Sıra', 'Öğrenci No', 'Ad', 'Soyad', 'Sınıf', 'Türkçe', 'Matematik', 'Fen', 'Sosyal', 'Din', 'İngilizce', 'Toplam Net', 'Puan']
    const rows = deneme.sonuclar
      .sort((a, b) => b.toplamNet - a.toplamNet)
      .map((s, i) => [
        i + 1,
        s.ogrenciNo,
        s.ad,
        s.soyad,
        s.sinif,
        s.turkce,
        s.matematik,
        s.fen,
        s.sosyal,
        s.din,
        s.ingilizce,
        s.toplamNet.toFixed(2),
        s.puan.toFixed(2)
      ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${deneme.yayinAdi}_${deneme.denemeAdi}_sonuclar.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-500" />
            Deneme Sonuçları
          </h1>
          <p className="text-muted-foreground mt-1">
            {denemeler.length} deneme, {stats.toplamKatilim} toplam katılım
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/araclar/txt-parser.html" target="_blank">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent text-sm font-medium transition-colors">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">TXT Parser</span>
            </button>
          </Link>
          <button
            onClick={() => setShowTxtModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
          >
            <Upload className="h-4 w-4" />
            Sonuç Yükle
          </button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.toplamDeneme}</div>
              <div className="text-sm text-muted-foreground">Toplam Deneme</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.toplamKatilim}</div>
              <div className="text-sm text-muted-foreground">Toplam Katılım</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.ortalamaNet.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Genel Ortalama</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {new Date(denemeler[0]?.tarih || '').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
              </div>
              <div className="text-sm text-muted-foreground">Son Deneme</div>
            </div>
          </div>
        </div>
      </div>

      {/* Arama ve Filtre */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Deneme ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={yayinFilter}
            onChange={(e) => setYayinFilter(e.target.value)}
            className="h-10 pl-10 pr-8 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
          >
            <option value="">Tüm Yayınlar</option>
            {yayinlar.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Deneme Listesi */}
      <div className="space-y-4">
        {filteredDenemeler.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || yayinFilter ? 'Filtreye uygun deneme bulunamadı' : 'Henüz deneme eklenmemiş'}
            </p>
            <button
              onClick={() => setShowTxtModal(true)}
              className="mt-4 text-purple-500 hover:text-purple-400 text-sm font-medium"
            >
              İlk denemeyi ekle →
            </button>
          </div>
        ) : (
          filteredDenemeler.map((deneme) => (
            <div
              key={deneme.id}
              className="bg-card border border-border rounded-xl p-4 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-xs font-semibold">
                      {deneme.yayinAdi}
                    </span>
                    <h3 className="font-semibold text-foreground">{deneme.denemeAdi}</h3>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(deneme.tarih).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {deneme.katilim} katılım
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      {deneme.siniflar.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* İstatistikler */}
                  <div className="hidden md:flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">{deneme.ortalamaNet.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Ortalama</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">{deneme.enYuksekNet.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">En Yüksek</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-500">{deneme.enDusukNet.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">En Düşük</div>
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedDeneme(deneme)}
                      className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="Sonuçları Gör"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadResults(deneme)}
                      className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="CSV İndir"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDeneme(deneme.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sonuç Detay Modal */}
      {selectedDeneme && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-4xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-xs font-semibold">
                    {selectedDeneme.yayinAdi}
                  </span>
                  <h3 className="font-semibold text-foreground">{selectedDeneme.denemeAdi}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDeneme.katilim} öğrenci • {new Date(selectedDeneme.tarih).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadResults(selectedDeneme)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </button>
                <button
                  onClick={() => setSelectedDeneme(null)}
                  className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-5">
              {selectedDeneme.sonuclar.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Bu denemenin detaylı sonuç verisi yok</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-accent/50 border-b border-border">
                        <th className="text-left px-3 py-2 font-semibold text-muted-foreground">#</th>
                        <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Öğrenci</th>
                        <th className="text-center px-3 py-2 font-semibold text-muted-foreground">Sınıf</th>
                        <th className="text-center px-3 py-2 font-semibold text-muted-foreground">TÜR</th>
                        <th className="text-center px-3 py-2 font-semibold text-muted-foreground">MAT</th>
                        <th className="text-center px-3 py-2 font-semibold text-muted-foreground">FEN</th>
                        <th className="text-center px-3 py-2 font-semibold text-muted-foreground">SOS</th>
                        <th className="text-center px-3 py-2 font-semibold text-muted-foreground">DİN</th>
                        <th className="text-center px-3 py-2 font-semibold text-muted-foreground">İNG</th>
                        <th className="text-center px-3 py-2 font-semibold text-muted-foreground">NET</th>
                        <th className="text-center px-3 py-2 font-semibold text-muted-foreground">PUAN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedDeneme.sonuclar
                        .sort((a, b) => b.toplamNet - a.toplamNet)
                        .map((sonuc, index) => (
                          <tr key={sonuc.id} className="hover:bg-accent/30">
                            <td className="px-3 py-2">
                              {index < 3 ? (
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                  index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                  index === 1 ? 'bg-gray-400/20 text-gray-400' :
                                  'bg-orange-500/20 text-orange-500'
                                }`}>
                                  {index + 1}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">{index + 1}</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <div className="font-medium text-foreground">{sonuc.ad} {sonuc.soyad}</div>
                              <div className="text-xs text-muted-foreground font-mono">{sonuc.ogrenciNo}</div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="px-2 py-0.5 rounded bg-accent text-xs">{sonuc.sinif}</span>
                            </td>
                            <td className="px-3 py-2 text-center text-foreground">{sonuc.turkce}</td>
                            <td className="px-3 py-2 text-center text-foreground">{sonuc.matematik}</td>
                            <td className="px-3 py-2 text-center text-foreground">{sonuc.fen}</td>
                            <td className="px-3 py-2 text-center text-foreground">{sonuc.sosyal}</td>
                            <td className="px-3 py-2 text-center text-foreground">{sonuc.din}</td>
                            <td className="px-3 py-2 text-center text-foreground">{sonuc.ingilizce}</td>
                            <td className="px-3 py-2 text-center font-bold text-purple-500">{sonuc.toplamNet.toFixed(2)}</td>
                            <td className="px-3 py-2 text-center font-bold text-green-500">{sonuc.puan.toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TXT Yükleme Modal */}
      {showTxtModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-500" />
                Deneme Sonucu Yükle
              </h3>
              <button
                onClick={() => { setShowTxtModal(false); setTxtData(''); setTxtParsed([]); setTxtError(''); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Deneme Bilgileri */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Yayın</label>
                  <select
                    value={newDeneme.yayinAdi}
                    onChange={(e) => setNewDeneme({ ...newDeneme, yayinAdi: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {yayinlar.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Tarih</label>
                  <input
                    type="date"
                    value={newDeneme.tarih}
                    onChange={(e) => setNewDeneme({ ...newDeneme, tarih: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Deneme Adı</label>
                <input
                  type="text"
                  value={newDeneme.denemeAdi}
                  onChange={(e) => setNewDeneme({ ...newDeneme, denemeAdi: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Örn: 8.SINIF TG GİD - 3"
                />
              </div>

              {/* Veri Girişi */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Sonuç Verisi</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Format: Ad Soyad | Öğrenci No | Türkçe | Mat | Fen | Sosyal | Din | İngilizce
                </p>
                <textarea
                  value={txtData}
                  onChange={(e) => {
                    setTxtData(e.target.value)
                    parseTxtData(e.target.value)
                  }}
                  className="w-full h-40 rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder={`Ela Deniz Uğur | 2024001 | 18 | 16 | 17 | 9 | 9 | 9\nAhmet Yılmaz | 2024002 | 15 | 14 | 15 | 8 | 8 | 8`}
                />
              </div>

              {/* Hata */}
              {txtError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <pre className="whitespace-pre-wrap">{txtError}</pre>
                </div>
              )}

              {/* Önizleme */}
              {txtParsed.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-foreground">{txtParsed.length} öğrenci sonucu algılandı</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-border rounded-lg">
                    <table className="w-full text-xs">
                      <thead className="bg-accent/50 sticky top-0">
                        <tr>
                          <th className="px-2 py-1.5 text-left text-muted-foreground">Öğrenci</th>
                          <th className="px-2 py-1.5 text-center text-muted-foreground">Net</th>
                          <th className="px-2 py-1.5 text-center text-muted-foreground">Puan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {txtParsed.slice(0, 5).map((s, i) => (
                          <tr key={i}>
                            <td className="px-2 py-1.5 text-foreground">{s.ad} {s.soyad}</td>
                            <td className="px-2 py-1.5 text-center font-mono text-purple-500">{s.toplamNet.toFixed(2)}</td>
                            <td className="px-2 py-1.5 text-center font-mono text-green-500">{s.puan.toFixed(2)}</td>
                          </tr>
                        ))}
                        {txtParsed.length > 5 && (
                          <tr>
                            <td colSpan={3} className="px-2 py-1.5 text-center text-muted-foreground">
                              +{txtParsed.length - 5} öğrenci daha...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-5 pb-5 pt-2 border-t border-border">
              <button
                onClick={() => { setShowTxtModal(false); setTxtData(''); setTxtParsed([]); setTxtError(''); }}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSaveDeneme}
                disabled={saving || txtParsed.length === 0 || !newDeneme.denemeAdi}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Denemeyi Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
