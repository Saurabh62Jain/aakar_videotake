import streamlit as st

st.set_page_config(
    page_title="Aakar Videotake",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit elements and make the iframe fullscreen
fullscreen_iframe_style = """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {
        padding: 0px !important;
    }
    iframe {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        border: none;
        margin: 0;
        padding: 0;
        overflow: auto;
        z-index: 999999;
    }
    </style>
"""
st.markdown(fullscreen_iframe_style, unsafe_allow_html=True)

# Serve index.html as a fullscreen iframe
# Any click within the website will load other subpages relative to /app/static/
st.components.v1.iframe("/app/static/index.html")
