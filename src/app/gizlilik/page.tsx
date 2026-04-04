import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | LGS Hazırlık',
  description: 'LGS Hazırlık platformu gizlilik politikası',
}

export default function GizlilikPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Gizlilik Politikası</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Giriş</h2>
            <p className="text-muted-foreground">
              LGS Hazırlık (lgs.thorius.com.tr) olarak, kullanıcılarımızın gizliliğine önem veriyoruz.
              Bu gizlilik politikası, sitemizi kullanırken toplanan bilgilerin nasıl kullanıldığını açıklar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Toplanan Bilgiler</h2>
            <p className="text-muted-foreground mb-4">Sitemizde aşağıdaki bilgiler toplanabilir:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>E-posta adresi (kayıt sırasında)</li>
              <li>Deneme sonuçları ve net bilgileri</li>
              <li>Kullanım istatistikleri</li>
              <li>Çerezler aracılığıyla toplanan teknik bilgiler</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Bilgilerin Kullanımı</h2>
            <p className="text-muted-foreground mb-4">Toplanan bilgiler şu amaçlarla kullanılır:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Hesap oluşturma ve yönetimi</li>
              <li>Kişiselleştirilmiş deneme analizi sunma</li>
              <li>Platform performansını iyileştirme</li>
              <li>Kullanıcı desteği sağlama</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Çerezler (Cookies)</h2>
            <p className="text-muted-foreground">
              Sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
              Çerezler, oturum yönetimi ve tercihlerinizi hatırlamak için kullanılır.
              Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Üçüncü Taraf Hizmetler</h2>
            <p className="text-muted-foreground mb-4">Sitemizde aşağıdaki üçüncü taraf hizmetler kullanılmaktadır:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Google AdSense:</strong> Reklam gösterimi için kullanılır. Google&apos;ın gizlilik politikası için: <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
              <li><strong>Firebase:</strong> Kimlik doğrulama ve veri depolama için kullanılır.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Çocukların Gizliliği</h2>
            <p className="text-muted-foreground">
              Sitemiz, LGS&apos;ye hazırlanan öğrencilere yöneliktir. 13 yaşın altındaki çocuklardan
              bilerek kişisel bilgi toplamıyoruz. Ebeveynler, çocuklarının site kullanımını
              denetlemelidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Veri Güvenliği</h2>
            <p className="text-muted-foreground">
              Kullanıcı verilerini korumak için endüstri standardı güvenlik önlemleri kullanıyoruz.
              Ancak, internet üzerinden veri iletiminin %100 güvenli olmadığını unutmayın.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Haklarınız</h2>
            <p className="text-muted-foreground mb-4">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Kişisel verilerinize erişim talep etme</li>
              <li>Verilerinizin düzeltilmesini isteme</li>
              <li>Verilerinizin silinmesini talep etme</li>
              <li>Veri işlemeye itiraz etme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. İletişim</h2>
            <p className="text-muted-foreground">
              Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
              <br />
              E-posta: info@thorius.com.tr
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Değişiklikler</h2>
            <p className="text-muted-foreground">
              Bu gizlilik politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada yayınlanacaktır.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
