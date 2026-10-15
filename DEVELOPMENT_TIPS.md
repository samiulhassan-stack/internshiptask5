# Development Tips & Best Practices

Helpful tips for working with this codebase and extending it.

---

## 🚀 Getting Started Tips

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# Navigate to http://localhost:5173
```

### Hot Module Replacement (HMR)

Vite provides instant feedback:
- Edit a component → See changes immediately
- Edit styles → No page reload needed
- TypeScript errors → Shown in browser overlay

---

## 🛠️ Development Workflow

### Recommended Development Order

1. **Start with types** (`src/types/index.ts`)
   - Define your data structures first
   - TypeScript will guide the rest

2. **Create the store** (`src/stores/`)
   - Implement state and actions
   - Test in console first

3. **Build the component** (`src/components/`)
   - Use the store
   - Handle all states (loading, error, empty, success)

4. **Add styles** (`src/styles/`)
   - Start with layout
   - Add polish last

5. **Test in browser**
   - Check all states
   - Test interactions

---

## 🎯 Store Development Tips

### Tip 1: Use DevTools

```typescript
import { devtools } from 'zustand/middleware';

export const useCartStore = create(
  devtools<CartState>(
    (set, get) => ({
      // Your store implementation
    }),
    { name: 'CartStore' } // Shows in Redux DevTools
  )
);
```

Install Redux DevTools browser extension to inspect state!

### Tip 2: Debug with Logging

```typescript
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (product) => {
    console.log('Adding to cart:', product);
    const newItems = [...get().items, { product, quantity: 1 }];
    console.log('New cart state:', newItems);
    set({ items: newItems });
  }
}));
```

### Tip 3: Test Stores Independently

```typescript
// In browser console:
const store = window.useCartStore = require('./stores/cartStore').useCartStore;

// Test actions
store.getState().addToCart({ id: 1, name: 'Test' });
console.log(store.getState().items);
```

### Tip 4: Reset Store for Testing

```typescript
// Add reset action to every store
reset: () => set({
  items: [],
  loadingState: 'idle',
  error: null
})

// Call it during development
useCartStore.getState().reset();
```

---

## 🧩 Component Development Tips

### Tip 5: Component Development Template

```typescript
import React, { useEffect } from 'react';
import { useYourStore } from '../stores/yourStore';
import { YourSkeleton } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import '../styles/your.css';

export const YourComponent: React.FC = () => {
  const { data, loadingState, error, fetchData } = useYourStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Loading
  if (loadingState === 'loading') {
    return <YourSkeleton />;
  }

  // Error
  if (loadingState === 'error') {
    return (
      <EmptyState
        icon="⚠️"
        title="Error"
        description={error || 'Failed to load'}
        action={{ label: 'Retry', onClick: fetchData }}
      />
    );
  }

  // Empty
  if (data.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No data"
        description="You don't have any data yet"
      />
    );
  }

  // Success
  return (
    <div className="your-container">
      {data.map(item => (
        <YourItem key={item.id} item={item} />
      ))}
    </div>
  );
};
```

### Tip 6: Use React DevTools

Install React DevTools extension:
- Inspect component props and state
- See which components re-render
- Profile performance

Highlight updates in settings to visualize re-renders!

### Tip 7: Console Log During Development

```typescript
export const ProductList: React.FC = () => {
  const products = useProductsStore(state => state.products);
  
  // Temporary logs for debugging
  console.log('ProductList render, products:', products.length);
  
  // Remove before committing!
  
  return <div>{/* ... */}</div>;
};
```

### Tip 8: Isolate Component Development

Create a temporary route to test your component in isolation:

```typescript
// In App.tsx during development
function App() {
  const [devMode, setDevMode] = useState(false);
  
  if (devMode) {
    return <YourNewComponent />; // Test in isolation
  }
  
  return <NormalApp />;
}
```

---

## 🎨 Styling Tips

### Tip 9: Use Browser DevTools

- **Inspect element** → See applied styles
- **Edit live** → Test changes before committing
- **Copy styles** → Paste into CSS file

### Tip 10: CSS Organization

```css
/* Component: ProductCard */

/* 1. Layout */
.product-card {
  display: flex;
  flex-direction: column;
}

/* 2. Spacing */
.product-card {
  padding: 16px;
  gap: 12px;
}

/* 3. Visual */
.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 4. Interactions */
.product-card:hover {
  transform: translateY(-2px);
}

/* 5. Responsive */
@media (max-width: 768px) {
  .product-card {
    padding: 12px;
  }
}
```

### Tip 11: CSS Variables for Consistency

```css
/* In global.css */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #333;
  --border-radius: 8px;
  --spacing-unit: 8px;
}

/* Use in components */
.button {
  background: var(--primary-color);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 2);
}
```

### Tip 12: Quick Styling Iterations

```typescript
// During development, use inline styles for quick testing
<div style={{ 
  backgroundColor: 'red',  // Quick visual test
  border: '2px solid blue' 
}}>

// Once happy, move to CSS file
```

---

## 🐛 Debugging Tips

### Tip 13: TypeScript Errors

**Error:** `Property 'foo' does not exist on type 'Bar'`

**Solution:**
1. Check your type definitions in `src/types/index.ts`
2. Make sure you're using the correct interface
3. Use TypeScript's "Go to Definition" (F12)

### Tip 14: Store Not Updating

**Problem:** Component doesn't re-render when store changes

**Solutions:**
```typescript
// ❌ Wrong: Object reference doesn't change
set({ items: items }); 

// ✅ Right: Create new array
set({ items: [...items] });

// ❌ Wrong: Mutating array
items.push(newItem);
set({ items });

// ✅ Right: Non-mutating update
set({ items: [...items, newItem] });
```

### Tip 15: Component Not Re-rendering

**Problem:** Store updates but component doesn't

**Check:**
```typescript
// ❌ Wrong: Not selecting from store
const store = useCartStore();
// Only re-renders when ENTIRE store changes

// ✅ Right: Selecting specific values
const items = useCartStore(state => state.items);
// Re-renders when items change
```

### Tip 16: Infinite Loop Detection

**Problem:** Component keeps re-rendering

**Common causes:**
```typescript
// ❌ Creating new function every render
useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData is new every time!

// ✅ Solution 1: Remove dependency
useEffect(() => {
  fetchData();
}, []); // eslint-disable-line

// ✅ Solution 2: Use useCallback
const fetchData = useCallback(() => {
  // ...
}, []);
```

---

## 🧪 Testing Tips

### Tip 17: Manual Testing Checklist

For each component:
- [ ] Loading state shows skeleton
- [ ] Error state shows error message with retry
- [ ] Empty state shows when no data
- [ ] Success state shows data correctly
- [ ] Interactions work (buttons, forms)
- [ ] Responsive on mobile
- [ ] No console errors

### Tip 18: Simulate Different States

```typescript
// In store, add debug actions
export const useProductsStore = create<State>((set) => ({
  // ... normal actions
  
  // Debug helpers (remove before production)
  _setLoading: () => set({ loadingState: 'loading' }),
  _setError: (msg: string) => set({ loadingState: 'error', error: msg }),
  _setEmpty: () => set({ products: [], loadingState: 'success' })
}));

// In browser console:
useProductsStore.getState()._setLoading();
useProductsStore.getState()._setError('Test error');
```

### Tip 19: Test Data Generators

```typescript
// Create test data helpers
export function createMockProduct(overrides = {}): Product {
  return {
    id: Math.random(),
    name: 'Test Product',
    price: 99.99,
    category: 'Electronics',
    inStock: true,
    description: 'Test description',
    ...overrides
  };
}

// Usage
const testProduct = createMockProduct({ name: 'My Test', price: 49.99 });
```

---

## ⚡ Performance Tips

### Tip 20: Selective Store Subscriptions

```typescript
// ❌ Slow: Re-renders on ANY store change
const store = useCartStore();
return <div>{store.items.length}</div>;

// ✅ Fast: Only re-renders when items change
const itemsLength = useCartStore(state => state.items.length);
return <div>{itemsLength}</div>;

// ✅ Even better: Use computed value
const totalItems = useCartStore(state => state.getTotalItems());
return <div>{totalItems}</div>;
```

### Tip 21: Memoize Expensive Calculations

```typescript
import { useMemo } from 'react';

function ExpensiveComponent() {
  const products = useProductsStore(state => state.products);
  
  // Expensive sort/filter only runs when products change
  const sortedProducts = useMemo(() => {
    return products
      .filter(p => p.inStock)
      .sort((a, b) => b.price - a.price);
  }, [products]);
  
  return <div>{/* Use sortedProducts */}</div>;
}
```

### Tip 22: Avoid Inline Functions in Renders

```typescript
// ❌ Creates new function every render
{items.map(item => (
  <button onClick={() => handleClick(item.id)}>
))}

// ✅ Better (but still creates functions)
{items.map(item => {
  const handleItemClick = () => handleClick(item.id);
  return <button onClick={handleItemClick}>;
})}

// ✅ Best: Use data attributes
{items.map(item => (
  <button data-id={item.id} onClick={handleClick}>
))}

function handleClick(e) {
  const id = e.currentTarget.dataset.id;
  // Handle click
}
```

---

## 📝 Code Quality Tips

### Tip 23: Consistent Naming

```typescript
// Store files: camelCase + "Store"
cartStore.ts
userStore.ts

// Component files: PascalCase
ProductList.tsx
EmptyState.tsx

// Style files: match component, lowercase
productList.css
emptyState.css

// Type files: PascalCase
types/index.ts (exports: Product, User, etc.)
```

### Tip 24: Comments for Complex Logic

```typescript
// ✅ Good: Comment WHY, not WHAT
// Calculate discount based on user tier and cart total
// Premium users get 20% off orders over $100
const discount = user.tier === 'premium' && total > 100 
  ? total * 0.2 
  : 0;

// ❌ Bad: Comment obvious things
// Set the items to the new items
set({ items: newItems });
```

### Tip 25: Keep Components Small

If your component is over 100 lines:
1. Extract sub-components
2. Move logic to custom hooks
3. Split into container + presentational

```typescript
// ❌ Too big
function ProductList() {
  // 200 lines of JSX and logic
}

// ✅ Better
function ProductList() {
  return (
    <>
      <ProductFilters />
      <ProductGrid />
      <ProductPagination />
    </>
  );
}
```

---

## 🔧 Extension Tips

### Tip 26: Adding Persistence

```typescript
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      // Your store
    }),
    {
      name: 'cart-storage', // localStorage key
      // Only persist items, not loading states
      partialize: (state) => ({ items: state.items })
    }
  )
);
```

### Tip 27: Adding Undo/Redo

```typescript
import { temporal } from 'zundo';

export const useTodosStore = create(
  temporal<TodosState>(
    (set, get) => ({
      // Your store
    })
  )
);

// In component
const { undo, redo } = useTemporalStore();
```

### Tip 28: Adding Async Actions

```typescript
// Pattern for all async actions
asyncAction: async (param: string) => {
  set({ loadingState: 'loading', error: null });
  
  try {
    const result = await api.doSomething(param);
    set({ 
      data: result,
      loadingState: 'success' 
    });
  } catch (error) {
    set({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      loadingState: 'error' 
    });
  }
}
```

---

## 🎓 Learning Tips

### Tip 29: Understand Re-renders

Add this to see when components render:

```typescript
export const ProductList: React.FC = () => {
  console.log('ProductList rendered');
  
  // Your component
};
```

Watch the console as you interact with the app!

### Tip 30: Experiment Freely

This is a learning project! Try:
- Breaking things on purpose
- Removing code to see what happens
- Adding console.logs everywhere
- Testing edge cases
- Implementing your own ideas

**Remember:** You can always use `git` to reset!

---

## 🚀 Deployment Tips

### Tip 31: Build for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview

# Check build size
ls -lh dist/assets/
```

### Tip 32: Environment Variables

```typescript
// Create .env file (don't commit!)
VITE_API_URL=https://api.example.com

// Use in code
const apiUrl = import.meta.env.VITE_API_URL;
```

### Tip 33: Deployment Checklist

- [ ] Run `npm run build` without errors
- [ ] Test production build locally
- [ ] Remove all `console.log` statements
- [ ] Remove debug code
- [ ] Check bundle size (should be reasonable)
- [ ] Test in multiple browsers
- [ ] Test on mobile
- [ ] Update README with deployment URL

---

## 📚 Resources

### Browser Extensions
- React DevTools
- Redux DevTools (for Zustand)
- Vite DevTools

### VSCode Extensions
- ESLint
- Prettier
- TypeScript Vue Plugin
- Auto Rename Tag
- Path Intellisense

### Useful Commands
```bash
# Type check without building
npm run type-check

# Clean and reinstall
npm run clean
npm install

# Check for updates
npm outdated
```

---

**Happy coding! Remember: The best way to learn is by building and breaking things!** 🚀
