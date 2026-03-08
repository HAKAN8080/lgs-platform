const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
