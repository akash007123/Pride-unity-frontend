/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  robots?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tag?: string;
}

const DEFAULT_SEO = {
  siteName: 'PrideCommunity',
  siteUrl: 'https://pridevoice.netlify.app',
  defaultTitle: 'PrideCommunity - LGBTQ+ Advocacy, Support & Community Platform',
  defaultDescription: 'Join PrideCommunity - a safe space for LGBTQ+ individuals. Access resources, connect with community members, attend events, and find support. Together we unite in diversity and celebrate pride.',
  defaultImage: 'https://pridevoice.netlify.app/og-image.jpg',
  twitterHandle: '@pridecommunity',
};

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  ogTitle,
  ogDescription,
  twitterCard = 'summary_large_image',
  twitterSite = DEFAULT_SEO.twitterHandle,
  twitterCreator = DEFAULT_SEO.twitterHandle,
  robots = 'index, follow',
  publishedTime,
  modifiedTime,
  author,
  section,
  tag,
}: SEOProps) {
  const pageTitle = title ? `${title} | ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.defaultTitle;
  const metaDescription = description || DEFAULT_SEO.defaultDescription;
  const metaKeywords = keywords?.join(', ') || 'LGBTQ+, pride, inclusivity, advocacy, community, identity, gay rights, transgender support';
  const fullCanonicalUrl = canonicalUrl ? `${DEFAULT_SEO.siteUrl}${canonicalUrl}` : DEFAULT_SEO.siteUrl;
  const fullOgImage = ogImage ? `${DEFAULT_SEO.siteUrl}${ogImage}` : DEFAULT_SEO.defaultImage;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Update meta tags
    updateMetaTag('name', 'title', pageTitle);
    updateMetaTag('name', 'description', metaDescription);
    updateMetaTag('name', 'keywords', metaKeywords);
    updateMetaTag('name', 'robots', robots);
    updateMetaTag('name', 'author', author || DEFAULT_SEO.siteName);
    
    // Update canonical URL
    updateOrCreateLink('canonical', fullCanonicalUrl);

    // Open Graph tags
    updateMetaTag('property', 'og:title', pageTitle);
    updateMetaTag('property', 'og:description', metaDescription);
    updateMetaTag('property', 'og:url', fullCanonicalUrl);
    updateMetaTag('property', 'og:image', fullOgImage);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:site_name', DEFAULT_SEO.siteName);
    updateMetaTag('property', 'og:locale', 'en_US');

    // Article specific OG tags
    if (ogType === 'article') {
      updateMetaTag('property', 'article:published_time', publishedTime);
      updateMetaTag('property', 'article:modified_time', modifiedTime);
      updateMetaTag('property', 'article:author', author || DEFAULT_SEO.siteName);
      updateMetaTag('property', 'article:section', section);
      updateMetaTag('property', 'article:tag', tag);
    }

    // Twitter Card tags
    updateMetaTag('name', 'twitter:card', twitterCard);
    updateMetaTag('name', 'twitter:site', twitterSite);
    updateMetaTag('name', 'twitter:creator', twitterCreator);
    updateMetaTag('name', 'twitter:title', pageTitle);
    updateMetaTag('name', 'twitter:description', metaDescription);
    updateMetaTag('name', 'twitter:image', fullOgImage);
    updateMetaTag('name', 'twitter:url', fullCanonicalUrl);

    // Cleanup on unmount
    return () => {
      // Reset to default on cleanup
      document.title = DEFAULT_SEO.defaultTitle;
    };
  }, [
    pageTitle, 
    metaDescription, 
    metaKeywords, 
    robots, 
    fullCanonicalUrl, 
    fullOgImage,
    ogType,
    publishedTime,
    modifiedTime,
    author,
    section,
    tag,
    twitterCard,
    twitterSite,
    twitterCreator,
  ]);

  return null; // This component doesn't render anything
}

// Helper function to update or create meta tags
function updateMetaTag(type: 'name' | 'property', name: string, content: string | undefined) {
  if (!content) return;
  
  let element = document.querySelector(`meta[${type}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(type, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

// Helper function to update or create link tags
function updateOrCreateLink(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}

// JSON-LD structured data component
export interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]:not([data-dynamic])');
    existingScripts.forEach(script => script.remove());

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic', 'true');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      const dynamicScripts = document.querySelectorAll('script[type="application/ld+json"][data-dynamic]');
      dynamicScripts.forEach(script => script.remove());
    };
  }, [data]);

  return null;
}

// Organization structured data
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${DEFAULT_SEO.siteUrl}/#organization`,
  "name": DEFAULT_SEO.siteName,
  "url": DEFAULT_SEO.siteUrl,
  "logo": {
    "@type": "ImageObject",
    "url": `${DEFAULT_SEO.siteUrl}/logo.png`,
    "width": 512,
    "height": 512
  },
  "description": DEFAULT_SEO.defaultDescription,
  "foundingDate": "2024",
  "sameAs": [
    "https://www.facebook.com/pridecommunity",
    "https://twitter.com/pridecommunity",
    "https://www.instagram.com/pridecommunity",
    "https://www.linkedin.com/company/pridecommunity"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "support@pridevoice.netlify.app",
    "availableLanguage": ["English"]
  }
};

// Website structured data
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${DEFAULT_SEO.siteUrl}/#website`,
  "url": DEFAULT_SEO.siteUrl,
  "name": DEFAULT_SEO.siteName,
  "publisher": {
    "@id": `${DEFAULT_SEO.siteUrl}/#organization`
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${DEFAULT_SEO.siteUrl}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "en"
};

// Breadcrumb structured data
export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Blog post structured data
export const createArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@id": `${DEFAULT_SEO.siteUrl}/#organization`
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

// Event structured data
export const createEventSchema = (event: {
  name: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "image": event.image,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": event.location
  },
  "organizer": {
    "@id": `${DEFAULT_SEO.siteUrl}/#organization`
  },
  "url": event.url
});

export default SEOHead;
