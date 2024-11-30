// File: src/api/apiService.ts

import API_URL from "../apiConfig";
import { Item } from "../types/item";

// Generalized fetch function that accepts a token parameter
const fetchApi = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
) => {
  try {
    // Merge headers, including the Authorization header if the token exists
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
      ...options,
    });

    // Check if the response has a JSON body and parse it
    const isJsonResponse = response.headers
      .get("Content-Type")
      ?.includes("application/json");
    const responseData = isJsonResponse ? await response.json() : null;

    if (!response.ok) {
      // Throw an error with the message from the response or a default message
      throw new Error(
        responseData?.error ||
          responseData?.message ||
          `HTTP Error: ${response.status}`
      );
    }

    return responseData;
  } catch (error) {
    console.error(`Error in fetchApi (${endpoint}):`, error);
    throw error;
  }
};

// Authentication APIs

// Log in user
export const loginUser = (email: string, password: string) =>
  fetchApi("/api/account/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Log out user
export const logoutUser = (token: string) =>
  fetchApi(
    "/api/account/logout",
    {
      method: "POST",
    },
    token
  );

// Register user
export const registerUser = (email: string, password: string) =>
  fetchApi("/api/account/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Profile API

// Get profile
export const getProfile = (token: string) =>
  fetchApi("/api/account/profile", {}, token);

// Change Password API

// Change Password API
export const changePassword = (
  oldPassword: string,
  newPassword: string,
  token: string
) =>
  fetchApi(
    "/api/account/change-password",
    {
      method: "POST",
      body: JSON.stringify({
        OldPassword: oldPassword,
        NewPassword: newPassword,
      }),
    },
    token
  );
// Delete User API
export const deleteUser = (
  password: string,
  confirmDeletion: boolean,
  token: string
) =>
  fetchApi(
    "/api/account/delete-user",
    {
      method: "POST",
      body: JSON.stringify({
        Password: password,
        ConfirmDeletion: confirmDeletion,
      }),
    },
    token
  );

// Items API

// Get items
export const getItems = (token: string) => fetchApi("/api/items", {}, token);

// Get item by ID
export const getItemById = (id: number, token: string) =>
  fetchApi(`/api/items/${id}`, {}, token);

// Delete item
export const deleteItem = (id: number, token: string) =>
  fetchApi(
    `/api/items/${id}`,
    {
      method: "DELETE",
    },
    token
  );

// Create item
export const createItem = (item: Item, token: string) =>
  fetchApi(
    "/api/items",
    {
      method: "POST",
      body: JSON.stringify(item),
    },
    token
  );

// Update item
export const updateItem = (id: number, item: Item, token: string) =>
  fetchApi(
    `/api/items/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(item),
    },
    token
  );

// Other API functions can be added similarly...
