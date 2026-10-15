import { create } from 'zustand';
import { Product, LoadingState } from '../types';

interface ProductsState {
  products: Product[];
  loadingState: LoadingState;
  error: string | null;
  selectedCategory: string | null;
  fetchProducts: () => Promise<void>;
  setSelectedCategory: (category: string | null) => void;
  getFilteredProducts: () => Product[];
}

// Simulated API call
const mockFetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Wireless Headphones',
          price: 99.99,
          category: 'Electronics',
          inStock: true,
          image: '🎧',
          description: 'High-quality wireless headphones with noise cancellation'
        },
        {
          id: 2,
          name: 'Smart Watch',
          price: 249.99,
          category: 'Electronics',
          inStock: true,
          image: '⌚',
          description: 'Feature-rich smartwatch with health tracking'
        },
        {
          id: 3,
          name: 'Coffee Maker',
          price: 79.99,
          category: 'Home',
          inStock: false,
          image: '☕',
          description: 'Programmable coffee maker with thermal carafe'
        },
        {
          id: 4,
          name: 'Yoga Mat',
          price: 29.99,
          category: 'Sports',
          inStock: true,
          image: '🧘',
          description: 'Non-slip yoga mat with carrying strap'
        },
        {
          id: 5,
          name: 'Running Shoes',
          price: 129.99,
          category: 'Sports',
          inStock: true,
          image: '👟',
          description: 'Lightweight running shoes with cushioned sole'
        }
      ]);
    }, 2000); // Simulate network delay
  });
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  loadingState: 'idle',
  error: null,
  selectedCategory: null,

  fetchProducts: async () => {
    set({ loadingState: 'loading', error: null });
    try {
      const products = await mockFetchProducts();
      set({ products, loadingState: 'success' });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        loadingState: 'error' 
      });
    }
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  getFilteredProducts: () => {
    const { products, selectedCategory } = get();
    if (!selectedCategory) return products;
    return products.filter(p => p.category === selectedCategory);
  }
}));
