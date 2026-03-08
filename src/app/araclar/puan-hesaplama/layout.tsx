import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LGS Puan Hesaplama 2026 | Net & Puan Hesapla',
  description: '2026 LGS katsayılarıyla puanını ve netlerini hesapla. Türkçe, Matematik, Fen, İnkılap, Din ve İngilizce net girişiyle anlık puan hesaplama.',
  keywords: ['LGS puan hesaplama', 'LGS 2026 puan', 'LGS net hesaplama', 'LGS katsayı 2026'],
  alternates: { canonical: '/araclar/puan-hesaplama' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
