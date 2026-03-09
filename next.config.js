const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdnpub.egitim.com' },
      { protocol: 'https', hostname: 'play-lh.googleusercontent.com' },
    ],
  },
  webpack: (config) => {
    // pdfjs-dist için canvas modülünü şimle
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: path.resolve(__dirname, 'src/lib/canvas-shim.js'),
    }
    return config
  },
}

module.exports = nextConfig
