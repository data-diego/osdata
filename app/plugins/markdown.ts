import MarkdownIt from 'markdown-it'
import markdownItKatex from '@vscode/markdown-it-katex'

export default defineNuxtPlugin((nuxtApp) => {
  const md = new MarkdownIt().use(markdownItKatex)
  const originalRender = md.render
  md.render = function(...args) {
    const [src, ...rest] = args
    const newSrc = src  
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$')
      .replace(/\\\[/g, '$$$')
      .replace(/\\\]/g, '$$$')
    return originalRender.call(this, newSrc, ...rest)
  }

  nuxtApp.provide('markdown', md)
})
