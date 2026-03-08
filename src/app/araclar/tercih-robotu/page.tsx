'use client'

import { useState, useMemo } from 'react'
import { SCHOOLS_DATA, SCHOOL_TYPES, getSchoolTypeColor } from '@/lib/constants/schools'
import { Bot, ChevronDown, ChevronUp, MapPin, Users, Star, Target, TrendingUp } from 'lucide-react'

const ILLER = ['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Kocaeli', 'Konya', 'Adana', 'Trabzon', 'Kayseri', 'Mersin', 'Diyarbakır', 'Gaziantep', 'Eskişehir']
const DILLER = ['Tümü', 'İngilizce', 'Almanca', 'Fransızca']

function ScoreBadge({ diff }: { diff: number }) {
  if (diff <= -10)
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/15 text-green-500">Kesin Girer</span>
  if (diff <= 0)
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-500">Sınırda</span>
  return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500">Hedef</span>
}

export default function TercihRobotuPage() {
  const [puan, setPuan] = useState('')
  const [il, setIl] = useState('Tümü')
  const [tur, setTur] = useState('')
  const [dil, setDil] = useState('Tümü')
  const [searched, setSearched] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    kesin: true,
    sinirda: true,
    hedef: true,
  })

  const puanNum = parseFloat(puan)

  const results = useMemo(() => {
    if (!searched || !puan || isNaN(puanNum)) return { kesin: [], sinirda: [], hedef: [] }

    const filtered = SCHOOLS_DATA.filter(s => {
      if (il !== 'Tümü' && s.il !== il) return false
      if (tur && s.tur !== tur) return false
      if (dil !== 'Tümü' && s.dil !== dil) return false
      const diff = s.puan - puanNum
      return diff >= -50 && diff <= 25 // -50 ile +25 arası göster
    })

    const kesin = filtered.filter(s => s.puan - puanNum <= -10).sort((a, b) => b.puan - a.puan)
    const sinirda = filtered.filter(s => s.puan - puanNum > -10 && s.puan - puanNum <= 0).sort((a, b) => b.puan - a.puan)
    const hedef = filtered.filter(s => s.puan - puanNum > 0 && s.puan - puanNum <= 25).sort((a, b) => a.puan - b.puan)

    return { kesin, sinirda, hedef }
  }, [searched, puan, puanNum, tur, dil])

  const total = results.kesin.length + results.sinirda.length + results.hedef.length

  const SchoolCard = ({ school }: { school: typeof SCHOOLS_DATA[0] }) => {
    const diff = school.puan - puanNum
    const color = getSchoolTypeColor(school.tur)
    return (
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground truncate">{school.lise}</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0" style={{ backgroundColor: color + '20', color }}>
              {school.tur}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{school.ilce}</span>
            <span>{school.dil}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{school.kontenjan} kontenjan</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold text-lg text-foreground">{school.puan.toFixed(2)}</div>
          <div className={`text-xs font-medium ${diff > 0 ? 'text-blue-500' : diff > -10 ? 'text-yellow-500' : 'text-green-500'}`}>
            {diff > 0 ? `+${diff.toFixed(2)} üst` : diff === 0 ? 'Eşit' : `${diff.toFixed(2)}`}
          </div>
          <ScoreBadge diff={diff} />
        </div>
      </div>
    )
  }

  const Section = ({
    id, label, icon: Icon, color, schools, emptyText
  }: {
    id: string
    label: string
    icon: React.ElementType
    color: string
    schools: typeof SCHOOLS_DATA
    emptyText: string
  }) => (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-accent/30 transition-colors"
        onClick={() => setExpanded(e => ({ ...e, [id]: !e[id] }))}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground">{label}</span>
          <span className="text-sm text-muted-foreground">({schools.length} okul)</span>
        </div>
        {expanded[id] ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {expanded[id] && (
        <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
          {schools.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{emptyText}</p>
          ) : (
            schools.map((s, i) => <SchoolCard key={`${s.lise}-${s.dil}-${i}`} school={s} />)
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 mb-4">
            <Bot className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">Tercih Robotu</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Puanına Göre Okul Önerileri</h1>
          <p className="mt-3 text-muted-foreground">2025 LGS taban puanlarına göre girebileceğin okulları keşfet</p>
        </div>

        {/* Giriş Formu */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">LGS Puanın</label>
              <input
                type="number"
                min={200}
                max={500}
                step={0.01}
                value={puan}
                onChange={e => { setPuan(e.target.value); setSearched(false) }}
                placeholder="örn: 450.00"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">İl</label>
                <select
                  value={il}
                  onChange={e => setIl(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  {ILLER.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Okul Türü</label>
                <select
                  value={tur}
                  onChange={e => setTur(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="">Tümü</option>
                  {SCHOOL_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Yabancı Dil</label>
                <select
                  value={dil}
                  onChange={e => setDil(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  {DILLER.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={() => { if (puan && !isNaN(puanNum)) setSearched(true) }}
              disabled={!puan || isNaN(puanNum)}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Okul Önerilerini Gör
            </button>
          </div>
        </div>

        {/* Sonuçlar */}
        {searched && (
          <>
            {total === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Bu kriterlere uygun okul bulunamadı.</p>
                <p className="text-sm mt-1">Filtrelerini değiştirmeyi dene.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  <span className="font-medium text-foreground">{puanNum.toFixed(2)}</span> puanına göre{' '}
                  <span className="font-medium text-foreground">{total}</span> okul listelendi
                </p>

                <Section
                  id="kesin"
                  label="Kesin Girer"
                  icon={Star}
                  color="bg-green-500/10 text-green-500"
                  schools={results.kesin}
                  emptyText="Bu aralıkta okul yok"
                />
                <Section
                  id="sinirda"
                  label="Sınırda"
                  icon={Target}
                  color="bg-yellow-500/10 text-yellow-500"
                  schools={results.sinirda}
                  emptyText="Bu aralıkta okul yok"
                />
                <Section
                  id="hedef"
                  label="Hedef (0–25 puan üst)"
                  icon={TrendingUp}
                  color="bg-blue-500/10 text-blue-500"
                  schools={results.hedef}
                  emptyText="Bu aralıkta okul yok"
                />

                <p className="text-xs text-center text-muted-foreground pt-2">
                  Veriler 2025 LGS ilk yerleştirme sonuçlarına aittir (İstanbul, Ankara, İzmir, Bursa, Antalya, Kocaeli, Konya, Adana).
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
