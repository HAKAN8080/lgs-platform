import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lise Taban Puanları 2024 | İl İl Okul Sorgulama',
  description: '2024 LGS lise taban puanları ve kontenjanları. İstanbul, Ankara, İzmir ve tüm iller için anadolu lisesi, fen lisesi taban puanı sorgula.',
  keywords: ['lise taban puanları', 'LGS taban puan 2024', 'anadolu lisesi taban puanı', 'fen lisesi taban puanı'],
  alternates: { canonical: '/araclar/taban-puanlari' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
