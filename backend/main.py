# backend/main.py

import logging
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/posters")
def get_posters():
    """Returns a list of poster details from the CSV file."""
    try:
        logger.info("Reading poster details from data/poster-details.csv")
        posters_df = pd.read_csv("../data/poster-details.csv", parse_dates=["Date"])
        #posters_df['Date'] = pd.to_datetime(posters_df['Date'], format='%m/%d/%y') # Convert 'Date' column to datetime objects
        posters_df = posters_df.sort_values(by=['Date', 'Name']).reset_index(drop=True)
        return posters_df.to_dict(orient="records")
    except FileNotFoundError:
        logger.error("data/poster-details.csv not found")
        raise HTTPException(status_code=404, detail="Poster details file not found.")
    except Exception as e:
        logger.error(f"An error occurred while reading poster details: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.get("/api/judges")
def get_judges():
    """Returns a list of judges from the CSV file."""
    try:
        logger.info("Reading judges from data/judges.csv")
        judges_df = pd.read_csv("../data/judges.csv")
        return judges_df["Judge"].tolist()
    except FileNotFoundError:
        logger.error("data/judges.csv not found")
        raise HTTPException(status_code=404, detail="Judges file not found.")
    except Exception as e:
        logger.error(f"An error occurred while reading judges: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

from pydantic import BaseModel

class Score(BaseModel):
    Judge: str
    Poster_Title: str
    Scientific_Clarity: int
    Data_Presentation: int
    Visual_Design: int
    Impact: int
    Tiebreaker: int
    Comment: str

@app.post("/api/scores")
def post_score(score: Score):
    """Saves a new score to the CSV file."""
    try:
        logger.info(f"Received score from {score.Judge} for {score.Poster_Title}")
        total_score = score.Scientific_Clarity + score.Data_Presentation + score.Visual_Design + score.Impact + score.Tiebreaker
        
        file_path = "../data/scores.csv"
        
        new_score = pd.DataFrame([{
            "Timestamp": pd.Timestamp.now(),
            "Judge": score.Judge,
            "Poster_Title": score.Poster_Title,
            "Scientific_Clarity": score.Scientific_Clarity,
            "Data_Presentation": score.Data_Presentation,
            "Visual_Design": score.Visual_Design,
            "Impact": score.Impact,
            "Tiebreaker": score.Tiebreaker,
            "Total": total_score,
            "Comment": score.Comment
        }])

        # Check if the file exists to determine if we need to write the header
        try:
            pd.read_csv(file_path)
            write_header = False
        except FileNotFoundError:
            write_header = True

        new_score.to_csv(file_path, mode='a', header=write_header, index=False)
        
        return {"message": "Score submitted successfully!"}
    except Exception as e:
        logger.error(f"An error occurred while saving the score: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.get("/api/scores")
def get_scores():
    """Returns a list of all scores from the CSV file."""
    try:
        logger.info("Reading scores from data/scores.csv")
        scores_df = pd.read_csv("../data/scores.csv")
        # Replace NaN with None for JSON compatibility
        scores_df = scores_df.where(pd.notnull(scores_df), None)
        return scores_df.to_dict(orient="records")
    except FileNotFoundError:
        logger.error("data/scores.csv not found")
        return [] # Return empty list if no scores yet
    except Exception as e:
        logger.error(f"An error occurred while reading scores: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")
