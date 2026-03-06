import { writable } from "svelte/store";
import { TOAST_DURATION } from "../utils/constants";

function createNotificationStore() {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    success: (message) => {
      const id = Date.now();
      update((notifications) => [
        ...notifications,
        { id, type: "success", message },
      ]);
      setTimeout(() => {
        update((notifications) => notifications.filter((n) => n.id !== id));
      }, TOAST_DURATION);
    },
    error: (message) => {
      const id = Date.now();
      update((notifications) => [
        ...notifications,
        { id, type: "error", message },
      ]);
      setTimeout(() => {
        update((notifications) => notifications.filter((n) => n.id !== id));
      }, TOAST_DURATION);
    },
    info: (message) => {
      const id = Date.now();
      update((notifications) => [
        ...notifications,
        { id, type: "info", message },
      ]);
      setTimeout(() => {
        update((notifications) => notifications.filter((n) => n.id !== id));
      }, TOAST_DURATION);
    },
    remove: (id) => {
      update((notifications) => notifications.filter((n) => n.id !== id));
    },
  };
}

export const notifications = createNotificationStore();
