-- Supabase Schema for Neuro-Nest

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table (Linked to Auth Users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    dream_goal TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Trees Table
CREATE TABLE IF NOT EXISTS learning_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_goal TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_guest BOOLEAN DEFAULT FALSE
);

-- Nodes Table (Individual Skills)
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY, -- AI generated ID (e.g., node-1)
    tree_id UUID REFERENCES learning_trees(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'in-progress', 'mastered')),
    level INTEGER DEFAULT 1,
    position_x FLOAT,
    position_y FLOAT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Edges Table (Relationships)
CREATE TABLE IF NOT EXISTS edges (
    id TEXT PRIMARY KEY,
    tree_id UUID REFERENCES learning_trees(id) ON DELETE CASCADE,
    source_id TEXT REFERENCES nodes(id) ON DELETE CASCADE,
    target_id TEXT REFERENCES nodes(id) ON DELETE CASCADE
);

-- Node Progress & Quizzes
CREATE TABLE IF NOT EXISTS node_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    node_id TEXT REFERENCES nodes(id) ON DELETE CASCADE,
    quiz_data JSONB, -- Stores the generated questions
    attempts INTEGER DEFAULT 0,
    best_score FLOAT,
    is_passed BOOLEAN DEFAULT FALSE,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_progress ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for development)
CREATE POLICY "Users can view their own profiles" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profiles" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own trees" ON learning_trees FOR SELECT USING (auth.uid() = user_id OR is_guest = true);
CREATE POLICY "Users can insert their own trees" ON learning_trees FOR INSERT WITH CHECK (auth.uid() = user_id OR is_guest = true);

CREATE POLICY "Anyone can view nodes of public/guest trees" ON nodes FOR SELECT USING (true);
CREATE POLICY "Anyone can view edges of public/guest trees" ON edges FOR SELECT USING (true);

CREATE POLICY "Users can track their own progress" ON node_progress FOR ALL USING (auth.uid() = user_id);
