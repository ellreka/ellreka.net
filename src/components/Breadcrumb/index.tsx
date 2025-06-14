import Link from 'next/link';
import { createBreadcrumbStructuredData } from '@/lib/structured-data';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ellreka.net';
  
  const structuredData = createBreadcrumbStructuredData(
    items.map(item => ({
      name: item.name,
      url: item.href ? `${siteUrl}${item.href}` : undefined
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="パンくずリスト" className="mb-4">
        <ol className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-gray-100">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};