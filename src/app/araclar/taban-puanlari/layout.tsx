import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lise Taban Puanları 2025 | İl İl Okul Sorgulama',
  description: '2025 LGS lise taban puanları ve kontenjanları. İstanbul, Ankara, İzmir ve tüm iller için anadolu lisesi, fen lisesi taban puanı sorgula.',
  keywords: ['lise taban puanları', 'LGS taban puan 2025', 'anadolu lisesi taban puanı', 'fen lisesi taban puanı'],
  alternates: { canonical: '/araclar/taban-puanlari' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
