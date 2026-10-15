import React from 'react';
import { useCartStore } from '../stores/cartStore';
import { EmptyState } from './EmptyState';
import '../styles/cart.css';

export const Cart: React.FC = () => {
  // Using global state - accessible from anywhere!
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice 
  } = useCartStore();

  // Empty state when cart is empty
  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Add some products to your cart to get started!"
          action={{
            label: 'Browse Products',
            onClick: () => {
              // In a real app, this would navigate to products
              document.querySelector('.products-container')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart ({items.length} items)</h2>
        <button className="clear-cart-btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-items">
        {items.map(item => (
          <div key={item.product.id} className="cart-item">
            <div className="cart-item-image">{item.product.image}</div>
            <div className="cart-item-details">
              <h4>{item.product.name}</h4>
              <p className="cart-item-price">${item.product.price}</p>
            </div>
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.product.id)}
              >
                Remove
              </button>
            </div>
            <div className="cart-item-total">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-price">${getTotalPrice().toFixed(2)}</span>
        </div>
        <button className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};
