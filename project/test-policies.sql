-- First, check if RLS is enabled
SELECT relname as table_name, relrowsecurity as rls_enabled
FROM pg_class
WHERE relname = 'profiles';

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users based on id" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create insert policy
CREATE POLICY "Enable insert for authenticated users only" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Create update policy
CREATE POLICY "Enable update for users based on id" 
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create read policy
CREATE POLICY "Enable read access for users based on id" 
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Test if policies are created
SELECT polname, tablename, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';