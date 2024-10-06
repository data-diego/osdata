import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const test = ref([]);
  return {
    test
  };
});
