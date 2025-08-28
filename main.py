import streamlit as st
from scrape import (
    scrape_website,
    extract_body_content,
    # clean_body_content,
    # split_dom_content,
)
from parse import parse_with_ollama

# Streamlit UI
st.title("AI Web Scraper")
url = st.text_input("Enter Website URL")

# Step 1: Scrape the Website
if st.button("Scrape Website"):
    if url:
        st.write("Scraping the website...")

        # Scrape the website
        dom_content = scrape_website(url)
        body_content = extract_body_content(dom_content)
        # cleaned_content = clean_body_content(body_content)

        # Store the DOM content in Streamlit session state
        st.session_state.dom_content = body_content

        # Display the DOM content in an expandable text box
        with st.expander("View DOM Content"):
            st.dataframe(body_content)