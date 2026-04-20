-- Create field photos table
CREATE TABLE IF NOT EXISTS field_photos (
    photo_id SERIAL PRIMARY KEY,
    field_id INTEGER NOT NULL REFERENCES field_management(field_id) ON DELETE CASCADE,
    photo_data TEXT NOT NULL, -- Base64 encoded image data
    mime_type VARCHAR(50) NOT NULL,
    photo_type VARCHAR(50) DEFAULT 'general', -- 'general', 'planting', 'growth', 'harvest', 'issue'
    notes TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER REFERENCES users(user_id),
    ai_analysis JSONB -- Store AI analysis results
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_field_photos_field_id ON field_photos(field_id);
CREATE INDEX IF NOT EXISTS idx_field_photos_upload_date ON field_photos(upload_date);
CREATE INDEX IF NOT EXISTS idx_field_photos_photo_type ON field_photos(photo_type);
