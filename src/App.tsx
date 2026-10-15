import { ProductList } from './components/ProductList';
import { TodoList } from './components/TodoList';
import { Cart } from './components/Cart';
import { UserProfile } from './components/UserProfile';
import { useCartStore } from './stores/cartStore';
import './styles/global.css';

function App() {
  // Accessing global state without prop drilling!
  const { getTotalItems } = useCartStore();

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          🚀 State Management Demo
          <span className="app-badge">Zustand + React</span>
        </h1>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Cart Items: <strong>{getTotalItems()}</strong>
        </div>
      </header>

      <div className="app-content">
        <main className="main-section">
          <ProductList />
          <TodoList />
        </main>

        <aside className="sidebar">
          <UserProfile />
          <Cart />
        </aside>
      </div>
    </div>
  );
}

export default App;
