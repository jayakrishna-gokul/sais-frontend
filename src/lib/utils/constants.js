// API Configuration
export const API_BASE_URL = "";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  SEARCH: {
    QUERY: "/api/search",
    HISTORY: "/api/search/history",
  },
  DOCUMENTS: {
    UPLOAD: "/api/documents/upload",
    LIST: "/api/documents",
    DELETE: "/api/documents",
  },
  CONNECTORS: {
    CONFLUENCE: {
      SYNC: "/api/connectors/confluence/sync",
      STATUS: "/api/connectors/confluence/status",
    },
  },
  ADMIN: {
    USERS: "/api/admin/users",
    STATS: "/api/admin/stats",
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "sapphire_auth_token",
  USER: "sapphire_user",
  THEME: "sapphire_theme",
};

// UI Constants
export const TOAST_DURATION = 5000;
export const REQUEST_TIMEOUT = 30000;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
