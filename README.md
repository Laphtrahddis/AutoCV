# AutoCV! - AI-Powered Resume Generator

## Overview

AutoCV! is an AI-powered resume builder designed specifically for Computer Science students. It streamlines the process of creating professional and well-structured CVs by generating LaTeX-based resumes using AI. Users input their details through a user-friendly interface, and the system dynamically compiles a polished LaTeX CV.

## Features

- **AI-Powered Resume Generation**: Uses the Gemini API to generate LaTeX code for different sections of a CV.
- **Modular Form-Based Input**: Users enter their details section-wise (Summary, Skills, Education, Experience, Projects, Achievements, Languages).
- **Animated, Professional UI**: A well-designed and interactive frontend for an optimal user experience.
- **Backend Processing with Node.js/Express**: Handles user inputs and generates LaTeX code for each section before compiling the final document.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion (for animations)
- **Backend**: Node.js, Express.js
- **AI API**: Gemini API for generating LaTeX code
- **Document Formatting**: LaTeX

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js & npm

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Laphtrahddis/AutoCV.git
   cd AutoCV
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the backend**:
   ```bash
   node index.js
   ```
4. **Run the frontend**:
   ```bash
   open http://localhost:4000/ 
   ```

## Usage

1. Fill in the required details in each section.
2. Your resume is ready, get the LaTeX code, and use it as you wish!

## Contributing

Contributions are welcome! Feel free to fork the repository, create feature branches, and submit pull requests.

## Future Enhancements

- Add multiple CV templates
- Integrate PDF generation
- Improve AI-generated content with better prompts

## Contact

For any queries or suggestions, feel free to reach out at [sidd260504@gmail.com](mailto\:sidd260504@gmail.com).

