<template>
  <div v-for="message in messages" :key="message.id" class="flex flex-col gap-4 px-4">
    <MessageItem :message="message"/>
  </div>
</template>

<script setup>
defineProps(['messages']);
</script>
