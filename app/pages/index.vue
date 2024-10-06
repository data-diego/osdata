<template>
  <div class="max-w-screen-xl mx-auto w-full p-4 flex flex-col gap-4">
      <h1 class="text-5xl text-center">🔬</h1>
      <h1 class="text-xl font-bold text-center">osdata.space</h1>
      <p class="text-center">Visualize OSD Studies with AI</p>
      <p class="text-center text-sm">Currently loaded studies: <br>OSD-379</p>
      <div id="viz"></div>
      <LoadingIndicator v-if="loading"/>
      <ChatInterface/>
  </div>
</template>

<script setup>

</script>
