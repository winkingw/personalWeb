<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'

const route = useRoute()
const { locale } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })

const slug = String(route.params.slug)

const { getBlogPost, getBlogList } = useContent()

const { data: post } = await useAsyncData(`blog-post-${locale.value}-${slug}`, () =>
  getBlogPost(slug, locale.value)
)

const { data: allPosts } = await useAsyncData(`blog-all-${locale.value}-for-nav`, () =>
  getBlogList(locale.value)
)

const prevNext = computed(() => {
  const posts = allPosts.value || []
  const idx = posts.findIndex((p: BlogCollectionItem) => p.slug === slug)
  return {
    prev: idx > 0 ? { slug: posts[idx - 1]!.slug, title: posts[idx - 1]!.title } : null,
    next: idx < posts.length - 1 ? { slug: posts[idx + 1]!.slug, title: posts[idx + 1]!.title } : null,
  }
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

useSeo({
  title: () => post.value?.title || 'Blog',
  description: () => post.value?.description || '',
  image: () => post.value?.image,
  type: 'article',
  publishedAt: () => post.value?.date,
  updatedAt: () => post.value?.updated,
})

const appConfig = useAppConfig() as Record<string, any>
const shareUrl = computed(() => `${appConfig.site?.url || ''}${route.path}`)
</script>

<template>
  <div>
    <article v-if="post" class="max-w-3xl mx-auto">
      <BlogPostHeader :post="post" />

      <div class="prose prose-lg dark:prose-invert max-w-none">
        <ContentRenderer :value="post" />
      </div>

      <BlogPostFooter :prev="prevNext.prev" :next="prevNext.next" />

      <div class="mt-8">
        <BlogShareButtons :title="post.title" :url="shareUrl" />
      </div>
    </article>
  </div>
</template>
