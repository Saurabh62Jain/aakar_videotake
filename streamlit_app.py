import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Aakar Videotake", layout="wide")

# Automatically redirect user to the static index page served under /app/static/index.html
components.html(
    """
    <script>
        window.parent.location.href = "/app/static/index.html";
    </script>
    """,
    height=0
)
