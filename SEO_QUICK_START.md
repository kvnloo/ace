# SEO Quick Start Guide - LawnTech Dynamics

## Overview

This quick reference shows how to use the SEO system implemented in your project.

## Files Created

| File                                      | Purpose                                  |
| ----------------------------------------- | ---------------------------------------- |
| `/home/user/ace/index.html`               | Updated with comprehensive SEO meta tags |
| `/home/user/ace/services/seo.ts`          | Core SEO utility service                 |
| `/home/user/ace/components/SEOHelmet.tsx` | React component wrapper                  |
| `/home/user/ace/SEO.md`                   | Comprehensive documentation (23KB)       |

## Quick Usage

### Method 1: Component Approach (Recommended)

```tsx
import { SEOHelmet } from './components/SEOHelmet';

export function HomePage() {
  return (
    <>
      <SEOHelmet
        title="LawnTech Dynamics - AI-Powered Tennis Facility"
        description="Experience the future of tennis with cutting-edge 3D visualization and AI coaching."
        canonical="https://lawntech-dynamics.com/"
        ogImage="https://lawntech-dynamics.com/og-image.jpg"
      />
      <div>{/* Your page content */}</div>
    </>
  );
}
```

### Method 2: Hook Approach

```tsx
import { useSEO } from './components/SEOHelmet';
import { useEffect } from 'react';

export function ProductPage({ product }) {
  const { setSEO, setStructuredData } = useSEO();

  useEffect(() => {
    setSEO({
      title: `${product.name} - LawnTech`,
      description: product.shortDescription,
      canonical: `https://lawntech-dynamics.com/products/${product.id}`,
      ogImage: product.imageUrl,
      ogType: 'product',
    });

    setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      price: product.price,
      priceCurrency: 'USD',
    });
  }, [product, setSEO, setStructuredData]);

  return <div>{/* Product content */}</div>;
}
```

### Method 3: Direct Function Calls

```tsx
import { updateSEO, generateBreadcrumbSchema } from './services/seo';

// Update all tags at once
updateSEO({
  title: 'About LawnTech',
  description: 'Learn about our mission...',
  keywords: 'tennis, AI, facility',
  canonical: 'https://lawntech-dynamics.com/about',
  ogImage: 'https://lawntech-dynamics.com/about-hero.jpg',
});

// Generate and set structured data
const breadcrumbs = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://lawntech-dynamics.com/' },
  { name: 'About', url: 'https://lawntech-dynamics.com/about' },
]);
updateSEO({ structuredData: breadcrumbs });
```

## Static Meta Tags in index.html

The following meta tags are already configured in `index.html`:

### Primary Tags

- Title: Optimized for search engines
- Meta Description: Compelling call-to-action
- Keywords: Relevant search terms
- Author: Brand name
- Theme Color: #DFFF4F (Tennis yellow)

### Open Graph Tags (11 tags)

- og:type, og:url, og:title, og:description
- og:image, og:image:alt, og:image:width, og:image:height
- og:site_name, og:locale
- Plus LinkedIn fallbacks

### Twitter Card Tags (8 tags)

- twitter:card (summary_large_image)
- twitter:title, twitter:description, twitter:image
- twitter:image:alt, twitter:creator, twitter:site
- twitter:url

### Mobile & Web App Tags

- viewport meta tag
- apple-mobile-web-app-capable
- apple-mobile-web-app-status-bar-style
- apple-mobile-web-app-title
- mobile-web-app-capable

### Performance Tags

- Canonical URL
- Favicon (SVG emoji)
- Apple touch icon
- Preconnect directives (fonts, CDN)
- DNS-prefetch for external resources

### Structured Data (3 schemas)

1. Organization Schema - Knowledge panel data
2. Website Schema - Sitelinks search box
3. SportsActivityLocation Schema - Rich results

### Robots & Indexing

- robots meta tag with detailed directives
- hreflang tags for international variants

## API Reference

### Main Functions

```typescript
// Update all tags at once
updateSEO(config: SeoConfig): void

// Update specific tags
setPageTitle(title: string): void
setDescription(description: string): void
setOpenGraphTags(config: Partial<SeoConfig>): void
setTwitterCardTags(config: Partial<SeoConfig>): void
setCanonicalUrl(url: string): void
setRobots(robots: string): void
setKeywords(keywords: string): void
setStructuredData(data: Record<string, unknown>): void

// Schema generators
generateOrganizationSchema(overrides?: Record<string, unknown>): Record<string, unknown>
generateBreadcrumbSchema(items: Array<{name: string; url: string}>): Record<string, unknown>
generateProductSchema(config: {...}): Record<string, unknown>

// Reset to defaults
resetSEO(): void
```

### SeoConfig Interface

```typescript
interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  author?: string;
  robots?: string;

  // Open Graph
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

  // Twitter Card
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  twitterCreator?: string;
  twitterSite?: string;

  // Structured Data
  structuredData?: Record<string, unknown>;
}
```

## Best Practices

### Title Tags

- 50-60 characters
- Include primary keyword
- Brand at the end
- Unique per page

**Example:** `"AI Tennis Coaching - LawnTech | Real-time Analytics"`

### Meta Descriptions

- 150-160 characters
- Include keyword naturally
- Action-oriented
- Compelling CTA

**Example:** `"Discover AI-powered tennis coaching with real-time performance analysis. Book your session at LawnTech Dynamics today."`

### Open Graph Images

- 1200 x 630 pixels (1.91:1 ratio)
- Include logo/branding
- High contrast
- < 500KB optimized

### Canonical URLs

- Use full URLs
- Must match og:url
- Set for every page
- Prevent duplicate content issues

### Structured Data

- Validate with Google Rich Results Test
- Include required properties
- Use appropriate schema types
- Update when content changes

## Testing Your Implementation

### Browser DevTools

```javascript
// Check all meta tags
document.querySelectorAll('meta[property^="og:"]');
document.querySelectorAll('meta[name^="twitter:"]');

// Check structured data
document.querySelector('script[type="application/ld+json"]');
```

### Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Google PageSpeed**: https://pagespeed.web.dev/

## Common Patterns

### Product/Service Page

```tsx
<SEOHelmet
  title={`${product.name} - LawnTech`}
  description={product.excerpt}
  canonical={`https://lawntech-dynamics.com/products/${product.slug}`}
  ogImage={product.mainImage}
  ogType="product"
  structuredData={generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.mainImage,
    price: product.price,
    ratingValue: product.rating,
    ratingCount: product.reviewCount,
  })}
/>
```

### Blog Article

```tsx
<SEOHelmet
  title={`${article.title} | LawnTech Blog`}
  description={article.excerpt}
  canonical={`https://lawntech-dynamics.com/blog/${article.slug}`}
  ogImage={article.featuredImage}
  ogType="article"
  structuredData={{
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: article.authorName },
  }}
/>
```

### Category/Listing Page

```tsx
<SEOHelmet
  title={`${category} Packages - LawnTech`}
  description={`Browse our ${category} packages and find the perfect option for you.`}
  canonical={`https://lawntech-dynamics.com/packages/${category.slug}`}
  ogImage={categoryBanner}
  structuredData={generateBreadcrumbSchema([
    { name: 'Home', url: 'https://lawntech-dynamics.com/' },
    { name: 'Packages', url: 'https://lawntech-dynamics.com/packages' },
    { name: category, url: `https://lawntech-dynamics.com/packages/${category.slug}` },
  ])}
/>
```

## SEO Checklist

Before deploying any page:

- [ ] Title tag (50-60 chars)
- [ ] Meta description (150-160 chars)
- [ ] Canonical URL set
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Structured data added
- [ ] Mobile viewport verified
- [ ] Internal links checked
- [ ] Images optimized and have alt text
- [ ] Page loads on HTTPS

## Performance Impact

- **Zero runtime overhead**: Meta tags are updated synchronously
- **Lightweight**: ~9KB service code, ~2KB component code
- **No dependencies**: Pure TypeScript/React (no external libraries)
- **Efficient updates**: Only modified tags are updated in DOM
- **SEO best practices**: Follows Google and Schema.org guidelines

## Support

For detailed documentation, see `/home/user/ace/SEO.md`

For implementation help, refer to the examples in this file and the React component samples.

## Next Steps

1. Update og:image URL to point to actual image file
2. Set up Twitter account handles
3. Add Google Search Console tracking
4. Configure Analytics tracking
5. Test with Google Rich Results Tool
6. Monitor performance in Google Search Console
