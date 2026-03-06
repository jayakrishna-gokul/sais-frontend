import { writable } from "svelte/store";
import { auth } from "../services/auth";

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: auth.getCurrentUser(),
    isAuthenticated: auth.isAuthenticated(),
    loading: false,
    error: null,
  });

  return {
    subscribe,
    login: async (email, password) => {
      update((state) => ({ ...state, loading: true, error: null }));

      const result = await auth.login(email, password);

      if (result.success) {
        set({
          user: result.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        update((state) => ({
          ...state,
          loading: false,
          error: result.error,
        }));
      }

      return result.success;
    },
    logout: () => {
      auth.logout();
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    },
    clearError: () => {
      update((state) => ({ ...state, error: null }));
    },
  };
}

export const authStore = createAuthStore();
