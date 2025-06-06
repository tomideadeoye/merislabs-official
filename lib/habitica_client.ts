/**
 * Habitica API client for Orion
 */

import axios from 'axios';

// Define the Habitica API base URL
const HABITICA_API_URL = 'https://habitica.com/api/v3';

// Get API credentials from environment variables
const HABITICA_USER_ID = process.env.HABITICA_USER_ID || '';
const HABITICA_API_TOKEN = process.env.HABITICA_API_TOKEN || '';

// Create an axios instance with default headers
const habiticaClient = axios.create({
  baseURL: HABITICA_API_URL,
  headers: {
    'x-api-user': HABITICA_USER_ID,
    'x-api-key': HABITICA_API_TOKEN,
    'Content-Type': 'application/json'
  }
});

// Export the client as HabiticaApiClient for backward compatibility
export const HabiticaApiClient = habiticaClient;

/**
 * Get user data from Habitica
 */
export async function getUserData() {
  try {
    const response = await habiticaClient.get('/user');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Habitica user data:', error);
    throw error;
  }
}

/**
 * Get user tasks from Habitica
 */
export async function getTasks() {
  try {
    const response = await habiticaClient.get('/tasks/user');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Habitica tasks:', error);
    throw error;
  }
}

/**
 * Create a new task in Habitica
 */
export async function createTask(taskData: any) {
  try {
    const response = await habiticaClient.post('/tasks/user', taskData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating Habitica task:', error);
    throw error;
  }
}

/**
 * Score (complete) a task in Habitica
 */
export async function scoreTask(taskId: string, direction: 'up' | 'down') {
  try {
    const response = await habiticaClient.post(`/tasks/${taskId}/score/${direction}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error scoring Habitica task ${taskId}:`, error);
    throw error;
  }
}

/**
 * Update an existing task in Habitica
 */
export async function updateTask(taskId: string, taskData: any) {
  try {
    const response = await habiticaClient.put(`/tasks/${taskId}`, taskData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating Habitica task ${taskId}:`, error);
    throw error;
  }
}

/**
 * Delete a task in Habitica
 */
export async function deleteTask(taskId: string) {
  try {
    const response = await habiticaClient.delete(`/tasks/${taskId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error deleting Habitica task ${taskId}:`, error);
    throw error;
  }
}

export default habiticaClient;