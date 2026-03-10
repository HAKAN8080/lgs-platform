'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, usePremium } from '@/contexts/auth-context'
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
  LabelList,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Loader2, ArrowLeft, BarChart3, Lock, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Deneme {
  id: string
  yayinAdi: string
  denemeAdi: string
  tarih: string
  toplamNet: number
  puan: number
  netler: Record<string, number>
  tip?: 'deneme' | 'izleme'
  soruSayisi?: Record<string, number>
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
  turkce: 'turkce',
  matematik: 'matematik', math: 'matematik',
  fen: 'fen',
  inkilap: 'inkilap', tarih: 'inkilap',
  din: 'din',
  ingilizce: 'ingilizce', english: 'ingilizce',
}

function normalizeKey(raw: string): string {
  const s = raw.toLowerCase().trim()
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i')
    .replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ç/g, 'c')
  return KEY_ALTS[s] ?? KEY_ALTS[raw.toLowerCase().trim()] ?? raw.toLowerCase().trim()
}

function normalizeNetler(raw: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [k, v] of Object.entries(raw)) {
    result[normalizeKey(k)] = v
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

// ─── Demo data ───────────────────────────────────────────────────────────────
const DEMO_CHART = [
  { tarih: '10 Oca', toplam: 38.4, turkce: 12.1, matematik: 8.2, fen: 10.3, inkilap: 4.1, din: 3.8, ingilizce: 4.2 },
  { tarih: '25 Oca', toplam: 41.2, turkce: 13.5, matematik: 9.1, fen: 11.2, inkilap: 4.5, din: 4.1, ingilizce: 4.8 },
  { tarih: '08 Şub', toplam: 44.7, turkce: 14.2, matematik: 10.3, fen: 12.1, inkilap: 4.8, din: 4.3, ingilizce: 5.1 },
  { tarih: '22 Şub', toplam: 47.1, turkce: 15.1, matematik: 11.8, fen: 12.8, inkilap: 5.0, din: 4.6, ingilizce: 5.4 },
  { tarih: '10 Mar', toplam: 49.3, turkce: 15.8, matematik: 12.4, fen: 13.2, inkilap: 5.1, din: 4.8, ingilizce: 5.7 },
  { tarih: '24 Mar', toplam: 52.1, turkce: 16.3, matematik: 13.9, fen: 14.1, inkilap: 5.3, din: 5.0, ingilizce: 6.2 },
]

// ─── Slide 1: Stats + Ders Seçici ────────────────────────────────────────────
function Slide1() {
  const dersButtons = [
    { key: 'toplam', label: 'Toplam Net' },
    { key: 'turkce', label: 'Türkçe' },
    { key: 'matematik', label: 'Matematik' },
    { key: 'fen', label: 'Fen' },
    { key: 'inkilap', label: 'İnkılap' },
    { key: 'din', label: 'Din' },
    { key: 'ingilizce', label: 'İngilizce' },
  ]

  return (
    <div className="p-5 pointer-events-none select-none space-y-5">
      {/* Ders selector */}
      <div className="flex flex-wrap gap-2">
        {dersButtons.map((d) => (
          <div
            key={d.key}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              d.key === 'toplam'
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-card border-border text-muted-foreground'
            }`}
          >
            {d.label}
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Ortalama</div>
          <div className="text-2xl font-bold text-foreground">45.5</div>
          <div className="text-xs text-muted-foreground">/ 80</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">En Yüksek</div>
          <div className="text-2xl font-bold text-green-500">52.1</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">En Düşük</div>
          <div className="text-2xl font-bold text-red-500">38.4</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Trend</div>
          <div className="flex items-center gap-1 text-xl font-bold text-green-500">
            <TrendingUp className="h-5 w-5" />
            Artış
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Slide 2: SVG Line Chart ─────────────────────────────────────────────────
function Slide2() {
  const [dashOffset, setDashOffset] = useState(500)

  useEffect(() => {
    const t = setTimeout(() => setDashOffset(0), 100)
    return () => clearTimeout(t)
  }, [])

  // Chart dimensions
  const W = 560
  const H = 160
  const padL = 36
  const padR = 16
  const padT = 12
  const padB = 28

  const chartW = W - padL - padR
  const chartH = H - padT - padB

  const minY = 0
  const maxY = 80

  const xs = DEMO_CHART.map((_, i) => padL + (i / (DEMO_CHART.length - 1)) * chartW)
  const ys = DEMO_CHART.map((d) => padT + chartH - ((d.toplam - minY) / (maxY - minY)) * chartH)

  const polyPoints = xs.map((x, i) => `${x},${ys[i]}`).join(' ')

  const avgY = padT + chartH - ((45.5 - minY) / (maxY - minY)) * chartH

  // Area fill path
  const areaPath =
    `M ${xs[0]},${ys[0]} ` +
    xs.slice(1).map((x, i) => `L ${x},${ys[i + 1]}`).join(' ') +
    ` L ${xs[xs.length - 1]},${padT + chartH} L ${xs[0]},${padT + chartH} Z`

  const yTicks = [0, 20, 40, 60, 80]

  return (
    <div className="p-5 pointer-events-none select-none">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Toplam Net — Deneme Bazlı Gelişim
        </h2>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          className="overflow-visible"
        >
          {/* Grid lines */}
          {yTicks.map((tick) => {
            const ty = padT + chartH - ((tick - minY) / (maxY - minY)) * chartH
            return (
              <line
                key={tick}
                x1={padL}
                y1={ty}
                x2={W - padR}
                y2={ty}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4 4"
              />
            )
          })}

          {/* Y axis labels */}
          {yTicks.map((tick) => {
            const ty = padT + chartH - ((tick - minY) / (maxY - minY)) * chartH
            return (
              <text
                key={tick}
                x={padL - 4}
                y={ty + 4}
                textAnchor="end"
                fontSize={9}
                fill="rgba(255,255,255,0.35)"
              >
                {tick}
              </text>
            )
          })}

          {/* X axis labels */}
          {DEMO_CHART.map((d, i) => (
            <text
              key={d.tarih}
              x={xs[i]}
              y={H - 4}
              textAnchor="middle"
              fontSize={9}
              fill="rgba(255,255,255,0.35)"
            >
              {d.tarih}
            </text>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="#6366f1" fillOpacity={0.08} />

          {/* Average reference line */}
          <line
            x1={padL}
            y1={avgY}
            x2={W - padR}
            y2={avgY}
            stroke="#6366f1"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />
          <text
            x={W - padR - 2}
            y={avgY - 4}
            textAnchor="end"
            fontSize={9}
            fill="#6366f1"
            fillOpacity={0.7}
          >
            Ort: 45.5
          </text>

          {/* Line */}
          <polyline
            points={polyPoints}
            fill="none"
            stroke="#6366f1"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="500"
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
          />

          {/* Dots */}
          {xs.map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={ys[i]}
              r={4}
              fill="#6366f1"
              stroke="none"
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

// ─── Slide 3: Tüm Dersler Özet Tablosu ───────────────────────────────────────
function Slide3() {
  const rows = [
    { label: 'Toplam Net', color: '#6366f1', avg: 45.5, max: 52.1, son: 52.1, trend: 'up' },
    { label: 'Türkçe',     color: '#3b82f6', avg: 14.5, max: 16.3, son: 16.3, trend: 'up' },
    { label: 'Matematik',  color: '#ef4444', avg: 10.9, max: 13.9, son: 13.9, trend: 'up' },
    { label: 'Fen',        color: '#22c55e', avg: 12.3, max: 14.1, son: 14.1, trend: 'up' },
    { label: 'İnkılap',    color: '#f97316', avg: 4.8,  max: 5.3,  son: 5.3,  trend: 'stable' },
    { label: 'Din',        color: '#a855f7', avg: 4.4,  max: 5.0,  son: 5.0,  trend: 'stable' },
    { label: 'İngilizce',  color: '#06b6d4', avg: 5.2,  max: 6.2,  son: 6.2,  trend: 'up' },
  ]

  return (
    <div className="p-5 pointer-events-none select-none">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground text-sm">Tüm Dersler Özeti</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-2.5 text-muted-foreground font-medium">Ders</th>
                <th className="text-center px-3 py-2.5 text-muted-foreground font-medium">Ort.</th>
                <th className="text-center px-3 py-2.5 text-muted-foreground font-medium">Max</th>
                <th className="text-center px-3 py-2.5 text-muted-foreground font-medium">Son</th>
                <th className="text-center px-3 py-2.5 text-muted-foreground font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-border last:border-0">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: r.color }}
                      />
                      <span className="font-medium text-foreground">{r.label}</span>
                    </div>
                  </td>
                  <td className="text-center px-3 py-2.5 font-medium text-foreground">{r.avg}</td>
                  <td className="text-center px-3 py-2.5 text-green-500 font-medium">{r.max}</td>
                  <td className="text-center px-3 py-2.5 font-medium text-foreground">{r.son}</td>
                  <td className="text-center px-3 py-2.5">
                    {r.trend === 'up' ? (
                      <span className="inline-flex items-center gap-1 text-green-500 font-medium">
                        <TrendingUp className="h-3.5 w-3.5" /> Artış
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
                        <Minus className="h-3.5 w-3.5" /> Stabil
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── NetTakipTeaser ───────────────────────────────────────────────────────────
function NetTakipTeaser() {
  const [slideIndex, setSlideIndex] = useState(0)

  const slides = [
    { baslik: 'lgs-platform.com/panel/net-takip — İstatistikler', content: <Slide1 /> },
    { baslik: 'lgs-platform.com/panel/net-takip — Gelişim Grafiği', content: <Slide2 /> },
    { baslik: 'lgs-platform.com/panel/net-takip — Dersler Özeti', content: <Slide3 /> },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  const slide = slides[slideIndex]

  const features = [
    'Tüm deneme geçmişi grafikte',
    'Ders bazlı net takibi',
    'Trend analizi',
    'Karne verilerinden otomatik',
  ]

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-green-500/10">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Net Takip</h1>
            <p className="text-sm text-muted-foreground">Deneme sınavlarındaki net gelişimin</p>
          </div>
        </div>

        {/* Slide window */}
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-xl mb-6">
          {/* Lock badge */}
          <div className="absolute top-14 right-4 z-10 flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border px-3 py-1.5 shadow-lg">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">Premium</span>
          </div>

          {/* Fake browser bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 text-center text-[11px] text-muted-foreground font-medium">
              {slide.baslik}
            </div>
            <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
          </div>

          {/* Slide content */}
          <div className="min-h-[260px]">
            {slide.content}
          </div>

          {/* Blur overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
        </div>

        {/* Slide dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === slideIndex ? 'bg-primary w-5' : 'bg-border hover:bg-muted-foreground/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA card */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Premium ile Net Takip</span>
          </div>

          {/* Features list */}
          <ul className="space-y-2 mb-6">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="h-4 w-4 text-green-500 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">99₺</span>
              <span className="text-sm text-muted-foreground">/ay</span>
            </div>
            <Link
              href="/premium"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Premium'a Geç
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NetTakipPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { isPremium } = usePremium()
  const [denemeler, setDenemeler] = useState<Deneme[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [selected, setSelected] = useState<string>('toplam')
  const [displayMode, setDisplayMode] = useState<'net' | 'puan' | 'yuzde'>('net')
  const [tableFilter, setTableFilter] = useState<'tumu' | 'denemeler' | 'izlemeler'>('denemeler')
  const [yayinFilter, setYayinFilter] = useState<string>('tumu')

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

  if (!isPremium) return <NetTakipTeaser />

  // ─── Global filter (affects both chart and table) ─────────────────────────
  const yayinlar = Array.from(new Set(denemeler.map(d => d.yayinAdi))).sort()

  const baseFiltered = denemeler
    .filter(d => tableFilter === 'tumu' ? true : tableFilter === 'izlemeler' ? d.tip === 'izleme' : d.tip !== 'izleme')
    .filter(d => yayinFilter === 'tumu' ? true : d.yayinAdi === yayinFilter)

  // For the summary table
  const denemeleriForTable = baseFiltered

  // ─── Helper: get soruSayisi for a ders in a deneme ────────────────────────
  const getSoruSayisi = (d: Deneme, ders: string): number => {
    if (d.tip === 'izleme' && d.soruSayisi?.[ders]) {
      return d.soruSayisi[ders]
    }
    return DERSLER.find(x => x.key === ders)?.maxNet ?? 10
  }

  // ─── Active denemeler & chart data ───────────────────────────────────────
  const activeDenemeler = baseFiltered.filter(d => {
    if (selected === 'toplam') return d.tip !== 'izleme'
    if (d.tip === 'izleme') {
      const netler = normalizeNetler(d.netler ?? {})
      const val = netler[selected]
      return val !== undefined && val !== null && val > 0
    }
    return true
  })

  const chartData = activeDenemeler.map((d) => {
    const netler = normalizeNetler(d.netler ?? {})
    const label = `${d.yayinAdi} ${d.denemeAdi}`
    const tarihLabel = new Date(d.tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })

    if (selected === 'toplam') {
      return {
        name: label,
        tarih: tarihLabel,
        toplam: Math.round(d.toplamNet * 10) / 10,
        puan: Math.round(d.puan * 10) / 10,
        tip: d.tip ?? 'deneme',
      }
    }

    const net = Math.round((netler[selected] ?? 0) * 10) / 10
    const soruSayisi = getSoruSayisi(d, selected)
    const yuzde = soruSayisi > 0 ? Math.round((net / soruSayisi) * 1000) / 10 : 0

    return {
      name: label,
      tarih: tarihLabel,
      net,
      yuzde,
      tip: d.tip ?? 'deneme',
    }
  })

  // ─── Chart key & domain ───────────────────────────────────────────────────
  const selectedDers = DERSLER.find(d => d.key === selected)!

  let chartKey: string
  let chartDomain: [number, number]

  if (selected === 'toplam' && displayMode === 'puan') {
    chartKey = 'puan'
    chartDomain = [200, 500]
  } else if (selected === 'toplam' && displayMode === 'net') {
    chartKey = 'toplam'
    chartDomain = [0, 90]
  } else if (selected !== 'toplam' && displayMode === 'yuzde') {
    chartKey = 'yuzde'
    chartDomain = [0, 100]
  } else {
    // selected !== 'toplam' && displayMode === 'net'
    chartKey = 'net'
    chartDomain = [0, selectedDers.maxNet]
  }

  // ─── Stats ────────────────────────────────────────────────────────────────
  const values = chartData.map(r => (r as Record<string, unknown>)[chartKey] as number)
  const avg = values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0
  const max = values.length ? Math.max(...values) : 0
  const min = values.length ? Math.min(...values) : 0
  const trnd = trend(values)

  // ─── Chart title ──────────────────────────────────────────────────────────
  let chartTitle: string
  if (selected === 'toplam' && displayMode === 'net') {
    chartTitle = 'Toplam Net — Deneme Bazlı Gelişim'
  } else if (selected === 'toplam' && displayMode === 'puan') {
    chartTitle = 'LGS Puanı — Deneme Bazlı Gelişim'
  } else if (displayMode === 'yuzde') {
    chartTitle = `${selectedDers.label} — Başarı % Gelişim`
  } else {
    chartTitle = `${selectedDers.label} — Net Gelişim`
  }

  // ─── Tooltip unit ─────────────────────────────────────────────────────────
  const tooltipSuffix = displayMode === 'yuzde' ? '%' : ''

  // ─── Reference line label unit ────────────────────────────────────────────
  const refLineUnit = displayMode === 'yuzde' ? '%' : displayMode === 'puan' ? '' : ''

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
            {/* Global filter + Display mode toggle */}
            <div className="flex items-center gap-2 mb-3 justify-between flex-wrap">
              {/* Deneme / İzleme / Tümü global filtresi */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {(['denemeler', 'izlemeler', 'tumu'] as const).map(f => (
                  <button key={f} onClick={() => setTableFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      tableFilter === f ? 'bg-card shadow text-foreground' : 'text-muted-foreground'
                    }`}>
                    {f === 'denemeler' ? 'Denemeler' : f === 'izlemeler' ? 'İzlemeler' : 'Tümü'}
                  </button>
                ))}
              </div>

              {/* Net / Puan / Yüzde görünüm modu */}
              {selected === 'toplam' ? (
                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  {(['net', 'puan'] as const).map(m => (
                    <button key={m} onClick={() => setDisplayMode(m)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                        displayMode === m ? 'bg-card shadow text-foreground' : 'text-muted-foreground'
                      }`}>
                      {m === 'net' ? 'Net' : 'Puan'}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  {(['net', 'yuzde'] as const).map(m => (
                    <button key={m} onClick={() => setDisplayMode(m)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                        displayMode === m ? 'bg-card shadow text-foreground' : 'text-muted-foreground'
                      }`}>
                      {m === 'net' ? 'Net' : 'Başarı %'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Yayın Filtresi */}
            {yayinlar.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setYayinFilter('tumu')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    yayinFilter === 'tumu'
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Tüm Yayınlar
                </button>
                {yayinlar.map(y => (
                  <button
                    key={y}
                    onClick={() => setYayinFilter(y)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      yayinFilter === y
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            {/* Ders Seçici */}
            <div className="flex flex-wrap gap-2 mb-6">
              {DERSLER.map((d) => (
                <button
                  key={d.key}
                  onClick={() => { setSelected(d.key); setDisplayMode('net') }}
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
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">Ortalama</div>
                <div className="text-2xl font-bold text-foreground">
                  {avg}{tooltipSuffix}
                </div>
                {displayMode === 'net' && selected !== 'toplam' && (
                  <div className="text-xs text-muted-foreground">/ {selectedDers.maxNet}</div>
                )}
                {displayMode === 'net' && selected === 'toplam' && (
                  <div className="text-xs text-muted-foreground">/ 90</div>
                )}
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">En Yüksek</div>
                <div className="text-2xl font-bold text-green-500">{max}{tooltipSuffix}</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">En Düşük</div>
                <div className="text-2xl font-bold text-red-500">{min}{tooltipSuffix}</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">Sınav Sayısı</div>
                <div className="text-2xl font-bold text-foreground">{activeDenemeler.length}</div>
                <div className="text-xs text-muted-foreground">deneme</div>
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
                {chartTitle}
              </h2>
              {activeDenemeler.length < 2 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Grafik için en az 2 deneme gerekiyor
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="tarih"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={chartDomain}
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
                      formatter={(val: number) => [`${val}${tooltipSuffix}`, selectedDers.label]}
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
                      label={{ value: `Ort: ${avg}${refLineUnit}`, fontSize: 10, fill: selectedDers.color, position: 'insideTopRight' }}
                    />
                    <Line
                      type="monotone"
                      dataKey={chartKey}
                      stroke={selectedDers.color}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: selectedDers.color, strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    >
                      <LabelList
                        dataKey={chartKey}
                        position="top"
                        fontSize={10}
                        fill={selectedDers.color}
                        formatter={(v: number) => `${v}${tooltipSuffix}`}
                      />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* LGS Puan Tahmini */}
            {selected === 'toplam' && displayMode === 'net' && activeDenemeler.length >= 2 && (() => {
              const lastNet = values[values.length - 1]
              const avgPuan = Math.round(100 + (avg / 90) * 400)
              const lastPuan = Math.round(100 + (lastNet / 90) * 400)
              const realistMin = Math.round((avgPuan + lastPuan) / 2) - 5
              const realistMax = Math.round((avgPuan + lastPuan) / 2) + 5
              return (
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <h2 className="font-semibold text-foreground text-sm">LGS Puan Tahmini</h2>
                    <span className="text-xs text-muted-foreground">100 + (Net ÷ 90) × 400</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="rounded-lg bg-card border border-border p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">Ortalama Baz</div>
                      <div className="text-xl font-bold text-foreground">~{avgPuan}</div>
                      <div className="text-xs text-muted-foreground">{avg} net</div>
                    </div>
                    <div className="rounded-lg bg-card border border-border p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">Son Deneme Baz</div>
                      <div className="text-xl font-bold text-indigo-400">~{lastPuan}</div>
                      <div className="text-xs text-muted-foreground">{lastNet} net</div>
                    </div>
                    <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">🎯 Gerçekçi Tahmin</div>
                      <div className="text-xl font-bold text-indigo-400">{realistMin}–{realistMax}</div>
                      <div className="text-xs text-muted-foreground">tahmini aralık</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">* Tahmin deneme performansına dayanır. LGS&apos;de sınav stresi ve zorluk farkı sonucu etkileyebilir.</p>
                </div>
              )
            })()}

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
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Net%</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Max</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Son</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DERSLER.map((d) => {
                      const tableNetler = denemeleriForTable
                        .filter(rec => {
                          if (d.key === 'toplam') return rec.tip !== 'izleme'
                          if (rec.tip === 'izleme') {
                            const netler = normalizeNetler(rec.netler ?? {})
                            const val = netler[d.key]
                            return val !== undefined && val > 0
                          }
                          return true
                        })
                        .map(rec => {
                          const netler = normalizeNetler(rec.netler ?? {})
                          if (d.key === 'toplam') return Math.round(rec.toplamNet * 10) / 10
                          return Math.round((netler[d.key] ?? 0) * 10) / 10
                        })
                      const a = tableNetler.length ? Math.round(tableNetler.reduce((x, y) => x + y, 0) / tableNetler.length * 10) / 10 : 0
                      const mx = tableNetler.length ? Math.max(...tableNetler) : 0
                      const last = tableNetler.length ? tableNetler[tableNetler.length - 1] : 0
                      const t = trend(tableNetler)
                      const pct = Math.round((a / d.maxNet) * 100)
                      return (
                        <tr
                          key={d.key}
                          onClick={() => { setSelected(d.key); setDisplayMode('net') }}
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
                          <td className="text-center px-4 py-3 font-medium text-indigo-400">{pct}%</td>
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
              <div className="px-6 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground">* Net% = Ortalama Net / Maksimum Soru Sayısı × 100</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
