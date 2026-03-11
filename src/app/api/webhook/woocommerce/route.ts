import { NextRequest, NextResponse } from 'next/server'

// Resend ile email gönder
async function sendLicenseEmail(
  to: string,
  customerName: string,
  licenseCode: string,
  orderId: string
) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY tanımlı değil')
    return false
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'LGS Hazırlık <noreply@thorius.com.tr>',
      to: [to],
      subject: '🎉 LGS Premium Lisans Kodunuz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7c3aed; margin: 0;">LGS Hazırlık</h1>
            <p style="color: #666;">Premium Üyelik</p>
          </div>

          <p>Merhaba ${customerName || 'Değerli Öğrencimiz'},</p>

          <p>LGS Premium satın aldığınız için teşekkür ederiz! 🎉</p>

          <p>Sipariş Numaranız: <strong>#${orderId}</strong></p>

          <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
            <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px 0; font-size: 14px;">Lisans Kodunuz</p>
            <p style="color: white; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; font-family: monospace;">${licenseCode}</p>
          </div>

          <h3 style="color: #333;">Nasıl Aktive Edilir?</h3>
          <ol style="color: #555; line-height: 1.8;">
            <li><a href="https://lgs.thorius.com.tr/giris" style="color: #7c3aed;">lgs.thorius.com.tr</a> adresine giriş yapın</li>
            <li>Panel sayfasında <strong>"Lisans Kodu Gir"</strong> butonuna tıklayın</li>
            <li>Yukarıdaki kodu girin ve aktive edin</li>
            <li>Premium özelliklerin keyfini çıkarın! 🚀</li>
          </ol>

          <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin-top: 24px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Not:</strong> Lisans kodunuz LGS 2026 (Haziran) tarihine kadar geçerlidir.
              Sorularınız için <a href="mailto:destek@thorius.com.tr" style="color: #7c3aed;">destek@thorius.com.tr</a> adresinden bize ulaşabilirsiniz.
            </p>
          </div>

          <p style="margin-top: 30px; color: #888; font-size: 12px; text-align: center;">
            © 2026 LGS Hazırlık - Thorius
          </p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Email gönderme hatası:', error)
    return false
  }

  console.log(`📧 Email gönderildi: ${to}`)
  return true
}

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

    // Müşteriye email gönder
    await sendLicenseEmail(customerEmail, customerName, licenseCode, String(orderId))

    return NextResponse.json({
      success: true,
      license_code: licenseCode,
      message: `License created and email sent for order #${orderId}`,
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
