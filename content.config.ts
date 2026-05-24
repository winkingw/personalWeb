import { defineCollection, z } from '@nuxt/content'

// @nuxt/content 3 auto-discovers MDC components from app/components/content/*.
// This config surface is limited to content collections and schemas.

export const blogSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string().date(),
  updated: z.string().date().optional(),
  tags: z.array(z.string()),
  image: z.string().optional(),
  draft: z.boolean().default(true),
  published: z.boolean().default(false),
  locale: z.enum(['zh', 'en']),
  readingTime: z.number().optional(),
  wordCount: z.number().optional(),
})
export type BlogPost = z.infer<typeof blogSchema>

export const essaySchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string().date(),
  updated: z.string().date().optional(),
  draft: z.boolean().default(true),
  published: z.boolean().default(false),
  locale: z.enum(['zh', 'en']),
  readingTime: z.number().optional(),
  wordCount: z.number().optional(),
})
export type Essay = z.infer<typeof essaySchema>

export const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  date: z.string().date(),
  techStack: z.array(z.string()),
  image: z.string().optional(),
  links: z.object({
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    npm: z.string().url().optional(),
    docs: z.string().url().optional(),
  }).optional(),
  draft: z.boolean().default(true),
  published: z.boolean().default(false),
  locale: z.enum(['zh', 'en']),
})
export type Project = z.infer<typeof projectSchema>

export const aboutSchema = z.object({
  name: z.string(),
  title: z.string(),
  avatar: z.string(),
  introduction: z.string(),
  skills: z.array(z.object({
    name: z.string(),
    level: z.number(),
    category: z.string(),
  })),
  experience: z.array(z.object({
    role: z.string(),
    company: z.string(),
    period: z.string(),
    description: z.string(),
  })),
  socialLinks: z.object({
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    email: z.string().email().optional(),
  }),
  locale: z.enum(['zh', 'en']),
})
export type About = z.infer<typeof aboutSchema>

export const collections = {
  blog: defineCollection({
    source: 'blog/**/*.md',
    type: 'page',
    schema: blogSchema,
  }),
  essays: defineCollection({
    source: 'essays/**/*.md',
    type: 'page',
    schema: essaySchema,
  }),
  projects: defineCollection({
    source: 'projects/**/*.md',
    type: 'page',
    schema: projectSchema,
  }),
  about: defineCollection({
    source: 'about/*.md',
    type: 'page',
    schema: aboutSchema,
  }),
}
