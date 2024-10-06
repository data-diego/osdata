<template>
    <div
     class="flex w-full max-w-sm mx-auto mt-4 overflow-hidden bg-primary-foreground rounded-lg shadow-md text-primary"
    >
        <div class="flex items-center justify-center w-12 text-xl bg-red-500 text-white">
            <Icon name="material-symbols:error-rounded"/>
        </div>

        <div class="px-4 py-2 -mx-3">
            <div class="mx-3">
            <span class="font-semibold">{{ notification.title }}</span>
            <p class="text-sm">{{ notification.message }}</p>
            </div>
        </div>

    </div>
</template>

<script setup>
const props = defineProps(['notification'])
</script>

<style lang="scss" scoped>

</style>