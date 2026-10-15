import React, { useEffect } from 'react';
import { useUserStore } from '../stores/userStore';
import { useCartStore } from '../stores/cartStore';
import { UserProfileSkeleton } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import '../styles/user.css';

export const UserProfile: React.FC = () => {
  // Using global state - no prop drilling needed!
  const { user, loadingState, error, fetchUser, logout } = useUserStore();
  const { getTotalItems } = useCartStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Loading state with skeleton
  if (loadingState === 'loading') {
    return (
      <div className="user-profile">
        <UserProfileSkeleton />
      </div>
    );
  }

  // Error state
  if (loadingState === 'error') {
    return (
      <div className="user-profile">
        <EmptyState
          icon="😞"
          title="Failed to load profile"
          description={error || 'Could not load user information'}
          action={{
            label: 'Retry',
            onClick: fetchUser
          }}
        />
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="user-profile">
        <EmptyState
          icon="👤"
          title="Not logged in"
          description="Please log in to access your profile"
          action={{
            label: 'Log In',
            onClick: fetchUser
          }}
        />
      </div>
    );
  }

  // Success state with user data
  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="user-avatar">{user.avatar}</div>
        <div className="user-details">
          <h3>{user.name}</h3>
          <p className="user-email">{user.email}</p>
          <span className={`user-role role-${user.role}`}>{user.role}</span>
        </div>
      </div>
      
      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-value">{getTotalItems()}</span>
          <span className="stat-label">Cart Items</span>
        </div>
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};
