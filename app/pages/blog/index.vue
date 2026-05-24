<script setup lang="ts">
const route = useRoute()
const { locale, t } = useI18n()
useHead({ htmlAttrs: { lang: () => locale.value } })

const { getBlogList, getAllBlogTags } = useContent()
const { search } = useSearch()

const searchQuery = ref('')
const activeTag = ref<string | null>(null)

onMounted(() => {
  const tag = route.query.tag
  if (typeof tag === 'string') activeTag.value = tag
})

const { data: allPosts } = await useAsyncData(`blog-list-${locale.value}`, () => getBlogList(locale.value))
const { data: tags } = await useAsyncData(`blog-tags-${locale.value}`, () => getAllBlogTags(locale.value))

const filteredPosts = computed(() => {
  let posts = allPosts.value || []
  if (activeTag.value) {
    posts = posts.filter((p: any) => p.tags.includes(activeTag.value!))
  }
  if (searchQuery.value.trim()) {
    posts = search(searchQuery.value, posts)
  }
  return posts
})

function onTagChange(tag: string | null) {
  activeTag.value = tag
}

useSeo({
  title: () => t('blog.title'),
  description: () => t('blog.description'),
})
</script>

<template>
  <div>
    <UiPageHeader
      :title="t('blog.title')"
      :description="t('blog.description')"
    />

    <UiSection>
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div class="relative flex-1 max-w-sm">
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('blog.searchPlaceholder')"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <BlogFilters
          v-if="tags?.length"
          :tags="tags"
          @update:tag="onTagChange"
        />

        <BlogPostList :posts="filteredPosts" />

        <div
          v-if="!filteredPosts.length"
          class="text-center py-12 text-text-muted"
        >
          <p class="text-lg">{{ t('blog.noPosts') }}</p>
        </div>
      </div>
    </UiSection>
  </div>
</template>
