"""
Analiz Sayfasi
Ders bazli performans, trend analizi, guclu/zayif yonler
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

st.set_page_config(page_title="Analiz", page_icon="📈", layout="wide")

st.title("📈 Performans Analizi")

# Session state kontrol
if 'okul_sinavlari' not in st.session_state:
    st.session_state.okul_sinavlari = None
if 'deneme_sonuclari' not in st.session_state:
    st.session_state.deneme_sonuclari = None

# Veri kontrolu
if st.session_state.okul_sinavlari is None and st.session_state.deneme_sonuclari is None:
    st.warning("⚠️ Henuz veri yuklenmedi. Lutfen Veri Yukleme sayfasindan veri yukleyin.")
    st.stop()

ogrenci_adi = st.session_state.get('ogrenci_adi', 'Ogrenci')
st.subheader(f"👤 {ogrenci_adi}")

st.markdown("---")

# ============================================
# DERS BAZLI KARSILASTIRMALI OZET (EN USTTE)
# ============================================
st.header("📊 Ders Bazlı Karşılaştırmalı Özet")

# Ders isimleri eslestirme
ders_mapping = {
    'TURKCE': {'okul_keywords': ['TÜRKÇE', 'TURKCE'], 'deneme_col': 'Turkce', 'ikon': '📖'},
    'MATEMATIK': {'okul_keywords': ['MATEMATİK', 'MATEMATIK', 'MAT'], 'deneme_col': 'Matematik', 'ikon': '🔢'},
    'FEN': {'okul_keywords': ['FEN', 'FEN BİLİMLERİ'], 'deneme_col': 'Fen Bilimleri', 'ikon': '🔬'},
    'INKILAP': {'okul_keywords': ['İNKİLAP', 'INKILAP', 'İNKILAP', 'T.C.'], 'deneme_col': 'Ink.Tarihi', 'ikon': '📜'},
    'DIN': {'okul_keywords': ['DİN', 'DIN'], 'deneme_col': 'Din Kulturu', 'ikon': '🕌'},
    'INGILIZCE': {'okul_keywords': ['İNG', 'ING', 'İNGİLİZCE'], 'deneme_col': 'Ingilizce', 'ikon': '🇬🇧'}
}

# Okul sinavlarindan ders verilerini cek
okul_ders_data = {}
if st.session_state.okul_sinavlari is not None:
    df_okul = st.session_state.okul_sinavlari.copy()
    df_okul.columns = [str(c).strip().upper() for c in df_okul.columns]

    # Sutunlari bul
    sinav_col_okul = None
    puan_col_okul = None
    siralama_col_okul = None

    for col in df_okul.columns:
        col_lower = col.lower()
        if 'sinav' in col_lower or 'sınav' in col_lower or 'adi' in col_lower:
            sinav_col_okul = col
        elif 'puan' in col_lower and 'ortalama' not in col_lower:
            puan_col_okul = col
        elif 'siralama' in col_lower or 'sıralama' in col_lower or 'sira' in col_lower:
            siralama_col_okul = col

    if sinav_col_okul and puan_col_okul:
        for ders, info in ders_mapping.items():
            mask = df_okul[sinav_col_okul].astype(str).str.upper().apply(
                lambda x: any(kw in x for kw in info['okul_keywords'])
            )
            ders_df = df_okul[mask]

            if len(ders_df) > 0:
                puanlar = pd.to_numeric(ders_df[puan_col_okul], errors='coerce').dropna()
                ort_sira = None

                if siralama_col_okul:
                    def parse_sira(val):
                        try:
                            val = str(val)
                            if '/' in val:
                                return int(val.split('/')[0].strip())
                        except:
                            pass
                        return None

                    siralamalar = ders_df[siralama_col_okul].apply(parse_sira).dropna()
                    if len(siralamalar) > 0:
                        ort_sira = siralamalar.mean()

                if len(puanlar) > 0:
                    okul_ders_data[ders] = {
                        'ortalama': puanlar.mean(),
                        'siralama': ort_sira,
                        'sinav_sayisi': len(ders_df)
                    }

# Deneme sonuclarindan ders verilerini cek
deneme_ders_data = {}
if st.session_state.deneme_sonuclari is not None:
    df_deneme = st.session_state.deneme_sonuclari.copy()

    # Siralama kolonunu bul
    sira_col = None
    for col in df_deneme.columns:
        col_lower = str(col).lower()
        if 'kurum' in col_lower and 'sira' in col_lower:
            sira_col = col
            break
        elif 'sira' in col_lower:
            sira_col = col

    # Genel kurum siralamasini hesapla (tum denemeler icin)
    genel_kurum_sira = None
    if sira_col:
        siralamalar = pd.to_numeric(df_deneme[sira_col], errors='coerce').dropna()
        if len(siralamalar) > 0:
            genel_kurum_sira = siralamalar.mean()

    for ders, info in ders_mapping.items():
        deneme_col = info['deneme_col']
        if deneme_col in df_deneme.columns:
            netler = pd.to_numeric(df_deneme[deneme_col], errors='coerce').dropna()
            if len(netler) > 0:
                deneme_ders_data[ders] = {
                    'ortalama': netler.mean(),
                    'sinav_sayisi': len(netler)
                }

# Karsilastirmali tabloyu goster
if okul_ders_data or deneme_ders_data:
    # Sabit sıralama: Üst satır ve alt satır
    ust_satir = ['TURKCE', 'MATEMATIK', 'FEN']
    alt_satir = ['INKILAP', 'DIN', 'INGILIZCE']

    # Üst satır kartları
    cols = st.columns(3)
    for i, ders in enumerate(ust_satir):
        info = ders_mapping.get(ders, {'ikon': '📚'})
        okul = okul_ders_data.get(ders, {})
        deneme = deneme_ders_data.get(ders, {})

        with cols[i]:
            st.markdown(f"""
            <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
                        padding: 15px; border-radius: 12px; margin-bottom: 10px; color: white;">
                <h4 style="margin: 0; text-align: center;">{info['ikon']} {ders}</h4>
                <hr style="border-color: rgba(255,255,255,0.3); margin: 10px 0;">
                <div style="display: flex; justify-content: space-between;">
                    <div style="flex: 1; text-align: center; border-right: 1px solid rgba(255,255,255,0.3); padding-right: 10px;">
                        <small style="opacity: 0.8;">📚 OKUL</small><br>
                        <b style="font-size: 1.3em;">{f"%{okul.get('ortalama', 0):.1f}" if okul.get('ortalama') else '-'}</b><br>
                        <small>Sıra: {f"{okul.get('siralama'):.0f}." if okul.get('siralama') else '-'}</small>
                    </div>
                    <div style="flex: 1; text-align: center; padding-left: 10px;">
                        <small style="opacity: 0.8;">📝 DENEME</small><br>
                        <b style="font-size: 1.3em;">{f"{deneme.get('ortalama', 0):.1f} net" if deneme.get('ortalama') else '-'}</b>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

    # Alt satır kartları
    cols2 = st.columns(3)
    for i, ders in enumerate(alt_satir):
        info = ders_mapping.get(ders, {'ikon': '📚'})
        okul = okul_ders_data.get(ders, {})
        deneme = deneme_ders_data.get(ders, {})

        with cols2[i]:
            st.markdown(f"""
            <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
                        padding: 15px; border-radius: 12px; margin-bottom: 10px; color: white;">
                <h4 style="margin: 0; text-align: center;">{info['ikon']} {ders}</h4>
                <hr style="border-color: rgba(255,255,255,0.3); margin: 10px 0;">
                <div style="display: flex; justify-content: space-between;">
                    <div style="flex: 1; text-align: center; border-right: 1px solid rgba(255,255,255,0.3); padding-right: 10px;">
                        <small style="opacity: 0.8;">📚 OKUL</small><br>
                        <b style="font-size: 1.3em;">{f"%{okul.get('ortalama', 0):.1f}" if okul.get('ortalama') else '-'}</b><br>
                        <small>Sıra: {f"{okul.get('siralama'):.0f}." if okul.get('siralama') else '-'}</small>
                    </div>
                    <div style="flex: 1; text-align: center; padding-left: 10px;">
                        <small style="opacity: 0.8;">📝 DENEME</small><br>
                        <b style="font-size: 1.3em;">{f"{deneme.get('ortalama', 0):.1f} net" if deneme.get('ortalama') else '-'}</b>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

    # Genel kurum sıralaması
    if genel_kurum_sira:
        st.info(f"📊 **Deneme Sınavları Genel Kurum Sıralaması:** Ortalama **{genel_kurum_sira:.0f}.** sırada")
else:
    st.info("Karşılaştırmalı analiz için okul sınavları veya deneme sonuçları yükleyin.")

st.markdown("---")

# ============================================
# OKUL SINAVLARI ANALIZI
# ============================================
if st.session_state.okul_sinavlari is not None:
    st.header("📚 Okul Izleme Sinavlari Analizi")

    df = st.session_state.okul_sinavlari.copy()

    # Sutun isimlerini normalize et
    df.columns = [str(c).strip().upper() for c in df.columns]

    # Sutunlari bul
    tarih_col = None
    puan_col = None
    ort_puan_col = None
    sinav_col = None
    siralama_col = None

    for col in df.columns:
        col_lower = col.lower()
        if 'tarih' in col_lower or 'tarİh' in col_lower:
            tarih_col = col
        elif 'ortalama' in col_lower and 'puan' in col_lower:
            ort_puan_col = col
        elif 'puan' in col_lower and 'ortalama' not in col_lower:
            puan_col = col
        elif 'sinav' in col_lower or 'sınav' in col_lower or 'adi' in col_lower:
            sinav_col = col
        elif 'siralama' in col_lower or 'sıralama' in col_lower or 'sira' in col_lower:
            siralama_col = col

    if tarih_col:
        df[tarih_col] = pd.to_datetime(df[tarih_col], errors='coerce')
        df = df.sort_values(tarih_col, ascending=False)

    # Siralama parsing: "150 / 197" -> siralama=150, toplam=197
    if siralama_col:
        def parse_siralama(val):
            try:
                val = str(val)
                if '/' in val:
                    parts = val.split('/')
                    siralama = int(parts[0].strip())
                    toplam = int(parts[1].strip())
                    return siralama, toplam
            except:
                pass
            return None, None

        df['_siralama'] = df[siralama_col].apply(lambda x: parse_siralama(x)[0])
        df['_toplam_ogrenci'] = df[siralama_col].apply(lambda x: parse_siralama(x)[1])
        df['_yuzdelik'] = df.apply(
            lambda row: round((1 - row['_siralama'] / row['_toplam_ogrenci']) * 100, 1)
            if row['_siralama'] and row['_toplam_ogrenci'] else None,
            axis=1
        )

    # ============================================
    # MEVCUT DURUM - TUM DERSLER RENKLI
    # ============================================
    st.subheader("📊 Mevcut Durum")

    # Ders kategorileri
    ders_kategorileri = {
        'TURKCE': ['TÜRKÇE', 'TURKCE'],
        'MATEMATIK': ['MATEMATİK', 'MATEMATIK', 'MAT'],
        'FEN': ['FEN', 'FEN BİLİMLERİ'],
        'INKILAP': ['İNKİLAP', 'INKILAP', 'İNKILAP', 'T.C.'],
        'DIN_ING': ['DİN', 'DIN', 'İNG', 'ING', 'DİN-İNG']
    }

    ders_sonuclari = {}

    if sinav_col and puan_col:
        for ders, keywords in ders_kategorileri.items():
            mask = df[sinav_col].astype(str).str.upper().apply(
                lambda x: any(kw in x for kw in keywords)
            )
            ders_df = df[mask]

            if len(ders_df) > 0:
                puanlar = pd.to_numeric(ders_df[puan_col], errors='coerce').dropna()
                if len(puanlar) > 0:
                    # Siralama ortalamasi hesapla
                    ort_siralama = None
                    if '_siralama' in ders_df.columns:
                        siralamalar = ders_df['_siralama'].dropna()
                        if len(siralamalar) > 0:
                            ort_siralama = siralamalar.mean()

                    ders_sonuclari[ders] = {
                        'ortalama': puanlar.mean(),
                        'en_yuksek': puanlar.max(),
                        'en_dusuk': puanlar.min(),
                        'sinav_sayisi': len(ders_df),
                        'son_sinav': puanlar.iloc[0] if len(puanlar) > 0 else None,
                        'ort_siralama': ort_siralama
                    }

    # Tum dersleri renkli goster
    if ders_sonuclari:
        cols = st.columns(len(ders_sonuclari))

        for i, (ders, stats) in enumerate(ders_sonuclari.items()):
            ort = stats['ortalama']

            if ort >= 90:
                renk = "🟢"
                bg_color = "#D1FAE5"
            elif ort >= 80:
                renk = "🟡"
                bg_color = "#FEF3C7"
            else:
                renk = "🔴"
                bg_color = "#FEE2E2"

            with cols[i]:
                siralama_text = ""
                if stats.get('ort_siralama'):
                    siralama_text = f"<div style='margin-top:5px;'><b>📍 Ort. Sira: {stats['ort_siralama']:.0f}.</b></div>"

                st.markdown(f"""
                <div style="background-color: {bg_color}; padding: 15px; border-radius: 10px; text-align: center;">
                    <h4>{renk} {ders}</h4>
                    <h2>%{ort:.1f}</h2>
                    {siralama_text}
                    <small>{stats['sinav_sayisi']} sinav</small>
                </div>
                """, unsafe_allow_html=True)

    st.markdown("---")

    # ============================================
    # OGRENCI VS OKUL ORTALAMASI GRAFIGI
    # ============================================
    if puan_col and tarih_col:
        st.subheader("📈 Ogrenci Puani vs Okul Ortalamasi")

        # Okul denemelerini filtrele (ortalama puan doluysa okul denemesi)
        if ort_puan_col:
            okul_denemeleri = df[df[ort_puan_col].notna()].copy()

            if len(okul_denemeleri) > 1:
                okul_denemeleri[puan_col] = pd.to_numeric(okul_denemeleri[puan_col], errors='coerce')
                okul_denemeleri[ort_puan_col] = pd.to_numeric(okul_denemeleri[ort_puan_col], errors='coerce')
                okul_denemeleri = okul_denemeleri.sort_values(tarih_col)

                fig = go.Figure()

                # Ogrenci puani
                fig.add_trace(go.Scatter(
                    x=okul_denemeleri[tarih_col],
                    y=okul_denemeleri[puan_col],
                    mode='lines+markers',
                    name='Ogrenci Puani',
                    line=dict(color='#3B82F6', width=3),
                    marker=dict(size=10)
                ))

                # Okul ortalamasi
                fig.add_trace(go.Scatter(
                    x=okul_denemeleri[tarih_col],
                    y=okul_denemeleri[ort_puan_col],
                    mode='lines+markers',
                    name='Okul Ortalamasi',
                    line=dict(color='#9CA3AF', width=2, dash='dash'),
                    marker=dict(size=8)
                ))

                fig.update_layout(
                    title="Ogrenci vs Okul Ortalamasi Trendi",
                    xaxis_title="Tarih",
                    yaxis_title="Puan",
                    legend=dict(orientation="h", yanchor="bottom", y=1.02),
                    hovermode="x unified"
                )

                st.plotly_chart(fig, use_container_width=True)

                # Fark analizi
                okul_denemeleri['_fark'] = okul_denemeleri[puan_col] - okul_denemeleri[ort_puan_col]
                ort_fark = okul_denemeleri['_fark'].mean()

                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Ogrenci Ort.", f"{okul_denemeleri[puan_col].mean():.1f}")
                with col2:
                    st.metric("Okul Ort.", f"{okul_denemeleri[ort_puan_col].mean():.1f}")
                with col3:
                    delta_color = "normal" if ort_fark >= 0 else "inverse"
                    st.metric("Fark", f"{ort_fark:+.1f}", delta_color=delta_color)

                st.info(f"📊 **{len(okul_denemeleri)} okul denemesi** analiz edildi. Ogrenci okul ortalamasinin **{abs(ort_fark):.1f} puan** {'ustunde' if ort_fark >= 0 else 'altinda'}.")
            else:
                st.info("Okul denemesi verisi yetersiz (en az 2 sinav gerekli)")
        else:
            st.info("'Ortalama Puan' sutunu bulunamadi")

    st.markdown("---")

    # ============================================
    # SIRALAMA ANALIZI
    # ============================================
    if siralama_col and '_siralama' in df.columns:
        st.subheader("🏆 Siralama Analizi")

        siralama_df = df[df['_siralama'].notna()].copy()

        if len(siralama_df) > 0:
            col1, col2, col3, col4 = st.columns(4)

            with col1:
                en_iyi = siralama_df['_siralama'].min()
                st.metric("En Iyi Siralama", f"{int(en_iyi)}.")

            with col2:
                ort_sira = siralama_df['_siralama'].mean()
                st.metric("Ortalama Siralama", f"{ort_sira:.0f}.")

            with col3:
                ort_toplam = siralama_df['_toplam_ogrenci'].mean()
                st.metric("Ort. Sinav Katilimi", f"{ort_toplam:.0f} kisi")

            with col4:
                ort_yuzdelik = siralama_df['_yuzdelik'].mean()
                st.metric("Ort. Yuzdelik Dilim", f"Ust %{100-ort_yuzdelik:.0f}")

            # 1. siralama sayisi
            birinci_sayisi = len(siralama_df[siralama_df['_siralama'] == 1])
            if birinci_sayisi > 0:
                st.success(f"🥇 **{birinci_sayisi} sinavda 1. siralama!**")

            # Ust %10 sayisi
            ust_10 = len(siralama_df[siralama_df['_yuzdelik'] >= 90])
            if ust_10 > 0:
                st.success(f"🌟 **{ust_10} sinavda ust %10'luk dilimde!**")

    st.markdown("---")

    # ============================================
    # DERS BAZLI DETAY
    # ============================================
    if ders_sonuclari:
        st.subheader("📋 Ders Bazli Detay")

        perf_data = []
        for ders, stats in ders_sonuclari.items():
            if stats['ortalama'] is not None and not np.isnan(stats['ortalama']):
                durum = "🟢 GUCLU" if stats['ortalama'] >= 90 else "🟡 ORTA" if stats['ortalama'] >= 80 else "🔴 ZAYIF"
                perf_data.append({
                    'Ders': ders,
                    'Ortalama': f"%{stats['ortalama']:.1f}",
                    'En Yuksek': f"%{stats['en_yuksek']:.1f}",
                    'En Dusuk': f"%{stats['en_dusuk']:.1f}",
                    'Sinav Sayisi': stats['sinav_sayisi'],
                    'Durum': durum
                })

        if perf_data:
            perf_df = pd.DataFrame(perf_data)
            st.dataframe(perf_df, use_container_width=True, hide_index=True)

st.markdown("---")

# ============================================
# DENEME SONUCLARI ANALIZI
# ============================================
if st.session_state.deneme_sonuclari is not None:
    st.header("📝 Deneme Sinavlari Analizi")

    df_deneme = st.session_state.deneme_sonuclari.copy()

    st.dataframe(df_deneme, use_container_width=True)

    # Sayisal sutunlari bul
    numeric_cols = df_deneme.select_dtypes(include=[np.number]).columns.tolist()

    if numeric_cols:
        st.subheader("📊 Istatistikler")
        stats_df = df_deneme[numeric_cols].describe()
        st.dataframe(stats_df, use_container_width=True)

st.markdown("---")

# ============================================
# KARNE KONU ANALIZI
# ============================================
if st.session_state.get('tum_konu_analizi'):
    st.header("📋 Karne Konu Analizi")

    konu_df = pd.DataFrame(st.session_state.tum_konu_analizi)

    def get_ders(kod):
        if kod.startswith('T.') and not kod.startswith('TA.'):
            return 'Turkce'
        elif kod.startswith('M.'):
            return 'Matematik'
        elif kod.startswith('F.'):
            return 'Fen'
        elif kod.startswith('D.'):
            return 'Din'
        elif kod.startswith('İTA') or kod.startswith('ITA') or kod.startswith('TA.') or kod.startswith('SB.'):
            return 'Inkilap'
        elif kod.startswith('E') or kod.startswith('Y.'):
            return 'Ingilizce'
        return 'Diger'

    konu_df['ders'] = konu_df['kod'].apply(get_ders)

    # Ders bazli ozet
    st.subheader("📊 Ders Bazli Konu Basarisi")

    ders_ozet = konu_df.groupby('ders').agg({
        'basari': 'mean',
        'konu': 'count',
        'dogru': 'sum',
        'yanlis': 'sum'
    }).round(1)
    ders_ozet.columns = ['Ort. Basari %', 'Konu Sayisi', 'Toplam Dogru', 'Toplam Yanlis']
    ders_ozet = ders_ozet.sort_values('Ort. Basari %')

    st.dataframe(ders_ozet, use_container_width=True)

    # Zayif konular
    zayif_konular = st.session_state.get('tum_zayif_konular', [])
    if zayif_konular:
        st.subheader("⚠️ Zayif Konular (%50 ve alti)")

        zayif_df = pd.DataFrame(zayif_konular)
        zayif_df['ders'] = zayif_df['kod'].apply(get_ders)

        for ders in zayif_df['ders'].unique():
            ders_zayif = zayif_df[zayif_df['ders'] == ders]
            with st.expander(f"🔴 {ders} - {len(ders_zayif)} zayif konu"):
                for _, row in ders_zayif.iterrows():
                    st.write(f"• {row['konu'][:70]}... - **%{row['basari']}**")

st.markdown("---")

# ============================================
# OZET VE ONERILER
# ============================================
st.header("💡 Ozet ve Oneriler")

if st.session_state.okul_sinavlari is not None or st.session_state.get('tum_zayif_konular'):
    st.markdown("### Analiz Sonuclari")
    st.markdown("Yuklenen veriler analiz edildi. Detayli yol haritasi icin **Yol Haritasi** sayfasina gecin.")

    if st.session_state.get('tum_zayif_konular'):
        zayif = st.session_state.tum_zayif_konular
        st.warning(f"⚠️ **{len(zayif)} konu** %50 alti basari gosteriyor. Bu konulara oncelik verin!")

    st.markdown("""
    **Onerilen Adimlar:**
    1. Zayif konulari listeleyin
    2. Her konu icin video ders izleyin
    3. Konu testleri cozun
    4. Yanlis defteri tutun
    """)
