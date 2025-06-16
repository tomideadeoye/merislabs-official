/**
 * Habitica API client for Orion
 * // GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from './lib';

// Define the Habitica API base URL
const HABITICA_API_URL = 'https://habitica.com/api/v3';

// Get API credentials from environment variables
const ENV_HABITICA_USER_ID = process.env.HABITICA_USER_ID || '';
const ENV_HABITICA_API_TOKEN = process.env.HABITICA_API_TOKEN || '';

/**
 * Interface for Habitica user statistics and profile data.
 * This interface defines the expected structure of the user data returned by the Habitica API.
 */
export interface HabiticaUserStats {
  _id: string;
  profile?: {
    name: string;
    // Add other relevant profile fields as needed, e.g.,
    // blurb: string;
    // imageUrl: string;
  };
  stats: {
    hp: number;
    mp: number;
    exp: number;
    gp: number;
    lvl: number;
    class: string;
    // Add other relevant stats fields as needed, e.g.,
    // str: number;
    // con: number;
    // int: number;
    // per: number;
  };
  auth?: {
    local: {
      username: string;
      email: string;
    };
    // Add other authentication related fields if necessary
  };
  preferences: {
    timezoneOffset: number;
    dateStartOfWeek: number;
    // Add other relevant preference fields as needed
  };
  // Add other top-level user fields as needed based on API response
  // items: any; // Example for items, but ideally more specific type
  // party: any; // Example for party, but ideally more specific type
}

/**
 * Interface for a Habitica task.
 * This interface defines the expected structure of a task object returned by the Habitica API.
 */
export interface HabiticaTask {
  _id: string;
  text: string;
  type: 'todo' | 'daily' | 'habit' | 'reward';
  notes?: string;
  priority?: number; // 0.1 for trivial, 1 for easy, 1.5 for medium, 2 for hard
  value?: number; // for rewards
  isDue?: boolean; // for todos/dailies
  completed?: boolean; // for todos
  // Add other common task properties like tags, checklist, date created/due as needed
}

/**
 * Create a Habitica axios client with given credentials, or fallback to env vars.
 * @param userId - Optional Habitica User ID. If not provided, uses HABITICA_USER_ID from environment.
 * @param apiToken - Optional Habitica API Token. If not provided, uses HABITICA_API_TOKEN from environment.
 * @returns An AxiosInstance configured for Habitica API requests.
 */
function createHabiticaClient(userId?: string, apiToken?: string): AxiosInstance {
  const uid = userId || ENV_HABITICA_USER_ID;
  const token = apiToken || ENV_HABITICA_API_TOKEN;

  if (!uid || !token) {
    logger.error(
      JSON.stringify({
        operation: 'createHabiticaClient',
        message: 'Habitica API credentials (User ID or API Token) are missing.',
        userId: uid ? '*****' : 'MISSING',
        apiToken: token ? '*****' : 'MISSING',
        details:
          'Ensure HABITICA_USER_ID and HABITICA_API_TOKEN are set in environment variables or passed explicitly.',
      })
    );
    throw new Error('Habitica API credentials missing.');
  }

  const client = axios.create({
    baseURL: HABITICA_API_URL,
    headers: {
      'x-api-user': uid,
      'x-api-key': token,
      'Content-Type': 'application/json',
    },
  });

  logger.info(
    JSON.stringify({
      operation: 'createHabiticaClient',
      message: 'Habitica API client created successfully.',
      userId: uid.substring(0, 5) + '...', // Log partial ID for security
      apiToken: token.substring(0, 5) + '...', // Log partial token for security
    })
  );

  return client;
}

/**
 * Get user data from Habitica.
 * @param userId - Optional Habitica User ID.
 * @param apiToken - Optional Habitica API Token.
 * @returns User data as HabiticaUserStats.
 * @throws Error if fetching user data fails.
 */
export async function getUserData(userId?: string, apiToken?: string): Promise<HabiticaUserStats> {
  const client = createHabiticaClient(userId, apiToken);
  try {
    logger.info(
      JSON.stringify({
        operation: 'getUserData',
        message: 'Attempting to fetch Habitica user data.',
        userId: userId || 'from_env',
      })
    );
    const response = await client.get('/user');
    logger.info(
      JSON.stringify({
        operation: 'getUserData',
        message: 'Successfully fetched Habitica user data.',
        userId: userId || 'from_env',
        dataSummary: {
          _id: response.data.data._id,
          name: response.data.data.profile?.name,
        },
      })
    );
    return response.data.data;
  } catch (error: any) {
    logger.error(
      JSON.stringify({
        operation: 'getUserData',
        message: 'Error fetching Habitica user data.',
        userId: userId || 'from_env',
        error: error.message,
        statusCode: error.response?.status,
        details: error.response?.data,
      })
    );
    throw error;
  }
}

/**
 * Get user tasks from Habitica.
 * @param userId - Optional Habitica User ID.
 * @param apiToken - Optional Habitica API Token.
 * @returns An array of user tasks.
 * @throws Error if fetching tasks fails.
 */
export async function getTasks(userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    logger.info(
      JSON.stringify({
        operation: 'getTasks',
        message: 'Attempting to fetch Habitica tasks.',
        userId: userId || 'from_env',
      })
    );
    const response = await client.get('/tasks/user');
    logger.info(
      JSON.stringify({
        operation: 'getTasks',
        message: 'Successfully fetched Habitica tasks.',
        userId: userId || 'from_env',
        taskCount: response.data.data.length,
      })
    );
    return response.data.data;
  } catch (error: any) {
    logger.error(
      JSON.stringify({
        operation: 'getTasks',
        message: 'Error fetching Habitica tasks.',
        userId: userId || 'from_env',
        error: error.message,
        statusCode: error.response?.status,
        details: error.response?.data,
      })
    );
    throw error;
  }
}

/**
 * Create a new task in Habitica.
 * @param taskData - The data for the new task.
 * @param userId - Optional Habitica User ID.
 * @param apiToken - Optional Habitica API Token.
 * @returns The created task data.
 * @throws Error if creating task fails.
 */
export async function createTask(taskData: any, userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    logger.info(
      JSON.stringify({
        operation: 'createTask',
        message: 'Attempting to create Habitica task.',
        userId: userId || 'from_env',
        taskType: taskData.type,
        taskText: taskData.text,
      })
    );
    const response = await client.post('/tasks/user', taskData);
    logger.info(
      JSON.stringify({
        operation: 'createTask',
        message: 'Successfully created Habitica task.',
        userId: userId || 'from_env',
        taskId: response.data.data.id,
        taskText: response.data.data.text,
      })
    );
    return response.data.data;
  } catch (error: any) {
    logger.error(
      JSON.stringify({
        operation: 'createTask',
        message: 'Error creating Habitica task.',
        userId: userId || 'from_env',
        error: error.message,
        statusCode: error.response?.status,
        details: error.response?.data,
      })
    );
    throw error;
  }
}

/**
 * Score (complete) a task in Habitica.
 * @param taskId - The ID of the task to score.
 * @param direction - 'up' to complete/score positively, 'down' to score negatively.
 * @param userId - Optional Habitica User ID.
 * @param apiToken - Optional Habitica API Token.
 * @returns The updated user stats after scoring the task.
 */
export async function scoreTask(taskId: string, direction: 'up' | 'down', userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    logger.info(
      JSON.stringify({
        operation: 'scoreTask',
        message: 'Attempting to score Habitica task.',
        userId: userId || 'from_env',
        taskId: taskId,
        direction: direction,
      })
    );
    const response = await client.post(`/tasks/${taskId}/score/${direction}`);
    logger.info(
      JSON.stringify({
        operation: 'scoreTask',
        message: 'Successfully scored Habitica task.',
        userId: userId || 'from_env',
        taskId: taskId,
        direction: direction,
        // Consider adding a summary of resulting user stats if available in response
      })
    );
    return response.data.data;
  } catch (error: any) {
    logger.error(
      JSON.stringify({
        operation: 'scoreTask',
        message: 'Error scoring Habitica task.',
        userId: userId || 'from_env',
        taskId: taskId,
        direction: direction,
        error: error.message,
        statusCode: error.response?.status,
        details: error.response?.data,
      })
    );
    throw error;
  }
}

/**
 * Update an existing task in Habitica.
 * @param taskId - The ID of the task to update.
 * @param taskData - The updated task data.
 * @param userId - Optional Habitica User ID.
 * @param apiToken - Optional Habitica API Token.
 * @returns The updated task data.
 * @throws Error if updating task fails.
 */
export async function updateTask(taskId: string, taskData: any, userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    logger.info(
      JSON.stringify({
        operation: 'updateTask',
        message: 'Attempting to update Habitica task.',
        userId: userId || 'from_env',
        taskId: taskId,
        taskDataPreview: { text: taskData.text, type: taskData.type },
      })
    );
    const response = await client.put(`/tasks/${taskId}`, taskData);
    logger.info(
      JSON.stringify({
        operation: 'updateTask',
        message: 'Successfully updated Habitica task.',
        userId: userId || 'from_env',
        taskId: taskId,
        updatedTaskText: response.data.data.text,
      })
    );
    return response.data.data;
  } catch (error: any) {
    logger.error(
      JSON.stringify({
        operation: 'updateTask',
        message: 'Error updating Habitica task.',
        userId: userId || 'from_env',
        taskId: taskId,
        error: error.message,
        statusCode: error.response?.status,
        details: error.response?.data,
      })
    );
    throw error;
  }
}

/**
 * Delete a task in Habitica.
 * @param taskId - The ID of the task to delete.
 * @param userId - Optional Habitica User ID.
 * @param apiToken - Optional Habitica API Token.
 * @returns The response from the delete operation.
 * @throws Error if deleting task fails.
 */
export async function deleteTask(taskId: string, userId?: string, apiToken?: string) {
  const client = createHabiticaClient(userId, apiToken);
  try {
    logger.info(
      JSON.stringify({
        operation: 'deleteTask',
        message: 'Attempting to delete Habitica task.',
        userId: userId || 'from_env',
        taskId: taskId,
      })
    );
    const response = await client.delete(`/tasks/${taskId}`);
    logger.info(
      JSON.stringify({
        operation: 'deleteTask',
        message: 'Successfully deleted Habitica task.',
        userId: userId || 'from_env',
        taskId: taskId,
      })
    );
    return response.data.data;
  } catch (error: any) {
    logger.error(
      JSON.stringify({
        operation: 'deleteTask',
        message: 'Error deleting Habitica task.',
        userId: userId || 'from_env',
        taskId: taskId,
        error: error.message,
        statusCode: error.response?.status,
        details: error.response?.data,
      })
    );
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
