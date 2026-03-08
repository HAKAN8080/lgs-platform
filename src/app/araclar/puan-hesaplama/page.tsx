'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  SUBJECTS,
  calculateLGSScore,
  getScoreInterpretation,
  getPercentile,
  type SubjectInput
} from '@/lib/calculations/lgs-score'
import { SCHOOLS_DATA, getSchoolTypeColor } from '@/lib/constants/schools'
import { Calculator, RotateCcw, TrendingUp, Target, Trophy, Users, School, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function PuanHesaplamaPage() {
  const [inputs, setInputs] = useState<Record<string, SubjectInput>>(
    Object.fromEntries(SUBJECTS.map(s => [s.key, { correct: 0, wrong: 0 }]))
  )

  const result = useMemo(() => calculateLGSScore(inputs), [inputs])
  const interpretation = useMemo(() => getScoreInterpretation(result.score), [result.score])
  const percentile = useMemo(() => getPercentile(result.score), [result.score])

  // Puana uygun okulları bul
  const matchingSchools = useMemo(() => {
    return SCHOOLS_DATA
      .filter(school => school.puan <= result.score)
      .sort((a, b) => b.puan - a.puan)
      .slice(0, 5)
  }, [result.score])

  const handleInputChange = (subject: string, field: 'correct' | 'wrong', value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0)
    const maxValue = SUBJECTS.find(s => s.key === subject)?.max || 20

    setInputs(prev => {
      const currentInput = prev[subject]
      const otherField = field === 'correct' ? 'wrong' : 'correct'
      const otherValue = currentInput[otherField]

      // Doğru + Yanlış toplamı soru sayısını geçemez
      const maxAllowed = maxValue - otherValue
      const clampedValue = Math.min(numValue, maxAllowed)

      return {
        ...prev,
        [subject]: {
          ...prev[subject],
          [field]: clampedValue,
        }
      }
    })
  }

  const handleReset = () => {
    setInputs(Object.fromEntries(SUBJECTS.map(s => [s.key, { correct: 0, wrong: 0 }])))
  }

  const totalQuestions = SUBJECTS.reduce((sum, s) => sum + s.max, 0)
  const totalCorrect = Object.values(inputs).reduce((sum, i) => sum + i.correct, 0)
  const totalWrong = Object.values(inputs).reduce((sum, i) => sum + i.wrong, 0)
  const totalBlank = totalQuestions - totalCorrect - totalWrong

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">2025 Güncel Katsayılar</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">LGS Puan ve Net Hesaplama</h1>
          <p className="mt-4 text-muted-foreground">
            Doğru ve yanlış sayılarını gir, anında net ve puan hesapla
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Input Card - Wider */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sınav Bilgileri</CardTitle>
                  <CardDescription className="mt-1">Toplam {totalQuestions} soru</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sıfırla
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-2 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="col-span-2">Ders</div>
                <div className="text-center">Soru</div>
                <div className="text-center">Doğru</div>
                <div className="text-center">Yanlış</div>
                <div className="text-center">Net</div>
              </div>

              {/* Subject Rows */}
              <div className="space-y-2">
                {SUBJECTS.map((subject) => {
                  const net = result.breakdown[subject.key]?.net || 0
                  const percentage = (net / subject.max) * 100
                  return (
                    <div key={subject.key} className="grid grid-cols-6 gap-2 items-center py-2 border-b border-border/50 last:border-0">
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-lg">{subject.icon}</span>
                        <span className="font-medium text-foreground text-sm">
                          {subject.label}
                        </span>
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        {subject.max}
                      </div>
                      <div>
                        <Input
                          type="number"
                          min={0}
                          max={subject.max}
                          value={inputs[subject.key].correct || ''}
                          onChange={(e) => handleInputChange(subject.key, 'correct', e.target.value)}
                          className="text-center h-9 bg-green-500/5 border-green-500/30 focus:border-green-500 text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min={0}
                          max={subject.max - inputs[subject.key].correct}
                          value={inputs[subject.key].wrong || ''}
                          onChange={(e) => handleInputChange(subject.key, 'wrong', e.target.value)}
                          className="text-center h-9 bg-red-500/5 border-red-500/30 focus:border-red-500 text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div className="text-center">
                        <span
                          className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md text-sm font-bold"
                          style={{
                            backgroundColor: `${subject.color}15`,
                            color: subject.color
                          }}
                        >
                          {net.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals Row */}
              <div className="grid grid-cols-6 gap-2 items-center mt-4 pt-4 border-t-2 border-border">
                <div className="col-span-2 font-bold text-foreground">TOPLAM</div>
                <div className="text-center font-medium text-muted-foreground">{totalQuestions}</div>
                <div className="text-center font-bold text-green-500">{totalCorrect}</div>
                <div className="text-center font-bold text-red-500">{totalWrong}</div>
                <div className="text-center">
                  <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md text-sm font-bold bg-primary/15 text-primary">
                    {result.totalNet.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Score Card */}
            <Card className="overflow-hidden">
              <div
                className="p-6 text-center relative"
                style={{ backgroundColor: `${interpretation.color}10` }}
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `radial-gradient(circle at center, ${interpretation.color} 0%, transparent 70%)`
                  }}
                />
                <div className="relative">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">LGS Puanın</div>
                  <div
                    className="text-5xl font-black tracking-tight"
                    style={{ color: interpretation.color }}
                  >
                    {result.score.toFixed(2)}
                  </div>
                  <div
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
                    style={{ backgroundColor: `${interpretation.color}20`, color: interpretation.color }}
                  >
                    <Target className="h-3.5 w-3.5" />
                    {interpretation.label}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {interpretation.description}
                  </div>
                </div>
              </div>
            </Card>

            {/* Percentile Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold text-foreground">2025 Yüzdelik Dilim</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background/60 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Türkiye Sıralaması</div>
                    <div className="text-2xl font-black text-amber-500">
                      {percentile.rank.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      / {(percentile.totalStudents / 1000000).toFixed(1)}M öğrenci
                    </div>
                  </div>
                  <div className="bg-background/60 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Yüzdelik Dilim</div>
                    <div className="text-2xl font-black text-orange-500">
                      %{percentile.topPercent.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      İlk %{percentile.topPercent.toFixed(1)}&apos;lik dilim
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground text-center">
                  <Users className="h-3 w-3 inline mr-1" />
                  Tahmini ~1.2 milyon öğrenci bazında
                </div>
              </div>
            </Card>

            {/* Net Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Net Özeti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-accent/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground">Sözel Net</div>
                    <div className="text-xl font-bold text-foreground">{result.verbalNet.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">/50</div>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground">Sayısal Net</div>
                    <div className="text-xl font-bold text-foreground">{result.numericalNet.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">/40</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Boş Sayısı</span>
                  <span className="font-medium text-foreground">{totalBlank}</span>
                </div>
              </CardContent>
            </Card>

            {/* Net Bars */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ders Netleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SUBJECTS.map((subject) => {
                  const net = result.breakdown[subject.key]?.net || 0
                  const percentage = (net / subject.max) * 100
                  return (
                    <div key={subject.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <span>{subject.icon}</span>
                          {subject.label}
                        </span>
                        <span className="font-semibold" style={{ color: subject.color }}>
                          {net.toFixed(2)}/{subject.max}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: subject.color
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Matching Schools Section */}
        {result.score > 200 && (
          <Card className="mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">Puana Uygun Okullar</CardTitle>
                </div>
                <Link
                  href="/araclar/taban-puanlari"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Tümünü Gör
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <CardDescription>
                {result.score.toFixed(2)} puanla yerleşebileceğin en iyi 5 okul
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matchingSchools.length > 0 ? (
                <div className="space-y-3">
                  {matchingSchools.map((school, index) => {
                    const diff = result.score - school.puan
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors"
                        style={{ borderLeftColor: getSchoolTypeColor(school.tur), borderLeftWidth: 4 }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate">{school.lise}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span>{school.ilce}</span>
                            <span>•</span>
                            <span
                              className="px-1.5 py-0.5 rounded text-xs font-medium"
                              style={{
                                backgroundColor: `${getSchoolTypeColor(school.tur)}15`,
                                color: getSchoolTypeColor(school.tur)
                              }}
                            >
                              {school.tur}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-lg text-foreground">{school.puan.toFixed(2)}</div>
                          <div className="text-xs text-green-500 font-medium">+{diff.toFixed(2)} fark</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <School className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Bu puanla yerleşebilecek okul bulunamadı.</p>
                  <p className="text-sm mt-1">Daha fazla soru çözerek puanını yükseltebilirsin!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
