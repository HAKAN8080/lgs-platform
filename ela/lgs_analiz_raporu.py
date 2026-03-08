"""
Ela Deniz Ugur - LGS Analiz Raporu PDF
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics.charts.barcharts import VerticalBarChart
import os
import pandas as pd
from datetime import datetime

# Renkler
PRIMARY = HexColor('#1E3A8A')
SECONDARY = HexColor('#3B82F6')
ACCENT = HexColor('#10B981')
LIGHT_BG = HexColor('#EFF6FF')
WHITE = HexColor('#FFFFFF')
DARK = HexColor('#1F2937')
GRAY = HexColor('#6B7280')
RED = HexColor('#EF4444')
ORANGE = HexColor('#F59E0B')
GREEN = HexColor('#10B981')
YELLOW = HexColor('#FBBF24')

def setup_fonts():
    font_paths = [
        '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
        '/Library/Fonts/Arial Unicode.ttf',
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                pdfmetrics.registerFont(TTFont('TurkishFont', path))
                return 'TurkishFont'
            except:
                continue
    return 'Helvetica'

def create_bar_chart(data, labels, title):
    drawing = Drawing(400, 150)

    bc = VerticalBarChart()
    bc.x = 50
    bc.y = 30
    bc.height = 100
    bc.width = 320
    bc.data = [data]
    bc.categoryAxis.categoryNames = labels
    bc.categoryAxis.labels.fontName = 'Helvetica'
    bc.categoryAxis.labels.fontSize = 8
    bc.valueAxis.valueMin = 0
    bc.valueAxis.valueMax = 100
    bc.valueAxis.valueStep = 20
    bc.bars[0].fillColor = SECONDARY

    drawing.add(bc)
    return drawing

def create_pdf():
    output_path = "/Users/eladenizugur/Desktop/ela/Ela_Deniz_Ugur_LGS_Analiz.pdf"

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=1.5*cm,
        rightMargin=1.5*cm,
        topMargin=1.5*cm,
        bottomMargin=1.5*cm
    )

    font_name = setup_fonts()
    story = []

    # Stiller
    title_style = ParagraphStyle('Title', fontName=font_name, fontSize=24, alignment=TA_CENTER, textColor=PRIMARY, spaceAfter=10)
    subtitle_style = ParagraphStyle('Subtitle', fontName=font_name, fontSize=14, alignment=TA_CENTER, textColor=GRAY, spaceAfter=20)
    section_style = ParagraphStyle('Section', fontName=font_name, fontSize=16, textColor=PRIMARY, spaceBefore=15, spaceAfter=10)
    body_style = ParagraphStyle('Body', fontName=font_name, fontSize=10, textColor=DARK, leading=14)

    # ==================== SAYFA 1: KAPAK ====================
    story.append(Spacer(1, 2*cm))

    # Baslik
    header = Table([['LGS HAZIRLIK']], colWidths=[18*cm])
    header.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 28),
        ('TOPPADDING', (0,0), (-1,-1), 20),
        ('BOTTOMPADDING', (0,0), (-1,-1), 20),
    ]))
    story.append(header)

    story.append(Spacer(1, 0.5*cm))

    subheader = Table([['PERFORMANS ANALIZ RAPORU']], colWidths=[18*cm])
    subheader.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SECONDARY),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 16),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(subheader)

    story.append(Spacer(1, 2*cm))

    # Ogrenci bilgisi
    student_info = Table([
        ['Ogrenci', 'ELA DENIZ UGUR'],
        ['Rapor Tarihi', datetime.now().strftime('%d.%m.%Y')],
        ['Analiz Edilen Sinav', '46 Okul Izleme + Coklu Deneme'],
        ['Donem', 'Eylul 2025 - Mart 2026'],
    ], colWidths=[6*cm, 12*cm])
    student_info.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), LIGHT_BG),
        ('BACKGROUND', (1,0), (1,-1), WHITE),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 12),
        ('TEXTCOLOR', (0,0), (0,-1), PRIMARY),
        ('TEXTCOLOR', (1,0), (1,-1), DARK),
        ('ALIGN', (0,0), (0,-1), 'RIGHT'),
        ('ALIGN', (1,0), (1,-1), 'LEFT'),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('RIGHTPADDING', (0,0), (-1,-1), 15),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, HexColor('#BFDBFE')),
    ]))
    story.append(student_info)

    story.append(Spacer(1, 2*cm))

    # Ozet kutusu
    summary_title = Table([['GENEL DEGERLENDIRME']], colWidths=[18*cm])
    summary_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(summary_title)

    summary_text = Paragraph(
        "Ela, sozel derslerde ustun basari gosteren, Turkce ve sosyal bilimler alaninda sinifinin en iyileri arasinda yer alan bir ogrencidir. "
        "Ancak sayisal derslerde, ozellikle Fen Bilimlerinde ciddi bir dusus yasanmaktadir. "
        "Son 3 Fen izleme sinavinda %60 civarinda puan almasi ve sinif siralamasinin 160-178 arasinda olmasi acil mudahale gerektirmektedir. "
        "Matematik performansi da tutarsiz olup, son sinavda %66.7 ile beklenenin altinda kalmistir.",
        body_style
    )
    summary_box = Table([[summary_text]], colWidths=[18*cm])
    summary_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('RIGHTPADDING', (0,0), (-1,-1), 15),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('BOX', (0,0), (-1,-1), 1, DARK),
    ]))
    story.append(summary_box)

    story.append(PageBreak())

    # ==================== SAYFA 2: KARSILASTIRMALI OZET ====================

    # Veri dosyalarini oku
    data_dir = "/Users/eladenizugur/Desktop/ela/datalar"
    okul_ders_data = {}
    deneme_ders_data = {}

    # Ders mapping
    ders_mapping = {
        'TURKCE': {'okul_keywords': ['TÜRKÇE', 'TURKCE'], 'deneme_col': 'Turkce'},
        'MATEMATIK': {'okul_keywords': ['MATEMATİK', 'MATEMATIK', 'MAT'], 'deneme_col': 'Matematik'},
        'FEN': {'okul_keywords': ['FEN', 'FEN BİLİMLERİ'], 'deneme_col': 'Fen Bilimleri'},
        'INKILAP': {'okul_keywords': ['İNKİLAP', 'INKILAP', 'T.C.'], 'deneme_col': 'Ink.Tarihi'},
        'DIN': {'okul_keywords': ['DİN', 'DIN'], 'deneme_col': 'Din Kulturu'},
        'INGILIZCE': {'okul_keywords': ['İNG', 'ING'], 'deneme_col': 'Ingilizce'}
    }

    try:
        # Okul verisi
        df_okul = pd.read_excel(os.path.join(data_dir, "Okul.xlsx"))
        df_okul.columns = [str(c).strip().upper() for c in df_okul.columns]

        sinav_col = None
        puan_col = None
        siralama_col = None

        for col in df_okul.columns:
            col_lower = col.lower()
            if 'sinav' in col_lower or 'sınav' in col_lower or 'adi' in col_lower:
                sinav_col = col
            elif 'puan' in col_lower and 'ortalama' not in col_lower:
                puan_col = col
            elif 'siralama' in col_lower or 'sıralama' in col_lower:
                siralama_col = col

        if sinav_col and puan_col:
            for ders, info in ders_mapping.items():
                mask = df_okul[sinav_col].astype(str).str.upper().apply(
                    lambda x: any(kw in x for kw in info['okul_keywords'])
                )
                ders_df = df_okul[mask]
                if len(ders_df) > 0:
                    puanlar = pd.to_numeric(ders_df[puan_col], errors='coerce').dropna()
                    ort_sira = None
                    if siralama_col:
                        def parse_sira(val):
                            try:
                                if '/' in str(val):
                                    return int(str(val).split('/')[0].strip())
                            except:
                                pass
                            return None
                        siralamalar = ders_df[siralama_col].apply(parse_sira).dropna()
                        if len(siralamalar) > 0:
                            ort_sira = siralamalar.mean()
                    if len(puanlar) > 0:
                        okul_ders_data[ders] = {'ortalama': puanlar.mean(), 'siralama': ort_sira, 'sinav_sayisi': len(ders_df)}

        # Deneme verisi
        df_deneme = pd.read_excel(os.path.join(data_dir, "denemeler.xlsx"))
        sira_col = None
        for col in df_deneme.columns:
            if 'kurum' in str(col).lower() and 'sira' in str(col).lower():
                sira_col = col
                break

        for ders, info in ders_mapping.items():
            if info['deneme_col'] in df_deneme.columns:
                netler = pd.to_numeric(df_deneme[info['deneme_col']], errors='coerce').dropna()
                if len(netler) > 0:
                    deneme_ders_data[ders] = {'ortalama': netler.mean(), 'sinav_sayisi': len(netler)}

        # Genel kurum siralamasini ayri tut
        genel_kurum_sira = None
        if sira_col:
            siralamalar = pd.to_numeric(df_deneme[sira_col], errors='coerce').dropna()
            if len(siralamalar) > 0:
                genel_kurum_sira = siralamalar.mean()
    except Exception as e:
        print(f"Veri okuma hatasi: {e}")

    # Karsilastirmali ozet basligi
    karsilastirma_title = Table([['DERS BAZLI KARSILASTIRMALI OZET']], colWidths=[18*cm])
    karsilastirma_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(karsilastirma_title)
    story.append(Spacer(1, 0.3*cm))

    # Karsilastirma tablosu - sabit sıralama
    karsilastirma_header = ['DERS', 'OKUL ORT.', 'OKUL SIRA', 'DENEME NET']
    karsilastirma_rows = [karsilastirma_header]

    # Sabit sıralama: Türkçe, Matematik, Fen, İnkılap, Din, İngilizce
    ders_sirasi = ['TURKCE', 'MATEMATIK', 'FEN', 'INKILAP', 'DIN', 'INGILIZCE']

    for ders in ders_sirasi:
        okul = okul_ders_data.get(ders, {})
        deneme = deneme_ders_data.get(ders, {})

        okul_ort = f"%{okul.get('ortalama', 0):.1f}" if okul.get('ortalama') else '-'
        okul_sira = f"{okul.get('siralama', 0):.0f}." if okul.get('siralama') else '-'
        deneme_net = f"{deneme.get('ortalama', 0):.1f}" if deneme.get('ortalama') else '-'

        karsilastirma_rows.append([ders, okul_ort, okul_sira, deneme_net])

    karsilastirma_table = Table(karsilastirma_rows, colWidths=[4.5*cm, 4.5*cm, 4.5*cm, 4.5*cm])
    karsilastirma_table.setStyle(TableStyle([
        # Header
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        # Body
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 10),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('ALIGN', (0,0), (0,-1), 'LEFT'),
        # Okul kolonlari arka plan
        ('BACKGROUND', (1,1), (2,-1), HexColor('#EFF6FF')),
        # Deneme kolonlari arka plan
        ('BACKGROUND', (3,1), (3,-1), HexColor('#F0FDF4')),
        # Genel
        ('BOX', (0,0), (-1,-1), 1, DARK),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, HexColor('#E5E7EB')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(karsilastirma_table)

    story.append(Spacer(1, 0.3*cm))

    # Genel kurum siralamasini goster
    if genel_kurum_sira:
        kurum_sira_text = Paragraph(
            f"<b>Deneme Sinavlari Genel Kurum Siralaması:</b> Ortalama {genel_kurum_sira:.0f}. sirada",
            ParagraphStyle('KurumSira', fontName='Helvetica', fontSize=10, textColor=PRIMARY, alignment=TA_CENTER)
        )
        story.append(kurum_sira_text)
        story.append(Spacer(1, 0.3*cm))

    # Aciklama
    aciklama = Paragraph(
        "<b>OKUL ORT.:</b> Okul izleme sinavlari puan ortalamasi | "
        "<b>OKUL SIRA:</b> Okul ici ortalama siralama | "
        "<b>DENEME NET:</b> Kurum denemelerinde ders bazli net ortalamasi",
        ParagraphStyle('Aciklama', fontName='Helvetica', fontSize=8, textColor=GRAY, alignment=TA_CENTER)
    )
    story.append(aciklama)

    story.append(Spacer(1, 1*cm))

    # ==================== DERS ANALIZI DEVAMI ====================

    page2_title = Table([['DERS BAZLI PERFORMANS ANALIZI']], colWidths=[18*cm])
    page2_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(page2_title)
    story.append(Spacer(1, 0.5*cm))

    # Ders tablosu
    ders_data = [
        ['DERS', 'ORT.', 'EN YUKSEK', 'EN DUSUK', 'SON SINAV', 'DURUM'],
        ['Turkce', '%90.7', '%100', '%66.7', '%100 (1/203)', 'GUCLU'],
        ['Matematik', '%80.0', '%93.3', '%66.7', '%66.7 (171/202)', 'ORTA'],
        ['Fen Bilimleri', '%72.3', '%93.3', '%60.0', '%60.0 (160/205)', 'ZAYIF'],
        ['Inkilap Tarihi', '%92.0', '%100', '%80.0', '%93.3 (114/201)', 'GUCLU'],
        ['Din-Ing', '%93.3', '%100', '%80.0', '%80.0 (150/197)', 'GUCLU'],
    ]

    ders_table = Table(ders_data, colWidths=[4*cm, 2*cm, 2.5*cm, 2.5*cm, 4*cm, 3*cm])
    ders_table.setStyle(TableStyle([
        # Header
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        # Body
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 9),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('ALIGN', (0,0), (0,-1), 'LEFT'),
        # Durum renkleri
        ('BACKGROUND', (5,1), (5,1), GREEN),  # Turkce
        ('BACKGROUND', (5,2), (5,2), ORANGE),  # Mat
        ('BACKGROUND', (5,3), (5,3), RED),     # Fen
        ('BACKGROUND', (5,4), (5,4), GREEN),  # Inkilap
        ('BACKGROUND', (5,5), (5,5), GREEN),  # Din-Ing
        ('TEXTCOLOR', (5,1), (5,-1), WHITE),
        # Fen satiri vurgu
        ('BACKGROUND', (0,3), (4,3), HexColor('#FEE2E2')),
        # Genel
        ('BOX', (0,0), (-1,-1), 1, DARK),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, HexColor('#E5E7EB')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(ders_table)

    story.append(Spacer(1, 1*cm))

    # Kritik tespitler
    kritik_title = Table([['KRITIK TESPITLER']], colWidths=[18*cm])
    kritik_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), RED),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(kritik_title)

    kritik_items = [
        ['ACIL', 'Fen Bilimleri son 3 sinavda %60-62 - Sinif sonu siralama'],
        ['ACIL', 'Matematik son sinavda %66.7 - Buyuk dusus'],
        ['UYARI', 'Genel trend DUSUSTE: Son 2 ayda -5.7 puan kayip'],
        ['OLUMLU', 'Turkce ve Sosyal derslerde 1. siralama basarisi'],
        ['OLUMLU', 'Din-Ing ve Inkilap %90+ ortalama'],
    ]

    for item in kritik_items:
        if item[0] == 'ACIL':
            bg = HexColor('#FEE2E2')
            fg = RED
        elif item[0] == 'UYARI':
            bg = HexColor('#FEF3C7')
            fg = ORANGE
        else:
            bg = HexColor('#D1FAE5')
            fg = GREEN

        row = Table([[item[0], Paragraph(item[1], body_style)]], colWidths=[2*cm, 16*cm])
        row.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), fg),
            ('BACKGROUND', (1,0), (1,0), bg),
            ('TEXTCOLOR', (0,0), (0,0), WHITE),
            ('FONTNAME', (0,0), (0,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (0,0), 8),
            ('ALIGN', (0,0), (0,0), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (1,0), (1,0), 10),
        ]))
        story.append(row)
        story.append(Spacer(1, 0.1*cm))

    story.append(Spacer(1, 0.8*cm))

    # Zirve performanslar
    zirve_title = Table([['ZIRVE PERFORMANSLAR (100 Puan / 1. Siralama)']], colWidths=[18*cm])
    zirve_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GREEN),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(zirve_title)

    zirve_data = [
        ['Turkce Izleme 5', '100 puan', '1 / 203'],
        ['Din-Ing Izleme 3', '100 puan', '1 / 203'],
        ['Inkilap Izleme 3', '100 puan', '1 / 201'],
        ['Turkce Izleme 2', '100 puan', '1 / 207'],
        ['Din-Ing Izleme 1', '100 puan', '1 / 208'],
    ]

    zirve_table = Table(zirve_data, colWidths=[8*cm, 5*cm, 5*cm])
    zirve_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#D1FAE5')),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('BOX', (0,0), (-1,-1), 1, GREEN),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, HexColor('#A7F3D0')),
    ]))
    story.append(zirve_table)

    story.append(PageBreak())

    # ==================== SAYFA 3: YOL HARITASI ====================

    page3_title = Table([['YOL HARITASI VE EYLEM PLANI']], colWidths=[18*cm])
    page3_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(page3_title)
    story.append(Spacer(1, 0.5*cm))

    # Oncelik 1: Fen
    fen_title = Table([['1. ONCELIK: FEN BILIMLERI - ACIL MUDAHALE']], colWidths=[18*cm])
    fen_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), RED),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 11),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(fen_title)

    fen_content = Paragraph(
        "<b>Gunluk Sure:</b> 1.5 - 2 saat<br/><br/>"
        "<b>Hafta 1-2:</b> Konu bazli test cozerek zayif uniteleri belirle (Kimya: Madde, Asit-Baz / Fizik: Kuvvet, Enerji)<br/>"
        "<b>Hafta 3-4:</b> Video ders + konu anlatimli kaynak + mini testler (15-20 soru)<br/>"
        "<b>Hafta 5-8:</b> Gunluk 30-40 soru, paragraf tipi ve deney yorumlama, yanlis defteri<br/><br/>"
        "<b>Hedef:</b> 2 ay icinde %85+ ve ust %30'luk dilim",
        body_style
    )
    fen_box = Table([[fen_content]], colWidths=[18*cm])
    fen_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#FEE2E2')),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(fen_box)
    story.append(Spacer(1, 0.4*cm))

    # Oncelik 2: Matematik
    mat_title = Table([['2. ONCELIK: MATEMATIK - TUTARLILIK']], colWidths=[18*cm])
    mat_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ORANGE),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 11),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(mat_title)

    mat_content = Paragraph(
        "<b>Gunluk Sure:</b> 1 - 1.5 saat<br/><br/>"
        "<b>Odak Konular:</b> Cebirsel ifadeler, denklemler, geometrik cisimler, alan-hacim, veri analizi, olasilik<br/>"
        "<b>Strateji:</b> Temel islem hizi pratigi (10 dk/gun) + 15-20 karma soru + problem cozme stratejileri<br/><br/>"
        "<b>Hedef:</b> Tutarli %90+ performans",
        body_style
    )
    mat_box = Table([[mat_content]], colWidths=[18*cm])
    mat_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#FEF3C7')),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(mat_box)
    story.append(Spacer(1, 0.4*cm))

    # Koruma dersleri
    koruma_title = Table([['3. KORUMA: TURKCE VE SOSYAL DERSLER']], colWidths=[18*cm])
    koruma_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GREEN),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 11),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(koruma_title)

    koruma_content = Paragraph(
        "<b>Turkce (30-45 dk/gun):</b> Haftada 2-3 paragraf calismasi, dil bilgisi tekrari<br/>"
        "<b>Inkilap (20-30 dk/gun):</b> Kronoloji ve tarih seridi calismasi<br/>"
        "<b>Din-Ing (20-30 dk/gun):</b> Haftalik tekrar yeterli",
        body_style
    )
    koruma_box = Table([[koruma_content]], colWidths=[18*cm])
    koruma_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), HexColor('#D1FAE5')),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(koruma_box)
    story.append(Spacer(1, 0.6*cm))

    # Haftalik program
    program_title = Table([['HAFTALIK PROGRAM ONERISI']], colWidths=[18*cm])
    program_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 11),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(program_title)

    program_data = [
        ['GUN', 'FEN', 'MAT', 'DIGER', 'TOPLAM'],
        ['Pazartesi', '1.5 sa', '1 sa', 'Turkce 30dk', '3 saat'],
        ['Sali', '1.5 sa', '1 sa', 'Inkilap 30dk', '3 saat'],
        ['Carsamba', '1.5 sa', '1 sa', 'Turkce 30dk', '3 saat'],
        ['Persembe', '1.5 sa', '1 sa', 'Din-Ing 30dk', '3 saat'],
        ['Cuma', '1.5 sa', '1 sa', 'Genel Tekrar', '3 saat'],
        ['Cumartesi', 'DENEME SINAVI (3 sa)', '', 'Analiz (1 sa)', '4 saat'],
        ['Pazar', 'Yanlis Tekrari', '', 'Hafif Calisma', '2 saat'],
    ]

    program_table = Table(program_data, colWidths=[3*cm, 4.5*cm, 3*cm, 4.5*cm, 3*cm])
    program_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BACKGROUND', (0,1), (0,-1), LIGHT_BG),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, HexColor('#BFDBFE')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(program_table)

    story.append(Spacer(1, 0.6*cm))

    # Hedefler
    hedef_title = Table([['HEDEF PUANLAR']], colWidths=[18*cm])
    hedef_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ACCENT),
        ('TEXTCOLOR', (0,0), (-1,-1), WHITE),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 11),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(hedef_title)

    hedef_data = [
        ['', 'FEN', 'MAT', 'GENEL'],
        ['1 Ay Sonra', '%70 -> %80', '%80 -> %85', '%85 -> %88'],
        ['2 Ay Sonra', '%80 -> %85', '%85 -> %90', '%88 -> %92'],
        ['LGS Hedef', '%90+', '%90+', '85+ Net'],
    ]

    hedef_table = Table(hedef_data, colWidths=[4.5*cm, 4.5*cm, 4.5*cm, 4.5*cm])
    hedef_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BACKGROUND', (0,1), (0,-1), LIGHT_BG),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
        ('BOX', (0,0), (-1,-1), 1, ACCENT),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, HexColor('#A7F3D0')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(hedef_table)

    story.append(Spacer(1, 1*cm))

    # Footer
    footer = Table([
        ['Thorius Egitim ve Danismanlik'],
        ['Bu rapor ogrenci gelisimini desteklemek amaciyla hazirlanmistir.']
    ], colWidths=[18*cm])
    footer.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (0,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (0,0), 10),
        ('TEXTCOLOR', (0,0), (0,0), PRIMARY),
        ('FONTNAME', (0,1), (0,1), 'Helvetica'),
        ('FONTSIZE', (0,1), (0,1), 8),
        ('TEXTCOLOR', (0,1), (0,1), GRAY),
    ]))
    story.append(footer)

    # PDF olustur
    doc.build(story)

    print(f"\n{'='*50}")
    print("PDF RAPOR OLUSTURULDU!")
    print(f"{'='*50}")
    print(f"Dosya: {output_path}")
    print(f"Boyut: {os.path.getsize(output_path) / 1024:.1f} KB")
    print(f"{'='*50}")

    return output_path

if __name__ == "__main__":
    create_pdf()
