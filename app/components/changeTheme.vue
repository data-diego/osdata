<template>
    <Button @click="changeTheme()" size="icon" variant="secondary" class="!opacity-90">
        <Icon v-if="colorMode.preference == 'light'" name="ph:moon-stars-fill"/>
        <Icon v-else name="ph:sun-fill"/>
    </Button>
</template>

<script setup>
const colorMode = useColorMode()
const changeTheme = () => {
  if (colorMode.preference === 'system') {
    // Determine system preference
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    // Toggle based on system preference
    colorMode.preference = systemPreference === 'dark' ? 'light' : 'dark';
  } else {
    // Toggle user preference
    colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
  }
};
</script>
