// SEO metadata generation utility
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export function generateMetadata(seo: SEOMetadata) {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    openGraph: {
      title: seo.title,
      description: seo.description,
      image: seo.image,
      url: seo.url,
      type: seo.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      image: seo.image,
    },
  };
}

// JSON-LD Schema generation
export interface JSONLDSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function generateVehicleSchema(vehicle: any): JSONLDSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: vehicle.name,
    description: vehicle.description,
    image: vehicle.image,
    brand: vehicle.make,
    model: vehicle.model,
    modelDate: vehicle.year?.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.mileage?.toString(),
      unitCode: 'KMT',
    },
    vehicleConfiguration: vehicle.transmission,
    fuelType: vehicle.fuelType,
    color: vehicle.color,
    potentialAction: {
      '@type': 'TradeAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: vehicle.url,
      },
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): JSONLDSchema {
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

export function generateOrganizationSchema(): JSONLDSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AutoScout24 SafeTrade',
    url: 'https://www.autoscout24safetrade.com',
    logo: 'https://www.autoscout24safetrade.com/logo.png',
    sameAs: [
      'https://www.facebook.com/autoscout24',
      'https://www.twitter.com/autoscout24',
      'https://www.linkedin.com/company/autoscout24',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@autoscout24safetrade.com',
    },
  };
}

export default {
  generateMetadata,
  generateVehicleSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
};
