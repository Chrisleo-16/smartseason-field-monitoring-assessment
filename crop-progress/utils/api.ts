const API = "https://smartseason-field-monitoring-assessment.onrender.com/api";

export interface SignUpResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
  // NOTE: If you add JWT later, uncomment these:
  // token?: string;
  // user?: {
  //   user_id: number;
  //   username: string;
  //   email: string;
  //   phone_number: string;
  //   users_role: string;
  // };
}

// Aligned exactly with the PostgreSQL field_management table
export interface Field {
  field_id: number;
  field_name: string;
  field_location: string;
  crop_type: string;
  planting_date: string;
  harvesting_date: string;
  user_id: number;
  insights: string;             // Changed to string to match TEXT database column
  status_description: string;
  last_updated_at: string;      // Changed to string (ISO date string from API)
  computed_status: 'Active' | 'At Risk' | 'Completed';
  current_stage: 'Planted' | 'Growing' | 'Ready' | 'Harvested';        // Fixed typo
}

export interface FieldResponse {
  fields: Field[];
}

export interface FieldUpdateResponse {
  message: string;
  new_status?: string;
}

export interface FieldDeleteResponse {
  message: string;
}

export interface FieldCreateResponse {
  message: string;
  computed_status?: string;
}

// ----------------------------------------------------
// API FUNCTIONS
// ----------------------------------------------------

export async function register(username: string, password: string, email: string, phone_number: string, users_role: string) {
  const response = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Changed "role" to "users_role" to match backend req.body
    body: JSON.stringify({ username, password, email, phone_number, users_role }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
}

// Changed parameter from 'username' to 'email' to match backend logic
export async function login(email: string, password: string) {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Login failed');
  }

  return response.json();
}

// Get user details by email for role-based routing
export async function getUserByEmail(email: string) {
  const response = await fetch(`${API}/auth/user/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get user details');
  }

  return response.json();
}

// Get all users for dropdowns
export async function getAllUsers() {
  const response = await fetch(`${API}/auth/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch users');
  }

  return response.json();
}

// Used for the Admin "Create New Field" form
export type CreateFieldInput = Omit<Field, 'field_id' | 'last_updated_at' | 'computed_status'>;

// Used for the Agent "Observation" update
export interface AgentUpdateInput {
  current_stage: Field['current_stage'];
  insights: string;
}

// --- API FUNCTIONS ---

/**
 * 1. ADMIN: Fetch all fields for the dashboard
 */
export async function getAllFields(): Promise<Field[]> {
  const response = await fetch(`${API}/field-management/fields`);
  if (!response.ok) throw new Error('Failed to fetch all fields');
  return response.json();
}

/**
 * 2. ADMIN/AGENT: Get a single field detail
 */
export async function getFieldById(id: number): Promise<Field> {
  const response = await fetch(`${API}/field-management/fields/${id}`);
  if (!response.ok) throw new Error('Field not found');
  return response.json();
}

/**
 * 3. AGENT: Get only the fields assigned to a specific user
 */
export async function getFieldsByUser(userId: number): Promise<Field[]> {
  const response = await fetch(`${API}/field-management/fields/user/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch assigned fields');
  return response.json();
}

/**
 * 4. ADMIN: Create a brand new field assignment
 */
export async function createField(data: CreateFieldInput): Promise<{ message: string; computed_status: string }> {
  const response = await fetch(`${API}/field-management/fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Could not create field');
  return response.json();
}

/**
 * 5. AGENT: The limited update for field observations
 */
export async function agentUpdateField(id: number, data: AgentUpdateInput): Promise<{ message: string; new_status: string }> {
  const response = await fetch(`${API}/field-management/fields/${id}/agent-update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Agent update failed');
  return response.json();
}

/**
 * 6. ADMIN: Delete a field record
 */
export async function deleteField(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API}/field-management/fields/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Delete failed');
  return response.json();
}

// Weather API interfaces
export interface WeatherData {
  location: string;
  current: {
    temp: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
  };
  forecast: Array<{
    day: string;
    temp: number;
    description: string;
    icon: string;
  }>;
  alerts: string[];
  lastUpdated: string;
}

// Get weather data for a location
export async function getWeather(location: string): Promise<WeatherData> {
  const response = await fetch(`${API}/weather/${encodeURIComponent(location)}`);
  if (!response.ok) throw new Error('Failed to fetch weather data');
  return response.json();
}

// Photo Gallery APIs
export interface PhotoData {
  photo_id: number;
  field_id: number;
  photo_data: string; // Base64
  mime_type: string;
  photo_type: string;
  notes: string;
  upload_date: string;
  uploaded_by?: number;
  ai_analysis?: {
    health_status: string;
    confidence: number;
    recommendations: string[];
    analysis_date: string;
  };
}

export interface PhotoUploadResponse {
  message: string;
  photo: PhotoData;
  analysis: {
    health_status: string;
    confidence: number;
    recommendations: string[];
    analysis_date: string;
  };
}

// Upload photo for a field
export async function uploadFieldPhoto(fieldId: number, photo: File, photoType: string = 'general', notes: string = ''): Promise<PhotoUploadResponse> {
  const formData = new FormData();
  formData.append('photo', photo);
  formData.append('photo_type', photoType);
  formData.append('notes', notes);

  const response = await fetch(`${API}/photos/fields/${fieldId}/photos`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload photo');
  return response.json();
}

// Get photos for a field
export async function getFieldPhotos(fieldId: number): Promise<PhotoData[]> {
  const response = await fetch(`${API}/photos/fields/${fieldId}/photos`);
  if (!response.ok) throw new Error('Failed to fetch photos');
  return response.json();
}

// Delete a photo
export async function deletePhoto(photoId: number): Promise<{ message: string }> {
  const response = await fetch(`${API}/photos/photos/${photoId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete photo');
  return response.json();
}

// Analytics APIs
export interface FieldPrediction {
  field_id: number;
  field_name: string;
  crop_type: string;
  growth_progress: number;
  yield_prediction: {
    estimated_yield: number;
    unit: string;
    confidence: number;
    factors: {
      weather_impact: string;
      soil_health: string;
      pest_pressure: string;
    };
  };
  risk_assessment: {
    overall_risk: 'Low' | 'Medium' | 'High';
    risk_factors: string[];
    risk_score: number;
  };
  predicted_harvest_date: string;
  recommendations: string[];
}

export interface OverallAnalytics {
  total_fields: number;
  average_growth_progress: number;
  high_risk_fields: number;
  predicted_yield_total: number;
  crop_performance: Array<{
    crop_type: string;
    field_count: number;
    risk_percentage: number;
    performance_rating: string;
  }>;
}

export interface AnalyticsResponse {
  predictions: FieldPrediction[];
  overall_analytics: OverallAnalytics;
  generated_at: string;
}

// Get predictive analytics
export async function getPredictiveAnalytics(): Promise<AnalyticsResponse> {
  const response = await fetch(`${API}/analytics/predictions`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
}

// Get yield charts data
export async function getYieldCharts(): Promise<{
  crop_yield_data: Array<{
    crop_type: string;
    fields: Array<{
      field_name: string;
      estimated_yield: number;
      stage: string;
    }>;
    average_yield: number;
    yield_trend: Array<{
      month: string;
      yield: number;
    }>;
  }>;
  overall_yield_trend: Array<{
    month: string;
    total_yield: number;
  }>;
}> {
  const response = await fetch(`${API}/analytics/yield-charts`);
  if (!response.ok) throw new Error('Failed to fetch yield charts');
  return response.json();
}

// Reports APIs
export interface WeeklyReport {
  report_info: {
    title: string;
    date_range: {
      start: string;
      end: string;
    };
    generated_at: string;
    week_number: number;
  };
  summary: {
    total_fields: number;
    active_fields: number;
    at_risk_fields: number;
    completed_fields: number;
    updated_this_week: number;
  };
  field_details: Array<{
    field_name: string;
    location: string;
    crop_type: string;
    current_stage: string;
    status: string;
    planting_date: string;
    harvesting_date: string;
    last_updated: string;
    insights: string;
    weekly_activity: string;
  }>;
  crop_breakdown: Array<{
    crop_type: string;
    total_fields: number;
    active_fields: number;
    at_risk_fields: number;
    completed_fields: number;
  }>;
  recommendations: Array<{
    priority: 'High' | 'Medium' | 'Low';
    category: string;
    action: string;
    deadline: string;
  }>;
  upcoming_tasks: Array<{
    field_name: string;
    task: string;
    due_date: string;
    priority: 'High' | 'Medium' | 'Low';
  }>;
}

// Get weekly report
export async function getWeeklyReport(weekOffset: number = 0): Promise<WeeklyReport> {
  const response = await fetch(`${API}/reports/weekly?week_offset=${weekOffset}`);
  if (!response.ok) throw new Error('Failed to generate weekly report');
  return response.json();
}

// Generate PDF report
export async function generatePDFReport(reportType: string): Promise<{
  message: string;
  download_url: string;
  report_type: string;
  generated_at: string;
  file_size: string;
}> {
  const response = await fetch(`${API}/reports/pdf/${reportType}`);
  if (!response.ok) throw new Error('Failed to generate PDF report');
  return response.json();
}

// Send email report
export async function sendEmailReport(recipients: string[], reportType: string, subject: string, message: string): Promise<{
  message: string;
  sent_count: number;
  results: Array<{
    email: string;
    status: string;
    sent_at: string;
    message_id: string;
  }>;
  report_details: {
    report_type: string;
    subject: string;
    sent_at: string;
  };
}> {
  const response = await fetch(`${API}/reports/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipients,
      report_type: reportType,
      subject,
      message
    }),
  });
  if (!response.ok) throw new Error('Failed to send email report');
  return response.json();
}

// Get report history
export async function getReportHistory(): Promise<Array<{
  id: number;
  report_type: string;
  title: string;
  generated_at: string;
  file_size: string;
  download_url: string;
}>> {
  const response = await fetch(`${API}/reports/history`);
  if (!response.ok) throw new Error('Failed to fetch report history');
  return response.json();
}