import { NextRequest, NextResponse } from 'next/server'

// Rastgele lisans kodu oluştur
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segments = []
  for (let s = 0; s < 3; s++) {
    let segment = ''
    for (let i = 0; i < 4; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments.push(segment)
  }
  return `LGS-${segments.join('-')}`
}

// Firebase REST API ile veri yaz
async function writeToFirebase(licenseCode: string, data: Record<string, unknown>) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

  if (!projectId || !apiKey) {
    throw new Error('Firebase config missing')
  }

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/licenses?documentId=${licenseCode}&key=${apiKey}`

  const firestoreData = {
    fields: {
      code: { stringValue: data.code as string },
      plan: { stringValue: data.plan as string },
      used: { booleanValue: false },
      usedBy: { nullValue: null },
      usedByEmail: { nullValue: null },
      usedAt: { nullValue: null },
      note: { stringValue: data.note as string },
      customerEmail: { stringValue: data.customerEmail as string },
      orderId: { stringValue: data.orderId as string },
      createdAt: { timestampValue: new Date().toISOString() },
      source: { stringValue: 'woocommerce_webhook' },
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(firestoreData),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Firebase error: ${error}`)
  }

  return response.json()
}

// LGS Premium ürün ID'si
const LGS_PREMIUM_PRODUCT_ID = parseInt(process.env.LGS_PREMIUM_PRODUCT_ID || '6838')

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()

    // Boş payload kontrolü (ping testi)
    if (!payload || payload === '[]' || payload === '{}') {
      return NextResponse.json({ success: true, message: 'Ping received' }, { status: 200 })
    }

    let data
    try {
      data = JSON.parse(payload)
    } catch {
      return NextResponse.json({ success: true, message: 'Invalid JSON, ignoring' }, { status: 200 })
    }

    // Webhook ping testi
    if (data.webhook_id || !data.id) {
      return NextResponse.json({ success: true, message: 'Webhook ping successful' }, { status: 200 })
    }

    // Sipariş durumu kontrolü
    const status = data.status || ''
    if (status !== 'completed' && status !== 'processing') {
      return NextResponse.json({
        success: true,
        message: `Order status is ${status}, skipping`
      }, { status: 200 })
    }

    // LGS Premium ürünü var mı kontrol et
    const lineItems = data.line_items || []
    const hasLGSPremium = lineItems.some((item: { product_id: number }) =>
      item.product_id === LGS_PREMIUM_PRODUCT_ID
    )

    if (!hasLGSPremium) {
      return NextResponse.json({
        success: true,
        message: 'No LGS Premium product in order'
      }, { status: 200 })
    }

    // Müşteri bilgileri
    const customerEmail = data.billing?.email || ''
    const customerName = `${data.billing?.first_name || ''} ${data.billing?.last_name || ''}`.trim()
    const orderId = data.id || data.number || 'unknown'

    if (!customerEmail) {
      return NextResponse.json({
        success: false,
        message: 'Customer email not found'
      }, { status: 200 })
    }

    // Lisans kodu oluştur
    const licenseCode = generateCode()

    // Firebase'e kaydet
    await writeToFirebase(licenseCode, {
      code: licenseCode,
      plan: 'premium',
      note: `WooCommerce Sipariş #${orderId} - ${customerName}`,
      customerEmail: customerEmail,
      orderId: String(orderId),
    })

    console.log(`✅ Lisans oluşturuldu: ${licenseCode} - Sipariş #${orderId} - ${customerEmail}`)

    return NextResponse.json({
      success: true,
      license_code: licenseCode,
      message: `License created for order #${orderId}`,
    }, { status: 200 })

  } catch (error) {
    console.error('Webhook hatası:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      message: 'Error processing webhook'
    }, { status: 200 })
  }
}

// GET isteği için basit kontrol
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'WooCommerce webhook endpoint active'
  })
}
