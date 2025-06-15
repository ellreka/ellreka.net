export interface WebsiteStructuredData {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  url: string;
  name: string;
  description?: string;
  author?: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
}

export interface ArticleStructuredData {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  image?: string;
  description?: string;
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string[];
}

export interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

export interface BreadcrumbListStructuredData {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ellreka.net';

export function createWebsiteStructuredData(): WebsiteStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: 'ellreka.net',
    description: 'Technical blog by ellreka',
    author: {
      '@type': 'Person',
      name: 'ellreka',
      url: siteUrl
    }
  };
}

export function createArticleStructuredData({
  title,
  date,
  description,
  tags,
  slug,
  ogpImage
}: {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  slug: string;
  ogpImage?: string;
}): ArticleStructuredData {
  const articleUrl = `${siteUrl}/entry/${slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name: 'ellreka',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'ellreka.net',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`
      }
    },
    image: ogpImage || `${siteUrl}/favicon.ico`,
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    keywords: tags
  };
}

export function createBreadcrumbStructuredData(
  items: Array<{ name: string; url?: string }>
): BreadcrumbListStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };
}