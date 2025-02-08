import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
const API_KEY = process.env.GEMINI_API_KEY;


import express from "express";
import bodyParser from "body-parser";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..'); 
import { readFile } from 'fs/promises';

let completeCV = "";
const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files (CSS, JS, images)
app.use(express.static("public"));

// Route for the form page
app.get("/", (req, res) => {
  res.render("index"); // index.ejs should contain your form
});

// Handle form submission
app.post("/submit", async (req, res) => {
  try {
    const formData = req.body;

    // Define prompts for each CV section
    const prompts = [
      {
        title: "Personal Information",
        prompt: `
                    Name: ${formData.name}
                    Address: ${formData.address}
                    Email: ${formData.email}
                    Phone Number: ${formData.phone}
                    LinkedIn: ${formData.linkedin}
                    GitHub: ${formData.github}
                `,
      },
      {
        title: "Summary",
        prompt: `${formData.summary}`,
      },
      {
        title: "Technical Skills",
        prompt: `${formData.skills}`,
      },
      {
        title: "Education",
        prompt: `${formData.education}`,
      },
      {
        title: "Experience",
        prompt: `${formData.experience}`,
      },
      {
        title: "Projects",
        prompt: `${formData.projects}`,
      },
      {
        title: "Achievements",
        prompt: `${formData.achievements}`,
      },
      {
        title: "Languages",
        prompt: `${formData.languages}`,
      },
    ];

    completeCV = String.raw`\documentclass[10pt, letterpaper]{article}

% Packages:
\usepackage[
    ignoreheadfoot, % set margins without considering header and footer
    top=2 cm, % seperation between body and page edge from the top
    bottom=2 cm, % seperation between body and page edge from the bottom
    left=2 cm, % seperation between body and page edge from the left
    right=2 cm, % seperation between body and page edge from the right
    footskip=1.0 cm, % seperation between body and footer
    % showframe % for debugging 
]{geometry} % for adjusting page geometry
\usepackage{titlesec} % for customizing section titles
\usepackage{tabularx} % for making tables with fixed width columns
\usepackage{array} % tabularx requires this
\usepackage[dvipsnames]{xcolor} % for coloring text
\definecolor{primaryColor}{RGB}{0, 79, 144} % define primary color
\usepackage{enumitem} % for customizing lists
\usepackage{fontawesome5} % for using icons
\usepackage{amsmath} % for math
\usepackage[
    pdftitle={${formData.name}'s CV},
    pdfauthor={${formData.name}},
    pdfcreator={LaTeX with RenderCV},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref} % for links, metadata and bookmarks
\usepackage[pscoord]{eso-pic} % for floating text on the page
\usepackage{calc} % for calculating lengths
\usepackage{bookmark} % for bookmarks
\usepackage{lastpage} % for getting the total number of pages
\usepackage{changepage} % for one column entries (adjustwidth environment)
\usepackage{paracol} % for two and three column entries
\usepackage{ifthen} % for conditional statements
\usepackage{needspace} % for avoiding page brake right after the section title
\usepackage{iftex} % check if engine is pdflatex, xetex or luatex

% Ensure that generate pdf is machine readable/ATS parsable:
\ifPDFTeX
    \input{glyphtounicode}
    \pdfgentounicode=1
    % \usepackage[T1]{fontenc} % this breaks sb2nov
    \usepackage[utf8]{inputenc}
    \usepackage{lmodern}
\fi



% Some settings:
\AtBeginEnvironment{adjustwidth}{\partopsep0pt} % remove space before adjustwidth environment
\pagestyle{empty} % no header or footer
\setcounter{secnumdepth}{0} % no section numbering
\setlength{\parindent}{0pt} % no indentation
\setlength{\topskip}{0pt} % no top skip
\setlength{\columnsep}{0cm} % set column seperation
\makeatletter
\let\ps@customFooterStyle\ps@plain % Copy the plain style to customFooterStyle
\patchcmd{\ps@customFooterStyle}{\thepage}{
    \color{gray}\textit{\small ${formData.name} - Page \thepage{} of \pageref*{LastPage}}
}{}{} % replace number by desired string
\makeatother
\pagestyle{customFooterStyle}

\titleformat{\section}{\needspace{4\baselineskip}\bfseries\large}{}{0pt}{}[\vspace{1pt}\titlerule]

\titlespacing{\section}{
    % left space:
    -1pt
}{
    % top space:
    0.3 cm
}{
    % bottom space:
    0.2 cm
} % section title spacing

\renewcommand\labelitemi{$\vcenter{\hbox{\small$\bullet$}}$} % custom bullet points
\newenvironment{highlights}{
    \begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=0 cm + 10pt
    ]
}{
    \end{itemize}
} % new environment for highlights


\newenvironment{highlightsforbulletentries}{
    \begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=10pt
    ]
}{
    \end{itemize}
} % new environment for highlights for bullet entries

\newenvironment{onecolentry}{
    \begin{adjustwidth}{
        0 cm + 0.00001 cm
    }{
        0 cm + 0.00001 cm
    }
}{
    \end{adjustwidth}
} % new environment for one column entries

\newenvironment{twocolentry}[2][]{
    \onecolentry
    \def\secondColumn{#2}
    \setcolumnwidth{\fill, 4.5 cm}
    \begin{paracol}{2}
}{
    \switchcolumn \raggedleft \secondColumn
    \end{paracol}
    \endonecolentry
} % new environment for two column entries

\newenvironment{header}{
    \setlength{\topsep}{0pt}\par\kern\topsep\centering\linespread{1.5}
}{
    \par\kern\topsep
} % new environment for the header

\newcommand{\placelastupdatedtext}{% \placetextbox{<horizontal pos>}{<vertical pos>}{<stuff>}
  \AddToShipoutPictureFG*{% Add <stuff> to current page foreground
    \put(
        \LenToUnit{\paperwidth-2 cm-0.2 cm+0.05cm},
        \LenToUnit{\paperheight-1.0 cm}
    ){\vtop{{\null}\makebox[0pt][c]{
        \small\color{gray}\textit{}\hspace{\widthof{Last updated in February 2025}}
    }}}%
  }%
}%

% save the original href command in a new command:
\let\hrefWithoutArrow\href

% new command for external links:
\renewcommand{\href}[2]{\hrefWithoutArrow{#1}{\ifthenelse{\equal{#2}{}}{ }{#2 }\raisebox{.15ex}{\footnotesize \faExternalLink*}}}


\begin{document}
    \newcommand{\AND}{\unskip
        \cleaders\copy\ANDbox\hskip\wd\ANDbox
        \ignorespaces
    }
    \newsavebox\ANDbox
    \sbox\ANDbox{}

    \placelastupdatedtext
    \begin{header}
        \textbf{\fontsize{24 pt}{24 pt}\selectfont ${formData.name}}

        \vspace{0.3 cm}

        \normalsize
        \mbox{{\color{black}\footnotesize\faMapMarker*}\hspace*{0.13cm}${formData.address}}%
        \kern 0.25 cm%
        \AND%
        \kern 0.25 cm%
        \mbox{\href{mailto:${formData.email}}{\color{black}{\footnotesize\faEnvelope[regular]}\hspace*{0.13cm}${formData.email}}}%
        \kern 0.25 cm%
        \AND%
        \kern 0.25 cm%
        \mbox{\href{tel:+91-${formData.phone}}{\color{black}{\footnotesize\faPhone*}\hspace*{0.13cm}${formData.phone}}}%
        \kern 0.25 cm%
        \AND%
        \kern 0.25 cm%

        \mbox{\href{https://www.linkedin.com/in/${formData.linkedin}/}{\color{black}{\footnotesize\faLinkedinIn}\hspace*{0.13cm}${formData.linkedin}}}%
        \kern 0.25 cm%
        \AND%
        \kern 0.25 cm%
        \mbox{\href{https://github.com/${formData.github}}{\color{black}{\footnotesize\faGithub}\hspace*{0.13cm}${formData.github}}}%
    \end{header}

    \vspace{0.3 cm - 0.3 cm}`;

    let count = 0;

    // Iterate over each prompt and call the Gemini model
    for (const section of prompts) {
      if (count == 0) {
        count++;
        continue;
      }
      if (count == 1) {
        const prompt = String.raw`
                Generate a LaTeX Summary Section for a resume based on the user’s input. The output should strictly follow these constraints:

Concise Summary – Generate a professional summary within 70 words based only on the provided user input, dont cut off, end it normally. prefer using data which an interviewer will like to read first from the provided input.
No Hallucinations – Do not invent any details; use only the given information.
Plain Text Response – Output the LaTeX code without formatting it inside a code block.
LaTeX Formatting Consistency – Maintain proper indentation and syntax.
use \% where you want to print % to avoid commenting the rest of the line!
No Extra Text – Do not include explanations, comments, greetings, or any additional text beyond the required LaTeX code.
about the user: ${section.prompt}, you can use user's ${formData.experience},${formData.projects},${formData.achievements}, to retreive relevant summary worthy info and generate a summary. remember, less than 70 words!.
LaTeX Code Template:

\section*{Summary}
{summary_generated}
\vspace{0.0 cm}
                `;
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        // console.log(responseText);
        completeCV += `\n\n${responseText}`;
        count++;
        continue;
      }
      if (count == 2) {
        const prompt = String.raw`
Generate a LaTeX Technical Skills Section for a resume based on the user’s provided skills. The output must adhere to the following constraints:

Format all provided information to be nice and concise for a PERFECT resume..
Consistent LaTeX Formatting – Maintain professional formatting with clear indentation.
Plain Text Response – Reply without a code block to ensure direct usability.
No Explanations or Extra Text – Output only the LaTeX code without greetings, comments, or any additional information.
Use the user-provided skills to dynamically generate the LaTeX code below.
use \% where you want to print % to avoid commenting the rest of the line!
what you know about the user's skills: ${formData.skills}
LaTeX Code Template
\section*{Technical Skills}
\setlength{\itemsep}{0pt} % Remove extra space between list items
\begin{itemize}
{generated_skills_list}
\end{itemize}
                `;
        console.log(formData.skills);
        console.log(prompt);
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        // console.log(responseText);
        completeCV += `\n\n${responseText}`;
        count++;
        continue;
      }
      if (count == 3) {
        const prompt = String.raw`Generate a LaTeX Education Section for a resume based on the user's provided academic details. The output must strictly follow these constraints:

Use Only Provided Details – Do not infer or assume extra information beyond what is given.
Concise Formatting – The education section should be short and to the point. Ignore any unnecessary or overly detailed input. From Latest education to older. not the other way around.
LaTeX Formatting Consistency – Maintain proper indentation and structured output.
Plain Text Response – Reply without a code block to ensure direct usability.
No Explanations or Extra Text – Output only the LaTeX code without greetings, comments, or any additional information.
Use only these details to generate the LaTeX code below. Ignore any additional information beyond the provided fields.
use \% where you want to print % to avoid commenting the rest of the line!

the user education input is: ${formData.education}

LaTeX Code Template
\section*{Education}

\begin{itemize}
\item \textbf{{degree}} \
\textit{{university}} \hfill {graduation_year} \
\textbf{CGPA:} {cgpa}
\item \textbf{Secondary \& Senior Secondary Education} {Board:} {board} {Class 12 Percentage:} {class_12_percentage} {Class 10 Percentage:} {class_10_percentage}  
\end{itemize}
`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        // console.log(responseText);
        completeCV += `\n\n${responseText}`;
        count++;
        continue;
      }
      if (count == 4) {
        const prompt = String.raw`
                Generate a LaTeX Experience Section for a fresher's resume using the provided details. The output must strictly follow these constraints:

No Hallucinations – Use only the provided information. Do not generate job titles, companies, or descriptions that weren’t given.
Slight Inference for Resume-Worthy Output – Minor inferences (e.g., formatting, concise phrasing) are allowed, but do not fabricate experience.
Concise & Professional – The experience section should be brief, well-structured, and impactful. Keep the content from latest to older. not the other way around.
Proper LaTeX Formatting – Maintain indentation, bullet points, and logical structure.
Plain Text Response – Reply without a code block to ensure direct usability.
No Extra Text – Output only the LaTeX code, no explanations, greetings, or comments.
use \% where you want to print % to avoid commenting the rest of the line!
Use only these details to generate the LaTeX code below. Ignore any additional information beyond the provided fields.
You can create a new section for Activities if only you find its applicable. (example: Volunteer Experience, Leadership Experience, etc.)
user data: ${formData.experience}
LaTeX Code Template
\section*{Experience}

\begin{itemize}
\setlength{\itemsep}{0pt} % Remove space between items
\foreach \experience in {experiences} {  
    \item \textbf{\experience.title} \hfill \textbf{\experience.company (\experience.location)} \\  
    \textit{\experience.project} \hfill \experience.start_date - \experience.end_date \\  
    \foreach \responsibility in \experience.responsibilities {  
        - \responsibility \\  
    }  
}  

\end{itemize}`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        // console.log(responseText);
        completeCV += `\n\n${responseText}`;
        count++;
        continue;
      }
      if (count == 5) {
        const prompt = String.raw`
                Generate a **LaTeX Projects Section** for a resume using the provided project details. The output must strictly follow these constraints:

1. **No Hallucinations** – Use **only** the provided information. Do **not** generate project names, descriptions, or skills that weren’t given.
2. **Slight Inference for Resume-Worthy Output** – Minor inferences (e.g., proper phrasing for clarity) are allowed, but do **not** fabricate projects or skills.
3. **Concise & Professional** – Ensure a **brief, structured, and impactful** project section. Keep the content latest to older, not the other way around
4. **Proper LaTeX Formatting** – Maintain **enumeration, indentation, bullet points, and logical structure**.
5. **Clickable Project Links** – Use \href{} to ensure links are clickable in the final PDF.
use \% where you want to print % to avoid commenting the rest of the line!
6. **Plain Text Response** – Reply **without a code block** to ensure direct usability.
7. **No Extra Text** – Output **only the LaTeX code**, no explanations, greetings, or comments.

user data: ${formData.projects}

### **LaTeX Code Template**

\section*{Projects}  

\begin{enumerate}  

    \foreach \project in {projects} {  
        \item \textbf{\project.title} \hfill \project.date \\  
        \project.description \\  
        \textbf{Skills Used:} \foreach \skill in \project.skills_used { \textbf{\skill}, } \\  
        \href{\project.link}{\faExternalLink \, View Project} % Replace with the actual link  
    }  

\end{enumerate}  `;
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        // console.log(responseText);
        completeCV += `\n\n${responseText}`;
        count++;
        continue;
      }
      if (count == 6) {
        const prompt = String.raw`Generate a **LaTeX Achievements Section** for a resume using the provided achievement details. The output must strictly follow these constraints:

1. **No Hallucinations** – Use **only** the provided achievements. Do **not** generate extra accomplishments or modify the given details.
2. **Concise & Relevant** – Keep the section **brief and professional**, avoiding excessive detail if the user has provided any. format it from latest to older, not the other way around.
3. **Proper LaTeX Formatting** – Maintain **bullet points, indentation, and logical structure**.
4. **Plain Text Response** – Reply **without a code block** to ensure direct usability.
use \% where you want to print % to avoid commenting the rest of the line!
5. **No Extra Text** – Output **only the LaTeX code**, no explanations, greetings, or comments.

user's acheivements: ${formData.achievements}

### **LaTeX Code Template**

\section*{Achievements}  
\begin{itemize}  
    \foreach \achievement in {achievements} {  
        \item \achievement  
    }  
\end{itemize}  
`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        // console.log(responseText);
        completeCV += `\n\n${responseText}`;
        count++;
        continue;
      }
      if (count == 7) {
        const prompt = String.raw`Generate a **LaTeX Languages Section** for a resume using the provided language details. The output must strictly follow these constraints:

1. **No Hallucinations** – Use **only** the given languages. Do **not** infer proficiency levels unless explicitly stated.  
2. **Concise & Professional** – List languages in a **clear, readable format in a single line!**.  
3. **Proper LaTeX Formatting** , make sure the languages are not bullet points, list all langs in a single line. 
4. **Plain Text Response** – Reply **without a code block** to ensure direct usability.  
use \% where you want to print % to avoid commenting the rest of the line!
5. **No Extra Text** – Output **only the LaTeX code**, no explanations, greetings, or comments.  
IMP: Do not forget the \end{Document} in the end.

user's languages: ${formData.languages}

### **LaTeX Code Template**  

\section*{Languages}  
{languages}  

\end{document}  
`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        // console.log(responseText);
        completeCV += `\n\n${responseText}`;
        count++;
        continue;
      }
    }

    // Send the concatenated response back to the frontend
    res.render("result", { output: completeCV.trim() });
  } catch (error) {
    console.error("Error:", error);
    res.send("An error occurred!");
  }
  console.log('Calling saveCVToFile...');
  async function saveCVToFile(completeCV) {
    try {
        console.log('Inside saveCVToFile function'); // Log when function starts

        const filePath = join(__dirname, 'code.tex');
        console.log('File path resolved:', filePath); // Log resolved path
        
        await writeFile(filePath, completeCV);
        console.log('CV saved successfully as code.tex'); // Log success
    } catch (err) {
        console.error('Error writing file:', err); // Log error if any
    }
}
saveCVToFile(completeCV);



async function convertFileToBase64() {
    try {
        const filePath = join(__dirname, 'code.tex'); // Path to your file
        console.log('Reading file:', filePath);

        const fileBuffer = await readFile(filePath); // Read file as a buffer
        const base64String = fileBuffer.toString('base64'); // Convert buffer to Base64

        console.log('Base64 Encoded String:', base64String); // Log the output
        return base64String; // Return if needed elsewhere
    } catch (err) {
        console.error('Error reading file:', err);
    }
}

convertFileToBase64();

});


app.get('/code.tex', (req, res) => {
    res.sendFile(path.join(__dirname, 'code.tex'));
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
