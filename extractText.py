import pdfplumber

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

# Example usage:
# pdf_file = "resume.pdf"
# resume_text = extract_text_from_pdf(pdf_file)

# print(resume_text)  # preview first 500 characters
