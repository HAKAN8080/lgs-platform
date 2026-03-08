"""
Yol Haritasi Sayfasi
Kisisellestirilmis calisma plani ve PDF rapor
"""

import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime
from io import BytesIO

st.set_page_config(page_title="Yol Haritasi", page_icon="🗺️", layout="wide")

st.title("🗺️ Kisisellestirilmis Yol Haritasi")

# Session state kontrol
if 'okul_sinavlari' not in st.session_state:
    st.session_state.okul_sinavlari = None

if st.session_state.okul_sinavlari is None:
    st.warning("⚠️ Henuz veri yuklenmedi. Lutfen Veri Yukleme sayfasindan veri yukleyin.")
    st.stop()

ogrenci_adi = st.session_state.get('ogrenci_adi', 'Ogrenci')
st.subheader(f"👤 {ogrenci_adi}")

st.markdown("---")

# Veri analizi
df = st.session_state.okul_sinavlari.copy()
df.columns = [str(c).strip().upper() for c in df.columns]

# Sutunlari bul
puan_col = None
sinav_col = None
for col in df.columns:
    if 'PUAN' in col and 'ORT' not in col:
        puan_col = col
    if 'SINAV' in col or 'ADI' in col:
        sinav_col = col

# Ders kategorileri
ders_kategorileri = {
    'TURKCE': ['TÜRKÇE', 'TURKCE'],
    'MATEMATIK': ['MATEMATİK', 'MATEMATIK', 'MAT'],
    'FEN': ['FEN', 'FEN BİLİMLERİ'],
    'INKILAP': ['İNKİLAP', 'INKILAP', 'T.C.'],
    'DIN_ING': ['DİN', 'DIN', 'İNG', 'ING']
}

# Kaynak onerileri - Seviyeye gore
kaynak_onerileri = {
    'TURKCE': {
        'youtube': ['Tonguc Akademi Turkce', 'Hocalara Geldik', 'Kampus', 'Ogretmenler Odasi'],
        'kitap_zor': ['Sinan Kuzucu', 'Fenomen B', 'Kafa Dengi', 'Paraf'],
        'kitap_orta': ['Hiz', 'Ankara', 'Fenomen A', 'KVA', 'Gunay'],
        'site': ['tongucedu.com', 'okulistik.com', 'morpa.com.tr']
    },
    'MATEMATIK': {
        'youtube': ['Tonguc Akademi Matematik', 'Kagan Hoca', 'Mert Hoca', 'Suat Aslan'],
        'kitap_zor': ['Sinan Kuzucu', 'Fenomen B', 'Kafa Dengi', 'Paraf'],
        'kitap_orta': ['Hiz', 'Ankara', 'Fenomen A', 'KVA', 'Gunay'],
        'site': ['tongucedu.com', 'kaganakademi.com.tr', 'matopya.com']
    },
    'FEN': {
        'youtube': ['Tonguc Akademi Fen', 'Kagan Hoca Fen', 'Hocalara Geldik Fen', 'Fen Bilimleri Net'],
        'kitap_zor': ['Sinan Kuzucu', 'Fenomen B', 'Kafa Dengi', 'Paraf'],
        'kitap_orta': ['Hiz', 'Ankara', 'Fenomen A', 'KVA', 'Gunay'],
        'site': ['tongucedu.com', 'kaganakademi.com.tr', 'fenbil.com']
    },
    'INKILAP': {
        'youtube': ['Tonguc Akademi Inkilap', 'Kagan Hoca Sosyal', 'Bilen Hocam'],
        'kitap_zor': ['Sinan Kuzucu', 'Fenomen B', 'Kafa Dengi', 'Paraf'],
        'kitap_orta': ['Hiz', 'Ankara', 'Fenomen A', 'KVA', 'Gunay'],
        'site': ['tongucedu.com', 'tarihportali.net']
    },
    'DIN_ING': {
        'youtube': ['Tonguc Akademi Din', 'Ingilizce Konusan Adam', 'Study With Dila'],
        'kitap_zor': ['Sinan Kuzucu', 'Fenomen B', 'Kafa Dengi', 'Paraf'],
        'kitap_orta': ['Hiz', 'Ankara', 'Fenomen A', 'KVA', 'Gunay'],
        'site': ['tongucedu.com', 'engoo.com', 'bbc.co.uk/learningenglish']
    }
}

# Ders bazli analiz
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
                ders_sonuclari[ders] = {
                    'ortalama': puanlar.mean(),
                    'en_dusuk': puanlar.min(),
                    'en_yuksek': puanlar.max(),
                    'son': puanlar.iloc[0]
                }

# ============================================
# DURUM OZETI
# ============================================
st.header("📊 Mevcut Durum")

col1, col2 = st.columns(2)

with col1:
    st.subheader("🟢 Guclu Alanlar")
    guclu = [(d, s) for d, s in ders_sonuclari.items() if s['ortalama'] >= 90]
    if guclu:
        for ders, stats in guclu:
            st.success(f"**{ders}**: %{stats['ortalama']:.1f}")
    else:
        st.info("Henuz guclu alan tespit edilmedi")

with col2:
    st.subheader("🔴 Gelistirilecek Alanlar")
    zayif = [(d, s) for d, s in ders_sonuclari.items() if s['ortalama'] < 80]
    if zayif:
        for ders, stats in zayif:
            st.error(f"**{ders}**: %{stats['ortalama']:.1f}")
    else:
        orta = [(d, s) for d, s in ders_sonuclari.items() if 80 <= s['ortalama'] < 90]
        for ders, stats in orta:
            st.warning(f"**{ders}**: %{stats['ortalama']:.1f}")

st.markdown("---")

# ============================================
# ONCELIK SIRASI
# ============================================
st.header("🎯 Oncelik Sirasi")

# Dersleri sirala (dusukten yuksege)
sirali_dersler = sorted(ders_sonuclari.items(), key=lambda x: x[1]['ortalama'])

# Karne'den zayif konulari al
zayif_konular = st.session_state.get('tum_zayif_konular', [])
tum_konular = st.session_state.get('tum_konu_analizi', [])

# Ders bazli zayif konu sayisi
def get_ders_from_kod(kod):
    if kod.startswith('T.') and not kod.startswith('TA.'):
        return 'TURKCE'
    elif kod.startswith('M.'):
        return 'MATEMATIK'
    elif kod.startswith('F.'):
        return 'FEN'
    elif kod.startswith('D.'):
        return 'DIN_ING'
    elif kod.startswith('İTA') or kod.startswith('ITA') or kod.startswith('TA.') or kod.startswith('SB.'):
        return 'INKILAP'
    elif kod.startswith('E') or kod.startswith('Y.'):
        return 'DIN_ING'
    return None

ders_zayif_konu = {}
for konu in zayif_konular:
    ders = get_ders_from_kod(konu.get('kod', ''))
    if ders:
        if ders not in ders_zayif_konu:
            ders_zayif_konu[ders] = []
        ders_zayif_konu[ders].append(konu)

for i, (ders, stats) in enumerate(sirali_dersler, 1):
    ort = stats['ortalama']

    if ort < 75:
        renk = "🔴"
        oncelik = "ACIL"
        sure = "1.5-2 saat/gun"
    elif ort < 85:
        renk = "🟡"
        oncelik = "ORTA"
        sure = "1-1.5 saat/gun"
    else:
        renk = "🟢"
        oncelik = "KORUMA"
        sure = "30-45 dk/gun"

    # Bu dersteki zayif konu sayisi
    ders_zayif = ders_zayif_konu.get(ders, [])
    zayif_badge = f" - ⚠️ {len(ders_zayif)} zayif konu" if ders_zayif else ""

    with st.expander(f"{renk} {i}. {ders} - {oncelik} (Ort: %{ort:.1f}){zayif_badge}", expanded=(ort < 85 or len(ders_zayif) > 0)):
        st.write(f"**Onerilen Gunluk Sure:** {sure}")
        st.write(f"**Mevcut Ortalama:** %{ort:.1f}")
        st.write(f"**En Yuksek:** %{stats['en_yuksek']:.1f} | **En Dusuk:** %{stats['en_dusuk']:.1f}")

        # Zayif konulari goster (gruplanmis)
        if ders_zayif:
            st.markdown("---")
            st.markdown("**📚 Calisilmasi Gereken Konular:**")
            # Ayni konulari grupla
            konu_grubu = {}
            for konu in ders_zayif:
                konu_adi = konu['konu'][:50]
                if konu_adi not in konu_grubu:
                    konu_grubu[konu_adi] = {'sayi': 0, 'toplam_basari': 0}
                konu_grubu[konu_adi]['sayi'] += 1
                konu_grubu[konu_adi]['toplam_basari'] += konu.get('basari', 0)

            # Sirala (cok tekrar eden ve dusuk basarili olanlar once)
            sirali_konular = sorted(konu_grubu.items(), key=lambda x: (-x[1]['sayi'], x[1]['toplam_basari']/max(x[1]['sayi'],1)))

            for konu_adi, data in sirali_konular:
                ort_basari = data['toplam_basari'] / data['sayi'] if data['sayi'] > 0 else 0
                tekrar_badge = f" ({data['sayi']}x)" if data['sayi'] > 1 else ""
                st.write(f"• {konu_adi}{tekrar_badge} - **%{ort_basari:.0f}**")

        st.markdown("---")
        if ort < 75:
            st.markdown("""
            **Eylem Plani:**
            1. Yukaridaki zayif konulari oncelikle calis
            2. Her konu icin video ders izle
            3. Gunluk 30-40 soru coz
            4. Yanlis defteri tut
            """)
        elif ort < 85:
            st.markdown("""
            **Eylem Plani:**
            1. Zayif konulara odaklan
            2. Gunluk 15-20 soru coz
            3. Zor soru tiplerine odaklan
            """)
        else:
            st.markdown("""
            **Eylem Plani:**
            1. Mevcut seviyeyi koru
            2. Haftada 2-3 tekrar calismasi
            3. Deneme sinavlarinda takip et
            """)

        # Kaynak onerileri
        kaynaklar = kaynak_onerileri.get(ders, {})
        if kaynaklar:
            st.markdown("---")
            st.markdown("**📚 Onerilen Kaynaklar:**")

            kcol1, kcol2, kcol3, kcol4 = st.columns(4)

            with kcol1:
                st.markdown("**🎬 YouTube:**")
                for kanal in kaynaklar.get('youtube', [])[:3]:
                    st.write(f"• {kanal}")

            with kcol2:
                st.markdown("**📕 Zor Seviye:**")
                for kitap in kaynaklar.get('kitap_zor', [])[:4]:
                    st.write(f"• {kitap}")

            with kcol3:
                st.markdown("**📗 Orta Seviye:**")
                for kitap in kaynaklar.get('kitap_orta', [])[:4]:
                    st.write(f"• {kitap}")

            with kcol4:
                st.markdown("**🌐 Site:**")
                for site in kaynaklar.get('site', [])[:3]:
                    st.write(f"• {site}")

st.markdown("---")

# ============================================
# KONU BAZLI CALISMA PLANI
# ============================================
if zayif_konular:
    st.header("📚 Konu Bazli Calisma Plani")

    st.warning(f"⚠️ Toplam **{len(zayif_konular)} konu** %50 alti basari gosteriyor!")

    # Derse gore grupla
    ders_gruplari = {}
    for konu in zayif_konular:
        ders = get_ders_from_kod(konu.get('kod', ''))
        if ders:
            ders_adi = {
                'TURKCE': 'Turkce',
                'MATEMATIK': 'Matematik',
                'FEN': 'Fen Bilimleri',
                'DIN_ING': 'Din / Ingilizce',
                'INKILAP': 'Inkilap Tarihi'
            }.get(ders, ders)

            if ders_adi not in ders_gruplari:
                ders_gruplari[ders_adi] = []
            ders_gruplari[ders_adi].append(konu)

    # Her ders icin tablo (gruplanmis)
    for ders_adi, konular in ders_gruplari.items():
        # Ayni konulari grupla
        konu_grubu = {}
        for konu in konular:
            konu_adi = konu['konu'][:50]
            if konu_adi not in konu_grubu:
                konu_grubu[konu_adi] = {
                    'konu': konu_adi,
                    'soru_sayisi': 0,
                    'dogru': 0,
                    'yanlis': 0,
                    'tekrar': 0
                }
            konu_grubu[konu_adi]['soru_sayisi'] += konu.get('soru_sayisi', 1)
            konu_grubu[konu_adi]['dogru'] += konu.get('dogru', 0)
            konu_grubu[konu_adi]['yanlis'] += konu.get('yanlis', 0)
            konu_grubu[konu_adi]['tekrar'] += 1

        # Basari hesapla
        grouped_konular = []
        for konu_adi, data in konu_grubu.items():
            toplam = data['soru_sayisi']
            basari = (data['dogru'] / toplam * 100) if toplam > 0 else 0
            grouped_konular.append({
                'Konu': f"{konu_adi}" + (f" ({data['tekrar']}x)" if data['tekrar'] > 1 else ""),
                'Soru': data['soru_sayisi'],
                'Dogru': data['dogru'],
                'Yanlis': data['yanlis'],
                'Basari %': round(basari, 0)
            })

        # Sirala (dusuk basarili ve cok tekrar edenler once)
        grouped_konular.sort(key=lambda x: (x['Basari %'], -x['Soru']))

        st.subheader(f"📖 {ders_adi} ({len(grouped_konular)} farkli konu)")

        konu_df = pd.DataFrame(grouped_konular)
        st.dataframe(konu_df, use_container_width=True, hide_index=True)

st.markdown("---")

# ============================================
# HAFTALIK PROGRAM
# ============================================
st.header("📅 Haftalik Program Onerisi")

# Gunluk sureleri hesapla
gunluk_program = {
    'FEN': '1.5 sa' if ders_sonuclari.get('FEN', {}).get('ortalama', 100) < 80 else '45 dk',
    'MATEMATIK': '1.5 sa' if ders_sonuclari.get('MATEMATIK', {}).get('ortalama', 100) < 85 else '1 sa',
    'TURKCE': '45 dk' if ders_sonuclari.get('TURKCE', {}).get('ortalama', 100) >= 85 else '1 sa',
    'SOSYAL': '30 dk'
}

program_data = {
    'Gun': ['Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi', 'Pazar'],
    'Sabah': ['Fen', 'Matematik', 'Fen', 'Matematik', 'Fen', 'DENEME', 'Dinlenme'],
    'Ogleden Sonra': ['Matematik', 'Fen', 'Matematik', 'Fen', 'Matematik', 'SINAVI', 'Yanlis Tekrar'],
    'Aksam': ['Turkce', 'Inkilap', 'Turkce', 'Din-Ing', 'Genel Tekrar', 'Analiz', 'Hafif Calisma']
}

program_df = pd.DataFrame(program_data)
st.dataframe(program_df, use_container_width=True, hide_index=True)

st.info(f"""
**Tahmini Gunluk Calisma:** 3-4 saat

**Oncelikli Dersler:**
- Fen: {gunluk_program['FEN']}
- Matematik: {gunluk_program['MATEMATIK']}
- Turkce: {gunluk_program['TURKCE']}
- Sosyal: {gunluk_program['SOSYAL']}
""")

st.markdown("---")

# ============================================
# HEDEFLER
# ============================================
st.header("🎯 Hedef Puanlar")

col1, col2, col3 = st.columns(3)

with col1:
    st.subheader("1 Ay Sonra")
    for ders, stats in ders_sonuclari.items():
        mevcut = stats['ortalama']
        hedef = min(mevcut + 10, 95) if mevcut < 85 else mevcut
        st.write(f"**{ders}:** %{mevcut:.0f} → %{hedef:.0f}")

with col2:
    st.subheader("2 Ay Sonra")
    for ders, stats in ders_sonuclari.items():
        mevcut = stats['ortalama']
        hedef = min(mevcut + 15, 95) if mevcut < 85 else min(mevcut + 5, 98)
        st.write(f"**{ders}:** %{hedef:.0f}")

with col3:
    st.subheader("LGS Hedefi")
    for ders, stats in ders_sonuclari.items():
        if ders in ['INKILAP', 'DIN_ING']:
            st.write(f"**{ders}:** %100 🎯")
        else:
            st.write(f"**{ders}:** %95+")

st.markdown("---")

# ============================================
# PDF RAPOR OLUSTUR
# ============================================
st.header("📄 PDF Rapor")

if st.button("📥 PDF Rapor Olustur ve Indir", type="primary"):
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import cm
        from reportlab.lib.colors import HexColor
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
        from reportlab.lib.styles import ParagraphStyle
        from reportlab.lib.enums import TA_CENTER, TA_LEFT
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        import os

        # Font ayari
        font_paths = ['/System/Library/Fonts/Supplemental/Arial Unicode.ttf']
        font_name = 'Helvetica'
        for path in font_paths:
            if os.path.exists(path):
                try:
                    pdfmetrics.registerFont(TTFont('TurkishFont', path))
                    font_name = 'TurkishFont'
                    break
                except:
                    pass

        # PDF olustur
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=1.5*cm, rightMargin=1.5*cm,
                               topMargin=1.5*cm, bottomMargin=1.5*cm)

        PRIMARY = HexColor('#1E3A8A')
        SECONDARY = HexColor('#3B82F6')
        WHITE = HexColor('#FFFFFF')
        DARK = HexColor('#1F2937')
        LIGHT_BG = HexColor('#EFF6FF')
        RED = HexColor('#EF4444')
        GREEN = HexColor('#10B981')
        ORANGE = HexColor('#F59E0B')

        story = []
        body_style = ParagraphStyle('Body', fontName=font_name, fontSize=9, textColor=DARK, leading=12)
        small_style = ParagraphStyle('Small', fontName=font_name, fontSize=8, textColor=DARK, leading=10)

        # ============================================
        # SAYFA 1: GENEL ANALIZ + YOL HARITASI
        # ============================================

        # Baslik
        header = Table([[f'LGS YOL HARITASI - {ogrenci_adi.upper()}']], colWidths=[18*cm])
        header.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
            ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 18),
            ('TOPPADDING', (0,0), (-1,-1), 12),
            ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ]))
        story.append(header)
        story.append(Spacer(1, 0.5*cm))

        # Tarih
        story.append(Paragraph(f"Rapor Tarihi: {datetime.now().strftime('%d.%m.%Y')}",
                              ParagraphStyle('Date', fontSize=9, textColor=DARK)))
        story.append(Spacer(1, 0.3*cm))

        # GENEL ANALIZ BASLIGI
        genel_title = Table([['GENEL PERFORMANS ANALIZI']], colWidths=[18*cm])
        genel_title.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), DARK),
            ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 11),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(genel_title)

        # Ders bazli performans tablosu
        ders_data = [['DERS', 'ORT.', 'MAX', 'MIN', 'DURUM', 'ONCELIK']]
        for ders, stats in ders_sonuclari.items():
            ort = stats['ortalama']
            durum = 'GUCLU' if ort >= 90 else 'ORTA' if ort >= 80 else 'ZAYIF'
            oncelik = 'Koruma' if ort >= 90 else 'Gelistir' if ort >= 80 else 'ACIL'
            ders_data.append([ders, f'%{ort:.0f}', f'%{stats["en_yuksek"]:.0f}',
                             f'%{stats["en_dusuk"]:.0f}', durum, oncelik])

        ders_table = Table(ders_data, colWidths=[3.5*cm, 2*cm, 2*cm, 2*cm, 3*cm, 5.5*cm])
        ders_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), PRIMARY),
            ('TEXTCOLOR', (0,0), (-1,0), WHITE),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('ALIGN', (1,0), (-1,-1), 'CENTER'),
            ('BOX', (0,0), (-1,-1), 1, PRIMARY),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, HexColor('#E5E7EB')),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        story.append(ders_table)
        story.append(Spacer(1, 0.5*cm))

        # GENEL YOL HARITASI
        yh_title = Table([['GENEL YOL HARITASI']], colWidths=[18*cm])
        yh_title.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), SECONDARY),
            ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 11),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(yh_title)

        for i, (ders, stats) in enumerate(sirali_dersler, 1):
            ort = stats['ortalama']
            if ort < 75:
                bg = HexColor('#FEE2E2')
                sure = '1.5-2 sa/gun'
            elif ort < 85:
                bg = HexColor('#FEF3C7')
                sure = '1-1.5 sa/gun'
            else:
                bg = HexColor('#D1FAE5')
                sure = '30-45 dk/gun'

            content = Paragraph(f"<b>{i}. {ders}</b> - %{ort:.0f} - Sure: {sure}", body_style)
            row = Table([[content]], colWidths=[18*cm])
            row.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), bg),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ]))
            story.append(row)

        story.append(PageBreak())

        # ============================================
        # SAYFA 2+: DERS DERS DETAYLI ANALIZ
        # ============================================

        ders_isimleri = {
            'TURKCE': 'TURKCE',
            'MATEMATIK': 'MATEMATIK',
            'FEN': 'FEN BILIMLERI',
            'INKILAP': 'INKILAP TARIHI',
            'DIN_ING': 'DIN KULTURU / INGILIZCE'
        }

        for ders, stats in sirali_dersler:
            ort = stats['ortalama']

            # Ders basligi
            ders_header = Table([[f'{ders_isimleri.get(ders, ders)} ANALIZI']], colWidths=[18*cm])
            ders_header.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
                ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
                ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
                ('FONTSIZE', (0,0), (-1,-1), 12),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('TOPPADDING', (0,0), (-1,-1), 8),
                ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ]))
            story.append(ders_header)
            story.append(Spacer(1, 0.3*cm))

            # Performans ozeti
            durum = 'GUCLU' if ort >= 90 else 'ORTA' if ort >= 80 else 'ZAYIF'
            perf_data = [
                ['Ortalama', 'En Yuksek', 'En Dusuk', 'Sinav Sayisi', 'Durum'],
                [f'%{ort:.1f}', f'%{stats["en_yuksek"]:.1f}', f'%{stats["en_dusuk"]:.1f}',
                 str(stats.get('sinav_sayisi', '-')), durum]
            ]
            perf_table = Table(perf_data, colWidths=[3.6*cm]*5)
            perf_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), HexColor('#6B7280')),
                ('TEXTCOLOR', (0,0), (-1,0), WHITE),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('FONTSIZE', (0,0), (-1,-1), 9),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('BOX', (0,0), (-1,-1), 1, HexColor('#6B7280')),
                ('TOPPADDING', (0,0), (-1,-1), 5),
                ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ]))
            story.append(perf_table)
            story.append(Spacer(1, 0.3*cm))

            # Yol haritasi
            if ort < 75:
                eylem = "1. Temel konulari video ile ogren\n2. Gunluk 30-40 soru coz\n3. Yanlis defteri tut\n4. Haftada 2 deneme coz"
                sure = "1.5-2 saat/gun"
            elif ort < 85:
                eylem = "1. Zayif konulara odaklan\n2. Gunluk 15-20 soru coz\n3. Zor soru tiplerine calis"
                sure = "1-1.5 saat/gun"
            else:
                eylem = "1. Mevcut seviyeyi koru\n2. Haftada 2-3 tekrar\n3. Deneme sinavlarini takip et"
                sure = "30-45 dk/gun"

            yh_box = Table([['YOL HARITASI']], colWidths=[18*cm])
            yh_box.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), SECONDARY),
                ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
                ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
                ('FONTSIZE', (0,0), (-1,-1), 10),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ]))
            story.append(yh_box)

            eylem_content = Paragraph(f"<b>Onerilen Sure:</b> {sure}<br/><br/><b>Eylem Plani:</b><br/>{eylem.replace(chr(10), '<br/>')}", body_style)
            eylem_row = Table([[eylem_content]], colWidths=[18*cm])
            eylem_row.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
                ('TOPPADDING', (0,0), (-1,-1), 8),
                ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ]))
            story.append(eylem_row)
            story.append(Spacer(1, 0.3*cm))

            # Kaynak onerileri
            kaynaklar = kaynak_onerileri.get(ders, {})
            if kaynaklar:
                kaynak_box = Table([['ONERILEN KAYNAKLAR']], colWidths=[18*cm])
                kaynak_box.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), HexColor('#059669')),
                    ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
                    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0,0), (-1,-1), 10),
                    ('LEFTPADDING', (0,0), (-1,-1), 10),
                    ('TOPPADDING', (0,0), (-1,-1), 4),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ]))
                story.append(kaynak_box)

                zor_kitaplar = ', '.join(kaynaklar.get('kitap_zor', [])[:4])
                orta_kitaplar = ', '.join(kaynaklar.get('kitap_orta', [])[:4])
                youtube_kanallari = ', '.join(kaynaklar.get('youtube', [])[:3])

                kaynak_text = f"<b>Zor Seviye:</b> {zor_kitaplar}<br/><b>Orta Seviye:</b> {orta_kitaplar}<br/><b>YouTube:</b> {youtube_kanallari}"
                kaynak_content = Paragraph(kaynak_text, small_style)
                kaynak_row = Table([[kaynak_content]], colWidths=[18*cm])
                kaynak_row.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), HexColor('#D1FAE5')),
                    ('LEFTPADDING', (0,0), (-1,-1), 10),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                ]))
                story.append(kaynak_row)

            story.append(Spacer(1, 0.5*cm))

        # ============================================
        # HEDEF PUANLAR
        # ============================================
        hedef_header = Table([['HEDEF PUANLAR']], colWidths=[18*cm])
        hedef_header.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), HexColor('#7C3AED')),
            ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 11),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(hedef_header)

        hedef_data = [['DERS', 'MEVCUT', '1 AY SONRA', '2 AY SONRA', 'LGS HEDEFI']]
        for ders, stats in ders_sonuclari.items():
            mevcut = stats['ortalama']
            ay1 = min(mevcut + 10, 95) if mevcut < 85 else mevcut
            ay2 = min(mevcut + 15, 95) if mevcut < 85 else min(mevcut + 5, 98)
            lgs_hedef = '%100' if ders in ['INKILAP', 'DIN_ING'] else '%95+'
            hedef_data.append([ders, f'%{mevcut:.0f}', f'%{ay1:.0f}', f'%{ay2:.0f}', lgs_hedef])

        hedef_table = Table(hedef_data, colWidths=[3.6*cm]*5)
        hedef_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), HexColor('#7C3AED')),
            ('TEXTCOLOR', (0,0), (-1,0), WHITE),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('BOX', (0,0), (-1,-1), 1, HexColor('#7C3AED')),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, HexColor('#E5E7EB')),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        story.append(hedef_table)

        # ============================================
        # SON SAYFA: LGS SORU DAGILIMI
        # ============================================
        story.append(PageBreak())

        lgs_header = Table([['LGS SORU DAGILIMI (2024)']], colWidths=[18*cm])
        lgs_header.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
            ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 14),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(lgs_header)
        story.append(Spacer(1, 0.5*cm))

        # LGS Genel Bilgi
        lgs_info = [
            ['BOLUM', 'DERS', 'SORU', 'SURE'],
            ['SOZEL', 'Turkce', '20', ''],
            ['', 'Inkilap Tarihi', '10', ''],
            ['', 'Din Kulturu', '10', '75 dk'],
            ['', 'Ingilizce', '10', ''],
            ['SAYISAL', 'Matematik', '20', ''],
            ['', 'Fen Bilimleri', '20', '80 dk'],
            ['TOPLAM', '', '90', '155 dk']
        ]
        lgs_table = Table(lgs_info, colWidths=[4*cm, 5*cm, 4*cm, 5*cm])
        lgs_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), PRIMARY),
            ('TEXTCOLOR', (0,0), (-1,0), WHITE),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BACKGROUND', (0,-1), (-1,-1), HexColor('#E5E7EB')),
            ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('BOX', (0,0), (-1,-1), 1, PRIMARY),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, HexColor('#E5E7EB')),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(lgs_table)
        story.append(Spacer(1, 0.5*cm))

        # Konu dagilimi ozet
        konu_baslik = Table([['EN COK SORU CIKAN KONULAR (2024)']], colWidths=[18*cm])
        konu_baslik.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), SECONDARY),
            ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 11),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(konu_baslik)

        konu_data = [
            ['DERS', 'ONEMLI KONULAR (2024 Verileri)'],
            ['Turkce', 'Parcada Anlam (6), Sozel Mantik (3), Cumlede Anlam (3)'],
            ['Matematik', 'Ucgenler (3), Koklu Sayilar (3), Dogrusal Denklemler (3)'],
            ['Fen', 'Madde-Endustri (5), DNA-Genetik (4), Enerji (4)'],
            ['Inkilap', 'Ataturkculuk (4), Milli Mucadele (2), Milli Uyanis (2)'],
            ['Din', 'Kader (2), Zekat (2), Din-Hayat (2), Hz. Muhammed (2)'],
            ['Ingilizce', 'Friendship (2), Natural Forces (2), Science (2)']
        ]
        konu_table = Table(konu_data, colWidths=[4*cm, 14*cm])
        konu_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), HexColor('#6B7280')),
            ('TEXTCOLOR', (0,0), (-1,0), WHITE),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('ALIGN', (0,0), (0,-1), 'LEFT'),
            ('BOX', (0,0), (-1,-1), 1, HexColor('#6B7280')),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, HexColor('#E5E7EB')),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        story.append(konu_table)
        story.append(Spacer(1, 0.5*cm))

        # Not
        story.append(Paragraph("<b>Not:</b> Her dogru 1 puan, yanlis dogru goturmez. Kaynak: kaganakademi.com.tr", small_style))

        # Olustur
        doc.build(story)

        # Download butonu
        buffer.seek(0)
        st.download_button(
            label="📥 PDF'i Indir",
            data=buffer,
            file_name=f"{ogrenci_adi.replace(' ', '_')}_LGS_Yol_Haritasi.pdf",
            mime="application/pdf"
        )
        st.success("✅ PDF olusturuldu!")

    except ImportError:
        st.error("PDF olusturmak icin 'reportlab' kutuphanesi gerekli: pip install reportlab")
    except Exception as e:
        st.error(f"PDF olusturma hatasi: {e}")

st.markdown("---")
st.caption("Thorius Egitim ve Danismanlik")
