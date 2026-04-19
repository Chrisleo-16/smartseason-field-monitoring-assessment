"use client"
import React, { useState, useEffect } from 'react';
import { agentUpdateField, getFieldById, Field, AgentUpdateInput } from '@/utils/api';

interface FieldUpdateProps {
  fieldId?: number;
  onUpdateComplete?: () => void;
}

export const FieldUpdate: React.FC<FieldUpdateProps> = ({ fieldId, onUpdateComplete }) => {
  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateData, setUpdateData] = useState<AgentUpdateInput>({
    current_stage: 'Planted',
    insights: ''
  });

  useEffect(() => {
    if (fieldId) {
      fetchFieldDetails();
    }
  }, [fieldId]);

  const fetchFieldDetails = async () => {
    if (!fieldId) return;
    
    try {
      const fieldData = await getFieldById(fieldId);
      setField(fieldData);
      setUpdateData({
        current_stage: fieldData.current_stage,
        insights: fieldData.insights || ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch field details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldId) return;

    setLoading(true);
    setError('');

    try {
      await agentUpdateField(fieldId, updateData);
      if (onUpdateComplete) {
        onUpdateComplete();
      }
      // Reset form
      setUpdateData({
        current_stage: 'Planted',
        insights: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update field');
    } finally {
      setLoading(false);
    }
  };

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'Planted': return 'Seeds have been planted and are beginning to germinate';
      case 'Growing': return 'Crops are actively growing and developing';
      case 'Ready': return 'Crops are mature and ready for harvesting';
      case 'Harvested': return 'Crops have been harvested';
      default: return '';
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Update Field Status</h2>
      
      {field && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3>{field.field_name}</h3>
          <p><strong>Location:</strong> {field.field_location}</p>
          <p><strong>Crop Type:</strong> {field.crop_type}</p>
          <p><strong>Current Status:</strong> {field.computed_status}</p>
        </div>
      )}

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="current_stage" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Current Stage:
          </label>
          <select
            id="current_stage"
            value={updateData.current_stage}
            onChange={(e) => setUpdateData({...updateData, current_stage: e.target.value as any})}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          >
            <option value="Planted">Planted</option>
            <option value="Growing">Growing</option>
            <option value="Ready">Ready</option>
            <option value="Harvested">Harvested</option>
          </select>
          <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
            {getStageDescription(updateData.current_stage)}
          </small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="insights" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Field Observations & Insights:
          </label>
          <textarea
            id="insights"
            value={updateData.insights}
            onChange={(e) => setUpdateData({...updateData, insights: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              minHeight: '120px',
              resize: 'vertical'
            }}
            placeholder="Enter detailed observations about:
- Crop health and growth progress
- Weather conditions and impact
- Pest or disease observations
- Soil moisture and irrigation needs
- Any challenges or concerns
- Expected timeline for next stage"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {onUpdateComplete && (
            <button
              type="button"
              onClick={onUpdateComplete}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            {loading ? 'Updating...' : 'Update Field'}
          </button>
        </div>
      </form>

      {/* Field Stage Progress Indicator */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Field Growth Stages</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          {['Planted', 'Growing', 'Ready', 'Harvested'].map((stage, index) => (
            <div key={stage} style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: updateData.current_stage === stage ? '#28a745' : '#ddd',
                  color: updateData.current_stage === stage ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 5px',
                  fontWeight: 'bold'
                }}
              >
                {index + 1}
              </div>
              <small>{stage}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldUpdate;
