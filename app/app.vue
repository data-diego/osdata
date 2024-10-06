<template>
  <NuxtLayout vaul-drawer-wrapper>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
</script>

<style>
::view-transition-old(*),
::view-transition-new(*) {
  height: 100%;
  width: auto;
  border-radius: 0.2rem;
}

::view-transition-group(*) {
  overflow: clip;
  /* animation-duration: 1s; */
}
</style>