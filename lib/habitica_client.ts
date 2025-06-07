/**
 * Habitica API client for Orion
 */

import axios, { AxiosInstance } from 'axios';

// Define the Habitica API base URL
const HABITICA_API_URL = 'https://habitica.com/api/v3';

// Get API credentials from environment variables
const ENV_HABITICA_USER_ID = process.env.HABITICA_USER_ID || '';
const ENV_HABITICA_API_TOKEN = process.env.HABITICA_API_TOKEN || '';

/**
 * Create a Habitica axios client with given credentials, or fallback to env vars.
 */
function createHabiticaClient(userId?: string, apiToken?: string): AxiosInstance {
  const uid = userId || ENV_HABITICA_USER_ID;
  const token = apiToken || ENV_HABITICA_API_TOKEN;
  return axios.create({
    baseURL: HABITICA_API_URL,
    headers: {
      'x-api-user': uid,
      'x-api-key': token,
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Get user data from Habitica
 */
export async function getUserData(userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    const response = await client.get('/user');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Habitica user data:', error);
    throw error;
  }
}

/**
 * Get user tasks from Habitica
 */
export async function getTasks(userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    const response = await client.get('/tasks/user');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Habitica tasks:', error);
    throw error;
  }
}

/**
 * Create a new task in Habitica
 */
export async function createTask(taskData: any, userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    const response = await client.post('/tasks/user', taskData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating Habitica task:', error);
    throw error;
  }
}

/**
 * Score (complete) a task in Habitica
 */
export async function scoreTask(taskId: string, direction: 'up' | 'down', userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    const response = await client.post(`/tasks/${taskId}/score/${direction}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error scoring Habitica task ${taskId}:`, error);
    throw error;
  }
}

/**
 * Update an existing task in Habitica
 */
export async function updateTask(taskId: string, taskData: any, userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    const response = await client.put(`/tasks/${taskId}`, taskData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating Habitica task ${taskId}:`, error);
    throw error;
  }
}

/**
 * Delete a task in Habitica
 */
export async function deleteTask(taskId: string, userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    const response = await client.delete(`/tasks/${taskId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error deleting Habitica task ${taskId}:`, error);
    throw error;
  }
}

const habiticaClient = {
  getUserData,
  getTasks,
  createTask,
  scoreTask,
  updateTask,
  deleteTask,
};

export default habiticaClient;
