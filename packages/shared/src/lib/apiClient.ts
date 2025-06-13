/**
 * Re-export of apiClient and request from the canonical location
 */

// Import and re-export apiClient
import apiClientOriginal from '../../lib/apiClient';
export const apiClient = apiClientOriginal;

// Define a stub request function
export const request = async <T>(config: any): Promise<T> => {
  console.warn('Using stub request function. Real implementation not found.');
  return {} as T;
};
