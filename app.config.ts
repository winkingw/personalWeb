const siteUrl = process.env.SITE_URL || 'https://personal-web.local'

export default defineAppConfig({
  site: {
    name: 'Takagi San',
    description: 'Personal website — tech blog, projects, essays',
    url: siteUrl,
    ogImage: '/images/og-default.png',
    socialLinks: {
      github: '',
      linkedin: '',
      email: '',
    },
  },
})
