export const useBot = () => {
    const appStore = useAppStore();
  
    const callBot = async (message) => {
      if (!message) return;
      await addHumanMessage(message);
      const aiResponse = await fetchAiResponse(message);
      await handleAiResponse(aiResponse);
    };
  
    const addHumanMessage = async (content) => {
        appStore.sessionMessages.push({
          role: 'human',
          content
        });
    };
  
    const fetchAiResponse = async (message) => {
      const { body } = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          message_history: appStore.sessionMessages.slice(-20)
        })
      });
  
      return body;
    };
  
    const handleAiResponse = async (stream) => {
      const aiResponse = ref({
        role: 'ai',
        content: '',
        isLoading: true
      });
  
      appStore.sessionMessages.push(aiResponse.value);
  
      await useChainStream({
        stream,
        onChunk: ({ data }) => { aiResponse.value.content += data; },
        onReady: async ({ data }) => {
          aiResponse.value.content = data;
          aiResponse.value.isLoading = false;
        }
      });
    };
  
    return { callBot };
  };
  