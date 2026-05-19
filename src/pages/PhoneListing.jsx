import { useState, useEffect } from 'react';
import { getProductsByCategory } from '../data/productMap';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import ProductSort from '../components/ProductSort';
import './Listing.scss';

function PhoneListing({ cart, addToCart, updateCartQuantity, removeFromCart, onPageChange }) {
  const category = 'phone';
  
  const categoryProducts = getProductsByCategory(category);
  
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '5000'
  });
  
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });
  const [sortBy, setSortBy] = useState('low');

  useEffect(() => {
    setFilters({ brand: '', minPrice: '', maxPrice: '5000' });
    setAppliedFilters({ brand: '', minPrice: '', maxPrice: '5000' });
    setSortBy('low');
  }, [category]);

  const filteredAndSorted = categoryProducts
    .filter(p => {
      if (appliedFilters.brand && p.brand !== appliedFilters.brand) return false;
      
      const min = Number(appliedFilters.minPrice);
      const max = Number(appliedFilters.maxPrice);
      
      if (appliedFilters.minPrice !== '' && p.price < min) return false;
      if (appliedFilters.maxPrice !== '' && p.price > max) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'high') return b.price - a.price;
      return a.price - b.price;
    });

  const handleApplyFilters = () => setAppliedFilters({ ...filters });
  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleSortChange = (value) => setSortBy(value);

  return (
    <main className="listing">
      <div className="listing__content">
        <aside className="sidebar-wrapper">
          <Sidebar 
            category={category}
            filters={filters}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
          />
        </aside>
        
        <div className="listing__main">
          <div className="products-header">
            <span className="products-count">{filteredAndSorted.length} products</span>
            <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
          </div>
          
          <div className="products-grid">
            {filteredAndSorted.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                cartQuantity={cart[product.id] || 0}
                onAddToCart={addToCart}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default PhoneListing;