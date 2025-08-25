from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import selenium.webdriver as webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

@app.get("/internships")
def get_internships():
    try:
        url = "https://github.com/SimplifyJobs/Summer2026-Internships"
        html = scrape_website(url)
        data = extract_body_content(html)
        if not data:
            raise HTTPException(status_code=404, detail="No data found")
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# def clean_body_content(body_content):
#     soup = BeautifulSoup(body_content, "html.parser")

#     for script_or_style in soup(["script", "style"]):
#         script_or_style.extract()

#     # Get text or further process the content
#     cleaned_content = soup.get_text(separator="\n")
#     cleaned_content = "\n".join(
#         line.strip() for line in cleaned_content.splitlines() if line.strip()
#     )

#     return cleaned_content


# def split_dom_content(dom_content, max_length=8000):
#     return [
#         dom_content[i : i + max_length] for i in range(0, len(dom_content), max_length)
#     ]

# ====================================
# DONE!
#  Let's get the data from what we scrapped from selenium and actually provide all the info without
#  using AI since it is very slow. WE'll turn it into a json object (dictionary) and then provide it back with a good UI

# Now it's time to let the user parse the info into what they want to see:
# allow to check what they want to see
# don't allow user to input any website url
# start applying good ui with react,