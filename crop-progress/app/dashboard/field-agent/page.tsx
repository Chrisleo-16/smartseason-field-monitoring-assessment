"use client"
import React, { useState, useEffect } from 'react';
import { getFieldsByUser, agentUpdateField, Field, AgentUpdateInput } from '@/utils/api';

export default function FieldAgentDashboard() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [updateData, setUpdateData] = useState<AgentUpdateInput>({
    current_stage: 'Planted',
    insights: ''
  });
  const [userId, setUserId] = useState<number>(1); // This would come from auth context

  useEffect(() => {
    fetchAssignedFields();
  }, [userId]);

  const fetchAssignedFields = async () => {
    try {
      const data = await getFieldsByUser(userId);
      setFields(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assigned fields');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField) return;

    try {
      await agentUpdateField(selectedField.field_id, updateData);
      setSelectedField(null);
      setUpdateData({ current_stage: 'Planted', insights: '' });
      fetchAssignedFields();
    } catch (err: any) {
      setError(err.message || 'Failed to update field');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'At Risk': return 'orange';
      case 'Completed': return 'blue';
      default: return 'gray';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Planted': return '#8B4513';
      case 'Growing': return '#228B22';
      case 'Ready': return '#FFD700';
      case 'Harvested': return '#FF6347';
      default: return '#666';
    }
  };

  if (loading) return <div>Loading...</div>;

  // Calculate summaries for assigned fields
  const totalFields = fields.length;
  const statusBreakdown = fields.reduce((acc, field) => {
    acc[field.computed_status] = (acc[field.computed_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const stageBreakdown = fields.reduce((acc, field) => {
    acc[field.current_stage] = (acc[field.current_stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeFields = statusBreakdown['Active'] || 0;
  const atRiskFields = statusBreakdown['At Risk'] || 0;
  const completedFields = statusBreakdown['Completed'] || 0;
  const readyForHarvest = stageBreakdown['Ready'] || 0;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Field Agent Dashboard - Overview</h1>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>My Fields</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff' }}>{totalFields}</div>
        </div>
        
        <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Active</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#28a745' }}>{activeFields}</div>
        </div>
        
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>At Risk</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#ffc107' }}>{atRiskFields}</div>
        </div>
        
        <div style={{ backgroundColor: '#e7f3ff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#004085' }}>Ready to Harvest</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#17a2b8' }}>{readyForHarvest}</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>My Fields Status</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {Object.entries(statusBreakdown).map(([status, count]) => (
            <div key={status} style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: getStatusColor(status),
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>
                {status}: {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Stage Breakdown */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Growth Stages</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {Object.entries(stageBreakdown).map(([stage, count]) => (
            <div key={stage} style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: getStageColor(stage),
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>
                {stage}: {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2>My Assigned Fields</h2>
      
      {/* User ID selector for demo purposes */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="userId">User ID: </label>
        <select
          id="userId"
          value={userId}
          onChange={(e) => setUserId(parseInt(e.target.value))}
          style={{ padding: '8px', marginLeft: '10px' }}
        >
          <option value={1}>User 1</option>
          <option value={2}>User 2</option>
          <option value={3}>User 3</option>
        </select>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {fields.map((field) => (
          <div
            key={field.field_id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>{field.field_name}</h3>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Location:</strong> {field.field_location}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Crop Type:</strong> {field.crop_type}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Current Stage:</strong>
              <span
                style={{
                  backgroundColor: getStageColor(field.current_stage),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginLeft: '8px'
                }}
              >
                {field.current_stage}
              </span>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Status:</strong>
              <span
                style={{
                  backgroundColor: getStatusColor(field.computed_status),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginLeft: '8px'
                }}
              >
                {field.computed_status}
              </span>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Planting Date:</strong> {new Date(field.planting_date).toLocaleDateString()}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Harvesting Date:</strong> {new Date(field.harvesting_date).toLocaleDateString()}
            </div>
            
            {field.insights && (
              <div style={{ marginBottom: '15px' }}>
                <strong>Latest Insights:</strong>
                <p style={{ margin: '5px 0', fontStyle: 'italic', color: '#666' }}>
                  {field.insights}
                </p>
              </div>
            )}
            
            <button
              onClick={() => {
                setSelectedField(field);
                setUpdateData({
                  current_stage: field.current_stage,
                  insights: field.insights || ''
                });
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
                width: '100%'
              }}
            >
              Update Field Status
            </button>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No fields assigned to you. Contact your admin for field assignments.
        </div>
      )}

      {/* Update Field Modal */}
      {selectedField && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginTop: 0 }}>Update Field: {selectedField.field_name}</h2>
            
            <form onSubmit={handleUpdateField}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="current_stage">Current Stage:</label>
                <select
                  id="current_stage"
                  value={updateData.current_stage}
                  onChange={(e) => setUpdateData({...updateData, current_stage: e.target.value as any})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  required
                >
                  <option value="Planted">Planted</option>
                  <option value="Growing">Growing</option>
                  <option value="Ready">Ready</option>
                  <option value="Harvested">Harvested</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="insights">Field Observations/Insights:</label>
                <textarea
                  id="insights"
                  value={updateData.insights}
                  onChange={(e) => setUpdateData({...updateData, insights: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }}
                  placeholder="Enter your observations about the field conditions, crop health, weather impact, etc."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedField(null);
                    setUpdateData({ current_stage: 'Planted', insights: '' });
                  }}
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
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  Update Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}