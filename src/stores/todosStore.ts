import { create } from 'zustand';
import { Todo, LoadingState } from '../types';

interface TodosState {
  todos: Todo[];
  loadingState: LoadingState;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

// Simulated API call
const mockFetchTodos = (): Promise<Todo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate sometimes returning empty data
      const hasData = Math.random() > 0.3; // 70% chance of having data
      
      if (!hasData) {
        resolve([]);
        return;
      }

      resolve([
        { id: 1, title: 'Complete internship task', completed: false, userId: 1 },
        { id: 2, title: 'Learn Zustand', completed: true, userId: 1 },
        { id: 3, title: 'Implement skeleton loaders', completed: false, userId: 1 }
      ]);
    }, 1800);
  });
};

export const useTodosStore = create<TodosState>((set, get) => ({
  todos: [],
  loadingState: 'idle',
  error: null,

  fetchTodos: async () => {
    set({ loadingState: 'loading', error: null });
    try {
      const todos = await mockFetchTodos();
      set({ todos, loadingState: 'success' });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch todos',
        loadingState: 'error' 
      });
    }
  },

  addTodo: (title) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      userId: 1
    };
    set({ todos: [...get().todos, newTodo] });
  },

  toggleTodo: (id) => {
    set({
      todos: get().todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    });
  },

  deleteTodo: (id) => {
    set({ todos: get().todos.filter(todo => todo.id !== id) });
  }
}));
