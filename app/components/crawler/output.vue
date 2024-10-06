<template>
    <div>
        <pre>
            {{appStore.crawlOutput}}
        </pre>
    </div>
</template>

<script setup>
  const appStore = useAppStore();

</script>
