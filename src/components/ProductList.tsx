import React, { useEffect } from 'react';
import { useProductsStore } from '../stores/productsStore';
import { useCartStore } from '../stores/cartStore';
import { ProductCardSkeleton } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import '../styles/products.css';

export const ProductList: React.FC = () => {
  // Using global state - no prop drilling needed!
  const { 
    products, 
    loadingState, 
    error, 
    fetchProducts, 
    selectedCategory,
    setSelectedCategory,
    getFilteredProducts 
  } = useProductsStore();

  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = getFilteredProducts();
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Loading state with skeleton
  if (loadingState === 'loading') {
    return (
      <div className="products-container">
        <h2>Products</h2>
        <div className="products-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState === 'error') {
    return (
      <div className="products-container">
        <EmptyState
          icon="⚠️"
          title="Oops! Something went wrong"
          description={error || 'Failed to load products'}
          action={{
            label: 'Try Again',
            onClick: fetchProducts
          }}
        />
      </div>
    );
  }

  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="products-container">
        <h2>Products</h2>
        
        {/* Category filter */}
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${(cat === 'All' ? !selectedCategory : selectedCategory === cat) ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <EmptyState
          icon="🔍"
          title="No products found"
          description={
            selectedCategory 
              ? `No products available in the "${selectedCategory}" category.`
              : "We couldn't find any products at the moment."
          }
          action={{
            label: 'Clear Filter',
            onClick: () => setSelectedCategory(null)
          }}
        />
      </div>
    );
  }

  // Success state with data
  return (
    <div className="products-container">
      <h2>Products</h2>
      
      {/* Category filter */}
      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${(cat === 'All' ? !selectedCategory : selectedCategory === cat) ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <span className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
