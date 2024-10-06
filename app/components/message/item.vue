<template>
  <div class="flex items-start gap-2.5" :class="{'flex-row-reverse': message.role === 'human', 'flex-row': message.role === 'ai'}">
    <MessageAvatar :role="message.role" />
    <div class="inline-flex flex-wrap items-center mt-1 gap-3">
      <MarkdownRenderer class="prose capital-case" :content="message.content" />
    </div>
  </div>
</template>

<script setup>
defineProps(['message']);
</script>
