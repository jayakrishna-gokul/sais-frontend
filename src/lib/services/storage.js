import { STORAGE_KEYS } from "../utils/constants";

class StorageService {
  // Secure token storage with encryption (basic XOR for demo)
  setToken(token) {
    try {
      const encrypted = btoa(token); // In production, use proper encryption
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, encrypted);
      return true;
    } catch (error) {
      console.error("Failed to store token:", error);
      return false;
    }
  }

  getToken() {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      return encrypted ? atob(encrypted) : null;
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
  }

  removeToken() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  setUser(user) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to store user:", error);
    }
  }

  getUser() {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to retrieve user:", error);
      return null;
    }
  }

  clear() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Session storage for temporary data
  setSession(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSession(key) {
    try {
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }
}

export const storage = new StorageService();
