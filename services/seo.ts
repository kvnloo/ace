/**
 * SEO Service - Helmet-like system for dynamic meta tags management
 *
 * This module provides utilities to dynamically update meta tags, Open Graph,
 * and structured data without relying on external libraries like React Helmet.
 */

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogUrl?: string;
  ogSiteName?: string;
  ogLocale?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  twitterCreator?: string;
  twitterSite?: string;
  author?: string;
  robots?: string;
  structuredData?: Record<string, unknown>;
}

const DEFAULT_SITE_NAME = 'LawnTech Dynamics';
const DEFAULT_SITE_URL = 'https://lawntech-dynamics.com';
const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/og-image.jpg`;
const DEFAULT_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

/**
 * Create or update a meta tag
 */
function setMetaTag(name: string, content: string, isProperty: boolean = false): void {
  const attribute = isProperty ? 'property' : 'name';
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

/**
 * Create or update a link tag
 */
function setLinkTag(rel: string, href: string, attributes: Record<string, string> = {}): void {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    document.head.appendChild(tag);
  }

  tag.href = href;
  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
}

/**
 * Update the page title
 */
function setPageTitle(title: string): void {
  document.title = title;
  setMetaTag('title', title);
  setMetaTag('og:title', title, true);
  setMetaTag('twitter:title', title);
}

/**
 * Update meta description
 */
function setDescription(description: string): void {
  setMetaTag('description', description);
  setMetaTag('og:description', description, true);
  setMetaTag('twitter:description', description);
}

/**
 * Set Open Graph tags
 */
function setOpenGraphTags(config: Partial<SeoConfig>): void {
  const ogConfig = {
    type: config.ogType || 'website',
    title: config.ogTitle || config.title || DEFAULT_SITE_NAME,
    description: config.ogDescription || config.description || '',
    image: config.ogImage || DEFAULT_IMAGE,
    url: config.ogUrl || DEFAULT_SITE_URL,
    siteName: config.ogSiteName || DEFAULT_SITE_NAME,
    locale: config.ogLocale || 'en_US',
  };

  setMetaTag('og:type', ogConfig.type, true);
  setMetaTag('og:title', ogConfig.title, true);
  setMetaTag('og:description', ogConfig.description, true);
  setMetaTag('og:image', ogConfig.image, true);
  setMetaTag('og:image:alt', config.ogImageAlt || 'LawnTech Dynamics', true);
  setMetaTag('og:image:width', config.ogImageWidth || '1200', true);
  setMetaTag('og:image:height', config.ogImageHeight || '630', true);
  setMetaTag('og:url', ogConfig.url, true);
  setMetaTag('og:site_name', ogConfig.siteName, true);
  setMetaTag('og:locale', ogConfig.locale, true);
}

/**
 * Set Twitter Card tags
 */
function setTwitterCardTags(config: Partial<SeoConfig>): void {
  const twitterConfig = {
    card: config.twitterCard || 'summary_large_image',
    title: config.twitterTitle || config.title || DEFAULT_SITE_NAME,
    description: config.twitterDescription || config.description || '',
    image: config.twitterImage || DEFAULT_IMAGE,
    creator: config.twitterCreator || '@lawntech_dynamics',
    site: config.twitterSite || '@lawntech_dynamics',
  };

  setMetaTag('twitter:card', twitterConfig.card);
  setMetaTag('twitter:title', twitterConfig.title);
  setMetaTag('twitter:description', twitterConfig.description);
  setMetaTag('twitter:image', twitterConfig.image);
  setMetaTag('twitter:image:alt', config.twitterImageAlt || 'LawnTech Dynamics', false);
  setMetaTag('twitter:creator', twitterConfig.creator);
  setMetaTag('twitter:site', twitterConfig.site);
}

/**
 * Set canonical URL
 */
function setCanonicalUrl(url: string): void {
  setLinkTag('canonical', url);
}

/**
 * Set structured data (JSON-LD)
 */
export function setStructuredData(data: Record<string, unknown>): void {
  let script = document.querySelector('script[data-seo="structured"]') as HTMLScriptElement;

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'structured');
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

/**
 * Set robots meta tag
 */
function setRobots(robots: string): void {
  setMetaTag('robots', robots);
}

/**
 * Set keywords
 */
function setKeywords(keywords: string): void {
  setMetaTag('keywords', keywords);
}

/**
 * Main function to update all SEO tags at once
 */
export function updateSEO(config: SeoConfig): void {
  // Update basic meta tags
  if (config.title) {
    setPageTitle(config.title);
  }

  if (config.description) {
    setDescription(config.description);
  }

  if (config.keywords) {
    setKeywords(config.keywords);
  }

  if (config.canonical) {
    setCanonicalUrl(config.canonical);
  }

  if (config.author) {
    setMetaTag('author', config.author);
  }

  if (config.robots) {
    setRobots(config.robots);
  }

  // Update Open Graph tags
  setOpenGraphTags(config);

  // Update Twitter Card tags
  setTwitterCardTags(config);

  // Update structured data if provided
  if (config.structuredData) {
    setStructuredData(config.structuredData);
  }
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LawnTech Dynamics',
    url: DEFAULT_SITE_URL,
    logo: `${DEFAULT_SITE_URL}/logo.svg`,
    description:
      'An autonomous, AI-integrated indoor grass tennis facility featuring cutting-edge 3D visualization and real-time gameplay analysis.',
    sameAs: [
      'https://twitter.com/lawntech_dynamics',
      'https://linkedin.com/company/lawntech-dynamics',
      'https://instagram.com/lawntech_dynamics',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@lawntech-dynamics.com',
      availableLanguage: ['en'],
    },
    ...overrides,
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Product/Service structured data
 */
export function generateProductSchema(config: {
  name: string;
  description: string;
  image?: string;
  price?: string;
  priceCurrency?: string;
  ratingValue?: number;
  ratingCount?: number;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: config.name,
    description: config.description,
    image: config.image || DEFAULT_IMAGE,
    ...(config.price && {
      offers: {
        '@type': 'Offer',
        price: config.price,
        priceCurrency: config.priceCurrency || 'USD',
      },
    }),
    ...(config.ratingValue && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: config.ratingValue,
        ratingCount: config.ratingCount || 1,
      },
    }),
  };
}

/**
 * Reset SEO to default values
 */
export function resetSEO(): void {
  updateSEO({
    title: `${DEFAULT_SITE_NAME} - Futuristic AI-Powered Indoor Tennis Facility`,
    description:
      'Experience the future of tennis with LawnTech Dynamics - an autonomous, AI-integrated indoor grass tennis facility featuring cutting-edge 3D visualization, real-time gameplay analysis, and immersive sports technology.',
    canonical: DEFAULT_SITE_URL,
    ogUrl: DEFAULT_SITE_URL,
  });
}

export default {
  updateSEO,
  setPageTitle,
  setDescription,
  setOpenGraphTags,
  setTwitterCardTags,
  setCanonicalUrl,
  setRobots,
  setKeywords,
  setStructuredData,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateProductSchema,
  resetSEO,
};
