"use client"
import React, { useState, useEffect } from 'react';
import { getAllFields, createField, deleteField, Field, CreateFieldInput } from '@/utils/api';

export default function AdminDashboard() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateFieldInput>({
    field_name: '',
    field_location: '',
    crop_type: '',
    planting_date: '',
    harvesting_date: '',
    user_id: 0,
    insights: '',
    status_description: '',
    current_stage: 'Planted'
  });

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const data = await getAllFields();
      setFields(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createField(formData);
      setShowCreateForm(false);
      setFormData({
        field_name: '',
        field_location: '',
        crop_type: '',
        planting_date: '',
        harvesting_date: '',
        user_id: 0,
        insights: '',
        status_description: '',
        current_stage: 'Planted'
      });
      fetchFields();
    } catch (err: any) {
      setError(err.message || 'Failed to create field');
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      try {
        await deleteField(fieldId);
        fetchFields();
      } catch (err: any) {
        setError(err.message || 'Failed to delete field');
      }
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
      case 'Planted': return '#007bff';
      case 'Growing': return '#28a745';
      case 'Ready': return '#ffc107';
      case 'Harvested': return '#dc3545';
      default: return 'gray';
    }
  };

  if (loading) return <div>Loading...</div>;

  // Calculate summaries
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard - Overview</h1>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Total Fields</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff' }}>{totalFields}</div>
        </div>
        
        <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Active Fields</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#28a745' }}>{activeFields}</div>
        </div>
        
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>At Risk Fields</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#ffc107' }}>{atRiskFields}</div>
        </div>
        
        <div style={{ backgroundColor: '#cce5ff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#004085' }}>Completed Fields</h3>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff' }}>{completedFields}</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Status Breakdown</h3>
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
        <h3>Growth Stage Breakdown</h3>
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

      <h2>Field Management</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {showCreateForm ? 'Cancel' : 'Create New Field'}
      </button>

      {showCreateForm && (
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '5px'
        }}>
          <h3>Create New Field</h3>
          <form onSubmit={handleCreateField}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Field Name"
                value={formData.field_name}
                onChange={(e) => setFormData({...formData, field_name: e.target.value})}
                required
                style={{ padding: '8px' }}
              />
              <input
                type="text"
                placeholder="Field Location"
                value={formData.field_location}
                onChange={(e) => setFormData({...formData, field_location: e.target.value})}
                required
                style={{ padding: '8px' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Crop Type"
                value={formData.crop_type}
                onChange={(e) => setFormData({...formData, crop_type: e.target.value})}
                required
                style={{ padding: '8px' }}
              />
              <input
                type="number"
                placeholder="User ID"
                value={formData.user_id || ''}
                onChange={(e) => setFormData({...formData, user_id: parseInt(e.target.value) || 0})}
                required
                style={{ padding: '8px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input
                type="date"
                placeholder="Planting Date"
                value={formData.planting_date}
                onChange={(e) => setFormData({...formData, planting_date: e.target.value})}
                required
                style={{ padding: '8px' }}
              />
              <input
                type="date"
                placeholder="Harvesting Date"
                value={formData.harvesting_date}
                onChange={(e) => setFormData({...formData, harvesting_date: e.target.value})}
                required
                style={{ padding: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <select
                value={formData.current_stage}
                onChange={(e) => setFormData({...formData, current_stage: e.target.value as any})}
                style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
              >
                <option value="Planted">Planted</option>
                <option value="Growing">Growing</option>
                <option value="Ready">Ready</option>
                <option value="Harvested">Harvested</option>
              </select>
            </div>

            <textarea
              placeholder="Status Description"
              value={formData.status_description}
              onChange={(e) => setFormData({...formData, status_description: e.target.value})}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '60px' }}
            />
            
            <textarea
              placeholder="Insights"
              value={formData.insights}
              onChange={(e) => setFormData({...formData, insights: e.target.value})}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '60px' }}
            />

            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Create Field
            </button>
          </form>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Field Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Location</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Crop Type</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Current Stage</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>User ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.field_id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{field.field_name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{field.field_location}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{field.crop_type}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{field.current_stage}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <span style={{
                    backgroundColor: getStatusColor(field.computed_status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {field.computed_status}
                  </span>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{field.user_id}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleDeleteField(field.field_id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {fields.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No fields found. Create your first field to get started.
          </div>
        )}
      </div>
    </div>
  );
}