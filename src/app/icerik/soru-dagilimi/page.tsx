'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LGS_QUESTION_DISTRIBUTION,
  YEARS,
  getTopicTotal,
  getMostFrequentTopics,
  getTopTopicsForYear,
  type SubjectDistribution
} from '@/lib/constants/question-distribution'
import { BookOpen, TrendingUp, BarChart3, Filter, ChevronDown, ChevronUp, Star } from 'lucide-react'

type ViewMode = 'all' | 'subject'

export default function SoruDagilimiPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set(LGS_QUESTION_DISTRIBUTION.map(s => s.subject)))

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subject)) {
        newSet.delete(subject)
      } else {
        newSet.add(subject)
      }
      return newSet
    })
  }

  const filteredData = useMemo(() => {
    if (selectedSubject) {
      return LGS_QUESTION_DISTRIBUTION.filter(s => s.subject === selectedSubject)
    }
    return LGS_QUESTION_DISTRIBUTION
  }, [selectedSubject])

  const topTopicsForYear = useMemo(() => {
    if (selectedYear) {
      return getTopTopicsForYear(selectedYear, 15)
    }
    return null
  }, [selectedYear])

  // Her ders için en çok çıkan konular
  const subjectHighlights = useMemo(() => {
    return LGS_QUESTION_DISTRIBUTION.map(subject => ({
      subject: subject.subject,
      icon: subject.icon,
      color: subject.color,
      topTopics: getMostFrequentTopics(subject, 3)
    }))
  }, [])

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">2018-2025 Verileri</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">LGS Soru Dağılımları</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            8 yıllık LGS sınav sorularının ders ve konu bazlı detaylı analizi
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">90</div>
              <div className="text-sm text-muted-foreground">Toplam Soru / Yıl</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-500">720</div>
              <div className="text-sm text-muted-foreground">8 Yılda Toplam</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-500">6</div>
              <div className="text-sm text-muted-foreground">Ders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-orange-500">60+</div>
              <div className="text-sm text-muted-foreground">Konu</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filtrele:</span>
              </div>

              {/* Subject Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedSubject === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(null)}
                >
                  Tüm Dersler
                </Button>
                {LGS_QUESTION_DISTRIBUTION.map(subject => (
                  <Button
                    key={subject.subject}
                    variant={selectedSubject === subject.subject ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject(subject.subject)}
                    style={{
                      backgroundColor: selectedSubject === subject.subject ? subject.color : undefined,
                      borderColor: subject.color,
                    }}
                    className={selectedSubject !== subject.subject ? "hover:bg-accent" : ""}
                  >
                    <span className="mr-1">{subject.icon}</span>
                    {subject.subject}
                  </Button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <Button
                variant={selectedYear === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(null)}
              >
                Tüm Yıllar
              </Button>
              {YEARS.map(year => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Year-specific top topics */}
        {selectedYear && topTopicsForYear && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                {selectedYear} LGS En Çok Çıkan Konular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {topTopicsForYear.map((item, index) => (
                  <div
                    key={`${item.subject}-${item.topic}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
                      style={{ backgroundColor: item.color }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{item.topic}</div>
                      <div className="text-xs text-muted-foreground">{item.subject}</div>
                    </div>
                    <div
                      className="text-lg font-bold"
                      style={{ color: item.color }}
                    >
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subject Highlights - Only show when no filters */}
        {!selectedSubject && !selectedYear && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                En Çok Çıkan Konular (2018-2025)
              </CardTitle>
              <CardDescription>Her dersten en sık sorulan 3 konu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectHighlights.map(highlight => (
                  <div
                    key={highlight.subject}
                    className="p-4 rounded-lg border border-border"
                    style={{ borderLeftColor: highlight.color, borderLeftWidth: 4 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{highlight.icon}</span>
                      <span className="font-semibold text-foreground">{highlight.subject}</span>
                    </div>
                    <div className="space-y-2">
                      {highlight.topTopics.map((topic, idx) => (
                        <div key={topic.topic} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {idx + 1}. {topic.topic}
                          </span>
                          <span className="font-medium" style={{ color: highlight.color }}>
                            {topic.total} soru
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tables */}
        <div className="space-y-6">
          {filteredData.map(subject => (
            <Card key={subject.subject}>
              <CardHeader
                className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg"
                onClick={() => toggleSubject(subject.subject)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      {subject.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg" style={{ color: subject.color }}>
                        {subject.subject}
                      </CardTitle>
                      <CardDescription>{subject.questionCount} soru / yıl</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    {expandedSubjects.has(subject.subject) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {expandedSubjects.has(subject.subject) && (
                <CardContent className="pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-semibold text-foreground min-w-[180px]">
                            Konu
                          </th>
                          {YEARS.map(year => (
                            <th
                              key={year}
                              className={`text-center py-3 px-2 font-semibold ${
                                selectedYear === year ? 'bg-primary/10 text-primary' : 'text-foreground'
                              }`}
                            >
                              {year}
                            </th>
                          ))}
                          <th className="text-center py-3 px-2 font-semibold text-foreground bg-accent/50">
                            Toplam
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subject.topics
                          .sort((a, b) => getTopicTotal(b) - getTopicTotal(a))
                          .map(topic => {
                            const total = getTopicTotal(topic)
                            const maxCount = Math.max(...Object.values(topic.years))
                            return (
                              <tr
                                key={topic.topic}
                                className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                              >
                                <td className="py-3 px-2 text-foreground font-medium">
                                  {topic.topic}
                                </td>
                                {YEARS.map(year => {
                                  const count = topic.years[year] || 0
                                  const isMax = count === maxCount && count > 0
                                  return (
                                    <td
                                      key={year}
                                      className={`text-center py-3 px-2 ${
                                        selectedYear === year ? 'bg-primary/5' : ''
                                      }`}
                                    >
                                      {count > 0 ? (
                                        <span
                                          className={`inline-flex items-center justify-center min-w-[28px] h-7 rounded-md text-sm font-medium ${
                                            isMax
                                              ? 'text-white'
                                              : count >= 3
                                              ? 'text-white'
                                              : ''
                                          }`}
                                          style={{
                                            backgroundColor: count > 0
                                              ? `${subject.color}${Math.min(20 + count * 15, 100).toString(16).padStart(2, '0')}`
                                              : 'transparent',
                                            color: count >= 3 ? 'white' : subject.color
                                          }}
                                        >
                                          {count}
                                        </span>
                                      ) : (
                                        <span className="text-muted-foreground/50">-</span>
                                      )}
                                    </td>
                                  )
                                })}
                                <td className="text-center py-3 px-2 bg-accent/50">
                                  <span
                                    className="inline-flex items-center justify-center min-w-[36px] h-7 rounded-md text-sm font-bold text-white"
                                    style={{ backgroundColor: subject.color }}
                                  >
                                    {total}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-accent/30">
                          <td className="py-3 px-2 font-bold text-foreground">TOPLAM</td>
                          {YEARS.map(year => {
                            const yearTotal = subject.topics.reduce(
                              (sum, t) => sum + (t.years[year] || 0),
                              0
                            )
                            return (
                              <td
                                key={year}
                                className={`text-center py-3 px-2 font-bold ${
                                  selectedYear === year ? 'bg-primary/10' : ''
                                }`}
                                style={{ color: subject.color }}
                              >
                                {yearTotal}
                              </td>
                            )
                          })}
                          <td
                            className="text-center py-3 px-2 font-bold bg-accent/50"
                            style={{ color: subject.color }}
                          >
                            {subject.topics.reduce((sum, t) => sum + getTopicTotal(t), 0)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="mt-8 bg-accent/30">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <BarChart3 className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Soru Dağılımı Analizi Nasıl Kullanılır?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Yüksek çıkma oranına sahip konulara öncelik ver</li>
                  <li>• Her yıl düzenli çıkan konuları mutlaka çalış</li>
                  <li>• 0 soru çıkan konuları da gözden geçir, tekrar çıkabilir</li>
                  <li>• Özellikle son 3 yılın trendlerini takip et</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
