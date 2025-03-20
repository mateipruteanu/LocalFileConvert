import { MetadataRoute } from 'next';
import { conversionRoutes } from '@/lib/conversion-routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://localfileconvert.com';
  
  // Create the base homepage entry
  const homePageEntry = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };

  // Create entries for all conversion routes
  const conversionEntries = conversionRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    homePageEntry,
    ...conversionEntries,
  ];
}
