// SEO JSON-LD schema component
import { ReactNode } from 'react';

interface JSONLDProps {
  children: ReactNode;
}

export function JSONLD({ children }: JSONLDProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(children) }}
    />
  );
}

export default JSONLD;
