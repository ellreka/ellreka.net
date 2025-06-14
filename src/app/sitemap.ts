import { MetadataRoute } from 'next'
import { getEntries } from '@/lib/getEntries'
import { getTags } from '@/lib/getTags'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ellreka.net'
  const entries = await getEntries()
  const tags = getTags(entries)
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/entries`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/releases`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
  
  const entryPages: MetadataRoute.Sitemap = entries.map(entry => ({
    url: `${baseUrl}/entry/${entry.slug}`,
    lastModified: new Date(entry.meta.date),
    changeFrequency: 'yearly',
    priority: 0.7,
  }))
  
  const tagPages: MetadataRoute.Sitemap = tags.map(tag => ({
    url: `${baseUrl}/entries/${encodeURIComponent(tag.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
  
  const sitePages: MetadataRoute.Sitemap = ['zenn', 'ellreka'].map(site => ({
    url: `${baseUrl}/entries/${site}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
  
  return [...staticPages, ...entryPages, ...tagPages, ...sitePages]
}