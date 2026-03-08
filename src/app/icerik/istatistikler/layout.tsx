import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2025 LGS İstatistikleri | Tam Puan & İl Dağılımları',
  description: '2025 LGS sınavı istatistikleri: 500 tam puan yapan öğrenci sayıları, il bazlı başarı dağılımları ve yıllara göre karşılaştırma.',
  keywords: ['LGS 2025 istatistik', 'LGS tam puan', 'LGS başarı istatistik', 'LGS 500 puan'],
  alternates: { canonical: '/icerik/istatistikler' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
