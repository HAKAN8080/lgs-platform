'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
} from 'lucide-react'

const sidebarItems = [
  { name: 'Panel', href: '/kurumsal/panel', icon: Home },
  { name: 'Öğrenciler', href: '/kurumsal/panel/ogrenciler', icon: Users },
  { name: 'Sınıflar', href: '/kurumsal/panel/siniflar', icon: GraduationCap },
  { name: 'Denemeler', href: '/kurumsal/panel/denemeler', icon: FileText, comingSoon: true },
  { name: 'Raporlar', href: '/kurumsal/panel/raporlar', icon: BarChart3, comingSoon: true },
  { name: 'Ayarlar', href: '/kurumsal/panel/ayarlar', icon: Settings, comingSoon: true },
]

export default function KurumsalPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [kurumAdi, setKurumAdi] = useState('Demo Kurum')

  // TODO: Auth check - şimdilik demo mode
  useEffect(() => {
    // Kurumsal auth kontrolü yapılacak
  }, [])

  const handleLogout = () => {
    router.push('/kurumsal')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-accent rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-purple-500" />
          <span className="font-semibold text-sm">{kurumAdi}</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <div className="font-semibold text-sm text-foreground">{kurumAdi}</div>
              <div className="text-[10px] text-muted-foreground">Kurumsal Panel</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-accent rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (item.comingSoon) {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground/50 cursor-not-allowed"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.name}</span>
                  <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">Yakında</span>
                </div>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-500/10 text-purple-500'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.name}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
