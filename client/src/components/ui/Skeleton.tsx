/**
 * Skeleton loading components for better perceived performance.
 * Shows placeholder UI while data is loading.
 */

import {
  skeletonText,
  skeletonTitle,
  skeletonCard,
  skeletonImage,
  skeletonButton,
} from './Skeleton.css';

export function SkeletonText({ width = '100%' }: { width?: string }) {
  return <div className={skeletonText} style={{ width }} />;
}

export function SkeletonTitle() {
  return <div className={skeletonTitle} />;
}

export function SkeletonImage() {
  return <div className={skeletonImage} />;
}

export function SkeletonButton() {
  return <div className={skeletonButton} />;
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className={skeletonCard}>
      <SkeletonTitle />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonText key={i} width={i === lines - 1 ? '80%' : '100%'} />
      ))}
    </div>
  );
}

/**
 * Product card skeleton for product lists
 */
export function ProductSkeleton() {
  return (
    <div className={skeletonCard}>
      <SkeletonImage />
      <SkeletonTitle />
      <SkeletonText width="40%" />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <SkeletonButton />
      </div>
    </div>
  );
}

/**
 * Order item skeleton for orders lists
 */
export function OrderSkeleton() {
  return (
    <div className={skeletonCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <SkeletonText width="30%" />
        <SkeletonText width="20%" />
      </div>
      <SkeletonText width="50%" />
      <SkeletonText width="70%" />
    </div>
  );
}

/**
 * Table row skeleton for admin tables
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: '0.75rem' }}>
          <SkeletonText />
        </td>
      ))}
    </tr>
  );
}

/**
 * Generic list skeleton - renders multiple skeleton items
 */
export function ListSkeleton({
  count = 3,
  type = 'card',
}: {
  count?: number;
  type?: 'card' | 'product' | 'order';
}) {
  const SkeletonComponent =
    type === 'product' ? ProductSkeleton : type === 'order' ? OrderSkeleton : SkeletonCard;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </>
  );
}
