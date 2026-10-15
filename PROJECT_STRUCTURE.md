# Project Structure

Complete file tree with descriptions of each file's purpose.

```
global-state-data-fetching/
│
├── 📄 package.json                      # Dependencies and scripts
├── 📄 tsconfig.json                     # TypeScript configuration
├── 📄 tsconfig.node.json                # TypeScript config for Node
├── 📄 vite.config.ts                    # Vite build configuration
├── 📄 index.html                        # HTML entry point
├── 📄 .gitignore                        # Git ignore patterns
│
├── 📚 Documentation/
│   ├── README.md                        # Main project documentation
│   ├── QUICK_START.md                   # 2-minute getting started guide
│   ├── IMPLEMENTATION_GUIDE.md          # Deep dive into patterns
│   ├── BEFORE_AFTER.md                  # Problem vs solution comparison
│   ├── COMPONENT_SHOWCASE.md            # Visual component guide
│   ├── TASK_SUMMARY.md                  # Task completion report
│   ├── PATTERNS.md                      # Reusable code patterns
│   └── PROJECT_STRUCTURE.md             # This file
│
└── src/                                 # Source code
    │
    ├── 🎯 Entry Points
    │   ├── main.tsx                     # React app initialization
    │   ├── App.tsx                      # Root component
    │   └── vite-env.d.ts                # Vite type definitions
    │
    ├── 🧩 Components/                   # React UI components
    │   ├── Cart.tsx                     # Shopping cart component
    │   │   • Uses: useCartStore
    │   │   • Features: Empty state, quantity controls
    │   │   • Lines: ~80
    │   │
    │   ├── ProductList.tsx              # Product catalog component
    │   │   • Uses: useProductsStore, useCartStore
    │   │   • Features: Category filters, skeleton, empty states
    │   │   • Lines: ~120
    │   │
    │   ├── TodoList.tsx                 # Todo management component
    │   │   • Uses: useTodosStore
    │   │   • Features: CRUD operations, skeleton, empty state
    │   │   • Lines: ~95
    │   │
    │   ├── UserProfile.tsx              # User profile component
    │   │   • Uses: useUserStore, useCartStore
    │   │   • Features: User info, stats, skeleton
    │   │   • Lines: ~75
    │   │
    │   ├── SkeletonLoader.tsx           # Loading skeleton components
    │   │   • Exports: Skeleton, ProductCardSkeleton, TodoItemSkeleton, UserProfileSkeleton
    │   │   • Features: Multiple variants, animations
    │   │   • Lines: ~65
    │   │
    │   └── EmptyState.tsx               # Empty state component
    │       • Props: icon, title, description, action
    │       • Features: Reusable, customizable
    │       • Lines: ~30
    │
    ├── 🗄️ Stores/                       # Zustand state management
    │   ├── cartStore.ts                 # Shopping cart state
    │   │   • State: items[]
    │   │   • Actions: add, remove, update, clear
    │   │   • Computed: getTotalItems, getTotalPrice
    │   │   • Lines: ~60
    │   │
    │   ├── productsStore.ts             # Product catalog state
    │   │   • State: products[], loadingState, selectedCategory
    │   │   • Actions: fetchProducts, setSelectedCategory
    │   │   • Computed: getFilteredProducts
    │   │   • Lines: ~75
    │   │
    │   ├── todosStore.ts                # Todo list state
    │   │   • State: todos[], loadingState, error
    │   │   • Actions: fetchTodos, add, toggle, delete
    │   │   • Lines: ~70
    │   │
    │   └── userStore.ts                 # User profile state
    │       • State: user, loadingState, error
    │       • Actions: fetchUser, logout
    │       • Lines: ~50
    │
    ├── 📝 Types/                        # TypeScript definitions
    │   └── index.ts                     # All type definitions
    │       • Types: User, Product, CartItem, Todo, LoadingState
    │       • Lines: ~35
    │
    └── 🎨 Styles/                       # CSS modules
        ├── global.css                   # App-wide styles
        │   • Layout, typography, common styles
        │   • Lines: ~80
        │
        ├── skeleton.css                 # Skeleton loader animations
        │   • Shimmer animation, variants
        │   • Lines: ~50
        │
        ├── emptyState.css               # Empty state styling
        │   • Centered layout, icon styling
        │   • Lines: ~35
        │
        ├── products.css                 # Product list styles
        │   • Grid layout, card styles, filters
        │   • Lines: ~110
        │
        ├── cart.css                     # Cart component styles
        │   • Item layout, controls, summary
        │   • Lines: ~120
        │
        ├── todos.css                    # Todo list styles
        │   • Form, list items, summary
        │   • Lines: ~90
        │
        └── user.css                     # User profile styles
            • Avatar, info layout, stats
            • Lines: ~75
```

---

## 📊 File Statistics

### By Category

| Category | Files | Total Lines | Purpose |
|----------|-------|-------------|---------|
| Components | 6 | ~465 | React UI components |
| Stores | 4 | ~255 | State management |
| Styles | 7 | ~560 | CSS styling |
| Types | 1 | ~35 | TypeScript definitions |
| Config | 5 | ~100 | Build & TypeScript config |
| Documentation | 8 | ~5000 | Guides and explanations |
| **Total** | **31** | **~6415** | Complete project |

### By Purpose

| Purpose | Files | Description |
|---------|-------|-------------|
| State Management | 4 | Zustand stores for global state |
| UI Components | 6 | React components |
| Styling | 7 | CSS modules |
| Type Safety | 1 | TypeScript interfaces |
| Configuration | 5 | Build and project config |
| Documentation | 8 | Comprehensive guides |

---

## 🔄 Data Flow Diagram

```
User Interaction
      ↓
  Component
      ↓
   Store Hook (useCartStore)
      ↓
   Store Action (addToCart)
      ↓
  Update State (set)
      ↓
  All Subscribed Components Re-render
      ↓
  UI Updates
```

### Example: Adding to Cart

```
ProductList Component
      ↓
User clicks "Add to Cart"
      ↓
Call: useCartStore().addToCart(product)
      ↓
cartStore updates: items = [...items, newItem]
      ↓
Components re-render:
  • Cart (shows new item)
  • ProductList (updates button state)
  • App header (updates count badge)
```

---

## 🧩 Component Dependency Graph

```
App (root)
├── Uses: useCartStore (for badge count)
│
├── ProductList
│   ├── Uses: useProductsStore (products, loading, filters)
│   ├── Uses: useCartStore (addToCart)
│   ├── Renders: ProductCardSkeleton (loading state)
│   ├── Renders: EmptyState (error/empty states)
│   └── Styles: products.css
│
├── TodoList
│   ├── Uses: useTodosStore (todos, CRUD operations)
│   ├── Renders: TodoItemSkeleton (loading state)
│   ├── Renders: EmptyState (error/empty states)
│   └── Styles: todos.css
│
├── UserProfile
│   ├── Uses: useUserStore (user data)
│   ├── Uses: useCartStore (stats)
│   ├── Renders: UserProfileSkeleton (loading state)
│   ├── Renders: EmptyState (error/not logged in)
│   └── Styles: user.css
│
└── Cart
    ├── Uses: useCartStore (items, totals, actions)
    ├── Renders: EmptyState (empty cart)
    └── Styles: cart.css
```

---

## 🗄️ Store Dependencies

```
cartStore
  • Independent (no dependencies)
  • Used by: ProductList, Cart, UserProfile, App

productsStore
  • Independent (no dependencies)
  • Used by: ProductList

todosStore
  • Independent (no dependencies)
  • Used by: TodoList

userStore
  • Independent (no dependencies)
  • Used by: UserProfile
  • Can be used by: Cart (for user-specific logic)
```

---

## 🎨 Style Hierarchy

```
global.css (base styles)
├── Layout
├── Typography
├── Common components (.app, .app-header)
└── Responsive breakpoints

Component-specific CSS
├── products.css → ProductList
├── cart.css → Cart
├── todos.css → TodoList
├── user.css → UserProfile
├── skeleton.css → SkeletonLoader
└── emptyState.css → EmptyState
```

---

## 📦 Build Output Structure

```
dist/
├── index.html                   # Entry HTML
├── assets/
│   ├── index-[hash].js          # Main JavaScript bundle
│   ├── index-[hash].css         # Compiled CSS
│   └── [other hashed assets]
```

---

## 🚀 Deployment Checklist

### Files to Include
- ✅ `dist/` folder (after build)
- ✅ `package.json` (for dependencies)
- ✅ `README.md` (documentation)

### Files to Exclude (.gitignore)
- ❌ `node_modules/`
- ❌ `dist/` (generated)
- ❌ `.env` (if you add one)
- ❌ IDE files (`.vscode/`, `.idea/`)

---

## 🧪 Testing Structure (Future)

```
src/
├── components/
│   ├── Cart.tsx
│   └── Cart.test.tsx            # Component tests
│
├── stores/
│   ├── cartStore.ts
│   └── cartStore.test.ts        # Store tests
│
└── __tests__/
    ├── integration/              # Integration tests
    └── e2e/                      # End-to-end tests
```

---

## 📝 Adding New Features

### To Add a New Store:

1. Create `src/stores/yourStore.ts`
2. Define interface with state and actions
3. Implement with `create<YourState>(...)`
4. Export the hook: `export const useYourStore = ...`

### To Add a New Component:

1. Create `src/components/YourComponent.tsx`
2. Import necessary stores: `const { data } = useYourStore()`
3. Handle all states (loading, error, empty, success)
4. Create `src/styles/yourComponent.css`
5. Import styles in component

### To Add a New Empty State:

1. Use `<EmptyState />` component
2. Provide: icon, title, description, optional action
3. Place in appropriate state condition

### To Add a New Skeleton:

1. Use `<Skeleton />` with variants
2. Or create custom skeleton matching your layout
3. Show during `loadingState === 'loading'`

---

## 🎯 Code Organization Principles

### 1. Separation of Concerns
- **Stores:** Business logic only
- **Components:** UI and user interaction
- **Types:** Shared type definitions
- **Styles:** Visual presentation

### 2. Single Responsibility
- Each file has one clear purpose
- Components do one thing well
- Stores manage one domain

### 3. DRY (Don't Repeat Yourself)
- Reusable components: `EmptyState`, `Skeleton`
- Shared types in `types/index.ts`
- Common styles in `global.css`

### 4. Type Safety
- Everything is typed
- No `any` types
- Interfaces for all data structures

---

## 🔍 Finding What You Need

| I want to... | Look in... |
|--------------|-----------|
| Change how products are displayed | `src/components/ProductList.tsx` |
| Modify cart logic | `src/stores/cartStore.ts` |
| Update product card styling | `src/styles/products.css` |
| Add new product fields | `src/types/index.ts` (Product interface) |
| Change loading animation | `src/styles/skeleton.css` |
| Modify empty state text | Component files (search for "EmptyState") |
| Understand data flow | `IMPLEMENTATION_GUIDE.md` |
| See usage examples | `PATTERNS.md` |
| Get started quickly | `QUICK_START.md` |

---

**This structure provides a scalable foundation for building larger applications.**
