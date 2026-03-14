'use client'

import { useState, useMemo } from 'react'
import {
  GraduationCap,
  Plus,
  Users,
  Trash2,
  Pencil,
  X,
  Save,
  Loader2,
  TrendingUp,
  ChevronRight,
  UserPlus,
  UserMinus,
  Search,
  Check,
} from 'lucide-react'

interface Sinif {
  id: string
  ad: string
  seviye: string
  sube: string
  ogretmen?: string
  ogrenciSayisi: number
  ortalamaNet?: number
  createdAt: string
}

interface Ogrenci {
  id: string
  ad: string
  soyad: string
  ogrenciNo: string
  sinif: string
}

// Demo sınıf verileri
const demoSiniflar: Sinif[] = [
  { id: '1', ad: '8-A', seviye: '8', sube: 'A', ogretmen: 'Ayşe Yılmaz', ogrenciSayisi: 28, ortalamaNet: 72.5, createdAt: '2024-09-01' },
  { id: '2', ad: '8-B', seviye: '8', sube: 'B', ogretmen: 'Mehmet Kaya', ogrenciSayisi: 26, ortalamaNet: 68.3, createdAt: '2024-09-01' },
  { id: '3', ad: '7-A', seviye: '7', sube: 'A', ogretmen: 'Fatma Demir', ogrenciSayisi: 30, ortalamaNet: 65.1, createdAt: '2024-09-01' },
  { id: '4', ad: '7-B', seviye: '7', sube: 'B', ogretmen: 'Ali Çelik', ogrenciSayisi: 29, ortalamaNet: 63.8, createdAt: '2024-09-01' },
  { id: '5', ad: '6-A', seviye: '6', sube: 'A', ogretmen: 'Zeynep Arslan', ogrenciSayisi: 32, ortalamaNet: 58.2, createdAt: '2024-09-01' },
  { id: '6', ad: '6-B', seviye: '6', sube: 'B', ogretmen: 'Hasan Yıldız', ogrenciSayisi: 31, ortalamaNet: 56.9, createdAt: '2024-09-01' },
]

// Demo öğrenci verileri (sınıfsız olanlar dahil)
const demoOgrenciler: Ogrenci[] = [
  { id: '1', ad: 'Ela Deniz', soyad: 'Uğur', ogrenciNo: '2024001', sinif: '8-A' },
  { id: '2', ad: 'Ahmet', soyad: 'Yılmaz', ogrenciNo: '2024002', sinif: '8-A' },
  { id: '3', ad: 'Zeynep', soyad: 'Kaya', ogrenciNo: '2024003', sinif: '8-B' },
  { id: '4', ad: 'Can', soyad: 'Demir', ogrenciNo: '2024004', sinif: '8-B' },
  { id: '5', ad: 'Elif', soyad: 'Çelik', ogrenciNo: '2024005', sinif: '8-A' },
  { id: '6', ad: 'Burak', soyad: 'Şahin', ogrenciNo: '2024006', sinif: '7-A' },
  { id: '7', ad: 'Selin', soyad: 'Yıldız', ogrenciNo: '2024007', sinif: '7-A' },
  { id: '8', ad: 'Emre', soyad: 'Arslan', ogrenciNo: '2024008', sinif: '7-B' },
  { id: '9', ad: 'Yeni', soyad: 'Öğrenci1', ogrenciNo: '2024009', sinif: '' },
  { id: '10', ad: 'Yeni', soyad: 'Öğrenci2', ogrenciNo: '2024010', sinif: '' },
  { id: '11', ad: 'Yeni', soyad: 'Öğrenci3', ogrenciNo: '2024011', sinif: '' },
]

const seviyeler = ['5', '6', '7', '8']
const subeler = ['A', 'B', 'C', 'D']

export default function SiniflarPage() {
  const [siniflar, setSiniflar] = useState<Sinif[]>(demoSiniflar)
  const [ogrenciler, setOgrenciler] = useState<Ogrenci[]>(demoOgrenciler)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSinif, setEditingSinif] = useState<Sinif | null>(null)
  const [selectedSinif, setSelectedSinif] = useState<Sinif | null>(null)
  const [showOgrenciModal, setShowOgrenciModal] = useState(false)
  const [saving, setSaving] = useState(false)

  // Yeni sınıf form state
  const [formData, setFormData] = useState({
    seviye: '8',
    sube: 'A',
    ogretmen: '',
  })

  // Öğrenci atama state
  const [ogrenciSearch, setOgrenciSearch] = useState('')
  const [selectedOgrenciler, setSelectedOgrenciler] = useState<string[]>([])

  // Seviye bazlı grupla
  const groupedBySeviye = useMemo(() => {
    const groups: Record<string, Sinif[]> = {}
    siniflar.forEach((s) => {
      if (!groups[s.seviye]) groups[s.seviye] = []
      groups[s.seviye].push(s)
    })
    // Sıralama
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.sube.localeCompare(b.sube))
    })
    return groups
  }, [siniflar])

  // Toplam istatistikler
  const stats = useMemo(() => {
    const toplamOgrenci = siniflar.reduce((acc, s) => acc + s.ogrenciSayisi, 0)
    const ortalamaNet = siniflar.reduce((acc, s) => acc + (s.ortalamaNet || 0), 0) / siniflar.length
    return { toplamOgrenci, ortalamaNet }
  }, [siniflar])

  // Sınıftaki öğrenciler
  const siniftakiOgrenciler = useMemo(() => {
    if (!selectedSinif) return []
    return ogrenciler.filter((o) => o.sinif === selectedSinif.ad)
  }, [selectedSinif, ogrenciler])

  // Atanabilir öğrenciler (sınıfı olmayan veya farklı sınıfta)
  const atanabilirOgrenciler = useMemo(() => {
    if (!selectedSinif) return []
    return ogrenciler
      .filter((o) => o.sinif !== selectedSinif.ad)
      .filter((o) =>
        ogrenciSearch === '' ||
        `${o.ad} ${o.soyad}`.toLowerCase().includes(ogrenciSearch.toLowerCase()) ||
        o.ogrenciNo.includes(ogrenciSearch)
      )
  }, [selectedSinif, ogrenciler, ogrenciSearch])

  // Yeni sınıf ekle
  const handleAddSinif = () => {
    const ad = `${formData.seviye}-${formData.sube}`

    // Aynı isimde sınıf var mı kontrol et
    if (siniflar.some((s) => s.ad === ad)) {
      alert('Bu sınıf zaten mevcut!')
      return
    }

    setSaving(true)
    setTimeout(() => {
      const newSinif: Sinif = {
        id: Date.now().toString(),
        ad,
        seviye: formData.seviye,
        sube: formData.sube,
        ogretmen: formData.ogretmen,
        ogrenciSayisi: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setSiniflar((prev) => [...prev, newSinif])
      setFormData({ seviye: '8', sube: 'A', ogretmen: '' })
      setShowAddModal(false)
      setSaving(false)
    }, 500)
  }

  // Sınıf düzenle
  const handleEditSinif = () => {
    if (!editingSinif) return

    setSaving(true)
    setTimeout(() => {
      setSiniflar((prev) =>
        prev.map((s) => (s.id === editingSinif.id ? editingSinif : s))
      )
      setEditingSinif(null)
      setSaving(false)
    }, 500)
  }

  // Sınıf sil
  const handleDeleteSinif = (sinif: Sinif) => {
    if (sinif.ogrenciSayisi > 0) {
      alert('Bu sınıfta öğrenci var! Önce öğrencileri başka sınıfa taşıyın.')
      return
    }
    if (!confirm(`${sinif.ad} sınıfını silmek istediğinize emin misiniz?`)) return
    setSiniflar((prev) => prev.filter((s) => s.id !== sinif.id))
  }

  // Öğrenci ata
  const handleAtaOgrenci = () => {
    if (!selectedSinif || selectedOgrenciler.length === 0) return

    setSaving(true)
    setTimeout(() => {
      setOgrenciler((prev) =>
        prev.map((o) =>
          selectedOgrenciler.includes(o.id) ? { ...o, sinif: selectedSinif.ad } : o
        )
      )
      setSiniflar((prev) =>
        prev.map((s) =>
          s.id === selectedSinif.id
            ? { ...s, ogrenciSayisi: s.ogrenciSayisi + selectedOgrenciler.length }
            : s
        )
      )
      setSelectedOgrenciler([])
      setOgrenciSearch('')
      setShowOgrenciModal(false)
      setSaving(false)
    }, 500)
  }

  // Öğrenciyi sınıftan çıkar
  const handleCikarOgrenci = (ogrenciId: string) => {
    if (!selectedSinif) return
    if (!confirm('Öğrenciyi sınıftan çıkarmak istediğinize emin misiniz?')) return

    setOgrenciler((prev) =>
      prev.map((o) => (o.id === ogrenciId ? { ...o, sinif: '' } : o))
    )
    setSiniflar((prev) =>
      prev.map((s) =>
        s.id === selectedSinif.id
          ? { ...s, ogrenciSayisi: Math.max(0, s.ogrenciSayisi - 1) }
          : s
      )
    )
  }

  // Öğrenci seçimi toggle
  const toggleOgrenciSelection = (id: string) => {
    setSelectedOgrenciler((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-purple-500" />
            Sınıf Yönetimi
          </h1>
          <p className="text-muted-foreground mt-1">
            {siniflar.length} sınıf, {stats.toplamOgrenci} öğrenci
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Sınıf
        </button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{siniflar.length}</div>
              <div className="text-sm text-muted-foreground">Toplam Sınıf</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.toplamOgrenci}</div>
              <div className="text-sm text-muted-foreground">Toplam Öğrenci</div>
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
              <div className="text-sm text-muted-foreground">Ortalama Net</div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <UserMinus className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {ogrenciler.filter((o) => !o.sinif).length}
              </div>
              <div className="text-sm text-muted-foreground">Sınıfsız Öğrenci</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sınıf Listesi - Seviye Bazlı */}
      <div className="space-y-6">
        {Object.entries(groupedBySeviye)
          .sort(([a], [b]) => parseInt(b) - parseInt(a))
          .map(([seviye, siniflarInSeviye]) => (
            <div key={seviye}>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-sm font-bold">
                  {seviye}
                </span>
                {seviye}. Sınıflar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {siniflarInSeviye.map((sinif) => (
                  <div
                    key={sinif.id}
                    className="bg-card border border-border rounded-xl p-4 hover:border-purple-500/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{sinif.ad}</h3>
                        {sinif.ogretmen && (
                          <p className="text-sm text-muted-foreground">{sinif.ogretmen}</p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingSinif(sinif)}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSinif(sinif)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-accent/50 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-foreground">{sinif.ogrenciSayisi}</div>
                        <div className="text-xs text-muted-foreground">Öğrenci</div>
                      </div>
                      <div className="bg-accent/50 rounded-lg p-2 text-center">
                        <div className="text-lg font-bold text-foreground">
                          {sinif.ortalamaNet?.toFixed(1) || '-'}
                        </div>
                        <div className="text-xs text-muted-foreground">Ort. Net</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSinif(sinif)
                        setSelectedOgrenciler([])
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border hover:bg-accent text-sm font-medium text-foreground transition-colors"
                    >
                      <Users className="h-4 w-4" />
                      Öğrencileri Yönet
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Sınıf Detay / Öğrenci Yönetimi Panel */}
      {selectedSinif && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-500" />
                  {selectedSinif.ad} Sınıfı
                </h3>
                <p className="text-sm text-muted-foreground">
                  {siniftakiOgrenciler.length} öğrenci
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOgrenciModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  Öğrenci Ekle
                </button>
                <button
                  onClick={() => setSelectedSinif(null)}
                  className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {siniftakiOgrenciler.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Bu sınıfta henüz öğrenci yok</p>
                  <button
                    onClick={() => setShowOgrenciModal(true)}
                    className="mt-4 text-purple-500 hover:text-purple-400 text-sm font-medium"
                  >
                    Öğrenci ekle →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {siniftakiOgrenciler.map((ogrenci) => (
                    <div
                      key={ogrenci.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 font-semibold text-sm">
                          {ogrenci.ad[0]}{ogrenci.soyad[0]}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {ogrenci.ad} {ogrenci.soyad}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {ogrenci.ogrenciNo}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCikarOgrenci(ogrenci.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Sınıftan Çıkar"
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Öğrenci Ekleme Modal */}
      {showOgrenciModal && selectedSinif && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-500" />
                {selectedSinif.ad} Sınıfına Öğrenci Ekle
              </h3>
              <button
                onClick={() => {
                  setShowOgrenciModal(false)
                  setSelectedOgrenciler([])
                  setOgrenciSearch('')
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Arama */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Öğrenci ara..."
                  value={ogrenciSearch}
                  onChange={(e) => setOgrenciSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Seçilen sayı */}
              {selectedOgrenciler.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <Check className="h-4 w-4" />
                  {selectedOgrenciler.length} öğrenci seçildi
                </div>
              )}

              {/* Öğrenci listesi */}
              <div className="max-h-60 overflow-y-auto space-y-1 border border-border rounded-lg p-2">
                {atanabilirOgrenciler.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Eklenebilecek öğrenci bulunamadı
                  </div>
                ) : (
                  atanabilirOgrenciler.map((ogrenci) => {
                    const isSelected = selectedOgrenciler.includes(ogrenci.id)
                    return (
                      <button
                        key={ogrenci.id}
                        onClick={() => toggleOgrenciSelection(ogrenci.id)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                          isSelected
                            ? 'bg-purple-500/10 border border-purple-500/30'
                            : 'hover:bg-accent border border-transparent'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-border'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm">
                            {ogrenci.ad} {ogrenci.soyad}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="font-mono">{ogrenci.ogrenciNo}</span>
                            {ogrenci.sinif && (
                              <span className="px-1.5 py-0.5 rounded bg-accent text-[10px]">
                                {ogrenci.sinif}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => {
                  setShowOgrenciModal(false)
                  setSelectedOgrenciler([])
                  setOgrenciSearch('')
                }}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleAtaOgrenci}
                disabled={saving || selectedOgrenciler.length === 0}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                {selectedOgrenciler.length > 0 ? `${selectedOgrenciler.length} Öğrenci Ekle` : 'Öğrenci Seç'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yeni Sınıf Ekle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-500" />
                Yeni Sınıf Oluştur
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Seviye</label>
                  <select
                    value={formData.seviye}
                    onChange={(e) => setFormData({ ...formData, seviye: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {seviyeler.map((s) => (
                      <option key={s} value={s}>{s}. Sınıf</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Şube</label>
                  <select
                    value={formData.sube}
                    onChange={(e) => setFormData({ ...formData, sube: e.target.value })}
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {subeler.map((s) => (
                      <option key={s} value={s}>{s} Şubesi</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-accent/50 border border-border text-center">
                <span className="text-2xl font-bold text-foreground">
                  {formData.seviye}-{formData.sube}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Sınıf Öğretmeni <span className="text-muted-foreground font-normal">(opsiyonel)</span>
                </label>
                <input
                  type="text"
                  value={formData.ogretmen}
                  onChange={(e) => setFormData({ ...formData, ogretmen: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Öğretmen adı"
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
                onClick={handleAddSinif}
                disabled={saving}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sınıf Düzenle Modal */}
      {editingSinif && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Pencil className="h-5 w-5 text-purple-500" />
                Sınıf Düzenle
              </h3>
              <button onClick={() => setEditingSinif(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-accent/50 border border-border text-center">
                <span className="text-2xl font-bold text-foreground">{editingSinif.ad}</span>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Sınıf Öğretmeni</label>
                <input
                  type="text"
                  value={editingSinif.ogretmen || ''}
                  onChange={(e) => setEditingSinif({ ...editingSinif, ogretmen: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Öğretmen adı"
                />
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setEditingSinif(null)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleEditSinif}
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
