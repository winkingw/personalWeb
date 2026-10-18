const siteUrl = process.env.SITE_URL || 'https://winkingw.github.io/personalWeb/'

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
