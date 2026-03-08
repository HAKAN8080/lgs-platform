import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/panel/', '/giris', '/kayit'],
      },
    ],
    sitemap: 'https://lgs-platformu.vercel.app/sitemap.xml',
  }
}
