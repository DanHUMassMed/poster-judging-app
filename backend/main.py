# backend/main.py
import os
import logging
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uuid
import glob
from pydantic import BaseModel


load_dotenv() 
react_app_url = os.getenv("REACT_APP_URL", "http://localhost:3000")


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"{react_app_url}"],  # Allows frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/wormcat3/api/posters")
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

@app.get("/wormcat3/api/judges")
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


class Score(BaseModel):
    Judge: str
    Poster_Title: str
    Scientific_Clarity: int
    Data_Presentation: int
    Visual_Design: int
    Impact: int
    Tiebreaker: int
    Comment: str

@app.post("/wormcat3/api/scores")
def post_score(score: Score):
    """Saves a new score to a uniquely named CSV file."""
    try:
        total_score = score.Scientific_Clarity + score.Data_Presentation + score.Visual_Design + score.Impact + score.Tiebreaker

        # Generate a unique identifier for the filename
        unique_id = uuid.uuid4()
        file_name = f"score_{unique_id}.csv"
        file_path = os.path.join("../data/scores", file_name)

        # Create a DataFrame for the new score
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

        # Save the new score to a new CSV file. 
        # The header is automatically included, and 'index=False' prevents writing the DataFrame index.
        new_score.to_csv(file_path, index=False)

        return {"message": "Score submitted successfully!", "filename": file_name}
    except Exception as e:
        logger.error(f"An error occurred while saving the score: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")
    

@app.get("/wormcat3/api/scores")
def get_scores():
    """
    Reads all individual score_*.csv files from a directory, concatenates them,
    saves the result to a master scores.csv file, and returns all scores.
    """
    try:
        # Define the directory containing individual score files and the output file path
        source_dir = "../data/scores"
        output_file_path = "../data/scores.csv"

        # Create the glob search pattern to find all score files
        search_pattern = os.path.join(source_dir, "score_*.csv")
        score_files = glob.glob(search_pattern)

        logger.info(f"Found {len(score_files)} score files to process in {source_dir}.")

        # If no score files are found, return an empty list.
        if not score_files:
            logger.warning(f"No score files found in {source_dir}. Returning empty list.")
            # Also, attempt to remove the consolidated file if it exists but there are no source files
            if os.path.exists(output_file_path):
                os.remove(output_file_path)
            return []

        # Read all found CSV files into a list of DataFrames
        df_list = [pd.read_csv(file, dtype={'Timestamp': str}) for file in score_files]

        # Concatenate all DataFrames into a single DataFrame
        scores_df = pd.concat(df_list, ignore_index=True)

        # Save the consolidated DataFrame to the main scores.csv file, overwriting it
        scores_df.to_csv(output_file_path, index=False)
        logger.info(f"Successfully consolidated scores into {output_file_path}")

        # Replace NaN with None for JSON compatibility before returning
        scores_df = scores_df.where(pd.notnull(scores_df), None)
        
        return scores_df.to_dict(orient="records")

    except Exception as e:
        logger.error(f"An error occurred while reading and consolidating scores: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")