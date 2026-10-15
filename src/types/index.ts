// Type definitions for the application

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  image?: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
