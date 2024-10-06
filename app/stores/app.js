import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const sessionMessages = ref([]);
  return {
    sessionMessages
  };
});
