"""
LGS Puan Hesaplama Araci
2025 guncel katsayilar ile
"""

import streamlit as st
import pandas as pd

st.set_page_config(page_title="LGS Puan Hesaplama", page_icon="🧮", layout="wide")

st.title("🧮 LGS Puan Hesaplama Araci")
st.caption("2025 guncel katsayilar ile tahmini LGS puaninizi hesaplayin")

# 2025 KATSAYILAR
KATSAYILAR = {
    'turkce': 4.349,
    'matematik': 4.254,
    'fen': 4.123,
    'inkilap': 1.667,
    'din': 1.899,
    'ingilizce': 1.508
}
SABIT = 194.752

st.markdown("---")

# ============================================
# TABLO FORMATINDA GIRIS
# ============================================
st.subheader("📝 Dogru / Yanlis Girisi")

# Baslik satiri
header_cols = st.columns([3, 2, 2, 2])
with header_cols[0]:
    st.markdown("**DERS**")
with header_cols[1]:
    st.markdown("**SORU**")
with header_cols[2]:
    st.markdown("**DOGRU**")
with header_cols[3]:
    st.markdown("**YANLIS**")

st.markdown("---")

# Turkce
tc = st.columns([3, 2, 2, 2])
with tc[0]:
    st.markdown("📖 **Turkce**")
with tc[1]:
    st.markdown("20")
with tc[2]:
    turkce_dogru = st.number_input("td", min_value=0, max_value=20, value=0, key="td", label_visibility="collapsed")
with tc[3]:
    turkce_yanlis = st.number_input("ty", min_value=0, max_value=20, value=0, key="ty", label_visibility="collapsed")

# Matematik
mc = st.columns([3, 2, 2, 2])
with mc[0]:
    st.markdown("🔢 **Matematik**")
with mc[1]:
    st.markdown("20")
with mc[2]:
    mat_dogru = st.number_input("md", min_value=0, max_value=20, value=0, key="md", label_visibility="collapsed")
with mc[3]:
    mat_yanlis = st.number_input("my", min_value=0, max_value=20, value=0, key="my", label_visibility="collapsed")

# Fen
fc = st.columns([3, 2, 2, 2])
with fc[0]:
    st.markdown("🔬 **Fen Bilimleri**")
with fc[1]:
    st.markdown("20")
with fc[2]:
    fen_dogru = st.number_input("fd", min_value=0, max_value=20, value=0, key="fd", label_visibility="collapsed")
with fc[3]:
    fen_yanlis = st.number_input("fy", min_value=0, max_value=20, value=0, key="fy", label_visibility="collapsed")

# Inkilap
ic = st.columns([3, 2, 2, 2])
with ic[0]:
    st.markdown("📜 **Inkilap Tarihi**")
with ic[1]:
    st.markdown("10")
with ic[2]:
    inkilap_dogru = st.number_input("id", min_value=0, max_value=10, value=0, key="id", label_visibility="collapsed")
with ic[3]:
    inkilap_yanlis = st.number_input("iy", min_value=0, max_value=10, value=0, key="iy", label_visibility="collapsed")

# Din
dc = st.columns([3, 2, 2, 2])
with dc[0]:
    st.markdown("🕌 **Din Kulturu**")
with dc[1]:
    st.markdown("10")
with dc[2]:
    din_dogru = st.number_input("dd", min_value=0, max_value=10, value=0, key="dd", label_visibility="collapsed")
with dc[3]:
    din_yanlis = st.number_input("dy", min_value=0, max_value=10, value=0, key="dy", label_visibility="collapsed")

# Ingilizce
ec = st.columns([3, 2, 2, 2])
with ec[0]:
    st.markdown("🌍 **Ingilizce**")
with ec[1]:
    st.markdown("10")
with ec[2]:
    ing_dogru = st.number_input("ed", min_value=0, max_value=10, value=0, key="ed", label_visibility="collapsed")
with ec[3]:
    ing_yanlis = st.number_input("ey", min_value=0, max_value=10, value=0, key="ey", label_visibility="collapsed")

st.markdown("---")

# Toplam satiri
toplam_dogru = turkce_dogru + mat_dogru + fen_dogru + inkilap_dogru + din_dogru + ing_dogru
toplam_yanlis = turkce_yanlis + mat_yanlis + fen_yanlis + inkilap_yanlis + din_yanlis + ing_yanlis
toplam_bos = 90 - toplam_dogru - toplam_yanlis

tot = st.columns([3, 2, 2, 2])
with tot[0]:
    st.markdown("**TOPLAM**")
with tot[1]:
    st.markdown("**90**")
with tot[2]:
    st.markdown(f"**{toplam_dogru}**")
with tot[3]:
    st.markdown(f"**{toplam_yanlis}**")

st.markdown("---")

# ============================================
# HESAPLA
# ============================================
if st.button("🧮 PUAN HESAPLA", type="primary", use_container_width=True):

    # Net hesaplama
    turkce_net = max(0, turkce_dogru - (turkce_yanlis / 3))
    mat_net = max(0, mat_dogru - (mat_yanlis / 3))
    fen_net = max(0, fen_dogru - (fen_yanlis / 3))
    inkilap_net = max(0, inkilap_dogru - (inkilap_yanlis / 3))
    din_net = max(0, din_dogru - (din_yanlis / 3))
    ing_net = max(0, ing_dogru - (ing_yanlis / 3))

    toplam_net = turkce_net + mat_net + fen_net + inkilap_net + din_net + ing_net

    # Puan hesaplama
    puan = (
        turkce_net * KATSAYILAR['turkce'] +
        mat_net * KATSAYILAR['matematik'] +
        fen_net * KATSAYILAR['fen'] +
        inkilap_net * KATSAYILAR['inkilap'] +
        din_net * KATSAYILAR['din'] +
        ing_net * KATSAYILAR['ingilizce'] +
        SABIT
    )
    puan = max(200, min(500, puan))

    # Sonuc
    st.markdown("---")

    # Puan gosterimi
    if puan >= 480:
        renk, yorum = "#059669", "🏆 Mukemmel! Fen Lisesi"
    elif puan >= 450:
        renk, yorum = "#10B981", "🌟 Cok Iyi! Anadolu Lisesi"
    elif puan >= 400:
        renk, yorum = "#3B82F6", "👍 Iyi!"
    elif puan >= 350:
        renk, yorum = "#F59E0B", "📚 Orta"
    else:
        renk, yorum = "#EF4444", "💪 Gayret!"

    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown(f"""
        <div style="background:{renk}; padding:25px; border-radius:15px; text-align:center; color:white;">
            <div style="font-size:14px;">TAHMINI LGS PUANI</div>
            <div style="font-size:48px; font-weight:bold;">{puan:.2f}</div>
            <div>{yorum}</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")

    # Net tablosu
    st.subheader("📊 Net Tablosu")

    net_df = pd.DataFrame({
        'Ders': ['Turkce', 'Matematik', 'Fen', 'Inkilap', 'Din', 'Ingilizce', 'TOPLAM'],
        'D': [turkce_dogru, mat_dogru, fen_dogru, inkilap_dogru, din_dogru, ing_dogru, toplam_dogru],
        'Y': [turkce_yanlis, mat_yanlis, fen_yanlis, inkilap_yanlis, din_yanlis, ing_yanlis, toplam_yanlis],
        'Net': [f'{turkce_net:.2f}', f'{mat_net:.2f}', f'{fen_net:.2f}', f'{inkilap_net:.2f}', f'{din_net:.2f}', f'{ing_net:.2f}', f'{toplam_net:.2f}'],
        'Katsayi': ['4.349', '4.254', '4.123', '1.667', '1.899', '1.508', '-'],
        'Puan': [f'{turkce_net*4.349:.1f}', f'{mat_net*4.254:.1f}', f'{fen_net*4.123:.1f}', f'{inkilap_net*1.667:.1f}', f'{din_net*1.899:.1f}', f'{ing_net*1.508:.1f}', f'{puan-SABIT:.1f}']
    })
    st.dataframe(net_df, use_container_width=True, hide_index=True)

    # Metrikler
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Toplam Net", f"{toplam_net:.2f}/90")
    c2.metric("Basari", f"%{(toplam_net/90)*100:.0f}")
    c3.metric("Sozel", f"{turkce_net+inkilap_net+din_net+ing_net:.1f}/50")
    c4.metric("Sayisal", f"{mat_net+fen_net:.1f}/40")

# Formul
with st.expander("📚 LGS 2025 Formulu"):
    st.markdown("""
    **Net:** Dogru - (Yanlis / 3)

    | Ders | Katsayi |
    |------|---------|
    | Turkce | 4.349 |
    | Matematik | 4.254 |
    | Fen | 4.123 |
    | Inkilap | 1.667 |
    | Din | 1.899 |
    | Ingilizce | 1.508 |

    **Sabit:** 194.752
    """)

st.caption("Kaynak: lgs-puan.hesaplama.net")
