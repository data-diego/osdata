<template>
    <div class="flex flex-col gap-4 px-3">
      <MessageList 
        :messages="appStore.sessionMessages" 
      />
      <LoadingIndicator v-if="loading" />
      <div ref="inputRef" class="sticky bottom-0 flex flex-col items-center gap-2 bg-background mt-3">
      <Input class="py-6 px-5 rounded-full bg-gray-100" v-model="message" placeholder="Search anything" @keydown.enter="handleSendMessage" />
          <span class="text-xs text-center pb-3">OSData is powered by AI so it can make mistakes, always double check important information</span>
      </div>
    </div>
  </template>
  
  <script setup>
  const appStore = useAppStore();
  const { callBot } = useBot();
  
  const message = ref('');
  const loading = ref(false);
  const inputRef = ref(null);
  
  const handleSendMessage = async () => {
    if (!message.value) return;
    loading.value = true;
    await callBot(message.value);
    message.value = '';
    loading.value = false;
  };
  
  onMounted(() => {
    appStore.inputRef = inputRef.value;
  });
  </script>
  