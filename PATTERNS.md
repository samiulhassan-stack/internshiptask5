# Common Patterns & Recipes

Quick reference for common patterns used throughout the application.

---

## 🎯 State Management Patterns

### Pattern 1: Basic Store Structure

```typescript
import { create } from 'zustand';

interface YourState {
  // Data
  items: Item[];
  
  // Loading state
  loadingState: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: Item) => void;
  removeItem: (id: number) => void;
  
  // Computed values
  getCount: () => number;
}

export const useYourStore = create<YourState>((set, get) => ({
  // Initial state
  items: [],
  loadingState: 'idle',
  error: null,
  
  // Async action
  fetchItems: async () => {
    set({ loadingState: 'loading', error: null });
    try {
      const items = await api.getItems();
      set({ items, loadingState: 'success' });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed',
        loadingState: 'error' 
      });
    }
  },
  
  // Sync action
  addItem: (item) => {
    set({ items: [...get().items, item] });
  },
  
  // Sync action with filtering
  removeItem: (id) => {
    set({ items: get().items.filter(item => item.id !== id) });
  },
  
  // Computed value
  getCount: () => get().items.length
}));
```

### Pattern 2: Using Store in Components

```typescript
// ✅ Good: Select only what you need
function Component() {
  const items = useStore(state => state.items);
  const addItem = useStore(state => state.addItem);
  
  return <div>{items.length}</div>;
}

// ❌ Avoid: Selecting entire store (causes unnecessary re-renders)
function Component() {
  const store = useStore(); // Re-renders on ANY state change
  return <div>{store.items.length}</div>;
}

// ✅ Good: Multiple selective subscriptions
function Component() {
  const items = useStore(state => state.items);
  const loading = useStore(state => state.loadingState === 'loading');
  
  if (loading) return <Skeleton />;
  return <List items={items} />;
}
```

---

## 🎨 Loading State Patterns

### Pattern 3: Complete Loading State Handling

```typescript
function DataComponent() {
  const { data, loadingState, error, fetchData } = useStore();
  
  // 1. Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // 2. Loading state - Show skeleton
  if (loadingState === 'loading') {
    return (
      <div>
        <YourSkeleton />
      </div>
    );
  }
  
  // 3. Error state - Show error with retry
  if (loadingState === 'error') {
    return (
      <EmptyState
        icon="⚠️"
        title="Failed to load"
        description={error || 'Something went wrong'}
        action={{
          label: 'Try Again',
          onClick: fetchData
        }}
      />
    );
  }
  
  // 4. Empty state - Show friendly message
  if (data.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No data yet"
        description="Your data will appear here"
      />
    );
  }
  
  // 5. Success state - Show data
  return (
    <div>
      {data.map(item => <Item key={item.id} item={item} />)}
    </div>
  );
}
```

### Pattern 4: Skeleton Loader Creation

```typescript
// Simple skeleton
<Skeleton variant="text" width="80%" />

// Multiple lines
<Skeleton variant="text" count={3} />

// Custom skeleton for your component
export const YourComponentSkeleton = () => (
  <div className="your-component-skeleton">
    {/* Match your actual component's layout */}
    <Skeleton variant="circular" width="48px" height="48px" />
    <div style={{ flex: 1 }}>
      <Skeleton variant="text" width="60%" height="24px" />
      <Skeleton variant="text" width="40%" height="16px" />
    </div>
    <Skeleton variant="rectangular" width="80px" height="32px" />
  </div>
);

// Array of skeletons
{Array.from({ length: 5 }).map((_, i) => (
  <YourComponentSkeleton key={i} />
))}
```

---

## 🎭 Empty State Patterns

### Pattern 5: Empty State Variants

```typescript
// Empty data
<EmptyState
  icon="📭"
  title="No items"
  description="You don't have any items yet"
/>

// With action
<EmptyState
  icon="🛒"
  title="Cart is empty"
  description="Add some items to get started"
  action={{
    label: 'Browse Products',
    onClick: handleBrowse
  }}
/>

// Search no results
<EmptyState
  icon="🔍"
  title="No results found"
  description={`No results for "${searchQuery}"`}
  action={{
    label: 'Clear Search',
    onClick: () => setSearchQuery('')
  }}
/>

// Error state
<EmptyState
  icon="⚠️"
  title="Something went wrong"
  description={error || 'An error occurred'}
  action={{
    label: 'Try Again',
    onClick: retry
  }}
/>

// Success empty
<EmptyState
  icon="✅"
  title="All done!"
  description="You've completed everything"
/>
```

---

## 🔄 Data Mutation Patterns

### Pattern 6: Optimistic Updates

```typescript
// Add item optimistically
addItemOptimistic: async (item: Item) => {
  // 1. Add to UI immediately
  const tempId = Date.now();
  const tempItem = { ...item, id: tempId };
  set({ items: [...get().items, tempItem] });
  
  try {
    // 2. Send to server
    const savedItem = await api.addItem(item);
    
    // 3. Replace temp with real data
    set({ 
      items: get().items.map(i => 
        i.id === tempId ? savedItem : i
      )
    });
  } catch (error) {
    // 4. Revert on error
    set({ 
      items: get().items.filter(i => i.id !== tempId),
      error: 'Failed to add item'
    });
  }
}
```

### Pattern 7: Batch Updates

```typescript
// Update multiple items at once
updateMultiple: (updates: Record<number, Partial<Item>>) => {
  set({
    items: get().items.map(item => 
      updates[item.id] 
        ? { ...item, ...updates[item.id] }
        : item
    )
  });
}

// Usage
updateMultiple({
  1: { completed: true },
  2: { completed: true },
  3: { completed: true }
});
```

---

## 🧩 Component Patterns

### Pattern 8: Smart vs Presentational Components

```typescript
// Smart component (connected to store)
export function SmartProductList() {
  const { products, addToCart } = useProductsStore();
  const { isInCart } = useCartStore();
  
  return (
    <ProductListPresentation
      products={products}
      onAddToCart={addToCart}
      isInCart={isInCart}
    />
  );
}

// Presentational component (pure, easy to test)
interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isInCart: (id: number) => boolean;
}

export function ProductListPresentation({ 
  products, 
  onAddToCart,
  isInCart 
}: ProductListProps) {
  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={() => onAddToCart(product)}
          inCart={isInCart(product.id)}
        />
      ))}
    </div>
  );
}
```

### Pattern 9: Compound Components

```typescript
// Container component
export function DataList({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useDataStore();
  
  return (
    <div className="data-list">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data, loading, error });
        }
        return child;
      })}
    </div>
  );
}

// Child components
DataList.Loading = ({ loading }: any) => 
  loading ? <Skeleton /> : null;

DataList.Error = ({ error }: any) => 
  error ? <EmptyState icon="⚠️" title="Error" description={error} /> : null;

DataList.Empty = ({ data }: any) => 
  data?.length === 0 ? <EmptyState icon="📭" title="No data" /> : null;

DataList.Items = ({ data }: any) => (
  <div>
    {data?.map((item: any) => <Item key={item.id} {...item} />)}
  </div>
);

// Usage
<DataList>
  <DataList.Loading />
  <DataList.Error />
  <DataList.Empty />
  <DataList.Items />
</DataList>
```

---

## 🔗 Store Composition Patterns

### Pattern 10: Cross-Store Communication

```typescript
// Store A can access Store B
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product) => {
    // Access user store for user-specific logic
    const user = useUserStore.getState().user;
    
    if (!user) {
      alert('Please log in');
      return;
    }
    
    set({ items: [...get().items, { product, quantity: 1 }] });
  }
}));
```

### Pattern 11: Derived State Across Stores

```typescript
// Custom hook combining multiple stores
export function useCartSummary() {
  const items = useCartStore(state => state.items);
  const user = useUserStore(state => state.user);
  
  return {
    items,
    user,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => 
      sum + item.product.price * item.quantity, 0
    ),
    hasDiscount: user?.role === 'premium'
  };
}

// Usage in component
function CartSummary() {
  const { totalItems, totalPrice, hasDiscount } = useCartSummary();
  
  return (
    <div>
      <p>{totalItems} items</p>
      <p>${totalPrice}</p>
      {hasDiscount && <p>Premium discount applied!</p>}
    </div>
  );
}
```

---

## 🎨 Styling Patterns

### Pattern 12: Conditional Classes

```typescript
// Using template literals
<div className={`card ${isActive ? 'active' : ''} ${isError ? 'error' : ''}`}>

// Using classnames library (if installed)
import classNames from 'classnames';

<div className={classNames('card', {
  'active': isActive,
  'error': isError,
  'disabled': isDisabled
})}>

// Using object-based approach
const classes = [
  'card',
  isActive && 'active',
  isError && 'error'
].filter(Boolean).join(' ');

<div className={classes}>
```

### Pattern 13: Dynamic Styles

```typescript
// Inline styles with TypeScript
const cardStyle: React.CSSProperties = {
  backgroundColor: isActive ? '#667eea' : '#fff',
  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  transition: 'all 0.2s ease'
};

<div style={cardStyle}>
```

---

## 🧪 Testing Patterns

### Pattern 14: Testing Stores

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCartStore } from './cartStore';

describe('CartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({ items: [] });
  });
  
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addToCart(mockProduct);
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product).toEqual(mockProduct);
  });
  
  it('should calculate total correctly', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addToCart(mockProduct);
    });
    
    expect(result.current.getTotalPrice()).toBe(mockProduct.price);
  });
});
```

### Pattern 15: Testing Components with Stores

```typescript
import { render, screen } from '@testing-library/react';
import { useCartStore } from './stores/cartStore';
import Cart from './Cart';

// Mock the store
jest.mock('./stores/cartStore');

describe('Cart Component', () => {
  it('shows empty state when cart is empty', () => {
    (useCartStore as jest.Mock).mockReturnValue({
      items: [],
      getTotalPrice: () => 0
    });
    
    render(<Cart />);
    expect(screen.getByText(/empty/i)).toBeInTheDocument();
  });
  
  it('shows items when cart has items', () => {
    (useCartStore as jest.Mock).mockReturnValue({
      items: [{ product: mockProduct, quantity: 1 }],
      getTotalPrice: () => 99.99
    });
    
    render(<Cart />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });
});
```

---

## 🚀 Performance Patterns

### Pattern 16: Memoization

```typescript
import { useMemo } from 'react';

function ExpensiveComponent() {
  const items = useStore(state => state.items);
  
  // Memoize expensive calculation
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.price - a.price);
  }, [items]);
  
  return (
    <div>
      {sortedItems.map(item => <Item key={item.id} {...item} />)}
    </div>
  );
}
```

### Pattern 17: Selective Re-renders

```typescript
// ❌ Bad: Re-renders on any store change
function Component() {
  const store = useStore();
  return <div>{store.count}</div>;
}

// ✅ Good: Only re-renders when count changes
function Component() {
  const count = useStore(state => state.count);
  return <div>{count}</div>;
}

// ✅ Better: Using equality function
function Component() {
  const count = useStore(
    state => state.count,
    (oldVal, newVal) => oldVal === newVal // custom equality
  );
  return <div>{count}</div>;
}
```

---

## 📝 TypeScript Patterns

### Pattern 18: Type-Safe Actions

```typescript
// Define action types
type Action = 
  | { type: 'SET_ITEMS'; items: Item[] }
  | { type: 'ADD_ITEM'; item: Item }
  | { type: 'REMOVE_ITEM'; id: number };

// Type-safe reducer pattern (if using reducers)
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.items };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] };
    case 'REMOVE_ITEM':
      return { 
        ...state, 
        items: state.items.filter(i => i.id !== action.id) 
      };
  }
}
```

### Pattern 19: Generic Store Factory

```typescript
// Create reusable store factory
function createListStore<T extends { id: number }>() {
  interface State {
    items: T[];
    add: (item: T) => void;
    remove: (id: number) => void;
    update: (id: number, updates: Partial<T>) => void;
  }
  
  return create<State>((set, get) => ({
    items: [],
    add: (item) => set({ items: [...get().items, item] }),
    remove: (id) => set({ items: get().items.filter(i => i.id !== id) }),
    update: (id, updates) => set({
      items: get().items.map(i => i.id === id ? { ...i, ...updates } : i)
    })
  }));
}

// Use factory
const useProductStore = createListStore<Product>();
const useTodoStore = createListStore<Todo>();
```

---

## 🎯 Quick Reference

### Checklist: Adding New Feature with Global State

1. ✅ Create store in `src/stores/yourStore.ts`
2. ✅ Define TypeScript interfaces
3. ✅ Implement actions and computed values
4. ✅ Create component that uses store
5. ✅ Add loading state with skeleton
6. ✅ Add empty state
7. ✅ Add error handling
8. ✅ Test in browser
9. ✅ Add to documentation

### Checklist: New Data-Fetching Component

1. ✅ Use `LoadingState` type
2. ✅ Handle all 4 states: idle, loading, success, error
3. ✅ Show skeleton during loading
4. ✅ Show empty state for zero data
5. ✅ Show error state with retry
6. ✅ Show data in success state

---

**Use these patterns as templates for building consistent, maintainable features!**
