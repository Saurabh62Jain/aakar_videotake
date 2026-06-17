import streamlit as st
import streamlit.components.v1 as components
import os

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
    
    /* Target all iframes to ensure full screen compatibility */
    iframe {
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

# Get absolute path of current folder containing the static folder
current_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(current_dir, "static")

# Declare and render the component using the local static files
# Streamlit will serve all files in this directory with correct MIME types
local_site = components.declare_component("aakar_site", path=build_dir)
local_site()
