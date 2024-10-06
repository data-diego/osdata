<template>
  <div class="flex flex-col gap-4 px-3">
    <CrawlerOutput v-if="appStore.crawlOutput.length > 0"/>
    <LoadingIndicator v-if="loading" />
    <Input class="py-6 px-5 rounded-full" v-model="message" placeholder="URL of an OSD study like: https://osdr.nasa.gov/bio/repo/data/studies/OSD-379" @keydown.enter="handleSendMessage" />
    <span class="text-xs text-center pb-3">Search any study with its URL in a format like https://osdr.nasa.gov/bio/repo/data/studies/OSD-379</span>
  </div>
</template>

<script setup>
const appStore = useAppStore();
const message = ref('');
const loading = ref(false);

const urlRegex = /^https:\/\/osdr\.nasa\.gov\/bio\/repo\/data\/studies\/OSD-\d+$/;

const handleSendMessage = async () => {
  if (!message.value || !urlRegex.test(message.value)) {
    alert('Please enter a valid URL in the format: https://osdr.nasa.gov/bio/repo/data/studies/OSD-XXX');
    return;
  }
  loading.value = true;
  await fetch('/api/loader', {
    method: 'POST',
    body: JSON.stringify({ crawlUrl: message.value }),
    headers: {
      'Content-Type': 'application/json',
    }
  });
  loading.value = false;
  message.value = '';
}
</script>
