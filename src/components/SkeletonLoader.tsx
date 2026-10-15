import React from 'react';
import '../styles/skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'text', 
  width, 
  height,
  count = 1 
}) => {
  const getSkeletonClass = () => {
    switch (variant) {
      case 'circular': return 'skeleton skeleton-circular';
      case 'rectangular': return 'skeleton skeleton-rectangular';
      case 'card': return 'skeleton skeleton-card';
      default: return 'skeleton skeleton-text';
    }
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '200px')
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={getSkeletonClass()} style={style} />
      ))}
    </>
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <div className="product-card-skeleton">
    <Skeleton variant="rectangular" height="150px" />
    <div style={{ padding: '16px' }}>
      <Skeleton variant="text" height="24px" width="80%" />
      <Skeleton variant="text" height="16px" width="60%" />
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <Skeleton variant="rectangular" height="40px" width="100px" />
        <Skeleton variant="rectangular" height="40px" width="100px" />
      </div>
    </div>
  </div>
);

export const TodoItemSkeleton: React.FC = () => (
  <div className="todo-item-skeleton">
    <Skeleton variant="circular" width="24px" height="24px" />
    <Skeleton variant="text" width="70%" />
    <Skeleton variant="rectangular" width="60px" height="32px" />
  </div>
);

export const UserProfileSkeleton: React.FC = () => (
  <div className="user-profile-skeleton">
    <Skeleton variant="circular" width="60px" height="60px" />
    <div style={{ flex: 1 }}>
      <Skeleton variant="text" height="24px" width="150px" />
      <Skeleton variant="text" height="16px" width="200px" />
    </div>
  </div>
);
