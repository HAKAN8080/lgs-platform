"""
Veri Yukleme Sayfasi
1. Okul Sinavlari (Excel)
2. Deneme Sonuclari (PDF)
3. Detay Karneler (PDF)
"""

import streamlit as st
import pandas as pd
import pdfplumber
import re
from io import BytesIO

st.set_page_config(page_title="Veri Yukleme", page_icon="📤", layout="wide")

st.title("📤 Veri Yukleme")

# Session state kontrol
if 'okul_sinavlari' not in st.session_state:
    st.session_state.okul_sinavlari = None
if 'deneme_sonuclari' not in st.session_state:
    st.session_state.deneme_sonuclari = None
if 'karneler' not in st.session_state:
    st.session_state.karneler = []
if 'tum_zayif_konular' not in st.session_state:
    st.session_state.tum_zayif_konular = []
if 'tum_konu_analizi' not in st.session_state:
    st.session_state.tum_konu_analizi = []
if 'ogrenci_adi' not in st.session_state:
    st.session_state.ogrenci_adi = ""

# Ogrenci adi
st.text_input("👤 Ogrenci Adi", key="ogrenci_adi_input",
              value=st.session_state.ogrenci_adi,
              on_change=lambda: setattr(st.session_state, 'ogrenci_adi', st.session_state.ogrenci_adi_input))

st.markdown("---")

# ============================================
# 1. OKUL SINAVLARI (EXCEL)
# ============================================
st.header("1️⃣ Okul Izleme Sinavlari (Excel)")
st.caption("Okul sisteminden alinan izleme sinavi sonuclari")

okul_file = st.file_uploader(
    "Excel dosyasi yukleyin (.xlsx, .xls)",
    type=['xlsx', 'xls'],
    key="okul_upload"
)

if okul_file is not None:
    try:
        df_okul = pd.read_excel(okul_file)
        st.session_state.okul_sinavlari = df_okul

        st.success(f"✅ {len(df_okul)} satir yuklendi")

        with st.expander("📋 Yuklenen Veri Onizleme", expanded=True):
            st.dataframe(df_okul, use_container_width=True)

        # Otomatik sutun tespiti
        st.info(f"📊 Tespit edilen sutunlar: {', '.join(df_okul.columns.tolist())}")

    except Exception as e:
        st.error(f"Hata: {e}")

if st.session_state.okul_sinavlari is not None:
    st.success(f"✅ Okul sinavlari yuklu: {len(st.session_state.okul_sinavlari)} kayit")

st.markdown("---")

# ============================================
# 2. DENEME SONUCLARI (PDF veya Excel)
# ============================================
st.header("2️⃣ Deneme Sinavi Sonuclari")
st.caption("LGS deneme sinavlari sonuc listesi (Excel veya PDF)")

# Yukleme tipi sec
deneme_format = st.radio(
    "Veri formati seciniz:",
    ["Excel (.xlsx)", "PDF (metin tabanli)", "Manuel Giris"],
    horizontal=True,
    key="deneme_format"
)

if deneme_format == "Excel (.xlsx)":
    deneme_excel = st.file_uploader(
        "Deneme sonuclari Excel dosyasi",
        type=['xlsx', 'xls'],
        key="deneme_excel_upload"
    )

    if deneme_excel is not None:
        try:
            df_deneme = pd.read_excel(deneme_excel)
            st.session_state.deneme_sonuclari = df_deneme
            st.success(f"✅ {len(df_deneme)} sinav sonucu yuklendi")

            with st.expander("📋 Yuklenen Deneme Sonuclari", expanded=True):
                st.dataframe(df_deneme, use_container_width=True)
        except Exception as e:
            st.error(f"Excel okuma hatasi: {e}")

elif deneme_format == "PDF (metin tabanli)":
    st.warning("⚠️ Not: Goruntu tabanli PDF'ler (screenshot, taranmis) okunamaz. Sadece metin tabanli PDF desteklenir.")

    def parse_deneme_pdf(pdf_file):
        """PDF'den deneme sonuclarini cikart"""
        results = []
        header = None

        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                # Once text-based table extraction dene
                table_settings = {
                    "vertical_strategy": "text",
                    "horizontal_strategy": "text"
                }
                tables = page.extract_tables(table_settings)

                # Normal extraction da dene
                if not tables:
                    tables = page.extract_tables()

                for table in tables:
                    if table and len(table) > 1:
                        data_start = 0

                        for i, row in enumerate(table):
                            row_text = ' '.join([str(c) for c in row if c])
                            if 'Sınav' in row_text or 'SINAV' in row_text or 'Tarih' in row_text:
                                if header is None:
                                    header = row
                                data_start = i + 1
                                break

                        if header is None and len(table[0]) >= 5:
                            header = table[0]
                            data_start = 1

                        for row in table[data_start:]:
                            if row and len(row) >= 5:
                                if all(c is None or str(c).strip() == '' for c in row):
                                    continue
                                first_cell = str(row[0]) if row[0] else ''
                                if 'ORTALAMA' in first_cell.upper():
                                    continue
                                results.append(row)

        return results, header

    deneme_file = st.file_uploader(
        "PDF dosyasi yukleyin",
        type=['pdf'],
        key="deneme_upload"
    )

    if deneme_file is not None:
        try:
            with st.spinner("PDF analiz ediliyor..."):
                # Karakter kontrolu
                with pdfplumber.open(deneme_file) as pdf:
                    chars = pdf.pages[0].chars
                    if len(chars) == 0:
                        st.error("❌ Bu PDF goruntu tabanli (screenshot/taranmis). Metin cikarilemiyor.")
                        st.info("💡 Cozum: PDF'i Excel'e donusturun veya 'Manuel Giris' secenegini kullanin.")
                    else:
                        data, header = parse_deneme_pdf(deneme_file)
                        if data:
                            if header:
                                clean_header = [str(h).strip() if h else f'Col{i}' for i, h in enumerate(header)]
                                df_deneme = pd.DataFrame(data, columns=clean_header[:len(data[0])])
                            else:
                                df_deneme = pd.DataFrame(data)
                            df_deneme = df_deneme.dropna(axis=1, how='all')
                            st.session_state.deneme_sonuclari = df_deneme
                            st.success(f"✅ {len(df_deneme)} sinav sonucu yuklendi")
                            with st.expander("📋 Yuklenen Deneme Sonuclari", expanded=True):
                                st.dataframe(df_deneme, use_container_width=True)
                        else:
                            st.warning("PDF'de tablo bulunamadi.")
        except Exception as e:
            st.error(f"PDF okuma hatasi: {e}")

else:  # Manuel Giris
    st.info("📝 Deneme sonuclarini asagidaki formatta girin (her satir bir sinav)")

    # Ornek format
    with st.expander("📋 Ornek Format"):
        st.code("""Sinav Adi,Tarih,Turkce,Ink.Tar,Din,Ing,Mat,Fen,Toplam Net,Puan
OZDEBIR DENEME 3,2026-02-23,14.67,8.67,8.67,10,15.33,17.33,74.67,441.212
NAR TEST DENEME 4,2026-01-24,20,10,10,10,20,20,90,500""")

    manuel_data = st.text_area(
        "Veri girin (CSV formatinda):",
        height=200,
        key="manuel_deneme"
    )

    if manuel_data.strip():
        try:
            from io import StringIO
            df_deneme = pd.read_csv(StringIO(manuel_data))
            st.session_state.deneme_sonuclari = df_deneme
            st.success(f"✅ {len(df_deneme)} sinav sonucu yuklendi")
            st.dataframe(df_deneme, use_container_width=True)
        except Exception as e:
            st.error(f"Veri okuma hatasi: {e}")

if st.session_state.deneme_sonuclari is not None:
    st.success(f"✅ Deneme sonuclari yuklu: {len(st.session_state.deneme_sonuclari)} kayit")

st.markdown("---")

# ============================================
# 3. DETAY KARNELER (PDF)
# ============================================
st.header("3️⃣ Detay Karneler (PDF)")
st.caption("Konu analizli karneler - zayif konulari tespit eder")

def parse_karne(text):
    """Karne PDF'inden bilgileri cikart - Coklu format destegi"""
    result = {
        'sinav': '',
        'tarih': '',
        'puan': 0,
        'dersler': {},
        'konu_analizi': [],
        'zayif_konular': []
    }

    # ============================================
    # FORMAT TESPITI
    # ============================================

    # Format 1: FORM AKADEMİ / ÖZDEBİR (TÜRKİYE GENELİ + PUANI)
    # Format 2: HIZ / FENOMEN (SınavAdı + LGS PUAN) - KONU ANALİZİ bölümü var
    # Format 3: 345 / ÜÇDÖRTBEŞ (ÜÇDÖRTBEŞ + LGS puan)

    is_345_format = 'ÜÇDÖRTBEŞ' in text
    is_hiz_format = 'SınavAdı' in text and 'DERS ANALİZİ' in text
    is_fenomen_format = 'KONU ANALİZİ' in text and ('FENOMEN' in text or 'DC ÖC SN' in text or 'DC  ÖC  SN' in text)
    is_form_akademi = 'FORM AKADEMİ' in text or 'TÜRKİYE GENELİ DENEME' in text

    # ============================================
    # SINAV ADI
    # ============================================
    # HIZ format once kontrol et (SınavAdı ile baslar)
    if is_hiz_format:
        match = re.search(r'SınavAdı\s+([A-ZÇĞİÖŞÜa-z0-9\-\.]+)', text)
        if match:
            result['sinav'] = match.group(1).strip()[:50]
    elif is_345_format:
        match = re.search(r'SONUÇ BELGESİ\s+(ÜÇDÖRTBEŞ[^\n]*)', text)
        if match:
            result['sinav'] = match.group(1).strip()[:50]
    else:
        # TÜRKİYE GENELİ DENEME pattern
        match = re.search(r'(TÜRKİYE GENELİ DENEME[^\n\(]*(?:\([^\)]+\))?)', text)
        if match:
            result['sinav'] = match.group(1).strip()[:50]

    # ============================================
    # TARIH
    # ============================================
    tarih_match = re.search(r'(\d{2}\.\d{2}\.\d{4})', text)
    if tarih_match:
        result['tarih'] = tarih_match.group(1)

    # ============================================
    # PUAN - Tum formatlari dene
    # ============================================
    # Once PUANI pattern dene (Form Akademi, Ozdebir)
    puan_match = re.search(r'PUANI?\s*(\d+[,\.]\d+)', text)
    if puan_match:
        result['puan'] = float(puan_match.group(1).replace(',', '.'))
    else:
        # LGS pattern dene (345, HIZ)
        puan_match = re.search(r'LGS\s+(\d+[,\.]?\d*)', text)
        if puan_match:
            result['puan'] = float(puan_match.group(1).replace(',', '.'))

    # ============================================
    # DERS NETLERI
    # ============================================
    if is_345_format:
        # 345 format: Turkce 20 20 0 20,00 100
        ders_patterns = [
            (r'Türkçe\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Turkce'),
            (r'Matematik\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Matematik'),
            (r'Fen\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Fen'),
            (r'Tarih\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Sosyal'),
            (r'Din\s+[^\d]*(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Din'),
            (r'İngilizce\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Ingilizce'),
        ]
        for pattern, ders in ders_patterns:
            match = re.search(pattern, text)
            if match:
                result['dersler'][ders] = float(match.group(4).replace(',', '.'))

    elif is_hiz_format:
        # HIZ format: TÜRKÇE8.SINIF 20 20 0 0 20,00
        ders_patterns = [
            (r'TÜRKÇE[^\d]*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Turkce'),
            (r'MATEMATİK[^\d]*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Matematik'),
            (r'FEN[^\d]*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Fen'),
            (r'İNK[^\d]*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Sosyal'),
            (r'DİN[^\d]*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Din'),
            (r'İNGİLİZCE[^\d]*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,\.]+)', 'Ingilizce'),
        ]
        for pattern, ders in ders_patterns:
            match = re.search(pattern, text)
            if match:
                result['dersler'][ders] = float(match.group(5).replace(',', '.'))

    else:
        # Ozdebir format
        net_match = re.search(r'NET SAYISI\s+([\d,\.]+)\s+([\d,\.]+)\s+([\d,\.]+)\s+([\d,\.]+)\s+([\d,\.]+)\s+([\d,\.]+)', text)
        if net_match:
            result['dersler'] = {
                'Turkce': float(net_match.group(1).replace(',', '.')),
                'Matematik': float(net_match.group(2).replace(',', '.')),
                'Din': float(net_match.group(3).replace(',', '.')),
                'Fen': float(net_match.group(4).replace(',', '.')),
                'Sosyal': float(net_match.group(5).replace(',', '.')),
                'Ingilizce': float(net_match.group(6).replace(',', '.'))
            }

    # ============================================
    # KONU ANALIZI - Tum formatlar
    # ============================================

    seen = set()

    # Ders kodu mapping
    # T = Turkce, M = Matematik, F = Fen, SB/İTA/TA = Sosyal/Inkilap, D = Din, E/Y = Ingilizce
    def get_ders_from_kod(kod):
        if kod.startswith('T.') and not kod.startswith('TA.'):
            return 'Turkce'
        elif kod.startswith('M.'):
            return 'Matematik'
        elif kod.startswith('F.'):
            return 'Fen'
        elif kod.startswith('SB.') or kod.startswith('İTA') or kod.startswith('ITA') or kod.startswith('TA.'):
            return 'Sosyal'
        elif kod.startswith('D.'):
            return 'Din'
        elif kod.startswith('E.') or kod.startswith('Y.'):
            return 'Ingilizce'
        return 'Diger'

    # Pattern 1: Kodlu format (T.8.1.2. veya F.8.4.3.1. seklinde)
    # Ornek: T.8.1.2. Dinlediklerinde/izlediklerinde ... 1 1 0 100
    konu_pattern1 = re.compile(
        r'([TFMDSEIYTA][A-Z]?[\.\d]+[\.\d]*)\.\s*([^0-9\n]{10,120}?)\s+(\d)\s+(\d)\s+(\d)\s+(\d{1,3})'
    )
    matches1 = konu_pattern1.findall(text)

    for match in matches1:
        kod = match[0].strip()
        aciklama = match[1].strip()
        ss = int(match[2])
        d = int(match[3])
        y = int(match[4])
        yuzde = int(match[5])

        if ss == 0 or ss > 5 or yuzde > 100:
            continue

        key = f"{kod}_{ss}_{d}_{y}"
        if key in seen:
            continue
        seen.add(key)

        ders = get_ders_from_kod(kod)

        konu_data = {
            'kod': kod,
            'ders': ders,
            'konu': aciklama[:80],
            'soru_sayisi': ss,
            'dogru': d,
            'yanlis': y,
            'basari': yuzde
        }
        result['konu_analizi'].append(konu_data)

        if yuzde <= 50:
            result['zayif_konular'].append(konu_data)

    # Pattern 2: 345 format - Kazanim bazli (kod yok)
    if is_345_format and len(result['konu_analizi']) == 0:
        konu_pattern2 = re.compile(r'([A-ZÇĞİÖŞÜa-zçğıöşü][^\d\n]{10,80}?)\s+(\d)\s+(\d)\s+(\d)\s+(\d{1,3})')
        matches2 = konu_pattern2.findall(text)

        ders_mapping = {
            'kelime': 'T', 'metin': 'T', 'paragraf': 'T', 'cümle': 'T', 'fiil': 'T', 'sözcük': 'T',
            'denklem': 'M', 'üçgen': 'M', 'oran': 'M', 'olasılık': 'M', 'geometri': 'M', 'cebir': 'M',
            'kuvvet': 'F', 'enerji': 'F', 'madde': 'F', 'elektrik': 'F', 'ısı': 'F', 'basınç': 'F',
            'Mustafa Kemal': 'ITA', 'Millî': 'ITA', 'Atatürk': 'ITA', 'inkılap': 'ITA', 'Savaş': 'ITA',
            'kader': 'D', 'zekât': 'D', 'namaz': 'D', 'oruç': 'D', 'Allah': 'D', 'Peygamber': 'D',
        }

        konu_sayac = {'T': 1, 'M': 1, 'F': 1, 'ITA': 1, 'D': 1, 'E': 1}

        for match in matches2:
            aciklama = match[0].strip()
            ss = int(match[1])
            d = int(match[2])
            y = int(match[3])
            yuzde = int(match[4])

            if ss == 0 or ss > 5 or yuzde > 100:
                continue

            kod = 'T'
            for keyword, ders_kod in ders_mapping.items():
                if keyword.lower() in aciklama.lower():
                    kod = ders_kod
                    break

            konu_kodu = f"{kod}.{konu_sayac[kod]}"
            konu_sayac[kod] += 1

            key = f"{aciklama[:30]}_{ss}_{d}_{y}"
            if key in seen:
                continue
            seen.add(key)

            konu_data = {
                'kod': konu_kodu,
                'konu': aciklama[:80],
                'soru_sayisi': ss,
                'dogru': d,
                'yanlis': y,
                'basari': yuzde
            }
            result['konu_analizi'].append(konu_data)

            if yuzde <= 50:
                result['zayif_konular'].append(konu_data)

    return result


def parse_karne_tables(pdf_file):
    """
    FENOMEN/HIZ format karneleri için tablo bazlı parsing.
    PDF'deki tabloları doğrudan okur - daha güvenilir.
    """
    result = {
        'sinav': '',
        'tarih': '',
        'puan': 0,
        'dersler': {},
        'konu_analizi': [],
        'zayif_konular': []
    }

    def get_ders_from_header(header_text):
        """Tablo başlığından ders adını çıkar"""
        if not header_text:
            return None
        h = header_text.upper().replace(' ', '').replace('.', '')

        # Önce en spesifik kontrolleri yap (sıra önemli!)
        # 1. İnk. Tarihi - ATATÜRK veya İNKILAP/İNKTARİH içeriyorsa
        if 'ATATÜRK' in h or 'ATATURK' in h or 'İNKTARİH' in h or 'INKTARIH' in h or 'İNKILAP' in h:
            return 'Sosyal'
        # 2. Din Kültürü - DİNKÜLTÜRÜ veya DİN8 içeriyorsa
        elif 'DİNKÜLTÜRÜ' in h or 'DINKULTURU' in h or 'DİN8' in h:
            return 'Din'
        # 3. Fen Bilimleri
        elif 'FEN' in h:
            return 'Fen'
        # 4. Matematik
        elif 'MAT' in h:
            return 'Matematik'
        # 5. Türkçe - TÜRKÇE içeriyorsa (ATATÜRK değil!)
        elif h.startswith('TÜRKÇE') or h.startswith('TURKCE'):
            return 'Turkce'
        # 6. İngilizce
        elif 'İNG' in h or 'ING' in h:
            return 'Ingilizce'
        return None

    seen = set()

    with pdfplumber.open(pdf_file) as pdf:
        # İlk sayfadan temel bilgileri al
        first_page_text = pdf.pages[0].extract_text() or ""

        # Sınav adı
        sinav_match = re.search(r'SınavAdı\s+([^\n]+)', first_page_text)
        if sinav_match:
            result['sinav'] = sinav_match.group(1).strip()[:50]

        # Tarih
        tarih_match = re.search(r'(\d{2}\.\d{2}\.\d{4})', first_page_text)
        if tarih_match:
            result['tarih'] = tarih_match.group(1)

        # Puan
        puan_match = re.search(r'LGS\s+([\d,\.]+)', first_page_text)
        if puan_match:
            result['puan'] = float(puan_match.group(1).replace(',', '.'))

        # Tüm sayfalardan tabloları çıkar
        for page in pdf.pages:
            tables = page.extract_tables()

            for table in tables:
                if not table or len(table) < 3:
                    continue

                # İlk satır ders başlığı mı?
                first_row = table[0]
                if not first_row or not first_row[0]:
                    continue

                ders = get_ders_from_header(first_row[0])
                if not ders:
                    continue

                # İkinci satır başlık satırı mı? (# KONULAR DC ÖC SN)
                if len(table) < 2:
                    continue
                header_row = table[1]
                if not header_row or len(header_row) < 4:
                    continue

                # Sütun indekslerini bul
                sn_idx = None
                oc_idx = None
                dc_idx = None
                konu_idx = None

                for idx, cell in enumerate(header_row):
                    if cell:
                        cell_upper = str(cell).upper().strip()
                        if cell_upper == 'SN':
                            sn_idx = idx
                        elif cell_upper == 'ÖC':
                            oc_idx = idx
                        elif cell_upper == 'DC':
                            dc_idx = idx
                        elif 'KONU' in cell_upper:
                            konu_idx = idx

                if sn_idx is None or konu_idx is None:
                    continue

                # Konu satırlarını işle
                for row in table[2:]:
                    if not row or len(row) <= sn_idx:
                        continue

                    # Sıra numarası
                    sira = str(row[0]).strip() if row[0] else ''
                    if not sira.isdigit():
                        continue

                    # Konu adı
                    konu_adi = str(row[konu_idx]).strip() if row[konu_idx] else ''
                    if not konu_adi or len(konu_adi) < 2:
                        continue

                    # SN (sonuç)
                    sonuc = str(row[sn_idx]).strip() if row[sn_idx] else ''

                    # Tekrar kontrolü
                    key = f"{ders}_{konu_adi}_{sira}"
                    if key in seen:
                        continue
                    seen.add(key)

                    konu_data = {
                        'kod': f"{ders[0]}.{sira}",
                        'ders': ders,
                        'konu': konu_adi[:80],
                        'soru_sayisi': 1,
                        'dogru': 1 if sonuc == '+' else 0,
                        'yanlis': 1 if sonuc == '-' else 0,
                        'basari': 100 if sonuc == '+' else 0
                    }
                    result['konu_analizi'].append(konu_data)

                    # SN = "-" olanlar zayıf konu
                    if sonuc == '-':
                        result['zayif_konular'].append(konu_data)

    return result

karne_files = st.file_uploader(
    "Karne PDF dosyalari yukleyin",
    type=['pdf'],
    key="karne_upload",
    accept_multiple_files=True
)

if karne_files:
    karneler = []
    tum_zayif_konular = []
    tum_konu_analizi = []

    for karne_file in karne_files:
        try:
            with pdfplumber.open(karne_file) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text() or ""

                if len(text) > 100:
                    # FENOMEN/HIZ format kontrolü - KONU ANALİZİ tablosu var mı?
                    is_table_format = 'KONU ANALİZİ' in text or ('DC' in text and 'ÖC' in text and 'SN' in text)

                    if is_table_format:
                        # Tablo bazlı parsing kullan (daha güvenilir)
                        karne_data = parse_karne_tables(karne_file)
                    else:
                        # Klasik text bazlı parsing
                        karne_data = parse_karne(text)

                    karne_data['dosya'] = karne_file.name

                    karneler.append(karne_data)
                    tum_zayif_konular.extend(karne_data['zayif_konular'])
                    tum_konu_analizi.extend(karne_data['konu_analizi'])

                    st.success(f"✅ {karne_file.name}: {len(karne_data['konu_analizi'])} konu, {len(karne_data['zayif_konular'])} zayif")
                else:
                    st.warning(f"⚠️ {karne_file.name}: Metin cikarilmadi (goruntu tabanli olabilir)")

        except Exception as e:
            st.warning(f"{karne_file.name} okunamadi: {e}")

    st.session_state.karneler = karneler
    st.session_state.tum_zayif_konular = tum_zayif_konular
    st.session_state.tum_konu_analizi = tum_konu_analizi

    # Ozet goster
    if karneler:
        with st.expander("📋 Karne Detaylari", expanded=True):
            for k in karneler:
                st.markdown(f"**📄 {k['dosya']}**")
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.write(f"Sinav: {k['sinav'][:30]}")
                with col2:
                    st.write(f"Puan: {k['puan']}")
                with col3:
                    st.write(f"Zayif Konu: {len(k['zayif_konular'])}")
                st.markdown("---")

        # Zayif konular ozeti
        if tum_zayif_konular:
            st.subheader("⚠️ Calisilmasi Gereken Konular")
            zayif_df = pd.DataFrame(tum_zayif_konular)
            st.dataframe(zayif_df[['konu', 'soru_sayisi', 'dogru', 'yanlis', 'basari']],
                        use_container_width=True, hide_index=True)

if len(st.session_state.get('karneler', [])) > 0:
    st.success(f"✅ Karneler yuklu: {len(st.session_state.karneler)} adet, {len(st.session_state.get('tum_zayif_konular', []))} zayif konu")

st.markdown("---")

# ============================================
# OZET
# ============================================
st.header("📊 Yukleme Ozeti")

col1, col2, col3 = st.columns(3)

with col1:
    if st.session_state.okul_sinavlari is not None:
        st.metric("Okul Sinavlari", f"{len(st.session_state.okul_sinavlari)} kayit", "✅")
    else:
        st.metric("Okul Sinavlari", "Bekleniyor", "⏳")

with col2:
    if st.session_state.deneme_sonuclari is not None:
        st.metric("Deneme Sonuclari", f"{len(st.session_state.deneme_sonuclari)} kayit", "✅")
    else:
        st.metric("Deneme Sonuclari", "Bekleniyor", "⏳")

with col3:
    st.metric("Karneler", f"{len(st.session_state.karneler)} adet", "✅" if st.session_state.karneler else "ℹ️")

# Analiz sayfasina yonlendir
if st.session_state.okul_sinavlari is not None or st.session_state.deneme_sonuclari is not None:
    st.markdown("---")
    st.success("🎉 Veriler yuklendi! Sol menuden **Analiz** sayfasina gecebilirsiniz.")
