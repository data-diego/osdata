<template>
  <div class="flex flex-col items-center gap-1">
    <Icon name="mingcute:loading-fill" class="animate-spin text-xl" />
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
});
</script>
