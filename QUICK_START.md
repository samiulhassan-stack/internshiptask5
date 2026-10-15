# Quick Start Guide

## 🚀 Get Running in 2 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to `http://localhost:5173`

---

## 🎯 What to Look For

### 1. Global State (No Prop Drilling!)

Open these files side-by-side:
- `src/components/ProductList.tsx`
- `src/components/Cart.tsx`
- `src/App.tsx`

Notice how **none of them pass cart data as props**, yet they all access and modify the same cart!

```typescript
// In ProductList.tsx - no props needed!
const { addToCart } = useCartStore();

// In Cart.tsx - same state, still no props!
const { items, removeFromCart } = useCartStore();
```

### 2. Skeleton Loaders in Action

**Refresh the page** and watch:
- ⚡ Products show animated skeletons (2 seconds)
- ⚡ Todos show list skeletons (1.8 seconds)
- ⚡ User profile shows circular skeleton (1.5 seconds)

**Never a blank white screen!**

### 3. Empty States

**Try these actions:**

1. **Empty Cart:**
   - Look at the cart sidebar → See friendly empty state
   - Click "Browse Products" → Auto-scrolls to products

2. **Filter Products:**
   - Click a category filter
   - If no products match → See contextual empty state
   - Click "Clear Filter" → Products return

3. **No Todos:**
   - Clear all todos → See "No tasks yet" message

4. **Simulated Errors:**
   - Refresh multiple times
   - ~30% chance of empty todos list
   - Shows realistic empty state handling

### 4. Component Communication

Watch the **cart count badge** in the header:
1. Add products to cart → Badge updates instantly
2. Change quantities → Badge updates
3. Remove items → Badge updates

All without passing props between components!

---

## 📂 Quick File Reference

### Want to see how...

**Global state works?**
→ `src/stores/cartStore.ts`

**Skeleton loaders are built?**
→ `src/components/SkeletonLoader.tsx`

**Empty states are handled?**
→ `src/components/EmptyState.tsx`

**Components use stores?**
→ Any file in `src/components/`

**Types are defined?**
→ `src/types/index.ts`

---

## 🎨 Features to Explore

### Shopping Cart
- Add products to cart
- Adjust quantities with +/- buttons
- Remove items
- See real-time total calculation
- Empty state when cart is empty

### Product Catalog
- View all products
- Filter by category
- See stock status
- Add to cart directly
- Loading skeletons during fetch
- Empty state for filtered results

### Todo List
- Add new tasks
- Mark tasks as complete
- Delete tasks
- See active/completed count
- Loading skeleton during fetch
- Empty state when no tasks

### User Profile
- View user information
- See cart item count
- Logout functionality
- Loading skeleton during fetch
- Empty state when not logged in

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

---

## 💡 Try This Exercise

**Challenge:** Add a new global state feature

1. Create a new store: `src/stores/favoritesStore.ts`
2. Add "favorite" button to products
3. Show favorite count in header
4. Display favorites list in sidebar

**Notice:** No prop drilling needed! Any component can access favorites.

```typescript
// Create the store
export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  addFavorite: (product) => {
    set({ favorites: [...get().favorites, product] });
  }
}));

// Use anywhere!
const { addFavorite } = useFavoritesStore();
```

---

## 🐛 Troubleshooting

### Port already in use?
```bash
# Vite will automatically try the next available port
# or specify a custom port:
npm run dev -- --port 3000
```

### Build errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors?
```bash
# Restart your editor's TypeScript server
# In VS Code: Cmd/Ctrl + Shift + P → "Restart TS Server"
```

---

## 📚 Learning Path

**Already comfortable?** Read these next:

1. `README.md` - Comprehensive overview
2. `IMPLEMENTATION_GUIDE.md` - Deep dive into patterns
3. Official Zustand docs - Advanced patterns

**Want to modify?**

Start with these safe changes:
1. Add a new product to `productsStore.ts`
2. Change colors in CSS files
3. Add a new empty state variant
4. Create a new skeleton type

---

## 🎯 Key Takeaways

After exploring this app, you should understand:

✅ How to **eliminate prop drilling** with global state  
✅ When to use **skeleton loaders** vs spinners  
✅ How to create **friendly empty states**  
✅ Why **Zustand** is simpler than Redux  
✅ How to **structure stores** for scalability  
✅ Best practices for **loading states**  
✅ TypeScript patterns for **type-safe state**  

---

## 🎉 That's It!

You now have a production-ready example of:
- Global state management
- Proper loading states
- Empty state handling
- Clean component architecture

**Happy coding!** 🚀
