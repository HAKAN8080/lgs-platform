import { NextRequest, NextResponse } from 'next/server'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { generateLicenseCode } from '@/lib/firebase/license'
import crypto from 'crypto'

// WooCommerce webhook secret - .env.local'da tanımla
const WEBHOOK_SECRET = process.env.WOOCOMMERCE_WEBHOOK_SECRET || ''

// WooCommerce imza doğrulama
function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('WOOCOMMERCE_WEBHOOK_SECRET tanımlı değil, doğrulama atlanıyor')
    return true // Development için
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('base64')

  return signature === expectedSignature
}

// LGS Premium ürün ID'si - WooCommerce'den al
const LGS_PREMIUM_PRODUCT_IDS = [
  parseInt(process.env.LGS_PREMIUM_PRODUCT_ID || '0'),
  // Birden fazla ürün varsa ekle
]

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-wc-webhook-signature') || ''

    // İmza doğrulama
    if (!verifyWebhookSignature(payload, signature)) {
      console.error('Webhook imza doğrulaması başarısız')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(payload)

    // Sipariş durumu kontrolü - sadece tamamlanan siparişler
    if (data.status !== 'completed' && data.status !== 'processing') {
      return NextResponse.json({ message: 'Order not completed, skipping' }, { status: 200 })
    }

    // LGS Premium ürünü var mı kontrol et
    const lineItems = data.line_items || []
    const hasLGSPremium = lineItems.some((item: { product_id: number }) =>
      LGS_PREMIUM_PRODUCT_IDS.includes(item.product_id)
    )

    if (!hasLGSPremium && LGS_PREMIUM_PRODUCT_IDS[0] !== 0) {
      return NextResponse.json({ message: 'No LGS Premium product in order' }, { status: 200 })
    }

    // Müşteri bilgileri
    const customerEmail = data.billing?.email || ''
    const customerName = `${data.billing?.first_name || ''} ${data.billing?.last_name || ''}`.trim()
    const orderId = data.id || data.order_id || 'unknown'

    if (!customerEmail) {
      console.error('Müşteri email bulunamadı')
      return NextResponse.json({ error: 'Customer email not found' }, { status: 400 })
    }

    // Lisans kodu oluştur
    const licenseCode = generateLicenseCode()

    if (!db) {
      console.error('Firebase bağlantısı yok')
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 })
    }

    // Firebase'e kaydet
    const licenseRef = doc(db, 'licenses', licenseCode)
    await setDoc(licenseRef, {
      code: licenseCode,
      plan: 'premium',
      used: false,
      usedBy: null,
      usedByEmail: null,
      usedAt: null,
      note: `WooCommerce Sipariş #${orderId} - ${customerName}`,
      customerEmail: customerEmail,
      orderId: String(orderId),
      createdAt: serverTimestamp(),
      source: 'woocommerce_webhook',
    })

    console.log(`Lisans oluşturuldu: ${licenseCode} - Sipariş #${orderId} - ${customerEmail}`)

    // Başarılı yanıt - lisans kodunu döndür
    return NextResponse.json({
      success: true,
      license_code: licenseCode,
      message: `License created for order #${orderId}`,
    }, { status: 200 })

  } catch (error) {
    console.error('Webhook işleme hatası:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET isteği için basit kontrol
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'WooCommerce webhook endpoint active'
  })
}
