# LGS Platform

LGS hazırlık ve deneme takip platformu.

## Özellikler

- PDF karne yükleme ve analiz (HIZ, Form Akademi, ÜçDörtBeş)
- Manuel deneme ekleme (Excel/Form)
- Konu bazında kümülatif analiz
- LGS puan hesaplama
- Taban puanları
- Premium üyelik sistemi

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Firebase (Auth + Firestore)
- Tailwind CSS
- PDF.js
- Recharts

## Development

```bash
npm install
npm run dev
```

`.env.local` dosyası oluşturun (.env.local.example'dan kopyalayın) ve Firebase credentials ekleyin.

## Deployment (Vercel)

### 1. GitHub'a Push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel'e Deploy

1. [Vercel](https://vercel.com) hesabı açın
2. "Import Project" tıklayın
3. GitHub repo'nuzu seçin
4. Environment Variables ekleyin (.env.local'dan kopyalayın):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. "Deploy" tıklayın

### 3. Domain Bağlama (thorius.com.tr)

1. Vercel Dashboard > Settings > Domains
2. "thorius.com.tr" ekleyin
3. DNS ayarlarınızda:
   - A Record: `76.76.21.21`
   - CNAME (www): `cname.vercel-dns.com`
4. SSL otomatik aktif olacak (birkaç dakika)

## Firebase Setup

1. [Firebase Console](https://console.firebase.google.com)
2. Authentication > Email/Password aktif edin
3. Firestore Database oluşturun
4. Hosting > Domain ekleyin: thorius.com.tr (authorized domain)

## License

Proprietary
