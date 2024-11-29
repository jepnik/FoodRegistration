import API_URL  from '../apiConfig';
import { useAuth } from '../components/AuthContext';
import { useCallback } from 'react';

const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    // Check if the response has a body and parse it only if it's JSON
    const isJsonResponse = response.headers.get('Content-Type')?.includes('application/json');
    const responseData = isJsonResponse ? await response.json() : null;

    if (!response.ok) {
      throw new Error(responseData?.message || `HTTP Error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error(`Error in fetchApi (${endpoint}):`, error);
    throw error;
  }
};

// Custom hook to get items
// Item APIs
export const useGetItems = () => {
  const { token } = useAuth();
  const getItems = useCallback(
    () => fetchApi('/api/items', { headers: { 'Authorization': `Bearer ${token}` } }),
    [token]
  );
  return { getItems };
};

export const deleteItem = (id: number) => fetchApi(`/api/items/${id}`, { method: 'DELETE' });

export const createItem = (item: any) =>
  fetchApi('/api/items', { method: 'POST', body: JSON.stringify(item) });

export const updateItem = (id: number, item: any) =>
  fetchApi(`/api/items/${id}`, { method: 'PUT', body: JSON.stringify(item) });

// Authentication APIs
export const loginUser = (email: string, password: string) =>
  fetchApi('/api/account/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const logoutUser = () => fetchApi('/api/account/logout', { method: 'POST' });

export const getSession = () => fetchApi('/api/account/session');

export const registerUser = (email: string, password: string) =>
  fetchApi('/api/account/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
