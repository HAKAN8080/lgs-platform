import Link from 'next/link'
import { Calculator } from 'lucide-react'

const footerLinks = {
  araclar: [
    { name: 'LGS Puan Hesaplama', href: '/araclar/puan-hesaplama' },
    { name: 'Lise Taban Puanları', href: '/araclar/taban-puanlari' },
    { name: 'Tercih Robotu', href: '/araclar/tercih-robotu' },
  ],
  icerik: [
    { name: 'Soru Dağılımı', href: '/icerik/soru-dagilimi' },
    { name: 'Çalışma Stratejileri', href: '/icerik/stratejiler' },
  ],
  ogrenci: [
    { name: 'Öğrenci Paneli', href: '/panel' },
    { name: 'Premium', href: '/premium' },
  ],
  yasal: [
    { name: 'Gizlilik Politikası', href: '/gizlilik' },
    { name: 'Kullanım Şartları', href: '/kullanim-sartlari' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Calculator className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">LGS Hazırlık</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              LGS sınavına hazırlık için en kapsamlı platform. Puan hesaplama, net takip ve AI destekli koçluk.
            </p>
          </div>

          {/* Araçlar */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Araçlar</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.araclar.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İçerik */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">İçerik</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.icerik.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Öğrenci */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Öğrenci</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.ogrenci.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LGS Hazırlık Platformu. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-4">
              {footerLinks.yasal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
