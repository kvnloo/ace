import type React from 'react';
import { useEffect } from 'react';
import type { SeoConfig } from '../services/seo';
import { updateSEO, setStructuredData } from '../services/seo';

interface SEOHelmetProps extends SeoConfig {
  /**
   * Automatically scroll to top when SEO tags are updated
   * @default false
   */
  scrollToTop?: boolean;
}

/**
 * SEOHelmet Component - React wrapper for dynamic SEO tag management
 *
 * This component provides a React-friendly way to update meta tags, Open Graph,
 * and Twitter Card tags dynamically without relying on external libraries.
 *
 * @example
 * ```tsx
 * <SEOHelmet
 *   title="My Page Title"
 *   description="This is my page description"
 *   ogImage="https://example.com/image.jpg"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <SEOHelmet
 *   title="Product Page"
 *   description="Amazing product"
 *   canonical="https://example.com/product/123"
 *   structuredData={{
 *     '@context': 'https://schema.org',
 *     '@type': 'Product',
 *     name: 'Amazing Product'
 *   }}
 * />
 * ```
 */
export const SEOHelmet: React.FC<SEOHelmetProps> = ({ scrollToTop = false, ...seoConfig }) => {
  useEffect(() => {
    // Update all SEO tags
    updateSEO(seoConfig);

    // Scroll to top if requested
    if (scrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [seoConfig, scrollToTop]);

  // This component doesn't render anything visual
  return null;
};

/**
 * Hook for updating SEO tags in functional components
 *
 * @example
 * ```tsx
 * const { setSEO } = useSEO();
 *
 * useEffect(() => {
 *   setSEO({
 *     title: 'My Page',
 *     description: 'My page description'
 *   });
 * }, []);
 * ```
 */
export const useSEO = () => {
  return {
    setSEO: updateSEO,
    setStructuredData: setStructuredData,
  };
};

export default SEOHelmet;
