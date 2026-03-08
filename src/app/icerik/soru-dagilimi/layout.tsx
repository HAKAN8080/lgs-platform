import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LGS Soru Dağılımı 2018-2025 | Konu Bazlı Analiz',
  description: '2018-2025 yılları arasındaki LGS sorularının ders ve konu bazlı dağılımı. En çok çıkan konuları keşfet, 720 sorunun analizi.',
  keywords: ['LGS soru dağılımı', 'LGS konu analizi', 'LGS en çok çıkan konular', 'LGS istatistik'],
  alternates: { canonical: '/icerik/soru-dagilimi' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
