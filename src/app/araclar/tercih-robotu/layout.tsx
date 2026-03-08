import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LGS Tercih Robotu 2025 | Puanına Göre Okul Önerileri',
  description: 'LGS puanını gir, girebileceğin liseleri anında gör. 2025 taban puanlarına göre İstanbul lise önerileri: fen lisesi, anadolu lisesi, imam hatip.',
  keywords: ['LGS tercih robotu', 'LGS okul önerisi', 'lise seçimi', 'LGS tercih', 'hangi liseye girebilirim'],
  alternates: { canonical: '/araclar/tercih-robotu' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
