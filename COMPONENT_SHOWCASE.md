# Component Showcase

A visual guide to every component in the application.

---

## 🎨 UI Components

### EmptyState Component

**Purpose:** Show friendly messages when there's no data

**Location:** `src/components/EmptyState.tsx`

**Props:**
```typescript
interface EmptyStateProps {
  icon?: string;          // Emoji (default: 📭)
  title: string;          // Main heading
  description: string;    // Explanation text
  action?: {              // Optional CTA button
    label: string;
    onClick: () => void;
  };
}
```

**Variants:**

```typescript
// Empty Cart
<EmptyState
  icon="🛒"
  title="Your cart is empty"
  description="Add some products to your cart to get started!"
  action={{ label: 'Browse Products', onClick: handleBrowse }}
/>

// No Results
<EmptyState
  icon="🔍"
  title="No products found"
  description="Try adjusting your filters"
  action={{ label: 'Clear Filters', onClick: handleClear }}
/>

// Error State
<EmptyState
  icon="⚠️"
  title="Something went wrong"
  description="We couldn't load your data"
  action={{ label: 'Try Again', onClick: handleRetry }}
/>

// Success Empty
<EmptyState
  icon="✅"
  title="All done!"
  description="You've completed all your tasks"
/>
```

**CSS Classes:**
- `.empty-state` - Container
- `.empty-state-icon` - Large emoji display
- `.empty-state-title` - Bold heading
- `.empty-state-description` - Gray description text
- `.empty-state-action` - Gradient button

---

### Skeleton Component

**Purpose:** Show animated placeholders during loading

**Location:** `src/components/SkeletonLoader.tsx`

**Props:**
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;  // Repeat skeleton N times
}
```

**Usage:**

```typescript
// Text skeleton
<Skeleton variant="text" width="80%" />

// Circular avatar
<Skeleton variant="circular" width="60px" height="60px" />

// Rectangular block
<Skeleton variant="rectangular" height="200px" />

// Multiple lines
<Skeleton variant="text" count={3} />
```

**Pre-built Skeletons:**

```typescript
// Product Card
<ProductCardSkeleton />
// Shows: rectangular image + text lines + button area

// Todo Item  
<TodoItemSkeleton />
// Shows: circular checkbox + text + rectangular button

// User Profile
<UserProfileSkeleton />
// Shows: circular avatar + 2 text lines
```

**Animation:**
- Smooth gradient sweep from left to right
- 1.5s duration
- Infinite loop
- Subtle and professional

---

## 🏪 Store-Connected Components

### ProductList Component

**Purpose:** Display products with filtering and cart integration

**Location:** `src/components/ProductList.tsx`

**Global State Used:**
```typescript
const { 
  products,           // Product array
  loadingState,       // 'idle' | 'loading' | 'success' | 'error'
  fetchProducts,      // Async fetch function
  selectedCategory,   // Current filter
  setSelectedCategory,// Filter setter
  getFilteredProducts // Computed filtered list
} = useProductsStore();

const { addToCart } = useCartStore();
```

**Features:**
- Category filtering (All, Electronics, Home, Sports)
- Loading skeleton (6 card grid)
- Empty state for no results
- Error state with retry
- Add to cart functionality
- Stock status display

**States:**
1. **Loading** → Shows 6 `ProductCardSkeleton` components
2. **Error** → Shows error empty state with retry button
3. **Empty** → Shows contextual message based on filter
4. **Success** → Shows product grid

---

### TodoList Component

**Purpose:** Todo list with CRUD operations

**Location:** `src/components/TodoList.tsx`

**Global State Used:**
```typescript
const { 
  todos,          // Todo array
  loadingState,   // Loading state
  fetchTodos,     // Fetch function
  addTodo,        // Add function
  toggleTodo,     // Toggle complete
  deleteTodo      // Delete function
} = useTodosStore();
```

**Features:**
- Add new todos
- Toggle completion
- Delete todos
- Active/completed summary
- Loading skeletons
- Empty state

**States:**
1. **Loading** → Shows 5 `TodoItemSkeleton` components
2. **Error** → Shows error state
3. **Empty** → "No tasks yet" message
4. **Success** → Todo list with summary

---

### Cart Component

**Purpose:** Shopping cart with quantity management

**Location:** `src/components/Cart.tsx`

**Global State Used:**
```typescript
const { 
  items,              // CartItem[]
  removeFromCart,     // Remove by ID
  updateQuantity,     // Change quantity
  clearCart,          // Empty cart
  getTotalPrice       // Computed total
} = useCartStore();
```

**Features:**
- Item list with images
- Quantity controls (+/-)
- Remove items
- Clear cart button
- Total price calculation
- Empty state with CTA
- Checkout button

**States:**
1. **Empty** → Empty state with "Browse Products" button
2. **Has Items** → Full cart interface with items and total

---

### UserProfile Component

**Purpose:** User information and stats

**Location:** `src/components/UserProfile.tsx`

**Global State Used:**
```typescript
const { 
  user,           // User object or null
  loadingState,   // Loading state
  fetchUser,      // Fetch function
  logout          // Logout function
} = useUserStore();

const { getTotalItems } = useCartStore();
```

**Features:**
- User avatar (emoji)
- Name and email
- Role badge (admin/user/guest)
- Cart items stat
- Logout button
- Loading skeleton
- Empty state for not logged in
- Error state with retry

**States:**
1. **Loading** → Shows `UserProfileSkeleton`
2. **Error** → Error empty state
3. **Not Logged In** → Login prompt
4. **Logged In** → Full profile with stats

---

## 🗄️ Store Architecture

### cartStore

**State:**
```typescript
{
  items: CartItem[];
}
```

**Actions:**
```typescript
addToCart(product: Product)      // Add or increment
removeFromCart(productId: number) // Remove item
updateQuantity(id: number, qty: number)
clearCart()                       // Empty cart
```

**Computed:**
```typescript
getTotalItems(): number          // Sum of quantities
getTotalPrice(): number          // Sum of prices
```

---

### productsStore

**State:**
```typescript
{
  products: Product[];
  loadingState: LoadingState;
  error: string | null;
  selectedCategory: string | null;
}
```

**Actions:**
```typescript
fetchProducts(): Promise<void>
setSelectedCategory(category: string | null)
```

**Computed:**
```typescript
getFilteredProducts(): Product[]  // Filtered by category
```

---

### todosStore

**State:**
```typescript
{
  todos: Todo[];
  loadingState: LoadingState;
  error: string | null;
}
```

**Actions:**
```typescript
fetchTodos(): Promise<void>
addTodo(title: string)
toggleTodo(id: number)
deleteTodo(id: number)
```

---

### userStore

**State:**
```typescript
{
  user: User | null;
  loadingState: LoadingState;
  error: string | null;
}
```

**Actions:**
```typescript
fetchUser(): Promise<void>
logout()
```

---

## 🎭 State Transitions

### Typical Loading Flow

```
Initial Render
    ↓
loadingState: 'idle'
    ↓
useEffect calls fetchData()
    ↓
loadingState: 'loading'
    ↓ (shows skeleton)
    ↓
API call completes
    ↓
loadingState: 'success'
    ↓ (shows data or empty state)
```

### Error Flow

```
API call starts
    ↓
loadingState: 'loading'
    ↓ (shows skeleton)
    ↓
API call fails
    ↓
loadingState: 'error'
error: 'Network error'
    ↓ (shows error state)
    ↓
User clicks "Try Again"
    ↓
Back to loading...
```

---

## 🎨 CSS Architecture

### Global Styles
`src/styles/global.css`
- Body gradient background
- App container layout
- Common button styles
- Responsive grid

### Component Styles
- `products.css` - Product grid and cards
- `cart.css` - Cart items and summary
- `todos.css` - Todo list and form
- `user.css` - User profile layout
- `skeleton.css` - Loading animations
- `emptyState.css` - Empty state styling

### Style Patterns

**Card Style:**
```css
.component-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

**Gradient Buttons:**
```css
.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
}
```

**Hover Effects:**
```css
.interactive-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
@media (max-width: 1024px) {
  /* Tablet: Stack sidebar below main */
  .app-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  /* Mobile: Single column products */
  .products-grid {
    grid-template-columns: 1fr;
  }
}
```

### Layout Strategy
- Desktop: 2-column (main + sidebar)
- Tablet: Single column (stacked)
- Mobile: Single column (full width cards)

---

## 🎯 Component Hierarchy

```
App
├── Header
│   └── Cart Badge (uses useCartStore)
│
├── Main Section
│   ├── ProductList (uses useProductsStore, useCartStore)
│   │   ├── Category Filters
│   │   ├── ProductCardSkeleton (loading)
│   │   ├── EmptyState (no results)
│   │   └── ProductCard[]
│   │
│   └── TodoList (uses useTodosStore)
│       ├── Add Todo Form
│       ├── TodoItemSkeleton (loading)
│       ├── EmptyState (no todos)
│       ├── Todo Items[]
│       └── Summary Stats
│
└── Sidebar
    ├── UserProfile (uses useUserStore, useCartStore)
    │   ├── UserProfileSkeleton (loading)
    │   ├── EmptyState (not logged in)
    │   ├── User Info
    │   └── Stats
    │
    └── Cart (uses useCartStore)
        ├── EmptyState (no items)
        ├── Cart Items[]
        └── Summary + Checkout
```

---

## 🔧 Customization Guide

### Adding a New Empty State

```typescript
<EmptyState
  icon="🎨"  // Choose appropriate emoji
  title="Your Title Here"
  description="Helpful explanation"
  action={{
    label: "Action Text",
    onClick: yourHandler
  }}
/>
```

### Adding a New Skeleton

```typescript
export const YourComponentSkeleton = () => (
  <div className="your-skeleton">
    <Skeleton variant="rectangular" height="100px" />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="circular" width="40px" height="40px" />
  </div>
);
```

### Creating a New Store

```typescript
interface YourState {
  data: YourData[];
  loadingState: LoadingState;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useYourStore = create<YourState>((set) => ({
  data: [],
  loadingState: 'idle',
  error: null,
  
  fetchData: async () => {
    set({ loadingState: 'loading', error: null });
    try {
      const data = await api.getData();
      set({ data, loadingState: 'success' });
    } catch (error) {
      set({ 
        error: error.message,
        loadingState: 'error' 
      });
    }
  }
}));
```

---

**This showcase documents every visual and functional piece of the application.**
