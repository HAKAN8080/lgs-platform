'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Loader2, ArrowLeft, BarChart3 } from 'lucide-react'
import Link from 'next/link'

interface Deneme {
  id: string
  yayinAdi: string
  denemeAdi: string
  tarih: string
  toplamNet: number
  puan: number
  netler: Record<string, number>
}

const DERSLER = [
  { key: 'toplam', label: 'Toplam Net', color: '#6366f1', maxNet: 80 },
  { key: 'turkce', label: 'Türkçe', color: '#3b82f6', maxNet: 20 },
  { key: 'matematik', label: 'Matematik', color: '#ef4444', maxNet: 20 },
  { key: 'fen', label: 'Fen', color: '#22c55e', maxNet: 20 },
  { key: 'inkilap', label: 'İnkılap', color: '#f97316', maxNet: 10 },
  { key: 'din', label: 'Din', color: '#a855f7', maxNet: 10 },
  { key: 'ingilizce', label: 'İngilizce', color: '#06b6d4', maxNet: 10 },
]

// Karne kayıtlarındaki farklı key formatlarını normalize et
const KEY_ALTS: Record<string, string> = {
  turkce: 'turkce', türkçe: 'turkce', 'türkçe': 'turkce',
  matematik: 'matematik', math: 'matematik',
  fen: 'fen',
  inkilap: 'inkilap', inkılap: 'inkilap', 'i̇nkılap': 'inkilap', tarih: 'inkilap',
  din: 'din',
  ingilizce: 'ingilizce', 'i̇ngilizce': 'ingilizce', english: 'ingilizce',
}

function normalizeNetler(raw: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [k, v] of Object.entries(raw)) {
    const norm = KEY_ALTS[k.toLowerCase().trim()] ?? k
    result[norm] = v
  }
  return result
}

function trend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable'
  const last = values[values.length - 1]
  const prev = values.slice(0, -1).reduce((a, b) => a + b, 0) / (values.length - 1)
  const diff = last - prev
  if (diff > 1) return 'up'
  if (diff < -1) return 'down'
  return 'stable'
}

export default function NetTakipPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [denemeler, setDenemeler] = useState<Deneme[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [selected, setSelected] = useState<string>('toplam')

  useEffect(() => {
    if (!loading && !user) router.push('/giris')
  }, [user, loading, router])

  useEffect(() => {
    const fetch = async () => {
      if (!user || !db) { setLoadingData(false); return }
      try {
        const q = query(collection(db, 'denemeler'), where('userId', '==', user.uid))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Deneme[]
        data.sort((a, b) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime())
        setDenemeler(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingData(false)
      }
    }
    if (user) fetch()
  }, [user])

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Chart verisi
  const chartData = denemeler.map((d) => {
    const netler = normalizeNetler(d.netler ?? {})
    const row: Record<string, string | number> = {
      name: `${d.yayinAdi} ${d.denemeAdi}`,
      tarih: new Date(d.tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
      toplam: Math.round(d.toplamNet * 10) / 10,
    }
    for (const der of DERSLER.filter(x => x.key !== 'toplam')) {
      row[der.key] = Math.round((netler[der.key] ?? 0) * 10) / 10
    }
    return row
  })

  const selectedDers = DERSLER.find(d => d.key === selected)!
  const values = chartData.map(r => r[selected] as number)
  const avg = values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0
  const max = values.length ? Math.max(...values) : 0
  const min = values.length ? Math.min(...values) : 0
  const trnd = trend(values)

  const showAllLines = selected === 'toplam' && false // toplam seçiliyken tek çizgi
  const linesToShow = selected === 'toplam'
    ? [DERSLER[0]] // sadece toplam
    : [selectedDers]

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        {/* Back */}
        <Link href="/panel" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Panele Dön
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-green-500/10">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Net Takip</h1>
            <p className="text-sm text-muted-foreground">Deneme sınavlarındaki net gelişimin</p>
          </div>
        </div>

        {denemeler.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Henüz deneme yok</p>
            <p className="text-sm mt-2">Karne yükleyerek veya deneme ekleyerek başla</p>
            <Link href="/panel/karne-ekle" className="inline-block mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Karne Ekle
            </Link>
          </div>
        ) : (
          <>
            {/* Ders Seçici */}
            <div className="flex flex-wrap gap-2 mb-6">
              {DERSLER.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setSelected(d.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    selected === d.key
                      ? 'text-white border-transparent'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground'
                  }`}
                  style={selected === d.key ? { backgroundColor: d.color, borderColor: d.color } : {}}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">Ortalama</div>
                <div className="text-2xl font-bold text-foreground">{avg}</div>
                <div className="text-xs text-muted-foreground">/ {selectedDers.maxNet}</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">En Yüksek</div>
                <div className="text-2xl font-bold text-green-500">{max}</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">En Düşük</div>
                <div className="text-2xl font-bold text-red-500">{min}</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">Trend</div>
                <div className={`flex items-center gap-1 text-xl font-bold ${
                  trnd === 'up' ? 'text-green-500' : trnd === 'down' ? 'text-red-500' : 'text-muted-foreground'
                }`}>
                  {trnd === 'up' ? <TrendingUp className="h-5 w-5" /> : trnd === 'down' ? <TrendingDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
                  {trnd === 'up' ? 'Artış' : trnd === 'down' ? 'Düşüş' : 'Stabil'}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">
                {selectedDers.label} — Deneme Bazlı Gelişim
              </h2>
              {denemeler.length < 2 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Grafik için en az 2 deneme gerekiyor
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="tarih"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, selectedDers.maxNet]}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(val: number) => [val, selectedDers.label]}
                      labelFormatter={(label, payload) => {
                        const item = payload?.[0]?.payload
                        return item ? item.name : label
                      }}
                    />
                    <ReferenceLine
                      y={avg}
                      stroke={selectedDers.color}
                      strokeDasharray="4 4"
                      strokeOpacity={0.5}
                      label={{ value: `Ort: ${avg}`, fontSize: 10, fill: selectedDers.color, position: 'insideTopRight' }}
                    />
                    {linesToShow.map((d) => (
                      <Line
                        key={d.key}
                        type="monotone"
                        dataKey={d.key}
                        stroke={d.color}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: d.color, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Tüm Dersler Özet Tablosu */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Tüm Dersler Özeti</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-muted-foreground font-medium">Ders</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Ort.</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Max</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Son</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DERSLER.map((d) => {
                      const vals = chartData.map(r => r[d.key] as number)
                      const a = vals.length ? Math.round(vals.reduce((x, y) => x + y, 0) / vals.length * 10) / 10 : 0
                      const mx = vals.length ? Math.max(...vals) : 0
                      const last = vals.length ? vals[vals.length - 1] : 0
                      const t = trend(vals)
                      const pct = Math.round((a / d.maxNet) * 100)
                      return (
                        <tr
                          key={d.key}
                          onClick={() => setSelected(d.key)}
                          className={`border-b border-border last:border-0 cursor-pointer transition-colors ${
                            selected === d.key ? 'bg-accent/50' : 'hover:bg-accent/30'
                          }`}
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                              <span className="font-medium text-foreground">{d.label}</span>
                            </div>
                            <div className="mt-1 ml-4 h-1.5 w-24 rounded-full bg-border overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                            </div>
                          </td>
                          <td className="text-center px-4 py-3 font-medium text-foreground">{a}</td>
                          <td className="text-center px-4 py-3 text-green-500 font-medium">{mx}</td>
                          <td className="text-center px-4 py-3 font-medium text-foreground">{last}</td>
                          <td className="text-center px-4 py-3">
                            {t === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />
                            ) : t === 'down' ? (
                              <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />
                            ) : (
                              <Minus className="h-4 w-4 text-muted-foreground mx-auto" />
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
