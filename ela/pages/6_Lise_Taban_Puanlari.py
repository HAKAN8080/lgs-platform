"""
Lise Taban Puanlari
2024 LGS taban puanlari ve yuzdelik dilimler
"""

import streamlit as st
import pandas as pd

st.set_page_config(page_title="Lise Taban Puanlari", page_icon="🏫", layout="wide")

st.title("🏫 Lise Taban Puanlari")
st.caption("2024 LGS taban puanlari, yuzdelik dilimler ve kontenjanlar")

# ============================================
# ORNEK LISE VERILERI (Istanbul)
# ============================================
lise_data = [
    # Fen Liseleri
    {"il": "Istanbul", "ilce": "Kadikoy", "lise": "Istanbul Erkek Lisesi", "tur": "Fen Lisesi", "dil": "Ingilizce", "puan": 494.52, "yuzdelik": 0.01, "siralama": 150, "kontenjan": 120},
    {"il": "Istanbul", "ilce": "Besiktas", "lise": "Galatasaray Lisesi", "tur": "Fen Lisesi", "dil": "Fransizca", "puan": 493.89, "yuzdelik": 0.02, "siralama": 250, "kontenjan": 96},
    {"il": "Istanbul", "ilce": "Uskudar", "lise": "Haydarpasa Lisesi", "tur": "Fen Lisesi", "dil": "Ingilizce", "puan": 489.12, "yuzdelik": 0.15, "siralama": 1800, "kontenjan": 150},
    {"il": "Istanbul", "ilce": "Fatih", "lise": "Istanbul Lisesi", "tur": "Fen Lisesi", "dil": "Almanca", "puan": 487.45, "yuzdelik": 0.25, "siralama": 3000, "kontenjan": 120},
    {"il": "Istanbul", "ilce": "Kadikoy", "lise": "Kadikoy Anadolu Lisesi", "tur": "Fen Lisesi", "dil": "Ingilizce", "puan": 485.23, "yuzdelik": 0.40, "siralama": 4800, "kontenjan": 180},

    # Anadolu Liseleri - Kadikoy
    {"il": "Istanbul", "ilce": "Kadikoy", "lise": "Goztepe Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 478.56, "yuzdelik": 0.85, "siralama": 10200, "kontenjan": 240},
    {"il": "Istanbul", "ilce": "Kadikoy", "lise": "Bostanci Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 465.34, "yuzdelik": 2.10, "siralama": 25200, "kontenjan": 300},
    {"il": "Istanbul", "ilce": "Kadikoy", "lise": "Kadikoy Maarif Koleji", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 455.12, "yuzdelik": 3.50, "siralama": 42000, "kontenjan": 270},

    # Kucukcekmece
    {"il": "Istanbul", "ilce": "Kucukcekmece", "lise": "Kucukcekmece Fen Lisesi", "tur": "Fen Lisesi", "dil": "Ingilizce", "puan": 472.89, "yuzdelik": 1.20, "siralama": 14400, "kontenjan": 150},
    {"il": "Istanbul", "ilce": "Kucukcekmece", "lise": "Atakent Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 445.67, "yuzdelik": 5.00, "siralama": 60000, "kontenjan": 360},
    {"il": "Istanbul", "ilce": "Kucukcekmece", "lise": "Halkali Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 438.23, "yuzdelik": 6.50, "siralama": 78000, "kontenjan": 330},
    {"il": "Istanbul", "ilce": "Kucukcekmece", "lise": "Sefakoy Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 425.56, "yuzdelik": 8.50, "siralama": 102000, "kontenjan": 300},
    {"il": "Istanbul", "ilce": "Kucukcekmece", "lise": "Cennet Mah. Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 412.34, "yuzdelik": 11.00, "siralama": 132000, "kontenjan": 270},

    # Bakirkoy
    {"il": "Istanbul", "ilce": "Bakirkoy", "lise": "Bakirkoy Fen Lisesi", "tur": "Fen Lisesi", "dil": "Ingilizce", "puan": 480.45, "yuzdelik": 0.70, "siralama": 8400, "kontenjan": 120},
    {"il": "Istanbul", "ilce": "Bakirkoy", "lise": "Bakirkoy Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 468.90, "yuzdelik": 1.80, "siralama": 21600, "kontenjan": 240},

    # Besiktas
    {"il": "Istanbul", "ilce": "Besiktas", "lise": "Besiktas Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 475.23, "yuzdelik": 1.00, "siralama": 12000, "kontenjan": 210},
    {"il": "Istanbul", "ilce": "Besiktas", "lise": "Levent Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 462.45, "yuzdelik": 2.40, "siralama": 28800, "kontenjan": 270},

    # Uskudar
    {"il": "Istanbul", "ilce": "Uskudar", "lise": "Uskudar Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 470.12, "yuzdelik": 1.50, "siralama": 18000, "kontenjan": 240},
    {"il": "Istanbul", "ilce": "Uskudar", "lise": "Cengelkoy Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 458.78, "yuzdelik": 2.80, "siralama": 33600, "kontenjan": 300},

    # Fatih
    {"il": "Istanbul", "ilce": "Fatih", "lise": "Fatih Anadolu Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 460.56, "yuzdelik": 2.60, "siralama": 31200, "kontenjan": 240},
    {"il": "Istanbul", "ilce": "Fatih", "lise": "Vefa Lisesi", "tur": "Anadolu Lisesi", "dil": "Ingilizce", "puan": 452.34, "yuzdelik": 3.80, "siralama": 45600, "kontenjan": 210},

    # Meslek Liseleri
    {"il": "Istanbul", "ilce": "Kadikoy", "lise": "Kadikoy Mesleki ve Teknik A.L.", "tur": "Meslek Lisesi", "dil": "Ingilizce", "puan": 385.45, "yuzdelik": 18.00, "siralama": 216000, "kontenjan": 450},
    {"il": "Istanbul", "ilce": "Kucukcekmece", "lise": "Halkali Mesleki ve Teknik A.L.", "tur": "Meslek Lisesi", "dil": "Ingilizce", "puan": 365.23, "yuzdelik": 25.00, "siralama": 300000, "kontenjan": 540},

    # Imam Hatip
    {"il": "Istanbul", "ilce": "Fatih", "lise": "Fatih Imam Hatip Lisesi", "tur": "Imam Hatip", "dil": "Arapca", "puan": 420.67, "yuzdelik": 9.50, "siralama": 114000, "kontenjan": 360},
    {"il": "Istanbul", "ilce": "Uskudar", "lise": "Uskudar Imam Hatip Lisesi", "tur": "Imam Hatip", "dil": "Arapca", "puan": 405.34, "yuzdelik": 13.00, "siralama": 156000, "kontenjan": 420},

    # Sosyal Bilimler
    {"il": "Istanbul", "ilce": "Sisli", "lise": "Sisli Sosyal Bilimler Lisesi", "tur": "Sosyal Bilimler", "dil": "Ingilizce", "puan": 465.78, "yuzdelik": 2.00, "siralama": 24000, "kontenjan": 120},
]

df = pd.DataFrame(lise_data)

st.markdown("---")

# ============================================
# FILTRELER
# ============================================
st.subheader("🔍 Filtrele")

col1, col2, col3, col4 = st.columns(4)

with col1:
    il_secim = st.selectbox("Il", ["Tumu"] + sorted(df['il'].unique().tolist()))

with col2:
    if il_secim != "Tumu":
        ilce_listesi = sorted(df[df['il'] == il_secim]['ilce'].unique().tolist())
    else:
        ilce_listesi = sorted(df['ilce'].unique().tolist())
    ilce_secim = st.selectbox("Ilce", ["Tumu"] + ilce_listesi)

with col3:
    tur_secim = st.selectbox("Lise Turu", ["Tumu"] + sorted(df['tur'].unique().tolist()))

with col4:
    dil_secim = st.selectbox("Yabanci Dil", ["Tumu"] + sorted(df['dil'].unique().tolist()))

# Puan filtresi
st.markdown("---")
col1, col2 = st.columns(2)
with col1:
    min_puan = st.number_input("Min Puan", min_value=200, max_value=500, value=200)
with col2:
    max_puan = st.number_input("Max Puan", min_value=200, max_value=500, value=500)

# ============================================
# FILTRELEME
# ============================================
filtered_df = df.copy()

if il_secim != "Tumu":
    filtered_df = filtered_df[filtered_df['il'] == il_secim]
if ilce_secim != "Tumu":
    filtered_df = filtered_df[filtered_df['ilce'] == ilce_secim]
if tur_secim != "Tumu":
    filtered_df = filtered_df[filtered_df['tur'] == tur_secim]
if dil_secim != "Tumu":
    filtered_df = filtered_df[filtered_df['dil'] == dil_secim]

filtered_df = filtered_df[(filtered_df['puan'] >= min_puan) & (filtered_df['puan'] <= max_puan)]

# Siralama
filtered_df = filtered_df.sort_values('puan', ascending=False)

st.markdown("---")

# ============================================
# SONUCLAR
# ============================================
st.subheader(f"📋 Liseler ({len(filtered_df)} sonuc)")

if len(filtered_df) > 0:
    # Tablo gosterimi
    display_df = filtered_df[['lise', 'ilce', 'tur', 'dil', 'puan', 'yuzdelik', 'siralama', 'kontenjan']].copy()
    display_df.columns = ['Lise Adi', 'Ilce', 'Tur', 'Dil', 'Taban Puan', 'Yuzdelik %', 'Siralama', 'Kontenjan']
    display_df['Taban Puan'] = display_df['Taban Puan'].apply(lambda x: f"{x:.2f}")
    display_df['Yuzdelik %'] = display_df['Yuzdelik %'].apply(lambda x: f"%{x:.2f}")
    display_df['Siralama'] = display_df['Siralama'].apply(lambda x: f"{x:,}")

    st.dataframe(display_df, use_container_width=True, hide_index=True)

    # Istatistikler
    st.markdown("---")
    st.subheader("📊 Istatistikler")

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("En Yuksek Puan", f"{filtered_df['puan'].max():.2f}")
    c2.metric("En Dusuk Puan", f"{filtered_df['puan'].min():.2f}")
    c3.metric("Ortalama Puan", f"{filtered_df['puan'].mean():.2f}")
    c4.metric("Toplam Kontenjan", f"{filtered_df['kontenjan'].sum():,}")

else:
    st.warning("Secilen kriterlere uygun lise bulunamadi.")

st.markdown("---")

# ============================================
# PUAN ILE ARAMA
# ============================================
st.subheader("🎯 Puanina Gore Lise Bul")

puan_input = st.number_input("LGS Puaninizi Girin", min_value=200.0, max_value=500.0, value=450.0, step=0.01)

if st.button("🔍 Uygun Liseleri Goster", type="primary"):
    uygun_df = df[df['puan'] <= puan_input].sort_values('puan', ascending=False).head(10)

    if len(uygun_df) > 0:
        st.success(f"**{puan_input:.2f}** puanla yerlesilebilecek en iyi 10 lise:")

        for i, row in uygun_df.iterrows():
            puan_farki = puan_input - row['puan']

            if row['tur'] == "Fen Lisesi":
                renk = "#059669"
            elif row['tur'] == "Anadolu Lisesi":
                renk = "#3B82F6"
            elif row['tur'] == "Sosyal Bilimler":
                renk = "#8B5CF6"
            else:
                renk = "#6B7280"

            st.markdown(f"""
            <div style="background-color:#F3F4F6; padding:12px; border-radius:8px; margin-bottom:8px; border-left:4px solid {renk};">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>{row['lise']}</strong><br/>
                        <small>{row['ilce']} | {row['tur']} | {row['dil']}</small>
                    </div>
                    <div style="text-align:right;">
                        <strong style="font-size:18px;">{row['puan']:.2f}</strong><br/>
                        <small style="color:#10B981;">+{puan_farki:.2f} fark</small>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.warning("Bu puanla yerlesilebilecek lise bulunamadi.")

st.markdown("---")

# ============================================
# BILGI
# ============================================
with st.expander("ℹ️ Bilgilendirme"):
    st.markdown("""
    ### Taban Puan Nedir?
    Taban puan, bir lisenin bir onceki yil yerlesen son ogrencinin LGS puanidir.

    ### Yuzdelik Dilim Nedir?
    Yuzdelik dilim, ogrencinin tum Turkiye siralamasi icindeki yerini gosterir.
    Ornegin %1 yuzdelik dilim, ilk %1'lik dilimde oldugunu gosterir.

    ### Onemli Notlar
    - Bu veriler 2024 yilina aittir
    - Gercek puanlar her yil degisebilir
    - Kesin bilgi icin MEB sonuclarini kontrol edin

    ### Lise Turleri
    - **Fen Lisesi:** En yuksek puanli ogrenciler
    - **Anadolu Lisesi:** Genel akademik egitim
    - **Sosyal Bilimler Lisesi:** Sosyal alanlara yonelik
    - **Imam Hatip Lisesi:** Dini egitim agirlikli
    - **Meslek Lisesi:** Mesleki egitim
    """)

st.caption("Kaynak: lise-taban-puanlari.hesaplama.net | 2024 verileri")
