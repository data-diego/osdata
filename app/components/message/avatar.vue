<template>
  <div class="bg-blue-500 text-gray-50 rounded-lg flex items-center justify-center p-1.5 shadow-sm">
    <Icon v-if="role === 'human'" name="mdi:rocket-launch-outline" class="text-xl" />
    <Icon v-if="role === 'ai'" name="simple-icons:nasa" class="text-2xl -p-1" />
  </div>
</template>

<script setup>
defineProps(['role']);
</script>
