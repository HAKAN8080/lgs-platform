'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SCHOOLS_DATA, SCHOOL_TYPES, getSchoolTypeColor, type School } from '@/lib/constants/schools'
import { School as SchoolIcon, Search, Filter, Target } from 'lucide-react'

export default function TabanPuanlariPage() {
  const [filters, setFilters] = useState({
    ilce: '',
    tur: '',
    minPuan: 200,
    maxPuan: 500,
  })
  const [searchScore, setSearchScore] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Get unique districts
  const districts = useMemo(() => {
    const unique = [...new Set(SCHOOLS_DATA.map(s => s.ilce))].sort()
    return unique
  }, [])

  // Filter schools
  const filteredSchools = useMemo(() => {
    return SCHOOLS_DATA.filter(school => {
      if (filters.ilce && school.ilce !== filters.ilce) return false
      if (filters.tur && school.tur !== filters.tur) return false
      if (school.puan < filters.minPuan || school.puan > filters.maxPuan) return false
      return true
    }).sort((a, b) => b.puan - a.puan)
  }, [filters])

  // Schools matching search score
  const matchingSchools = useMemo(() => {
    if (!searchScore) return []
    return SCHOOLS_DATA
      .filter(school => school.puan <= searchScore)
      .sort((a, b) => b.puan - a.puan)
      .slice(0, 10)
  }, [searchScore])

  // Stats
  const stats = useMemo(() => {
    if (filteredSchools.length === 0) return null
    return {
      maxPuan: Math.max(...filteredSchools.map(s => s.puan)),
      minPuan: Math.min(...filteredSchools.map(s => s.puan)),
      avgPuan: filteredSchools.reduce((sum, s) => sum + s.puan, 0) / filteredSchools.length,
      totalKontenjan: filteredSchools.reduce((sum, s) => sum + s.kontenjan, 0),
    }
  }, [filteredSchools])

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 mb-4">
            <SchoolIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-500">2024 Verileri</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Lise Taban Puanları</h1>
          <p className="mt-4 text-muted-foreground">
            İstanbul liseleri için taban puanlar, yüzdelik dilimler ve kontenjanlar
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrele
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">İlçe</label>
                <select
                  value={filters.ilce}
                  onChange={(e) => setFilters(prev => ({ ...prev, ilce: e.target.value }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Tümü</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Lise Türü</label>
                <select
                  value={filters.tur}
                  onChange={(e) => setFilters(prev => ({ ...prev, tur: e.target.value }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Tümü</option>
                  {SCHOOL_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Min Puan</label>
                <Input
                  type="number"
                  min={200}
                  max={500}
                  value={filters.minPuan}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPuan: parseInt(e.target.value) || 200 }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Max Puan</label>
                <Input
                  type="number"
                  min={200}
                  max={500}
                  value={filters.maxPuan}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPuan: parseInt(e.target.value) || 500 }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">En Yüksek Puan</div>
                <div className="text-2xl font-bold text-green-500">{stats.maxPuan.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">En Düşük Puan</div>
                <div className="text-2xl font-bold text-red-500">{stats.minPuan.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Ortalama Puan</div>
                <div className="text-2xl font-bold text-blue-500">{stats.avgPuan.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Toplam Kontenjan</div>
                <div className="text-2xl font-bold text-purple-500">{stats.totalKontenjan.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schools Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Liseler ({filteredSchools.length} sonuç)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Lise Adı</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">İlçe</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tür</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Taban Puan</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Yüzdelik</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Kontenjan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchools.map((school, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground">{school.lise}</div>
                        <div className="text-xs text-muted-foreground">{school.dil}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{school.ilce}</td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: `${getSchoolTypeColor(school.tur)}15`,
                            color: getSchoolTypeColor(school.tur)
                          }}
                        >
                          {school.tur}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-foreground">{school.puan.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-sm text-muted-foreground">%{school.yuzdelik.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-sm text-muted-foreground">{school.kontenjan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Score Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Puanına Göre Lise Bul
            </CardTitle>
            <CardDescription>
              LGS puanını gir, yerleşebileceğin en iyi 10 liseyi gör
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Input
                type="number"
                min={200}
                max={500}
                step={0.01}
                placeholder="LGS Puanını Gir (örn: 450)"
                value={searchScore || ''}
                onChange={(e) => setSearchScore(parseFloat(e.target.value) || null)}
                className="max-w-xs"
              />
              <Button onClick={() => setShowResults(true)} disabled={!searchScore}>
                <Search className="h-4 w-4 mr-2" />
                Liseleri Göster
              </Button>
            </div>

            {showResults && searchScore && matchingSchools.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  <strong className="text-foreground">{searchScore.toFixed(2)}</strong> puanla yerleşebileceğin en iyi 10 lise:
                </p>
                {matchingSchools.map((school, index) => {
                  const diff = searchScore - school.puan
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                      style={{ borderLeftColor: getSchoolTypeColor(school.tur), borderLeftWidth: 4 }}
                    >
                      <div>
                        <div className="font-medium text-foreground">{school.lise}</div>
                        <div className="text-sm text-muted-foreground">
                          {school.ilce} • {school.tur} • {school.dil}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-foreground">{school.puan.toFixed(2)}</div>
                        <div className="text-sm text-green-500">+{diff.toFixed(2)} fark</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {showResults && searchScore && matchingSchools.length === 0 && (
              <p className="text-muted-foreground">Bu puanla yerleşebilecek lise bulunamadı.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
