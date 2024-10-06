<template>
    <div class="prose dark:prose-invert max-w-none" v-html="renderedMarkdown"></div>
</template>

<script setup>
const props = defineProps({
content: {
    type: String,
    required: true
}
})

const { $markdown } = useNuxtApp()
const renderedMarkdown = ref('')

watch(() => props.content, (newContent) => {
renderedMarkdown.value = $markdown.render(newContent)
}, { immediate: true })
</script>
<style>
	.katex-block{
		overflow-x: auto;
	}
</style>