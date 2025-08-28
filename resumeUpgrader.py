

# To run this code you need to install the following dependencies:
# pip install google-genai

import base64
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

resume_text = '915-267-7372 Alejandro Teran atteran@miners.utep.edu El Paso, TX https://github.com/Ateran7595/ https://www.linkedin.com/in/alejandro-teran795/ https://ateran7595-portfolio.vercel.app/ Objective Aspiring Software Engineer pursuing a Bachelor’s in Computer Science at UTEP with hands-on experience building real-world solutions through internships and personal projects. Passionate about full-stack development, mobile apps, and AI-powered tools that improve user experience and accessibility. Eager to continue growing through impactful software engineering roles. Education University of Texas at El Paso (UTEP) Bachelor of Science in Computer Science Work Experience Expected Graduation: Dec 2026 El Paso, TX Software Developer Intern @ Modo Labs 6/2025– 8/2025– Completed training to get to know Modo Labs’ platform and learn how to use AWS-based infrastructure.– Developed an advisor database that automatically filters each student’s assigned advisor based on department and major, integrating Calendly scheduling and real-time contact options.– Developed a scalable events module supporting event registration, calendar sync, and filtering by club or department, improving accessibility for 25,000+ UTEP students. Frontend Developer Volunteer @ Visionary Solutions of Virginia 3/2025- 6/2025– Design and develop accessible, user-friendly web interfaces using Figma and Wix.– Myrole included optimizing performance, ensuring WCAG compliance, collaborating with designers and developers, and enhancing user experience through research and feedback. Projects Space Object Tracker Java, OOP, Design Patterns, JUnit– Java console app tracking LEO objects using Strategy and Template Method patterns.– Modeled extensible objects like Satellite and Debris with filter and impact analysis behaviors.– Maintained test coverage with JUnit-based unit testing. Church Website React, Node.js, Firebase– Launched a responsive site featuring dynamic events, newsletter subscriptions, and automated email updates, boosting engagement among more than 100 users.– Used Firebase for real-time data and EmailJS API to streamline communication. RTrip– AI Travel Destination Finder React, Node.js, GeminiAI, Firebase– Built AI-powered travel app with GeminiAI, Google Places, and Unsplash APIs for rich recommendations.– Enabled secure login via Google Auth; built scalable backend with Firebase + Node.js.. Leadership & Involvement Officer, Web/App Development Club University of Texas at El Paso 1/2025- Present El Paso, TX– Assist students by answering questions, providing guidance, and creating example projects to foster practical learning in web and app development. Organize and lead workshops to develop technical skills and encourage collaboration and networking among peers. Skills Technical skills: Java, JavaScript, ReactJS, Node.js, Express, HTML, CSS, TailwindCSS, GeminiAI. Databases & Tools: Firebase, MongoDB, PostgreSQL, AWS, Git, GitHub, Jira, Postman, JUnit.'

def generate():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.5-flash-lite"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""You are an expert resume writer and career coach. 
Your job is to upgrade resumes to make them more professional, impactful, and ATS-friendly.

The user has uploaded the following resume text:
<<<RESUME_START>>>
{resume_text}
<<<RESUME_END>>>

Please:
1. Rewrite each bullet point with strong action verbs, measurable results (if implied), and concise phrasing.  
2. Improve clarity, grammar, and readability.  
3. Keep section headers (Education, Experience, Skills, Projects, etc.).  
4. Format the final output in clean plain text with bullet points.  
5. Do not invent new jobs, skills, or degrees that are not in the original resume.  
6. Only enhance what is there. If no specific metrics are provided, make implied results more explicit.  

Return your answer in two sections:

=== UPGRADED RESUME ===
[Rewritten Resume Here]

=== FEEDBACK ===
[3–6 short bullet points explaining the key improvements you made.]"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""Please provide the resume text you would like me to upgrade! I'm ready to transform it into a professional, impactful, and ATS-friendly document."""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=resume_text),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config = types.ThinkingConfig(
            thinking_budget=0,
        ),
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    generate()
