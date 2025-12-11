-- Users Table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settings_json JSONB
);

-- Triggers Table
CREATE TABLE Triggers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    count INTEGER DEFAULT 0
);

-- Journals Table
CREATE TABLE Journals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Journal_Triggers Link Table
CREATE TABLE Journal_Triggers (
    journal_id INTEGER REFERENCES Journals(id) ON DELETE CASCADE,
    trigger_id INTEGER REFERENCES Triggers(id) ON DELETE CASCADE,
    PRIMARY KEY (journal_id, trigger_id)
);


-- SobrietyLog Table
CREATE TABLE SobrietyLog (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    current_streak INTEGER,
    relapses_json JSONB
);

-- CBTExercises Table
CREATE TABLE CBTExercises (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- e.g., 'ABC_ANALYSIS', 'AUTOMATIC_THOUGHTS'
    content_json JSONB,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Achievements Table
CREATE TABLE Achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    badge_type VARCHAR(100) NOT NULL, -- e.g., '7_DAYS_SOBER', '30_DAYS_SOBER'
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
