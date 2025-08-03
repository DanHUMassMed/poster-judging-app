-- Insert one conference
INSERT INTO conferences (name, location, start_date, end_date)
VALUES ('2025 Scientific Poster Conference', 'Boston, MA', '2025-11-01', '2025-11-03');

-- Insert attendees
INSERT INTO attendees (first_name, last_name, email, affiliation, position, conference_id)
VALUES 
('Alice', 'Nguyen', 'alice.nguyen@example.com', 'Harvard University', 'Student', 1),
('Bob', 'Smith', 'bob.smith@example.com', 'MIT', 'Post-doc', 1),
('Carla', 'Rodriguez', 'carla.rodriguez@example.com', 'UCLA', 'PI', 1);

-- Insert posters (Alice and Bob are authors)
INSERT INTO posters (board_location, poster_up_date, poster_down_date, creator_id, poster_title, poster_abstract, judging_session)
VALUES 
('A1', '2025-11-01', '2025-11-02', 1, 'Role of RNA-binding Proteins in Neurogenesis', 'Explores key regulatory proteins in neural development.', 'Session 1'),
('B2', '2025-11-01', '2025-11-02', 2, 'Machine Learning for Microscopy Image Segmentation', 'Using CNNs for high-throughput image analysis.', 'Session 1');

-- Assign judge Carla to both posters
INSERT INTO judging_assignments (judge_id, poster_id, status)
VALUES 
(1, 1, 'Assigned'),
(1, 2, 'Assigned');

-- Insert scoring criteria
INSERT INTO criteria (name, description, max_score)
VALUES
('Scientific Clarity and Rigor', 'Was the scientific question clear and was the methodology appropriate and rigorous?', 5),
('Data Presentation and Interpretation', 'Were the results clearly presented and convincingly interpreted?', 5),
('Visual Design and Organization', 'Was the poster visually clear, well-organized, and easy to follow?', 5),
('Impact and Innovation', 'Did the poster present novel insights or potential impact for the field?', 5),
('Tiebreaker', 'Was there something special about the poster/presenter we could consider in case of a tie?', 5);

-- Insert scores and score_criteria for Poster 1
INSERT INTO scores (assignment_id, comment)
VALUES (1, 'Strong work and great clarity throughout');

-- Link each criterion to a score with a specific value
INSERT INTO score_criteria (score_id, criterion_id, score)
VALUES 
(1, 1, 5),
(1, 2, 4),
(1, 3, 4),
(1, 4, 5),
(1, 5, 3);

-- Insert scores and score_criteria for Poster 2
INSERT INTO scores (assignment_id, comment)
VALUES (2, 'Innovative approach, but data section was hard to follow');

INSERT INTO score_criteria (score_id, criterion_id, score)
VALUES 
(2, 1, 4),
(2, 2, 3),
(2, 3, 5),
(2, 4, 5),
(2, 5, 4);