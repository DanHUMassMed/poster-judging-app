# Project Plan: Poster Judging Application

This document outlines the plan for creating the poster judging application.

## 1. Project Setup

- **Initialize Git Repository:** Create a new Git repository for the project.
- **Create Project Structure:**
  ```
  /
  |-- backend/
  |   |-- main.py
  |   |-- requirements.txt
  |-- frontend/
  |   |-- public/
  |   |-- src/
  |   |   |-- components/
  |   |   |   |-- JudgingForm.js
  |   |   |   |-- PosterList.js
  |   |   |   |-- Results.js
  |   |   |-- App.js
  |   |   |-- index.js
  |   |-- package.json
  |-- data/
  |   |-- judges.csv
  |   |-- poster-details.csv
  |   |-- scores.csv
  |-- .gitignore
  |-- README.md
  ```
- **Create Virtual Environment:** Set up a virtual environment for the Python backend.
- **Install Dependencies:**
    - **Backend:** `fastapi`, `uvicorn`, `pandas`
    - **Frontend:** `react`, `react-dom`, `react-router-dom`, `axios`

## 2. Backend Development (FastAPI)

- **Create `main.py`:**
    - Implement the FastAPI application.
- **Implement API Endpoints:**
    - **`GET /api/posters`**:
        - Read `data/poster-details.csv`.
        - Return a JSON list of poster details.
    - **`GET /api/judges`**:
        - Read `data/judges.csv`.
        - Return a JSON list of judge names.
    - **`POST /api/scores`**:
        - Receive scoring data as a JSON object.
        - Validate the data.
        - Append the new score to `data/scores.csv`.
        - Return a success message.
    - **`GET /api/scores`**:
        - Read `data/scores.csv`.
        - Return a JSON list of all scores.
- **Data Handling:**
    - Use the `pandas` library to handle CSV file operations.
- **CORS:**
    - Enable CORS to allow requests from the frontend.

## 3. Frontend Development (React)

- **Setup React App:**
    - Use `create-react-app` to initialize the React project in the `frontend` directory.
- **Create Components:**
    - **`App.js`**:
        - Set up routing for the application (`/` for the judging form, `/results` for the scores).
    - **`PosterList.js`**:
        - Fetch poster details from the backend (`/api/posters`).
        - Display the list of posters.
    - **`JudgingForm.js`**:
        - Fetch the list of judges from the backend (`/api/judges`).
        - Create a form with dropdowns for judge and poster selection.
        - Include input fields for each scoring criterion (1-5).
        - Add a text area for comments.
        - Implement a submit handler to `POST` the scores to `/api/scores`.
    - **`Results.js`**:
        - Implement a passcode input field.
        - On correct passcode ('1232'), fetch all scores from `/api/scores`.
        - Display the scores in a table.
        - Implement a button to download the scores as a CSV file.
- **Styling (Tailwind CSS):**
    - Install and configure Tailwind CSS in the `frontend` directory.
    - Create a `tailwind.config.js` file.
    - Use Tailwind utility classes for styling the components.

## 4. Integration and Testing

- **Git:**
    - Create a `.gitignore` file to exclude `node_modules`, `__pycache__`, and other unnecessary files.
- **Testing:**
    - Test all API endpoints using a tool like Postman or `curl`.
    - Test the frontend functionality in the browser.
        - Verify that data is fetched and displayed correctly.
        - Verify that the form submission works.
        - Verify that the results page is password-protected.
        - Verify that the CSV download works.

## 5. Deployment (Optional)

- **Backend:**
    - Deploy the FastAPI application to a hosting service (e.g., Heroku, AWS, Google Cloud).
- **Frontend:**
    - Build the React app for production.
    - Deploy the static files to a hosting service (e.g., Netlify, Vercel, GitHub Pages).
