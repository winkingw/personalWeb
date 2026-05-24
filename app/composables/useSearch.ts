import type { BlogCollectionItem } from '@nuxt/content'
import Fuse from 'fuse.js'

export function useSearch() {
  function createIndex(posts: BlogCollectionItem[]) {
    return new Fuse(posts, {
      keys: ['title', 'description', 'tags'],
      threshold: 0.3,
      includeScore: true,
    })
  }

  function search(query: string, posts: BlogCollectionItem[]) {
    if (!query.trim()) return posts
    const fuse = createIndex(posts)
    return fuse.search(query).map(r => r.item)
  }

  return { search, createIndex }
}
