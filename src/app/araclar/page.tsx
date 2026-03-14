import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator, School, Bot, FileText, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ücretsiz LGS Araçları | Puan Hesaplama & Taban Puanları',
  description: 'LGS puan hesaplama, lise taban puanları sorgulama, tercih robotu ve çalışma programı oluşturucu. Tüm araçlar ücretsiz, kayıt gerektirmez.',
  alternates: { canonical: '/araclar' },
}

const tools = [
  {
    name: 'LGS Puan ve Net Hesaplama',
    description: '2025 katsayılarıyla LGS puanını ve netlerini hesapla. Doğru ve yanlış sayılarını gir, anında sonucu gör.',
    href: '/araclar/puan-hesaplama',
    icon: Calculator,
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  {
    name: 'Lise Taban Puanları',
    description: '2025 yılı lise taban puanları, kontenjanlar ve yüzdelik dilimler.',
    href: '/araclar/taban-puanlari',
    icon: School,
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
  },
  {
    name: 'Tercih Robotu',
    description: 'Puanına göre okul önerileri al. Hangi liselere yerleşebileceğini keşfet.',
    href: '/araclar/tercih-robotu',
    icon: Bot,
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    comingSoon: true,
  },
  {
    name: 'Optik TXT Parser',
    description: 'Optixy formatındaki TXT dosyalarını yükle, cevap anahtarı gir ve sonuçları hesapla.',
    href: '/araclar/txt-parser.html',
    icon: FileText,
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    external: true,
  },
  {
    name: 'AI Soru Üretici',
    description: 'MEB LGS sınav formatında yapay zeka destekli özgün sorular üret.',
    href: '/araclar/lgs-soru-uretici.html',
    icon: Sparkles,
    color: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    external: true,
    comingSoon: true,
  },
]

export default function AraclarPage() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Araçlar</h1>
          <p className="mt-4 text-muted-foreground">
            LGS hazırlığın için ücretsiz araçlar. Kayıt gerektirmez.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {tools.map((tool) => {
            const isDisabled = tool.comingSoon
            const href = isDisabled ? '#' : tool.href
            const className = `group relative rounded-xl border bg-card p-6 transition-all duration-200 ${
              isDisabled
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:border-primary/50 hover:bg-accent/50'
            }`

            const content = (
              <>
                {tool.comingSoon && (
                  <span className="absolute top-4 right-4 text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">
                    Yakında
                  </span>
                )}
                <div className={`inline-flex rounded-lg p-3 border ${tool.color}`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </h2>
                <p className="mt-2 text-muted-foreground">{tool.description}</p>
              </>
            )

            // External HTML files
            if (tool.external && !isDisabled) {
              return (
                <a key={tool.name} href={href} className={className}>
                  {content}
                </a>
              )
            }

            return (
              <Link key={tool.name} href={href} className={className}>
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
