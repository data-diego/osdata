export const useRetrieve = () => {
    const appStore = useAppStore();
  
    const callRetrieve = async (message) => {
      if (!message) return;
      const aiResponse = await fetchAiResponse(message);
      await handleAiResponse(aiResponse);
    };
  
    const fetchAiResponse = async (message) => {
      const { body } = await fetch('/api/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message
        })
      });
  
      return body;
    };
  
    const handleAiResponse = async (stream) => {
      await useChainStream({
        stream,
        onChunk: ({ data }) => { appStore.retrieveAnswer += data; },
        onReady: async ({ data }) => {
          appStore.retrieveAnswer = data;
        }
      });
    };
  
    return { callRetrieve };
  };
  