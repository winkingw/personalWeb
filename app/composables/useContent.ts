import type { BlogCollectionItem, EssaysCollectionItem, ProjectsCollectionItem, AboutCollectionItem } from '@nuxt/content'

interface ListOpts {
  limit?: number
  offset?: number
  tag?: string
}

function byPublished(collection: string, locale: string) {
  return queryCollection(collection as any)
    .where('locale', '=', locale)
    .where('published', '=', true)
}

export function useContent() {
  async function getBlogList(locale = 'zh', opts?: ListOpts): Promise<BlogCollectionItem[]> {
    let q = byPublished('blog', locale).order('date', 'DESC')
    if (opts?.tag) {
      q = q.where('tags', 'LIKE', `%${opts.tag}%`)
    }
    if (opts?.limit) q = q.limit(opts.limit)
    if (opts?.offset) q = q.skip(opts.offset)
    return (await q.all()) as unknown as BlogCollectionItem[]
  }

  async function getBlogPost(slug: string, locale = 'zh'): Promise<BlogCollectionItem | null> {
    const result = await queryCollection('blog')
      .where('slug', '=', slug)
      .where('locale', '=', locale)
      .first()
    return (result as unknown as BlogCollectionItem) ?? null
  }

  async function getAllBlogTags(locale = 'zh'): Promise<string[]> {
    const posts = await byPublished('blog', locale).all()
    const tags = new Set<string>()
    for (const p of posts as unknown as BlogCollectionItem[]) {
      for (const t of p.tags) tags.add(t)
    }
    return [...tags].sort()
  }

  async function getProjectList(locale = 'zh', opts?: ListOpts): Promise<ProjectsCollectionItem[]> {
    let q = byPublished('projects', locale).order('date', 'DESC')
    if (opts?.limit) q = q.limit(opts.limit)
    if (opts?.offset) q = q.skip(opts.offset)
    return (await q.all()) as unknown as ProjectsCollectionItem[]
  }

  async function getProject(slug: string, locale = 'zh'): Promise<ProjectsCollectionItem | null> {
    const result = await queryCollection('projects')
      .where('slug', '=', slug)
      .where('locale', '=', locale)
      .first()
    return (result as unknown as ProjectsCollectionItem) ?? null
  }

  async function getFeaturedProjects(locale = 'zh', limit = 3): Promise<ProjectsCollectionItem[]> {
    const result = await byPublished('projects', locale)
      .order('date', 'DESC')
      .limit(limit)
      .all()
    return result as unknown as ProjectsCollectionItem[]
  }

  async function getEssayList(locale = 'zh', opts?: ListOpts): Promise<EssaysCollectionItem[]> {
    let q = byPublished('essays', locale).order('date', 'DESC')
    if (opts?.limit) q = q.limit(opts.limit)
    if (opts?.offset) q = q.skip(opts.offset)
    return (await q.all()) as unknown as EssaysCollectionItem[]
  }

  async function getEssay(slug: string, locale = 'zh'): Promise<EssaysCollectionItem | null> {
    const result = await queryCollection('essays')
      .where('slug', '=', slug)
      .where('locale', '=', locale)
      .first()
    return (result as unknown as EssaysCollectionItem) ?? null
  }

  async function getAbout(locale = 'zh'): Promise<AboutCollectionItem | null> {
    const result = await queryCollection('about')
      .where('locale', '=', locale)
      .first()
    return (result as unknown as AboutCollectionItem) ?? null
  }

  return {
    getBlogList,
    getBlogPost,
    getAllBlogTags,
    getProjectList,
    getProject,
    getFeaturedProjects,
    getEssayList,
    getEssay,
    getAbout,
  }
}
