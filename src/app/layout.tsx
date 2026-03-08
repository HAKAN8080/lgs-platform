import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LGS Hazırlık Platformu',
  description: 'LGS sınavına hazırlık için puan hesaplama, net takip, konu analizi ve AI koç',
  keywords: ['LGS', 'puan hesaplama', 'net hesaplama', 'lise taban puanları', 'sınav hazırlık'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
