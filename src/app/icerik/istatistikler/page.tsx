'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trophy, School, Users, MapPin, TrendingUp, Search, ArrowUpDown } from 'lucide-react'

// LGS 500 Tam Puan İstatistikleri (2018-2025)
const LGS_500_YILLIK = [
  { year: 2018, resmi: 4, resmiYuzde: 22, resmiIl: 4, ozel: 14, ozelYuzde: 78, ozelIl: 8, toplam: 18, toplamIl: 10 },
  { year: 2019, resmi: 222, resmiYuzde: 39, resmiIl: 56, ozel: 343, ozelYuzde: 61, ozelIl: 52, toplam: 565, toplamIl: 66 },
  { year: 2020, resmi: 67, resmiYuzde: 37, resmiIl: 29, ozel: 114, ozelYuzde: 63, ozelIl: 33, toplam: 181, toplamIl: 42 },
  { year: 2021, resmi: 31, resmiYuzde: 32, resmiIl: 21, ozel: 66, ozelYuzde: 68, ozelIl: 28, toplam: 97, toplamIl: 36 },
  { year: 2022, resmi: 67, resmiYuzde: 35, resmiIl: 34, ozel: 127, ozelYuzde: 65, ozelIl: 40, toplam: 194, toplamIl: 49 },
  { year: 2023, resmi: 249, resmiYuzde: 44, resmiIl: 55, ozel: 313, ozelYuzde: 56, ozelIl: 50, toplam: 562, toplamIl: 68 },
  { year: 2024, resmi: 176, resmiYuzde: 43, resmiIl: 50, ozel: 237, ozelYuzde: 57, ozelIl: 45, toplam: 413, toplamIl: 58 },
  { year: 2025, resmi: 308, resmiYuzde: 43, resmiIl: 61, ozel: 411, ozelYuzde: 57, ozelIl: 52, toplam: 719, toplamIl: 66 },
]

// 2025 İllere Göre Tam Puan Dağılımı
const LGS_2025_ILLER = [
  { sira: 1, il: "Adana", ogrenci: 26, yuzde: 3.62 },
  { sira: 2, il: "Adıyaman", ogrenci: 2, yuzde: 0.28 },
  { sira: 3, il: "Afyonkarahisar", ogrenci: 9, yuzde: 1.25 },
  { sira: 4, il: "Aksaray", ogrenci: 5, yuzde: 0.70 },
  { sira: 5, il: "Amasya", ogrenci: 6, yuzde: 0.83 },
  { sira: 6, il: "Ankara", ogrenci: 56, yuzde: 7.79 },
  { sira: 7, il: "Antalya", ogrenci: 36, yuzde: 5.01 },
  { sira: 8, il: "Aydın", ogrenci: 8, yuzde: 1.11 },
  { sira: 9, il: "Balıkesir", ogrenci: 14, yuzde: 1.95 },
  { sira: 10, il: "Bartın", ogrenci: 1, yuzde: 0.14 },
  { sira: 11, il: "Batman", ogrenci: 3, yuzde: 0.42 },
  { sira: 12, il: "Bingöl", ogrenci: 1, yuzde: 0.14 },
  { sira: 13, il: "Bitlis", ogrenci: 1, yuzde: 0.14 },
  { sira: 14, il: "Bolu", ogrenci: 2, yuzde: 0.28 },
  { sira: 15, il: "Burdur", ogrenci: 1, yuzde: 0.14 },
  { sira: 16, il: "Bursa", ogrenci: 20, yuzde: 2.78 },
  { sira: 17, il: "Çanakkale", ogrenci: 6, yuzde: 0.83 },
  { sira: 18, il: "Çorum", ogrenci: 4, yuzde: 0.56 },
  { sira: 19, il: "Denizli", ogrenci: 8, yuzde: 1.11 },
  { sira: 20, il: "Diyarbakır", ogrenci: 10, yuzde: 1.39 },
  { sira: 21, il: "Düzce", ogrenci: 1, yuzde: 0.14 },
  { sira: 22, il: "Edirne", ogrenci: 4, yuzde: 0.56 },
  { sira: 23, il: "Elazığ", ogrenci: 3, yuzde: 0.42 },
  { sira: 24, il: "Erzincan", ogrenci: 2, yuzde: 0.28 },
  { sira: 25, il: "Erzurum", ogrenci: 8, yuzde: 1.11 },
  { sira: 26, il: "Eskişehir", ogrenci: 10, yuzde: 1.39 },
  { sira: 27, il: "Gaziantep", ogrenci: 23, yuzde: 3.20 },
  { sira: 28, il: "Giresun", ogrenci: 3, yuzde: 0.42 },
  { sira: 29, il: "Gümüşhane", ogrenci: 1, yuzde: 0.14 },
  { sira: 30, il: "Hatay", ogrenci: 5, yuzde: 0.70 },
  { sira: 31, il: "Isparta", ogrenci: 6, yuzde: 0.83 },
  { sira: 32, il: "İstanbul", ogrenci: 163, yuzde: 22.67 },
  { sira: 33, il: "İzmir", ogrenci: 49, yuzde: 6.82 },
  { sira: 34, il: "Kahramanmaraş", ogrenci: 10, yuzde: 1.39 },
  { sira: 35, il: "Karabük", ogrenci: 2, yuzde: 0.28 },
  { sira: 36, il: "Karaman", ogrenci: 2, yuzde: 0.28 },
  { sira: 37, il: "Kastamonu", ogrenci: 3, yuzde: 0.42 },
  { sira: 38, il: "Kayseri", ogrenci: 18, yuzde: 2.50 },
  { sira: 39, il: "Kırıkkale", ogrenci: 3, yuzde: 0.42 },
  { sira: 40, il: "Kırşehir", ogrenci: 7, yuzde: 0.97 },
  { sira: 41, il: "Kocaeli", ogrenci: 19, yuzde: 2.64 },
  { sira: 42, il: "Konya", ogrenci: 29, yuzde: 4.03 },
  { sira: 43, il: "Kütahya", ogrenci: 5, yuzde: 0.70 },
  { sira: 44, il: "Malatya", ogrenci: 8, yuzde: 1.11 },
  { sira: 45, il: "Manisa", ogrenci: 8, yuzde: 1.11 },
  { sira: 46, il: "Mardin", ogrenci: 5, yuzde: 0.70 },
  { sira: 47, il: "Mersin", ogrenci: 17, yuzde: 2.36 },
  { sira: 48, il: "Muğla", ogrenci: 4, yuzde: 0.56 },
  { sira: 49, il: "Muş", ogrenci: 2, yuzde: 0.28 },
  { sira: 50, il: "Nevşehir", ogrenci: 3, yuzde: 0.42 },
  { sira: 51, il: "Niğde", ogrenci: 3, yuzde: 0.42 },
  { sira: 52, il: "Ordu", ogrenci: 1, yuzde: 0.14 },
  { sira: 53, il: "Osmaniye", ogrenci: 4, yuzde: 0.56 },
  { sira: 54, il: "Rize", ogrenci: 1, yuzde: 0.14 },
  { sira: 55, il: "Sakarya", ogrenci: 7, yuzde: 0.97 },
  { sira: 56, il: "Samsun", ogrenci: 15, yuzde: 2.09 },
  { sira: 57, il: "Sivas", ogrenci: 5, yuzde: 0.70 },
  { sira: 58, il: "Şanlıurfa", ogrenci: 4, yuzde: 0.56 },
  { sira: 59, il: "Tekirdağ", ogrenci: 8, yuzde: 1.11 },
  { sira: 60, il: "Tokat", ogrenci: 5, yuzde: 0.70 },
  { sira: 61, il: "Trabzon", ogrenci: 11, yuzde: 1.53 },
  { sira: 62, il: "Uşak", ogrenci: 4, yuzde: 0.56 },
  { sira: 63, il: "Van", ogrenci: 3, yuzde: 0.42 },
  { sira: 64, il: "Yalova", ogrenci: 2, yuzde: 0.28 },
  { sira: 65, il: "Yozgat", ogrenci: 1, yuzde: 0.14 },
  { sira: 66, il: "Zonguldak", ogrenci: 3, yuzde: 0.42 },
]

type SortField = 'sira' | 'il' | 'ogrenci' | 'yuzde'
type SortOrder = 'asc' | 'desc'

export default function IstatistiklerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('ogrenci')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const filteredAndSortedIller = useMemo(() => {
    let result = [...LGS_2025_ILLER]

    // Filter
    if (searchQuery) {
      result = result.filter(il =>
        il.il.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal, 'tr')
          : bVal.localeCompare(aVal, 'tr')
      }
      return sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })

    return result
  }, [searchQuery, sortField, sortOrder])

  // Top 10 iller
  const top10Iller = useMemo(() => {
    return [...LGS_2025_ILLER].sort((a, b) => b.ogrenci - a.ogrenci).slice(0, 10)
  }, [])

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 mb-4">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-500">2025 LGS Sonuçları</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">LGS İstatistikleri</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            500 tam puan yapan öğrenci sayıları ve il bazlı dağılımlar
          </p>
        </div>

        {/* 2025 Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="pt-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-4xl font-black text-yellow-500">719</div>
              <div className="text-sm text-muted-foreground">2025 Tam Puan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary">66</div>
              <div className="text-sm text-muted-foreground">İl</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <School className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-500">308</div>
              <div className="text-sm text-muted-foreground">Resmi Okul</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <School className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-500">411</div>
              <div className="text-sm text-muted-foreground">Özel Okul</div>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 İller */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              2025 En Başarılı 10 İl
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {top10Iller.map((il, index) => (
                <div
                  key={il.il}
                  className={`relative p-4 rounded-lg border ${
                    index === 0
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : index === 1
                      ? 'bg-slate-400/10 border-slate-400/30'
                      : index === 2
                      ? 'bg-orange-600/10 border-orange-600/30'
                      : 'border-border'
                  }`}
                >
                  <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? 'bg-yellow-500 text-black'
                      : index === 1
                      ? 'bg-slate-400 text-black'
                      : index === 2
                      ? 'bg-orange-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-center pt-2">
                    <div className="font-semibold text-foreground">{il.il}</div>
                    <div className="text-2xl font-bold text-primary mt-1">{il.ogrenci}</div>
                    <div className="text-xs text-muted-foreground">%{il.yuzde}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Yıllık Karşılaştırma Tablosu */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Yıllara Göre 500 Tam Puan Dağılımı
            </CardTitle>
            <CardDescription>2018-2025 resmi ve özel okul karşılaştırması</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th rowSpan={2} className="text-center py-3 px-2 font-semibold text-foreground bg-accent/30 min-w-[60px]">
                      Yıl
                    </th>
                    <th colSpan={3} className="text-center py-2 px-2 font-semibold text-green-500 border-b border-border bg-green-500/10">
                      <div className="flex items-center justify-center gap-1">
                        <School className="h-4 w-4" />
                        Resmî Okul
                      </div>
                    </th>
                    <th colSpan={3} className="text-center py-2 px-2 font-semibold text-purple-500 border-b border-border bg-purple-500/10">
                      <div className="flex items-center justify-center gap-1">
                        <School className="h-4 w-4" />
                        Özel Okul
                      </div>
                    </th>
                    <th colSpan={3} className="text-center py-2 px-2 font-semibold text-primary border-b border-border bg-primary/10">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4" />
                        Toplam
                      </div>
                    </th>
                  </tr>
                  <tr className="border-b border-border text-xs">
                    <th className="text-center py-2 px-2 text-muted-foreground bg-green-500/5">Öğrenci</th>
                    <th className="text-center py-2 px-2 text-muted-foreground bg-green-500/5">Yüzde</th>
                    <th className="text-center py-2 px-2 text-muted-foreground bg-green-500/5">İl</th>
                    <th className="text-center py-2 px-2 text-muted-foreground bg-purple-500/5">Öğrenci</th>
                    <th className="text-center py-2 px-2 text-muted-foreground bg-purple-500/5">Yüzde</th>
                    <th className="text-center py-2 px-2 text-muted-foreground bg-purple-500/5">İl</th>
                    <th className="text-center py-2 px-2 text-muted-foreground bg-primary/5">Öğrenci</th>
                    <th className="text-center py-2 px-2 text-muted-foreground bg-primary/5">Yüzde</th>
                    <th className="text-center py-2 px-2 text-muted-foreground bg-primary/5">İl</th>
                  </tr>
                </thead>
                <tbody>
                  {LGS_500_YILLIK.map((stat) => (
                    <tr
                      key={stat.year}
                      className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${
                        stat.year === 2025 ? 'bg-yellow-500/10' : ''
                      }`}
                    >
                      <td className="text-center py-3 px-2 font-bold text-foreground bg-accent/30">
                        {stat.year}
                        {stat.year === 2025 && (
                          <span className="ml-1 text-yellow-500">★</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-2 font-medium text-green-500 bg-green-500/5">
                        {stat.resmi}
                      </td>
                      <td className="text-center py-3 px-2 text-muted-foreground bg-green-500/5">
                        %{stat.resmiYuzde}
                      </td>
                      <td className="text-center py-3 px-2 text-muted-foreground bg-green-500/5">
                        {stat.resmiIl}
                      </td>
                      <td className="text-center py-3 px-2 font-medium text-purple-500 bg-purple-500/5">
                        {stat.ozel}
                      </td>
                      <td className="text-center py-3 px-2 text-muted-foreground bg-purple-500/5">
                        %{stat.ozelYuzde}
                      </td>
                      <td className="text-center py-3 px-2 text-muted-foreground bg-purple-500/5">
                        {stat.ozelIl}
                      </td>
                      <td className="text-center py-3 px-2 font-bold text-primary bg-primary/5">
                        {stat.toplam}
                      </td>
                      <td className="text-center py-3 px-2 text-muted-foreground bg-primary/5">
                        %100
                      </td>
                      <td className="text-center py-3 px-2 text-muted-foreground bg-primary/5">
                        {stat.toplamIl}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-accent/50">
                    <td className="text-center py-3 px-2 font-bold text-foreground">TOPLAM</td>
                    <td className="text-center py-3 px-2 font-bold text-green-500">
                      {LGS_500_YILLIK.reduce((sum, s) => sum + s.resmi, 0).toLocaleString('tr-TR')}
                    </td>
                    <td className="text-center py-3 px-2 text-muted-foreground">
                      %{Math.round(LGS_500_YILLIK.reduce((sum, s) => sum + s.resmi, 0) / LGS_500_YILLIK.reduce((sum, s) => sum + s.toplam, 0) * 100)}
                    </td>
                    <td className="text-center py-3 px-2 text-muted-foreground">-</td>
                    <td className="text-center py-3 px-2 font-bold text-purple-500">
                      {LGS_500_YILLIK.reduce((sum, s) => sum + s.ozel, 0).toLocaleString('tr-TR')}
                    </td>
                    <td className="text-center py-3 px-2 text-muted-foreground">
                      %{Math.round(LGS_500_YILLIK.reduce((sum, s) => sum + s.ozel, 0) / LGS_500_YILLIK.reduce((sum, s) => sum + s.toplam, 0) * 100)}
                    </td>
                    <td className="text-center py-3 px-2 text-muted-foreground">-</td>
                    <td className="text-center py-3 px-2 font-bold text-primary">
                      {LGS_500_YILLIK.reduce((sum, s) => sum + s.toplam, 0).toLocaleString('tr-TR')}
                    </td>
                    <td className="text-center py-3 px-2 text-muted-foreground">%100</td>
                    <td className="text-center py-3 px-2 text-muted-foreground">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* İl Bazlı 2025 Detay Tablosu */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  2025 İl Bazlı Tam Puan Dağılımı
                </CardTitle>
                <CardDescription>66 ilden toplam 719 öğrenci</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="İl ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th
                      className="text-center py-3 px-3 font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleSort('sira')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        #
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-3 font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleSort('il')}
                    >
                      <div className="flex items-center gap-1">
                        İl
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="text-center py-3 px-3 font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleSort('ogrenci')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Öğrenci Sayısı
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="text-center py-3 px-3 font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleSort('yuzde')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Yüzde
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-center py-3 px-3 font-semibold text-foreground">
                      Görsel
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedIller.map((il, index) => {
                    const maxOgrenci = Math.max(...LGS_2025_ILLER.map(i => i.ogrenci))
                    const barWidth = (il.ogrenci / maxOgrenci) * 100
                    const isTop3 = LGS_2025_ILLER.sort((a, b) => b.ogrenci - a.ogrenci).slice(0, 3).includes(il)

                    return (
                      <tr
                        key={il.il}
                        className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${
                          isTop3 ? 'bg-yellow-500/5' : ''
                        }`}
                      >
                        <td className="text-center py-3 px-3 text-muted-foreground">
                          {il.sira}
                        </td>
                        <td className="py-3 px-3 font-medium text-foreground">
                          {il.il}
                          {isTop3 && <span className="ml-1 text-yellow-500">★</span>}
                        </td>
                        <td className="text-center py-3 px-3">
                          <span className={`inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-md font-bold ${
                            il.ogrenci >= 50
                              ? 'bg-primary text-primary-foreground'
                              : il.ogrenci >= 20
                              ? 'bg-primary/20 text-primary'
                              : il.ogrenci >= 10
                              ? 'bg-accent text-foreground'
                              : 'text-muted-foreground'
                          }`}>
                            {il.ogrenci}
                          </span>
                        </td>
                        <td className="text-center py-3 px-3 text-muted-foreground">
                          %{il.yuzde.toFixed(2)}
                        </td>
                        <td className="py-3 px-3">
                          <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {filteredAndSortedIller.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aramanıza uygun il bulunamadı.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
