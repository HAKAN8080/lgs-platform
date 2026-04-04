'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Calculator, BookOpen, User, Crown, LogOut, Loader2, Building2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { signOut } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'LGS Puan Hesapla', href: '/araclar/puan-hesaplama' },
  { name: 'Taban Puanları - İstanbul', href: '/araclar/taban-puanlari' },
  { name: 'Soru Dağılımı', href: '/icerik/soru-dagilimi' },
  { name: '2025 İstatistikleri', href: '/icerik/istatistikler' },
  { name: 'Tercih Robotu', href: '/araclar/tercih-robotu' },
  {
    name: 'Araçlar',
    href: '/araclar',
    children: [
      { name: 'Net Takip', href: '/panel/net-takip' },
      { name: 'Haftalık Strateji', href: '/panel/strateji' },
      { name: 'Çalışma Programı', href: '/icerik/calisma-programi' },
      { name: 'Çalışma Stratejileri', href: '/icerik/stratejiler' },
    ],
  },
  { name: 'Öğrenci Paneli', href: '/panel' },
  {
    name: 'Premium',
    href: '/premium',
    icon: Crown,
    children: [
      { name: 'AI Soru Üretici', href: '/araclar/lgs-soru-uretici.html' },
    ],
  },
  {
    name: 'Kurumsal',
    href: '/kurumsal',
    icon: Building2,
    children: [
      { name: 'Optik TXT Parser', href: '/araclar/txt-parser.html' },
    ],
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Calculator className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LGS Hazırlık</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Menüyü aç</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.icon && <item.icon className="h-4 w-4 text-yellow-500" />}
                {item.name}
              </Link>
              {item.children && (
                <div className="absolute left-0 top-full mt-2 w-48 rounded-md bg-popover border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : user ? (
            <>
              <Link
                href="/panel"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                Panel
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link
                href="/giris"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <div className="space-y-1 px-4 py-3">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block py-2 text-base font-medium text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block py-1.5 text-sm text-muted-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/panel"
                    className="block py-2 text-base font-medium text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Panel
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block py-2 text-base font-medium text-muted-foreground w-full text-left"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/giris"
                    className="block py-2 text-base font-medium text-muted-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="block py-2 text-base font-medium text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
