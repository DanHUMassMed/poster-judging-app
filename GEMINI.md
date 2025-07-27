# Product Description

This is an application for judging posters at an academic conference. The application will allow a user to select a judge. Which is a list of Names plus an Anonymous User. And also select from a list of poster titles. given this information the judge must score the poster using the following criteria

#### poster judging criteria

- Please score 1 (low) to  5(high) for the following criteria:

- Scientific Clarity and Rigor (1-5)
    - Was the scientific question clear and was the methodology appropriate and rigorous?

- Data Presentation and Interpretation (1-5)
    - Were the results clearly presented and convincingly interpreted?

- Visual Design and Organization (1-5)
    - Was the poster visually clear, well-organized, and easy to follow?

- Impact and Innovation (1-5)
    - Did the poster present novel insights or potential impact for the field?

- Tiebreaker (1-5)
    - Was there something special about the poster/presenter we could consider in case of a tie?

# AIs developer instructions
- Plan ahead think sequentially all the required steps
- Use best practices for coding

- 
# Tech Stack
- Frontend  ReactJS
- Backend Fast API
- Database is a directory of csv files


# Backend API
- getPosterDetails() 
    - Returns a list of details as json {Poster_Id,Session,Name,Affiliation,Poster_Title,Position}
    - The details are read from a cvs file in the directory data/poster-details.csv

- getJudges() 
    - Returns a list of Judges (string) 
    - The judges are read from a cvs file in the directory data/judges.csv

- postScores(scores)
    - {Timestamp,Judge,Poster_Title,Scientific_Clarity,Data_Presentation,Visual_Design,Impact,Tiebreaker,Total,Comment}

- getAllScores()
    - Returns a list of all the scores in data/scores.csv

# Frontend

- The frontend presents a visually attractive screen for looking up the judges and posters and scoring
- a separate page for displaying the results
    - this page accepts a passcode that is insecure '1232' hardcoded 
    - presents all the data in data/scores in a scrollable format
    - allows the user to download as csv