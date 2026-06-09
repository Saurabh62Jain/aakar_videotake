import streamlit as st

st.set_page_config(
    page_title="Aakar Videotake",
    page_icon="🎬",
    layout="wide"
)

# Perform redirection in the parent page DOM to bypass iframe sandbox restrictions
st.markdown(
    '<img src="void" onerror="window.location.href = \'/app/static/index.html\';" style="display:none;">',
    unsafe_allow_html=True
)
