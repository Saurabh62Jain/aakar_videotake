import streamlit as st

st.set_page_config(
    page_title="Aakar Videotake",
    page_icon="🎬",
    layout="wide"
)

# Hide Streamlit UI elements and force the st.iframe element to be fullscreen
fullscreen_iframe_style = """
    <style>
    header { visibility: hidden; }
    footer { visibility: hidden; }
    .block-container {
        padding: 0rem !important;
    }
    /* Target only our st.iframe component and make it fullscreen */
    iframe[title="st.iframe"] {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw !important;
        height: 100vh !important;
        border: none;
        margin: 0;
        padding: 0;
        z-index: 999999;
    }
    </style>
"""
st.markdown(fullscreen_iframe_style, unsafe_allow_html=True)

# Embed the static site using the recommended st.iframe
st.iframe("/app/static/index.html")
