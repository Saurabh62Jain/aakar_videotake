import streamlit as st

st.set_page_config(
    page_title="Aakar Videotake",
    page_icon="🎬",
    layout="wide"
)

# Apply a robust CSS reset to all Streamlit wrapper elements to make the iframe perfectly fullscreen on all mobile viewports
fullscreen_mobile_style = """
    <style>
    /* Complete reset for parent wrappers */
    html, body, .stApp, div[data-testid="stAppViewContainer"], .block-container {
        margin: 0px !important;
        padding: 0px !important;
        overflow: hidden !important;
        width: 100% !important;
        height: 100% !important;
    }
    
    /* Remove Streamlit default header, footer, and tools entirely from layout */
    header, footer, div[data-testid="stHeader"], div[data-testid="stToolbar"] {
        display: none !important;
    }
    
    /* Target only our st.iframe component and ensure iOS/Android compatibility */
    iframe[title="st.iframe"] {
        position: fixed;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
        width: 100vw !important;
        height: 100vh !important;
        height: -webkit-fill-available !important; /* Fix for iOS mobile browser viewport height bug */
        border: none;
        margin: 0;
        padding: 0;
        z-index: 999999;
    }
    </style>
"""
st.markdown(fullscreen_mobile_style, unsafe_allow_html=True)

# Embed the public GitHub Pages URL of your website
st.iframe("https://Saurabh62Jain.github.io/aakar_videotake/")
