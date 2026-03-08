import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, BarChart3, Lightbulb, FileText, Clock, Target, Trophy } from 'lucide-react'

export const metadata: Metadata = {
  title: 'LGS Hazırlık İçerikleri | Soru Dağılımı, İstatistikler & Stratejiler',
  description: 'LGS soru dağılımı analizi, 2025 istatistikleri, çalışma programı oluşturucu ve başarı stratejileri. 8 yıllık LGS verisi.',
  alternates: { canonical: '/icerik' },
}

const contents = [
  {
    name: 'LGS Soru Dağılımları',
    description: '2018-2025 yılları arasında çıkan LGS soruları ders ve konu bazlı detaylı analizi. En çok çıkan konuları öğren.',
    href: '/icerik/soru-dagilimi',
    icon: BarChart3,
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    stats: '8 Yıl • 720 Soru',
  },
  {
    name: '2025 LGS İstatistikleri',
    description: '500 tam puan yapan öğrenci sayıları, il bazlı dağılımlar ve yıllık karşılaştırmalar.',
    href: '/icerik/istatistikler',
    icon: Trophy,
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    stats: '719 Tam Puan • 66 İl',
  },
  {
    name: 'Çalışma Programı Oluşturucu',
    description: 'Müsaitlik takvimini ve ders netlerini girerek kişiselleştirilmiş haftalık program oluştur.',
    href: '/icerik/calisma-programi',
    icon: Lightbulb,
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    stats: '3 Adımda Program',
  },
  {
    name: 'Konu Anlatımları',
    description: 'Tüm dersler için kapsamlı konu anlatımları ve örnek sorular.',
    href: '/icerik/konu-anlatimlari',
    icon: BookOpen,
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    stats: 'Yakında',
    comingSoon: true,
  },
  {
    name: 'Çıkmış Sorular',
    description: 'Yıl yıl çıkmış LGS soruları ve çözümleri.',
    href: '/icerik/cikmis-sorular',
    icon: FileText,
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    stats: 'Yakında',
    comingSoon: true,
  },
]

const tips = [
  {
    icon: Clock,
    title: 'Günlük Çalışma',
    description: 'Her gün düzenli 3-4 saat çalışma',
  },
  {
    icon: Target,
    title: 'Hedef Belirleme',
    description: 'Haftalık ve aylık hedefler koy',
  },
  {
    icon: BarChart3,
    title: 'Deneme Takibi',
    description: 'Her denemeyi analiz et, hatalardan öğren',
  },
]

export default function IcerikPage() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">LGS Hazırlık İçerikleri</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">İçerik</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            LGS sınavına hazırlık için faydalı içerikler, analizler ve stratejiler
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {contents.map((content) => (
            <Link
              key={content.name}
              href={content.comingSoon ? '#' : content.href}
              className={`group relative rounded-xl border bg-card p-6 transition-all duration-200 ${
                content.comingSoon
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              {content.comingSoon && (
                <span className="absolute top-4 right-4 text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  Yakında
                </span>
              )}
              <div className={`inline-flex rounded-lg p-3 border ${content.color}`}>
                <content.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {content.name}
              </h2>
              <p className="mt-2 text-muted-foreground text-sm">{content.description}</p>
              <div className="mt-4 text-xs font-medium text-primary">{content.stats}</div>
            </Link>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-8">
          <h2 className="text-xl font-bold text-foreground text-center mb-6">Başarı İçin İpuçları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <div key={tip.title} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-background/60 flex items-center justify-center mb-3">
                  <tip.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{tip.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
