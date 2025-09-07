import React, { useState } from "react";
import html2pdf from "html2pdf.js";

function ResumeUpgrader() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [latexCode, setLatexCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [feedbackText, setFeedbackText] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      const data = await response.json();
      const fullText = data.upgraded_text;
      setResumeText(fullText);

      // Extract LaTeX portion
      const latexMatch = fullText.match(
        /\\documentclass[\s\S]*?\\end\{document\}/
      );
      if (latexMatch) {
        setLatexCode(latexMatch[0]);
      } else {
        setLatexCode(""); // or show a message if no LaTeX found
      }

      const htmlMatch = fullText.match(/<html>[\s\S]*?<\/html>/i);
      if (htmlMatch) setHtmlCode(htmlMatch[0]);

      const feedbackList = parseFeedbackWithTitles(resumeText);
      setFeedbackText(
        feedbackList.length > 0 ? feedbackList : ["No feedback available."]
      );
    } catch (error) {
      console.error("Error uploading resume:", error);
    } finally {
      setLoading(false);
    }
  };

  function parseFeedbackWithTitles(text) {
    const feedbackStart = text.indexOf("=== FEEDBACK ===");
    if (feedbackStart === -1) return [];

    // Get everything after the feedback header
    const feedbackSection = text.substring(
      feedbackStart + "=== FEEDBACK ===".length
    );

    // Split into lines, trim whitespace, remove empty lines
    const lines = feedbackSection
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const feedbackList = [];
    let currentTitle = "";

    lines.forEach((line) => {
      // Remove ** and leading * characters
      const cleanLine = line.replace(/\*\*/g, "").replace(/^\*\s*/, "");

      if (cleanLine.endsWith(":")) {
        // It's a title
        currentTitle = cleanLine;
      } else {
        // It's content, combine with the last title
        if (currentTitle) {
          feedbackList.push(`${currentTitle} ${cleanLine}`);
          currentTitle = ""; // reset for next bullet
        } else {
          feedbackList.push(cleanLine); // fallback if no title
        }
      }
    });

    return feedbackList;
  }

  const downloadPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = pdfHtml; // use the fixed-width version
  
    html2pdf()
      .from(element)
      .set({
        margin: [0.5, 0.5, 0.5, 0.5], // half inch margins
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 }, // higher quality
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };
  

  const pdfHtml = htmlCode.replace(
    "<head>",
    `<head>
      <style>
        body {
          margin: 40px;
          padding: 0;
          font-size: 12pt;
          line-height: 1.5;
        }
        .container {
          width: 800px; /* fixed resume width */
          margin: 0 auto;
        }
      </style>
    </head>`
  );
  

  const responsiveHtml = htmlCode.replace(
    "<head>",
    `<head>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center; /* center horizontally */
          align-items: flex-start; /* align content to top */
          min-height: 100vh;
          box-sizing: border-box;
        }
        .container {
          width: 100%;
          max-width: 900px; /* fit nicely inside iframe */
          padding: 20px;
          box-sizing: border-box;
        }
      </style>
    </head>`
  );

  const iframeStyle = {
    width: "100%",
    minHeight: "80vh",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "white",
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 w-full">
      <h1 className="text-emerald-400 font-semibold text-center text-4xl md:text-5xl lg:text-6xl font-bungee">
        Resume Upgrader (AI Beta)
      </h1>
      <h2 className="text-gray-300 text-center text-base md:text-lg mt-2">
        Transform your resume with AI — smarter, cleaner, and ATS-friendly in moments.
      </h2>
  
      {/* Upload Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
        <label className="bg-white text-black font-bold rounded cursor-pointer w-[150px] text-center">
          {file ? file.name : "Choose Resume"}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
  
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-emerald-400 text-white font-semibold hover:bg-emerald-600 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>
  
      {resumeText && (
        <div className="flex flex-col p-2">
          <iframe style={iframeStyle} srcDoc={responsiveHtml} />
  
          {/* Download PDF Button */}
          <button
            onClick={downloadPDF}
            className="mt-4 px-4 py-2 bg-sky-400 text-white rounded hover:bg-sky-600 font-semibold w-full sm:w-auto"
          >
            Download as PDF
          </button>
  
          {/* Feedback Section */}
          <div className="max-w-full lg:max-w-4xl text-white mx-auto mt-6">
            <h1 className="text-center font-inter font-bold text-xl md:text-2xl">
              Feedback
            </h1>
            <div className="px-4 pb-4">
              {feedbackText.length > 0 && (
                <ul className="list-disc pl-6 mt-4 text-sm md:text-base">
                  {feedbackText.map((item, idx) => (
                    <li key={idx} className="mb-2">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
  
          {/* Copy LaTeX Section */}
          <div className="text-center text-white p-4 flex flex-col gap-2">
            <h1 className="font-inter font-bold text-lg md:text-2xl">
              Want to change something?
            </h1>
            <p className="text-sm md:text-base">
              Click this button to copy LaTeX code and open it in an online editor.
            </p>
            <button
              onClick={() => {
                if (latexCode) {
                  navigator.clipboard.writeText(latexCode);
                  alert("LaTeX code copied to clipboard!");
                } else {
                  alert("No LaTeX code available to copy.");
                }
              }}
              className="px-4 py-2 bg-emerald-400 text-white rounded hover:bg-emerald-600 font-semibold w-full sm:w-auto"
            >
              Copy LaTeX
            </button>
            <a
              href="https://www.overleaf.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 underline font-bold text-base md:text-lg"
            >
              Open in Overleaf
            </a>
          </div>
  
          <p className="text-center text-xs md:text-sm text-gray-400 mt-2 px-4">
            <em>
              Note: This feature was AI-assisted. While every effort has been
              made to ensure accuracy, some content may require manual review.
              For best results, the LaTeX version is recommended.
            </em>
          </p>
        </div>
      )}
    </div>
  );
}

export default ResumeUpgrader;
