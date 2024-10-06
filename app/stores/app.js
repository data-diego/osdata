import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const sessionMessages = ref([]);
  const crawlOutput = ref([]);
  const retrieveAnswer = ref('');
  return {
    sessionMessages,
    crawlOutput,
    retrieveAnswer
  };
});
