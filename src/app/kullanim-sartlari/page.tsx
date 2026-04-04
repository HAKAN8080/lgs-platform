import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Şartları | LGS Hazırlık',
  description: 'LGS Hazırlık platformu kullanım şartları',
}

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Kullanım Şartları</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Kabul</h2>
            <p className="text-muted-foreground">
              LGS Hazırlık (lgs.thorius.com.tr) sitesini kullanarak, bu kullanım şartlarını
              kabul etmiş sayılırsınız. Bu şartları kabul etmiyorsanız, lütfen siteyi kullanmayın.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Hizmet Tanımı</h2>
            <p className="text-muted-foreground">
              LGS Hazırlık, LGS sınavına hazırlanan öğrenciler için deneme takip, puan hesaplama,
              konu analizi ve çeşitli eğitim araçları sunan bir platformdur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Hesap Oluşturma</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Hesap oluşturmak için geçerli bir e-posta adresi gereklidir</li>
              <li>Hesap bilgilerinizin gizliliğinden siz sorumlusunuz</li>
              <li>Hesabınızla yapılan tüm işlemlerden siz sorumlusunuz</li>
              <li>18 yaşından küçükler veli/vasi izniyle kayıt olmalıdır</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Kullanım Kuralları</h2>
            <p className="text-muted-foreground mb-4">Aşağıdaki davranışlar yasaktır:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Siteye zarar verecek yazılım veya kod kullanmak</li>
              <li>Başkalarının hesaplarına izinsiz erişmek</li>
              <li>Yanıltıcı veya sahte bilgi paylaşmak</li>
              <li>Siteyi yasadışı amaçlarla kullanmak</li>
              <li>İçerikleri izinsiz kopyalamak veya dağıtmak</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Premium Üyelik</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Premium özellikler ücretli üyelik gerektirir</li>
              <li>Ödemeler iade edilmez (yasal zorunluluklar hariç)</li>
              <li>Premium özelliklerin kapsamı değişebilir</li>
              <li>Lisans kodları tek kullanımlıktır ve devredilemez</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Fikri Mülkiyet</h2>
            <p className="text-muted-foreground">
              Sitedeki tüm içerik, tasarım, logo ve yazılımlar LGS Hazırlık&apos;a aittir.
              İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Sorumluluk Reddi</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Site &quot;olduğu gibi&quot; sunulmaktadır</li>
              <li>Puan hesaplamaları tahminidir, resmi sonuçları garanti etmez</li>
              <li>Sınav sonuçlarından platform sorumlu tutulamaz</li>
              <li>Teknik aksaklıklardan doğan zararlardan sorumlu değiliz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Reklamlar</h2>
            <p className="text-muted-foreground">
              Sitemizde üçüncü taraf reklamlar gösterilebilir. Bu reklamların içeriğinden
              reklam verenler sorumludur. Reklamlar, eğitim içeriğine uygun olacak şekilde filtrelenir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Hesap Sonlandırma</h2>
            <p className="text-muted-foreground">
              Kullanım şartlarını ihlal eden hesaplar önceden haber verilmeksizin
              askıya alınabilir veya silinebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Değişiklikler</h2>
            <p className="text-muted-foreground">
              Bu kullanım şartları önceden haber verilmeksizin değiştirilebilir.
              Güncel şartlar bu sayfada yayınlanır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">11. Uygulanacak Hukuk</h2>
            <p className="text-muted-foreground">
              Bu şartlar Türkiye Cumhuriyeti kanunlarına tabidir.
              Uyuşmazlıklarda İstanbul mahkemeleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">12. İletişim</h2>
            <p className="text-muted-foreground">
              Kullanım şartları hakkında sorularınız için:
              <br />
              E-posta: info@thorius.com.tr
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
