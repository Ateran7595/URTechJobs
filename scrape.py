
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware
import requests

from extractText import extract_text_from_pdf
from resumeUpgrader import generate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def scrape_website(website: str) -> str:
    response = requests.get(website, timeout=30)
    response.raise_for_status()
    return response.text


def extract_body_content(html_content: str) -> list:
    soup = BeautifulSoup(html_content, "html.parser")
    internships = []

    for table in soup.find_all("table"):
        rows = table.find_all("tr")

        if not rows:
            continue

        headers = [
            cell.get_text(" ", strip=True).lower()
            for cell in rows[0].find_all(["th", "td"])
        ]

        company_idx = next(
            (i for i, h in enumerate(headers) if "company" in h), None
        )
        role_idx = next(
            (i for i, h in enumerate(headers) if "role" in h or "title" in h),
            None,
        )
        location_idx = next(
            (i for i, h in enumerate(headers) if "location" in h), None
        )
        apply_idx = next(
            (
                i for i, h in enumerate(headers)
                if "application" in h or "apply" in h
            ),
            None,
        )
        posted_idx = next(
            (i for i, h in enumerate(headers) if "age" in h or "posted" in h),
            None,
        )

        if company_idx is None or role_idx is None:
            continue

        for row in rows[1:]:
            cells = row.find_all(["td", "th"])

            if len(cells) <= max(company_idx, role_idx):
                continue

            company_cell = cells[company_idx]
            role_cell = cells[role_idx]

            company_link = company_cell.find("a", href=True)
            apply_link = (
                cells[apply_idx].find("a", href=True)
                if apply_idx is not None and apply_idx < len(cells)
                else None
            )

            company = company_cell.get_text(" ", strip=True)
            role = role_cell.get_text(" ", strip=True)

            location = (
                cells[location_idx].get_text(" ", strip=True)
                if location_idx is not None and location_idx < len(cells)
                else ""
            )

            posted = (
                cells[posted_idx].get_text(" ", strip=True)
                if posted_idx is not None and posted_idx < len(cells)
                else ""
            )

            if not company or not role:
                continue

            internships.append({
                "Company": company,
                "Company_URL": company_link["href"] if company_link else "",
                "Role": role,
                "Location": location,
                "Apply_URL": apply_link["href"] if apply_link else "",
                "Posted": posted,
            })

    print(f"Total internships parsed: {len(internships)}")
    return internships


@app.get("/internships")
def get_internships():
    url = (
        "https://raw.githubusercontent.com/"
        "SimplifyJobs/Summer2027-Internships/master/README.md"
    )

    try:
        html = scrape_website(url)
        data = extract_body_content(html)

        if not data:
            raise HTTPException(
                status_code=404,
                detail="No internships found",
            )

        return JSONResponse(content=data)

    except HTTPException:
        raise
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch internship data: {exc}",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process internship data: {exc}",
        ) from exc


@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    try:
        resume_text = extract_text_from_pdf(file.file)

        if not resume_text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF",
            )

        upgraded_resume = generate(resume_text)
        return {"upgraded_text": upgraded_resume}

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc
    finally:
        await file.close()
