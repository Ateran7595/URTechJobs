from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import selenium.webdriver as webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import pdfplumber
from fastapi.middleware.cors import CORSMiddleware
from extractText import extract_text_from_pdf
from resumeUpgrader import generate
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory cache ---
internships_cache = []

# --- Scraping function ---
def scrape_website(website: str):
    chrome_driver_path = "./chromedriver.exe"
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(service=Service(chrome_driver_path), options=options)
    try:
        driver.get(website)
        return driver.page_source
    finally:
        driver.quit()

def extract_body_content(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    rows = soup.find_all("tr")
    data = []
    for row in rows:
        cols = row.find_all("td")
        if not cols or len(cols) < 5:
            continue
        if any("🔒" in col.get_text(strip=True) for col in cols):
            continue
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

async def scrape_and_cache():
    global internships_cache
    try:
        html = scrape_website("https://github.com/SimplifyJobs/Summer2026-Internships")
        internships_cache = extract_body_content(html)
        print("Internships cache updated")
    except Exception as e:
        print(f"Failed to update internships cache: {e}")

# --- Background updater ---
@app.on_event("startup")
async def startup_event():
    # Initial scrape at startup
    await scrape_and_cache()

    # Schedule periodic updates
    async def periodic_update():
        while True:
            await asyncio.sleep(300)  # 5 minutes
            await scrape_and_cache()
    asyncio.create_task(periodic_update())

# --- Endpoint ---
@app.get("/internships")
async def get_internships(force_refresh: bool = False):
    global internships_cache
    if force_refresh:
        await scrape_and_cache()
    if not internships_cache:
        raise HTTPException(status_code=404, detail="No internship data available yet")
    return JSONResponse(content=internships_cache)

# --- PDF Resume Upload ---
@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    try:
        resume_text = extract_text_from_pdf(file.file)
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        upgraded_resume = generate(resume_text)
        return {"upgraded_text": upgraded_resume}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
