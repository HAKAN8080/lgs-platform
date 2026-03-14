'use client'

import { useState, useMemo, useRef } from 'react'
import {
  Users,
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Pencil,
  X,
  Save,
  Loader2,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Filter,
  ChevronDown,
  UserPlus,
  GraduationCap,
} from 'lucide-react'

interface Ogrenci {
  id: string
  ad: string
  soyad: string
  ogrenciNo: string
  sinif: string
  telefon?: string
  veli?: string
  email?: string
  createdAt: string
}

// Demo öğrenci verileri
const demoOgrenciler: Ogrenci[] = [
  { id: '1', ad: 'Ela Deniz', soyad: 'Uğur', ogrenciNo: '2024001', sinif: '8-A', telefon: '0532 123 45 67', veli: 'Ayşe Uğur', createdAt: '2024-09-01' },
  { id: '2', ad: 'Ahmet', soyad: 'Yılmaz', ogrenciNo: '2024002', sinif: '8-A', telefon: '0533 234 56 78', veli: 'Mehmet Yılmaz', createdAt: '2024-09-01' },
  { id: '3', ad: 'Zeynep', soyad: 'Kaya', ogrenciNo: '2024003', sinif: '8-B', telefon: '0534 345 67 89', veli: 'Ali Kaya', createdAt: '2024-09-01' },
  { id: '4', ad: 'Can', soyad: 'Demir', ogrenciNo: '2024004', sinif: '8-B', telefon: '0535 456 78 90', veli: 'Fatma Demir', createdAt: '2024-09-02' },
  { id: '5', ad: 'Elif', soyad: 'Çelik', ogrenciNo: '2024005', sinif: '8-A', telefon: '0536 567 89 01', veli: 'Hasan Çelik', createdAt: '2024-09-02' },
  { id: '6', ad: 'Burak', soyad: 'Şahin', ogrenciNo: '2024006', sinif: '7-A', telefon: '0537 678 90 12', veli: 'Ayşe Şahin', createdAt: '2024-09-03' },
  { id: '7', ad: 'Selin', soyad: 'Yıldız', ogrenciNo: '2024007', sinif: '7-A', telefon: '0538 789 01 23', veli: 'Kemal Yıldız', createdAt: '2024-09-03' },
  { id: '8', ad: 'Emre', soyad: 'Arslan', ogrenciNo: '2024008', sinif: '7-B', telefon: '0539 890 12 34', veli: 'Zehra Arslan', createdAt: '2024-09-04' },
]

const siniflar = ['7-A', '7-B', '8-A', '8-B']

export default function OgrencilerPage() {
  const [ogrenciler, setOgrenciler] = useState<Ogrenci[]>(demoOgrenciler)
  const [searchQuery, setSearchQuery] = useState('')
  const [sinifFilter, setSinifFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showExcelModal, setShowExcelModal] = useState(false)
  const [editingOgrenci, setEditingOgrenci] = useState<Ogrenci | null>(null)
  const [saving, setSaving] = useState(false)

  // Yeni öğrenci form state
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    ogrenciNo: '',
    sinif: '8-A',
    telefon: '',
    veli: '',
    email: '',
  })

  // Excel import state
  const [excelData, setExcelData] = useState<string>('')
  const [excelPreview, setExcelPreview] = useState<Ogrenci[]>([])
  const [excelError, setExcelError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filtrelenmiş öğrenciler
  const filteredOgrenciler = useMemo(() => {
    return ogrenciler.filter((o) => {
      const matchesSearch =
        searchQuery === '' ||
        `${o.ad} ${o.soyad}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.ogrenciNo.includes(searchQuery)

      const matchesSinif = sinifFilter === '' || o.sinif === sinifFilter

      return matchesSearch && matchesSinif
    })
  }, [ogrenciler, searchQuery, sinifFilter])

  // Sınıf bazlı grupla
  const groupedBySinif = useMemo(() => {
    const groups: Record<string, number> = {}
    ogrenciler.forEach((o) => {
      groups[o.sinif] = (groups[o.sinif] || 0) + 1
    })
    return groups
  }, [ogrenciler])

  // Yeni öğrenci ekle
  const handleAddOgrenci = () => {
    if (!formData.ad || !formData.soyad || !formData.ogrenciNo) {
      alert('Ad, soyad ve öğrenci no zorunludur!')
      return
    }

    setSaving(true)
    setTimeout(() => {
      const newOgrenci: Ogrenci = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setOgrenciler((prev) => [...prev, newOgrenci])
      setFormData({ ad: '', soyad: '', ogrenciNo: '', sinif: '8-A', telefon: '', veli: '', email: '' })
      setShowAddModal(false)
      setSaving(false)
    }, 500)
  }

  // Öğrenci düzenle
  const handleEditOgrenci = () => {
    if (!editingOgrenci) return

    setSaving(true)
    setTimeout(() => {
      setOgrenciler((prev) =>
        prev.map((o) => (o.id === editingOgrenci.id ? editingOgrenci : o))
      )
      setEditingOgrenci(null)
      setSaving(false)
    }, 500)
  }

  // Öğrenci sil
  const handleDeleteOgrenci = (id: string) => {
    if (!confirm('Bu öğrenciyi silmek istediğinize emin misiniz?')) return
    setOgrenciler((prev) => prev.filter((o) => o.id !== id))
  }

  // Excel dosyası parse et
  const parseExcelText = (text: string) => {
    setExcelError('')
    const lines = text.trim().split('\n').filter(l => l.trim())

    if (lines.length === 0) {
      setExcelError('Veri bulunamadı')
      return
    }

    // İlk satır başlık mı kontrol et
    const firstLine = lines[0].toLowerCase()
    const hasHeader = firstLine.includes('ad') || firstLine.includes('soyad') || firstLine.includes('no')
    const dataLines = hasHeader ? lines.slice(1) : lines

    const parsed: Ogrenci[] = []
    const errors: string[] = []

    dataLines.forEach((line, index) => {
      const parts = line.split(/[\t;,]/).map(p => p.trim())

      if (parts.length < 3) {
        errors.push(`Satır ${index + 1}: Yetersiz veri (en az 3 sütun gerekli)`)
        return
      }

      // Format: Ad, Soyad, Öğrenci No, [Sınıf], [Telefon], [Veli]
      parsed.push({
        id: `new_${Date.now()}_${index}`,
        ad: parts[0] || '',
        soyad: parts[1] || '',
        ogrenciNo: parts[2] || '',
        sinif: parts[3] || '8-A',
        telefon: parts[4] || '',
        veli: parts[5] || '',
        createdAt: new Date().toISOString().split('T')[0],
      })
    })

    if (errors.length > 0) {
      setExcelError(errors.join('\n'))
    }

    setExcelPreview(parsed)
  }

  // Excel'den import et
  const handleExcelImport = () => {
    if (excelPreview.length === 0) return

    setSaving(true)
    setTimeout(() => {
      setOgrenciler((prev) => [...prev, ...excelPreview])
      setExcelData('')
      setExcelPreview([])
      setShowExcelModal(false)
      setSaving(false)
    }, 500)
  }

  // CSV indir
  const handleDownloadCSV = () => {
    const headers = ['Ad', 'Soyad', 'Öğrenci No', 'Sınıf', 'Telefon', 'Veli', 'Email']
    const rows = ogrenciler.map(o => [o.ad, o.soyad, o.ogrenciNo, o.sinif, o.telefon || '', o.veli || '', o.email || ''])

    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ogrenciler.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-500" />
            Öğrenci Yönetimi
          </h1>
          <p className="text-muted-foreground mt-1">
            Toplam {ogrenciler.length} öğrenci
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">CSV İndir</span>
          </button>
          <button
            onClick={() => setShowExcelModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent text-sm font-medium transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Excel İle Ekle</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Öğrenci Ekle
          </button>
        </div>
      </div>

      {/* Sınıf İstatistikleri */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {siniflar.map((sinif) => (
          <button
            key={sinif}
            onClick={() => setSinifFilter(sinifFilter === sinif ? '' : sinif)}
            className={`p-3 rounded-xl border transition-colors text-left ${
              sinifFilter === sinif
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-border bg-card hover:bg-accent/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <GraduationCap className={`h-4 w-4 ${sinifFilter === sinif ? 'text-purple-500' : 'text-muted-foreground'}`} />
              <span className={`font-medium ${sinifFilter === sinif ? 'text-purple-500' : 'text-foreground'}`}>
                {sinif}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {groupedBySinif[sinif] || 0}
            </div>
          </button>
        ))}
      </div>

      {/* Arama ve Filtre */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="İsim veya öğrenci no ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={sinifFilter}
            onChange={(e) => setSinifFilter(e.target.value)}
            className="h-10 pl-10 pr-8 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
          >
            <option value="">Tüm Sınıflar</option>
            {siniflar.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {(searchQuery || sinifFilter) && (
          <button
            onClick={() => { setSearchQuery(''); setSinifFilter(''); }}
            className="h-10 px-4 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Öğrenci Listesi */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-accent/50 border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Öğrenci</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Öğrenci No</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sınıf</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Veli</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Telefon</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOgrenciler.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    {searchQuery || sinifFilter ? 'Filtreye uygun öğrenci bulunamadı' : 'Henüz öğrenci eklenmemiş'}
                  </td>
                </tr>
              ) : (
                filteredOgrenciler.map((ogrenci) => (
                  <tr key={ogrenci.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 font-semibold text-sm">
                          {ogrenci.ad[0]}{ogrenci.soyad[0]}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{ogrenci.ad} {ogrenci.soyad}</div>
                          {ogrenci.email && (
                            <div className="text-xs text-muted-foreground">{ogrenci.email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-foreground">{ogrenci.ogrenciNo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-accent text-xs font-medium text-foreground">
                        {ogrenci.sinif}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{ogrenci.veli || '-'}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{ogrenci.telefon || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingOgrenci(ogrenci)}
                          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOgrenci(ogrenci.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-accent/30 text-sm text-muted-foreground">
          {filteredOgrenciler.length} öğrenci gösteriliyor
          {(searchQuery || sinifFilter) && ` (toplam ${ogrenciler.length})`}
        </div>
      </div>

      {/* Öğrenci Ekle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-purple-500" />
                Yeni Öğrenci Ekle
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Ad *</label>
                  <input
                    type="text"
                    value={formData.ad}
                    onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Öğrenci adı"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Soyad *</label>
                  <input
                    type="text"
                    value={formData.soyad}
                    onChange={(e) => setFormData({ ...formData, soyad: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Öğrenci soyadı"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Öğrenci No *</label>
                  <input
                    type="text"
                    value={formData.ogrenciNo}
                    onChange={(e) => setFormData({ ...formData, ogrenciNo: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    placeholder="2024001"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Sınıf</label>
                  <select
                    value={formData.sinif}
                    onChange={(e) => setFormData({ ...formData, sinif: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {siniflar.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Telefon</label>
                <input
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0532 123 45 67"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Veli Adı</label>
                <input
                  type="text"
                  value={formData.veli}
                  onChange={(e) => setFormData({ ...formData, veli: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Veli adı soyadı"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ogrenci@email.com"
                />
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleAddOgrenci}
                disabled={saving}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {showExcelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-green-500" />
                Excel / CSV İle Toplu Öğrenci Ekle
              </h3>
              <button onClick={() => { setShowExcelModal(false); setExcelData(''); setExcelPreview([]); setExcelError(''); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 rounded-lg bg-accent/50 border border-border">
                <h4 className="font-medium text-foreground text-sm mb-2">Format Bilgisi</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Excel'den kopyalayıp yapıştırın veya CSV formatında veri girin. Her satır bir öğrenci.
                </p>
                <code className="text-xs bg-background px-2 py-1 rounded border border-border text-muted-foreground block">
                  Ad, Soyad, Öğrenci No, Sınıf, Telefon, Veli
                </code>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Veri Yapıştır</label>
                <textarea
                  value={excelData}
                  onChange={(e) => {
                    setExcelData(e.target.value)
                    parseExcelText(e.target.value)
                  }}
                  className="w-full h-40 rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder={`Ela Deniz, Uğur, 2024001, 8-A, 0532 123 45 67, Ayşe Uğur\nAhmet, Yılmaz, 2024002, 8-B, 0533 234 56 78, Mehmet Yılmaz`}
                />
              </div>

              {excelError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <pre className="whitespace-pre-wrap">{excelError}</pre>
                </div>
              )}

              {excelPreview.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-foreground">{excelPreview.length} öğrenci algılandı</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-border rounded-lg">
                    <table className="w-full text-xs">
                      <thead className="bg-accent/50 sticky top-0">
                        <tr>
                          <th className="px-2 py-1.5 text-left text-muted-foreground">Ad Soyad</th>
                          <th className="px-2 py-1.5 text-left text-muted-foreground">No</th>
                          <th className="px-2 py-1.5 text-left text-muted-foreground">Sınıf</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {excelPreview.slice(0, 5).map((o, i) => (
                          <tr key={i}>
                            <td className="px-2 py-1.5 text-foreground">{o.ad} {o.soyad}</td>
                            <td className="px-2 py-1.5 text-muted-foreground font-mono">{o.ogrenciNo}</td>
                            <td className="px-2 py-1.5 text-muted-foreground">{o.sinif}</td>
                          </tr>
                        ))}
                        {excelPreview.length > 5 && (
                          <tr>
                            <td colSpan={3} className="px-2 py-1.5 text-center text-muted-foreground">
                              +{excelPreview.length - 5} öğrenci daha...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => { setShowExcelModal(false); setExcelData(''); setExcelPreview([]); setExcelError(''); }}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleExcelImport}
                disabled={saving || excelPreview.length === 0}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {excelPreview.length} Öğrenci Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Düzenle Modal */}
      {editingOgrenci && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Pencil className="h-5 w-5 text-purple-500" />
                Öğrenci Düzenle
              </h3>
              <button onClick={() => setEditingOgrenci(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Ad</label>
                  <input
                    type="text"
                    value={editingOgrenci.ad}
                    onChange={(e) => setEditingOgrenci({ ...editingOgrenci, ad: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Soyad</label>
                  <input
                    type="text"
                    value={editingOgrenci.soyad}
                    onChange={(e) => setEditingOgrenci({ ...editingOgrenci, soyad: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Öğrenci No</label>
                  <input
                    type="text"
                    value={editingOgrenci.ogrenciNo}
                    onChange={(e) => setEditingOgrenci({ ...editingOgrenci, ogrenciNo: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Sınıf</label>
                  <select
                    value={editingOgrenci.sinif}
                    onChange={(e) => setEditingOgrenci({ ...editingOgrenci, sinif: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {siniflar.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Telefon</label>
                <input
                  type="tel"
                  value={editingOgrenci.telefon || ''}
                  onChange={(e) => setEditingOgrenci({ ...editingOgrenci, telefon: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Veli Adı</label>
                <input
                  type="text"
                  value={editingOgrenci.veli || ''}
                  onChange={(e) => setEditingOgrenci({ ...editingOgrenci, veli: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setEditingOgrenci(null)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleEditOgrenci}
                disabled={saving}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
