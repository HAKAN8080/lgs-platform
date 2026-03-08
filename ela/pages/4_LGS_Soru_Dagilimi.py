"""
LGS Soru Dagilimi Sayfasi
2018-2024 yillari arasi LGS sinavlarinda cikan konular ve soru sayilari
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

st.set_page_config(page_title="LGS Soru Dagilimi", page_icon="📊", layout="wide")

st.title("📊 LGS Soru Dagilimi (2018-2024)")
st.markdown("Son 7 yilda LGS'de cikan konular ve soru sayilari")

# ============================================
# TURKCE SORU DAGILIMI (kaganakademi.com.tr)
# Her yil toplam 20 soru
# ============================================
turkce_data = {
    "Konu": [
        "Sozcukte Anlam",
        "Deyimler-Atasozleri",
        "Cumlede Anlam",
        "Sozel Mantik",
        "Parcada Anlam",
        "Metin Turleri",
        "Dil Bilgisi",
        "Yazim-Noktalama"
    ],
    "2018": [2, 1, 2, 1, 10, 1, 2, 1],
    "2019": [2, 1, 2, 4, 6, 1, 2, 2],
    "2020": [1, 1, 2, 5, 6, 2, 2, 1],
    "2021": [2, 1, 2, 4, 8, 1, 1, 1],
    "2022": [2, 1, 2, 4, 7, 1, 2, 1],
    "2023": [1, 1, 3, 4, 7, 1, 2, 1],
    "2024": [1, 1, 3, 3, 8, 1, 2, 1]
}

# ============================================
# MATEMATIK SORU DAGILIMI (kaganakademi.com.tr)
# ============================================
matematik_data = {
    "Konu": [
        "Uslu Sayilar",
        "Koklu Sayilar",
        "Cebirsel Ifadeler",
        "Dogrusal Denklemler",
        "Ucgenler",
        "Eslik-Benzerlik",
        "Donusumler",
        "Olasilik",
        "Veri Analizi"
    ],
    "2018": [2, 3, 3, 3, 1, 2, 2, 2, 2],
    "2019": [2, 3, 3, 4, 2, 2, 1, 1, 2],
    "2020": [4, 3, 4, 0, 0, 3, 2, 2, 2],
    "2021": [3, 2, 2, 2, 2, 3, 2, 2, 2],
    "2022": [2, 3, 2, 4, 2, 2, 2, 1, 2],
    "2023": [4, 5, 4, 0, 0, 2, 2, 1, 2],
    "2024": [2, 3, 2, 3, 3, 2, 2, 1, 2]
}

# ============================================
# FEN BILIMLERI SORU DAGILIMI (kaganakademi.com.tr)
# ============================================
fen_data = {
    "Konu": [
        "Madde ve Endustri",
        "DNA ve Genetik",
        "Enerji Donusumleri",
        "Basinc",
        "Elektrik Yukleri",
        "Basit Makineler",
        "Periyodik Sistem",
        "Canlilar ve Enerji"
    ],
    "2018": [6, 2, 3, 0, 3, 2, 2, 2],
    "2019": [6, 3, 4, 2, 2, 1, 1, 1],
    "2020": [4, 8, 0, 5, 1, 1, 1, 0],
    "2021": [5, 5, 4, 2, 1, 1, 1, 1],
    "2022": [5, 4, 4, 2, 2, 1, 1, 1],
    "2023": [4, 8, 0, 5, 1, 1, 1, 0],
    "2024": [5, 4, 4, 2, 2, 1, 1, 1]
}

# ============================================
# INKILAP TARIHI SORU DAGILIMI (kaganakademi.com.tr)
# ============================================
inkilap_data = {
    "Konu": [
        "Bir Kahraman Doguyor",
        "Milli Uyanis",
        "Milli Mucadele (Destan)",
        "Ataturkculuk ve Inkilaplar",
        "Demokratiklesme",
        "Ataturk Donemi Dis Politika"
    ],
    "2018": [1, 1, 1, 5, 1, 1],
    "2019": [1, 2, 2, 4, 0, 1],
    "2020": [1, 4, 3, 0, 1, 1],
    "2021": [1, 2, 2, 3, 1, 1],
    "2022": [2, 2, 2, 0, 2, 2],
    "2023": [1, 2, 3, 0, 2, 2],
    "2024": [1, 2, 2, 4, 0, 1]
}

# ============================================
# DIN KULTURU SORU DAGILIMI (kaganakademi.com.tr)
# ============================================
din_data = {
    "Konu": [
        "Kader Inanci",
        "Zekat ve Sadaka",
        "Din ve Hayat",
        "Hz. Muhammed'in Hayati",
        "Temel Inanc Esaslari"
    ],
    "2018": [2, 1, 2, 3, 2],
    "2019": [1, 3, 0, 4, 2],
    "2020": [1, 3, 3, 2, 1],
    "2021": [1, 3, 3, 2, 1],
    "2022": [3, 2, 4, 0, 1],
    "2023": [4, 3, 3, 0, 0],
    "2024": [2, 2, 2, 2, 2]
}

# ============================================
# INGILIZCE SORU DAGILIMI (kaganakademi.com.tr)
# ============================================
ingilizce_data = {
    "Konu": [
        "Friendship",
        "Teen Life",
        "Cooking / Recipes",
        "Communication",
        "Internet",
        "Adventures / Tourism",
        "Science",
        "Natural Forces"
    ],
    "2018": [2, 1, 1, 1, 1, 3, 0, 1],
    "2019": [1, 2, 1, 2, 1, 0, 2, 1],
    "2020": [1, 2, 1, 1, 2, 0, 2, 1],
    "2021": [1, 2, 1, 1, 1, 1, 2, 1],
    "2022": [2, 1, 1, 1, 1, 1, 2, 1],
    "2023": [4, 0, 1, 1, 1, 0, 2, 1],
    "2024": [2, 1, 1, 1, 1, 0, 2, 2]
}

# ============================================
# DERS SECIMI
# ============================================
st.markdown("---")

ders_secimi = st.selectbox(
    "📚 Ders Seciniz:",
    ["Turkce", "Matematik", "Fen Bilimleri", "Inkilap Tarihi", "Din Kulturu", "Ingilizce"],
    key="ders_sec"
)

# Ders verisini sec
ders_dict = {
    "Turkce": (turkce_data, "📖", "#3B82F6"),
    "Matematik": (matematik_data, "🔢", "#10B981"),
    "Fen Bilimleri": (fen_data, "🔬", "#8B5CF6"),
    "Inkilap Tarihi": (inkilap_data, "📜", "#F59E0B"),
    "Din Kulturu": (din_data, "🕌", "#EC4899"),
    "Ingilizce": (ingilizce_data, "🌍", "#06B6D4")
}

data, icon, color = ders_dict[ders_secimi]
df = pd.DataFrame(data)

st.markdown("---")

# ============================================
# TABLO GOSTERIMI
# ============================================
st.subheader(f"{icon} {ders_secimi} Soru Dagilimi")

# Toplam satiri ekle
yillar = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"]
toplam_row = {"Konu": "TOPLAM"}
for yil in yillar:
    toplam_row[yil] = df[yil].sum()

df_with_total = pd.concat([df, pd.DataFrame([toplam_row])], ignore_index=True)

# Tabloyu goster
st.dataframe(df_with_total, use_container_width=True, hide_index=True)

# ============================================
# GRAFIK - KONU BAZLI DAGILIM
# ============================================
st.subheader("📊 Konu Bazli Dagilim (2024)")

fig = px.bar(
    df,
    x="Konu",
    y="2024",
    color_discrete_sequence=[color],
    text="2024"
)
fig.update_traces(textposition='outside')
fig.update_layout(
    xaxis_title="",
    yaxis_title="Soru Sayisi",
    xaxis_tickangle=-45,
    height=400
)
st.plotly_chart(fig, use_container_width=True)

# ============================================
# YILLIK TREND
# ============================================
st.subheader("📈 Yillik Toplam Soru Sayisi Trendi")

toplam_df = pd.DataFrame({
    "Yil": yillar,
    "Soru Sayisi": [df[yil].sum() for yil in yillar]
})

fig2 = px.line(
    toplam_df,
    x="Yil",
    y="Soru Sayisi",
    markers=True,
    color_discrete_sequence=[color]
)
fig2.update_traces(line_width=3, marker_size=10)
fig2.update_layout(
    yaxis_title="Toplam Soru",
    height=300
)
st.plotly_chart(fig2, use_container_width=True)

st.markdown("---")

# ============================================
# GENEL OZET
# ============================================
st.header("📋 LGS 2024 Genel Ozet")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    ### Sozel Bolum (50 Soru - 75 dk)
    | Ders | Soru |
    |------|------|
    | Turkce | 20 |
    | T.C. Inkilap Tarihi | 10 |
    | Din Kulturu | 10 |
    | Ingilizce | 10 |
    """)

with col2:
    st.markdown("""
    ### Sayisal Bolum (40 Soru - 80 dk)
    | Ders | Soru |
    |------|------|
    | Matematik | 20 |
    | Fen Bilimleri | 20 |
    """)

st.markdown("---")

# ============================================
# ONEMLI NOTLAR
# ============================================
st.header("💡 Onemli Notlar")

st.info("""
**LGS Sinav Yapisi:**
- Toplam 90 soru, 155 dakika
- Her dogru 1 puan, her yanlis 0 puan (yanlis dogru goturmez)
- Puan hesaplama: Ham puan + Yerlestirme puani
- Merkezi sinav puani %50, yilsonu basari puani %50 agirlikli
""")

st.success("""
**Basari Icin Oneriler:**
- En cok soru cikan konulara oncelik verin
- Paragraf sorulari Turkce'nin %60'ini olusturur
- Matematik'te Geometri en cok soru cikan alandir
- Fen'de Fizik konulari agirliklidir
""")

# ============================================
# KAYNAK: kaganakademi.com.tr
# ============================================
st.markdown("---")
st.caption("Kaynak: kaganakademi.com.tr/blog/lgs-soru-dagilimlari")
