import Link from 'next/link';
import { createBreadcrumbStructuredData } from '@/lib/structured-data';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPageTitle?: string; // 構造化データ用の現在ページタイトル
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentPageTitle }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ellreka.net';
  
  // 構造化データ用のアイテム（現在ページタイトルを含む）
  const structuredDataItems = [
    ...items.map(item => ({
      name: item.name,
      url: item.href ? `${siteUrl}${item.href}` : undefined
    })),
    ...(currentPageTitle ? [{ name: currentPageTitle }] : [])
  ];
  
  const structuredData = createBreadcrumbStructuredData(structuredDataItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="パンくずリスト" className="mb-6 overflow-hidden">
        <ol className="flex items-center text-xs whitespace-nowrap">
          {items.map((item, index) => {
            const isLastItem = index === items.length - 1;
            
            return (
              <li key={index} className={`flex items-center ${isLastItem ? 'min-w-0 flex-1' : ''}`}>
                {index > 0 && (
                  <span className="mx-2 text-gray-400 dark:text-gray-600 flex-shrink-0" aria-hidden="true">
                    /
                  </span>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex-shrink-0"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className={`${isLastItem ? "text-gray-400 dark:text-gray-600 truncate block" : "text-gray-600 dark:text-gray-400"}`}>
                    {item.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};