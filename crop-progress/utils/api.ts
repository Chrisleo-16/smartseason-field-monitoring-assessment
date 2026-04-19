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