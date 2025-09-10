from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import selenium.webdriver as webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import pandas as pd
import json, os, time
import pdfplumber
from fastapi.middleware.cors import CORSMiddleware
from extractText import extract_text_from_pdf
from resumeUpgrader import generate
import threading, time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CACHE_TTL = 900  # 15 minutes
cached_data = None
last_fetch = 0

def scrape_and_update_cache():
    global cached_data, last_fetch
    url = "https://github.com/SimplifyJobs/Summer2026-Internships"
    html = scrape_website(url)
    data = extract_body_content(html)
    if data:
        cached_data = data
        last_fetch = time.time()

def background_refresh():
    while True:
        scrape_and_update_cache()
        time.sleep(CACHE_TTL)

@app.on_event("startup")
def start_background_refresh():
    threading.Thread(target=background_refresh, daemon=True).start()

@app.get("/internships")
def get_internships():
    if cached_data:
        return JSONResponse(content=cached_data)
    else:
        # fallback: scrape once if cache not ready
        scrape_and_update_cache()
        return JSONResponse(content=cached_data)

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

def scrape_website(website: str):
    chrome_driver_path = "./chromedriver.exe"
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # run without opening a browser window
    driver = webdriver.Chrome(service=Service(chrome_driver_path), options=options)

    try:
        driver.get(website)
        html = driver.page_source
        return html
    finally:
        driver.quit()

def extract_body_content(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    rows = soup.find_all("tr")

    data = []
    for row in rows:
        cols = row.find_all("td")
        if not cols or len(cols) < 5:  # ensure at least 5 cols
            continue 

        # skip inactive rows with 🔒
        if any("🔒" in col.get_text(strip=True) for col in cols):
            continue   

        # only keep rows that have a posted date
        if cols[4].get_text(strip=True) != "":
            company_tag = cols[0].find("a")
            company = company_tag.text.strip() if company_tag else cols[0].get_text(strip=True)
            company_url = company_tag["href"] if company_tag else None

            role = cols[1].get_text(strip=True) if len(cols) > 1 else ""
            location = cols[2].get_text(" ", strip=True) if len(cols) > 2 else ""

            apply_tag = cols[3].find("a") if len(cols) > 3 else None
            apply_url = apply_tag["href"] if apply_tag else None

            posted = cols[4].get_text(strip=True) if len(cols) > 4 else ""

            data.append({
                "Company": company,
                "Company_URL": company_url,
                "Role": role,
                "Location": location,
                "Apply_URL": apply_url,
                "Posted": posted,
            })

    return data
    
@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    try:
        # Extract text
        resume_text = extract_text_from_pdf(file.file)
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        # Generate upgraded resume
        upgraded_resume = generate(resume_text)

        return {"upgraded_text": upgraded_resume}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))