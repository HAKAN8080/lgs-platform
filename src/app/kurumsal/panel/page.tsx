'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  GraduationCap,
  FileText,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Plus,
} from 'lucide-react'

// Demo veriler
const demoStats = {
  toplamOgrenci: 156,
  toplamSinif: 6,
  toplamDeneme: 24,
  ortalamaNet: 67.4,
}

const recentDenemeler = [
  { id: 1, ad: 'HİZ - TG GİD 3', tarih: '14 Mart 2026', katilim: 142, ortalama: 68.5 },
  { id: 2, ad: 'PARAF - MOR MÜFREDAT 2', tarih: '10 Mart 2026', katilim: 138, ortalama: 65.2 },
  { id: 3, ad: '3D - 8.SINIF TG 5', tarih: '7 Mart 2026', katilim: 145, ortalama: 71.3 },
]

const quickActions = [
  { name: 'Öğrenci Ekle', href: '/kurumsal/panel/ogrenciler?action=add', icon: Users, color: 'bg-blue-500/10 text-blue-500' },
  { name: 'TXT Yükle', href: '/araclar/txt-parser.html', icon: FileText, color: 'bg-purple-500/10 text-purple-500' },
  { name: 'Sınıf Oluştur', href: '/kurumsal/panel/siniflar', icon: GraduationCap, color: 'bg-green-500/10 text-green-500', comingSoon: true },
]

export default function KurumsalPanelPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)] lg:h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Kurumsal Panel</h1>
        <p className="text-muted-foreground mt-1">Hoş geldiniz! İşte kurumunuzun özeti.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-xs text-green-500 flex items-center gap-0.5">
              +12 <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{demoStats.toplamOgrenci}</div>
            <div className="text-sm text-muted-foreground">Toplam Öğrenci</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{demoStats.toplamSinif}</div>
            <div className="text-sm text-muted-foreground">Sınıf</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{demoStats.toplamDeneme}</div>
            <div className="text-sm text-muted-foreground">Deneme Sınavı</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <span className="text-xs text-green-500 flex items-center gap-0.5">
              +2.3 <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{demoStats.ortalamaNet}</div>
            <div className="text-sm text-muted-foreground">Ortalama Net</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon

            if (action.comingSoon) {
              return (
                <div
                  key={action.name}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card opacity-50 cursor-not-allowed"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{action.name}</div>
                    <div className="text-xs text-muted-foreground">Yakında</div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-purple-500/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-medium text-foreground">{action.name}</div>
                <Plus className="h-4 w-4 text-muted-foreground ml-auto" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Denemeler */}
      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Son Denemeler</h2>
          </div>
          <Link
            href="/kurumsal/panel/denemeler"
            className="text-sm text-purple-500 hover:text-purple-400 transition-colors"
          >
            Tümünü Gör →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentDenemeler.map((deneme) => (
            <div
              key={deneme.id}
              className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
            >
              <div>
                <div className="font-medium text-foreground">{deneme.ad}</div>
                <div className="text-sm text-muted-foreground">{deneme.tarih}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">{deneme.ortalama} net</div>
                <div className="text-sm text-muted-foreground">{deneme.katilim} katılım</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
