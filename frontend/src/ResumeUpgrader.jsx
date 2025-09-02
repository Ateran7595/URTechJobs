import React, { useState } from "react";

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
      setFeedbackText(feedbackList.length > 0 ? feedbackList : ["No feedback available."]);


    } catch (error) {
      console.error("Error uploading resume:", error);
    } finally {
      setLoading(false);
    }

    function parseFeedbackWithTitles(text) {
      const feedbackStart = text.indexOf("=== FEEDBACK ===");
      if (feedbackStart === -1) return [];
    
      // Get everything after the feedback header
      const feedbackSection = text.substring(feedbackStart + "=== FEEDBACK ===".length);
    
      // Split into lines, trim whitespace, remove empty lines
      const lines = feedbackSection
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
      const feedbackList = [];
      let currentTitle = "";
    
      lines.forEach(line => {
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
  };

  return (
    <div className="p-6 flex flex-col gap-4 w-[100%]">
      <h1 className="text-emerald-400 font-semibold text-center text-[60px] font-bungee">
        Resume Upgrader
      </h1>
      <h2 className="text-gray-300 text-center text-lg mt-2">
        Transform your resume with AI — smarter, cleaner, and ATS-friendly in
        moments.
      </h2>
      <div className="flex items-center justify-center gap-2">
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
          className="px-4 py-2 rounded-2xl bg-emerald-400 text-white font-semibold hover:cursor-pointer hover:bg-emerald-600 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>

      {resumeText && (
        // <div className="mt-6 p-4 border rounded bg-white whitespace-pre-wrap">
        //   <h2 className="text-lg font-semibold mb-2 text-black">Upgraded Resume:</h2>
        //   {/* <p className="resume-preview border p-4 rounded mt-4 bg-white text-black" dangerouslySetInnerHTML={{ __html: htmlCode }}></p> */}
        //   <p className="resume-preview border p-4 rounded mt-4 bg-white text-black">{resumeText}</p>
        // </div>
        <div className="flex flex-col p-2">
          
          <iframe
            className="w-[900px] border rounded bg-white p-2 text-black"
            style={{ minHeight: "80vh" }}
            srcDoc={htmlCode}
          />
          <div className="w-[900px] text-white">
              <p className="p-4 rounded mt-4">
            {feedbackText.length > 0 && (
              <ul className="list-disc pl-6 mt-4">
                {feedbackText.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            )}
            </p>
          </div>
          <div className="text-center text-white p-4 flex flex-col gap-2">
            <h1 className="font-inter font-bold text-2xl ">
              Want to change something?
            </h1>
            <p>
              Click this button to copy LaTeX code and click on the link below
              to redirect to an online editor.
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
              className="px-4 py-2 bg-emerald-400 text-white rounded hover:cursor-pointer hover:bg-emerald-600 font-semibold"
            >
              Copy LaTeX
            </button>
            <a
              href="https://www.overleaf.com" // replace with your desired link
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-sky-600 underline font-bold text-[20px]"
            >
              Open in Overleaf
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeUpgrader;
