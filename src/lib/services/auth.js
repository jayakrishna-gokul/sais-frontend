import { api } from "./api";
import { storage } from "./storage";
import { API_ENDPOINTS } from "../utils/constants";

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      // Backend returns: { accessToken, tokenType, expiresIn, user }
      if (response.accessToken) {
        storage.setToken(response.accessToken);

        // If backend doesn't return user object, create one from email
        const user = response.user || { email };
        storage.setUser(user);

        return { success: true, user };
      }

      throw new Error("Invalid response from server");
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async register(email, password, fullName) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        fullName,
      });

      if (response.accessToken) {
        storage.setToken(response.accessToken);
        const user = response.user || { email, fullName };
        storage.setUser(user);
        return { success: true, user };
      }

      throw new Error("Registration failed");
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  logout() {
    storage.clear();
  }

  isAuthenticated() {
    return !!storage.getToken();
  }

  getCurrentUser() {
    return storage.getUser();
  }

  async refreshToken() {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
      if (response.accessToken) {
        storage.setToken(response.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const auth = new AuthService();
