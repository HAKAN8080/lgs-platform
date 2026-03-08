import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LGS Çalışma Programı Oluşturucu | Kişisel Haftalık Plan',
  description: 'Müsaitlik takvimini ve deneme netlerini girerek kişiselleştirilmiş LGS çalışma programı oluştur. Ders bazlı saat dağılımı otomatik hesaplanır.',
  keywords: ['LGS çalışma programı', 'LGS haftalık plan', 'LGS ders programı', 'LGS çalışma takvimi'],
  alternates: { canonical: '/icerik/calisma-programi' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
