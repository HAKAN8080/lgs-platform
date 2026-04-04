import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'LGS Hazırlık | Puan Hesaplama, Taban Puanları, Çalışma Programı',
    template: '%s | LGS Hazırlık',
  },
  description: '2026 LGS puan hesaplama, lise taban puanları, tercih robotu ve kişisel çalışma programı. Ücretsiz LGS hazırlık araçları.',
  keywords: ['LGS', 'LGS puan hesaplama', 'LGS 2026', 'lise taban puanları', 'LGS net hesaplama', 'LGS hazırlık', 'tercih robotu', 'çalışma programı'],
  authors: [{ name: 'LGS Hazırlık' }],
  creator: 'LGS Hazırlık',
  metadataBase: new URL('https://lgs.thorius.com.tr'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://lgs.thorius.com.tr',
    siteName: 'LGS Hazırlık',
    title: 'LGS Hazırlık | Puan Hesaplama, Taban Puanları, Çalışma Programı',
    description: '2026 LGS puan hesaplama, lise taban puanları, tercih robotu ve kişisel çalışma programı. Ücretsiz LGS hazırlık araçları.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LGS Hazırlık | Puan Hesaplama & Taban Puanları',
    description: '2026 LGS puan hesaplama, lise taban puanları, ücretsiz hazırlık araçları.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RG6JSELP8E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RG6JSELP8E');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3325810744415018"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
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
