-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    rent INTEGER NOT NULL,
    due_date INTEGER NOT NULL CHECK (due_date BETWEEN 1 AND 31),
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create property_amenities table
CREATE TABLE IF NOT EXISTS public.property_amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    included BOOLEAN DEFAULT false,
    monthly_charge INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS properties_owner_id_idx ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS property_amenities_property_id_idx ON public.property_amenities(property_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;

-- Create policies for properties
CREATE POLICY "Owners can create their own properties" 
    ON public.properties FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can view their own properties" 
    ON public.properties FOR SELECT 
    TO authenticated 
    USING (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own properties" 
    ON public.properties FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own properties" 
    ON public.properties FOR DELETE 
    TO authenticated 
    USING (auth.uid() = owner_id);

-- Create policies for property_amenities
CREATE POLICY "Property owners can manage amenities" 
    ON public.property_amenities 
    TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM public.properties 
        WHERE id = property_id AND owner_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.properties 
        WHERE id = property_id AND owner_id = auth.uid()
    ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER set_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_property_amenities_updated_at
    BEFORE UPDATE ON public.property_amenities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();