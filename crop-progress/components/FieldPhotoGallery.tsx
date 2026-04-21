"use client";
import React, { useState, useEffect } from 'react';
import { uploadFieldPhoto, getFieldPhotos, deletePhoto, PhotoData, PhotoUploadResponse } from '../utils/api';

interface FieldPhotoGalleryProps {
  fieldId: number;
}

export const FieldPhotoGallery: React.FC<FieldPhotoGalleryProps> = ({ fieldId }) => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);

  useEffect(() => {
    loadPhotos();
  }, [fieldId]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const fieldPhotos = await getFieldPhotos(fieldId);
      setPhotos(fieldPhotos);
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response: PhotoUploadResponse = await uploadFieldPhoto(fieldId, file);
      setPhotos(prev => [response.photo, ...prev]);
    } catch (error) {
      console.error('Failed to upload photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await deletePhoto(photoId);
      setPhotos(prev => prev.filter(photo => photo.photo_id !== photoId));
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  };

  const getBase64Image = (photoData: string, mimeType: string) => {
    return `data:${mimeType};base64,${photoData}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading field photos...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Field Photos ({photos.length})</h3>
        
        <label style={{
          backgroundColor: '#3D7A2A',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {uploading ? 'Uploading...' : '📷 Upload Photo'}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {photos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
          <div>No photos uploaded yet</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>Upload your first field photo to get started</div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {photos.map((photo) => (
            <div
              key={photo.photo_id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                backgroundColor: 'white'
              }}
              onClick={() => setSelectedPhoto(photo)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{ height: '150px', overflow: 'hidden' }}>
                <img
                  src={getBase64Image(photo.photo_data, photo.mime_type)}
                  alt={photo.notes || `Field photo ${photo.photo_id}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{ padding: '12px' }}>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  {new Date(photo.upload_date).toLocaleDateString()}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  {photo.photo_type || 'General'}
                </div>
                {photo.notes && (
                  <div style={{
                    fontSize: '12px',
                    color: '#888',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {photo.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '18px',
                zIndex: 1
              }}
            >
              ×
            </button>

            <img
              src={getBase64Image(selectedPhoto.photo_data, selectedPhoto.mime_type)}
              alt={selectedPhoto.notes || `Field photo ${selectedPhoto.photo_id}`}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '60vh',
                objectFit: 'contain'
              }}
            />

            <div style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
                {selectedPhoto.photo_type || 'General Photo'}
              </h4>
              
              <div style={{ marginBottom: '12px' }}>
                <strong>Upload Date:</strong> {new Date(selectedPhoto.upload_date).toLocaleDateString()}
              </div>

              {selectedPhoto.notes && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Notes:</strong> {selectedPhoto.notes}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <strong>Photo ID:</strong> {selectedPhoto.photo_id}
              </div>

              <button
                onClick={() => handleDeletePhoto(selectedPhoto.photo_id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🗑️ Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
