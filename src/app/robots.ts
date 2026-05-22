import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://saas-eta-rose.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/signin', '/signup'],
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
