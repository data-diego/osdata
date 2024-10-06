const resolveStream = async ({
    data,
    onChunk = () => {},
    onReady = () => {},
    stream,
  }) => {
    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      data.value += value;
      onChunk({ data: value });
    }
  
    onReady({ data: data.value });
  };
  
  export const useChainStream = ({
      onChunk = () => {},
      onReady = () => {},
      stream,
  }) => {
      const data = ref("");
    
      resolveStream({
        data,
        onChunk,
        onReady,
        stream,
      });
    
      return {
        data: readonly(data),
      };
  };
  