import streamlit as st

st.set_page_config(
    page_title="Aakar Videotake",
    page_icon="🎬",
    layout="wide"
)

# Cleanly hide Streamlit header/footer and reset container margins without affecting iframes globally
hide_streamlit_ui = """
    <style>
    header { visibility: hidden; }
    footer { visibility: hidden; }
    .block-container {
        padding-top: 0rem !important;
        padding-bottom: 0rem !important;
        padding-left: 0rem !important;
        padding-right: 0rem !important;
    }
    </style>
"""
st.markdown(hide_streamlit_ui, unsafe_allow_html=True)

# Embed the static site using the recommended st.iframe with stretch height to fill the screen
st.iframe("/app/static/index.html", height="stretch")
