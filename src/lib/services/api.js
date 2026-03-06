import { API_BASE_URL, REQUEST_TIMEOUT } from "../utils/constants";
import { storage } from "./storage";
import { router } from "../stores/routerStore";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = REQUEST_TIMEOUT;
  }

  // Build headers with authentication
  getHeaders(customHeaders = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = storage.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // HTTP request with timeout and error handling
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(options.headers),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - token expired
      if (response.status === 401) {
        storage.clear();
        router.navigate("/");
        throw new Error("Session expired. Please login again.");
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        throw new Error("Access denied. Insufficient permissions.");
      }

      // Handle 404 Not Found
      if (response.status === 404) {
        throw new Error("Resource not found.");
      }

      // Handle 500 Server Error
      if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      // Parse response
      const contentType = response.headers.get("content-type");
      const data =
        contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Request failed");
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please check your connection.");
      }

      throw error;
    }
  }

  // Convenience methods
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // File upload with progress
  async uploadFile(endpoint, file, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          // ✅ FIX: Parse the response body to get the actual error message
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            const errorMessage =
              errorResponse.estimatedProcessingTime ||
              errorResponse.message ||
              errorResponse.error ||
              `Upload failed: ${xhr.statusText}`;
            reject(new Error(errorMessage));
          } catch {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload cancelled"));
      });

      xhr.open("POST", `${this.baseURL}${endpoint}`);

      const token = storage.getToken();
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }
}

export const api = new ApiService();
