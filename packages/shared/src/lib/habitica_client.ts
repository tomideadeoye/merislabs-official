/* Habitica API client for Orion */

import axios, { AxiosInstance } from 'axios';

const HABITICA_API_URL = 'https://habitica.com/api/v3';
const ENV_HABITICA_USER_ID = process.env.HABITICA_USER_ID || '';
const ENV_HABITICA_API_TOKEN = process.env.HABITICA_API_TOKEN || '';

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
