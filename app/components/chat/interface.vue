<template>
    <div class="flex flex-col gap-4 px-3">
      <!-- <MessageList 
        :messages="appStore.sessionMessages" 
      /> -->
      <div class="grid grid-cols-2">
        <pre>{{ appStore.retrieveAnswer }}</pre>
      </div>
      <LoadingIndicator v-if="loading" />
      <div ref="inputRef" class="sticky bottom-0 flex flex-col items-center gap-2 bg-background mt-3">
      <Input class="py-6 px-5 rounded-full" v-model="message" placeholder="Search anything" @keydown.enter="handleSendMessage" />
          <span class="text-xs text-center pb-3">OSData.space is powered by AI so it can make mistakes, always double check important information</span>
      </div>
    </div>
  </template>
  
  <script setup>
  const appStore = useAppStore();
  const { callRetrieve } = useRetrieve();
  const message = ref('');
  const answer = ref('');
  const info = ref('');
  const loading = ref(false);
  const inputRef = ref(null);
  
  const handleSendMessage = async () => {
    if (!message.value) return;
    loading.value = true;
    await callRetrieve(message.value);
    message.value = '';
    loading.value = false;
  };
  
  onMounted(() => {
    appStore.inputRef = inputRef.value;
  });
  </script>
  