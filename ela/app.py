"""
LGS Ogrenci Takip Sistemi
Ana Sayfa
"""

import streamlit as st
import sys
import os

# Components klasorunu ekle
sys.path.append(os.path.dirname(__file__))

st.set_page_config(
    page_title="LGS Ogrenci Takip",
    page_icon="📚",
    layout="wide"
)

# Mouse takip eden yildiz efekti
from components.star_effect import add_particle_trail
add_particle_trail()

# Session state baslat
if 'okul_sinavlari' not in st.session_state:
    st.session_state.okul_sinavlari = None
if 'deneme_sonuclari' not in st.session_state:
    st.session_state.deneme_sonuclari = None
if 'karneler' not in st.session_state:
    st.session_state.karneler = []
if 'ogrenci_adi' not in st.session_state:
    st.session_state.ogrenci_adi = ""

st.title("📚 LGS Ogrenci Takip Sistemi")

st.markdown("---")

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("""
    ### 📊 Veri Yukleme
    - Okul izleme sinavlari (Excel)
    - Deneme sonuclari (PDF)
    - Detay karneler (PDF)
    """)

with col2:
    st.markdown("""
    ### 📈 Analiz
    - Ders bazli performans
    - Trend analizi
    - Guclu/zayif yonler
    """)

with col3:
    st.markdown("""
    ### 🗺️ Yol Haritasi
    - Kisisellestirilmis plan
    - Haftalik program
    - Hedef puanlar
    """)

st.markdown("---")

# Durum ozeti
st.subheader("📋 Veri Durumu")

col1, col2, col3 = st.columns(3)

with col1:
    if st.session_state.okul_sinavlari is not None:
        st.success(f"✅ Okul Sinavlari: {len(st.session_state.okul_sinavlari)} kayit")
    else:
        st.warning("⏳ Okul sinavlari yuklenmedi")

with col2:
    if st.session_state.deneme_sonuclari is not None:
        st.success(f"✅ Deneme Sonuclari: {len(st.session_state.deneme_sonuclari)} kayit")
    else:
        st.warning("⏳ Deneme sonuclari yuklenmedi")

with col3:
    if len(st.session_state.karneler) > 0:
        st.success(f"✅ Karneler: {len(st.session_state.karneler)} adet")
    else:
        st.info("ℹ️ Karne yuklenmedi (opsiyonel)")

st.markdown("---")
st.caption("Sol menuden sayfalara erisebilirsiniz.")
