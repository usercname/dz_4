import { useState, useEffect } from 'react';
import { products } from '../data/products';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import ProductSort from '../components/ProductSort';
import './Listing.scss';

function TvListing({ cart, addToCart, updateCartQuantity, removeFromCart, onPageChange }) {
  const category = 'tv';
  
  // Фильтруем товары по категории
  const categoryProducts = products.filter(p => p.category === category);
  
  // Состояние фильтров
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: 5000
  });
  
  // Состояние применённых фильтров (для кнопки Apply)
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });
  
  // Состояние сортировки
  const [sortBy, setSortBy] = useState('low');

  // Сброс фильтров при смене категории (через ключ)
  useEffect(() => {
    setFilters({ brand: '', minPrice: '', maxPrice: 5000 });
    setAppliedFilters({ brand: '', minPrice: '', maxPrice: 5000 });
    setSortBy('low');
  }, [category]);

  // Получаем уникальные бренды для текущей категории
  const brands = [...new Set(categoryProducts.map(p => p.brand))].sort();

  // Применяем фильтры и сортировку
  const filteredAndSorted = categoryProducts
    .filter(p => {
      if (appliedFilters.brand && p.brand !== appliedFilters.brand) return false;
      if (appliedFilters.minPrice && p.price < Number(appliedFilters.minPrice)) return false;
      if (appliedFilters.maxPrice && p.price > Number(appliedFilters.maxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'high') return b.price - a.price;
      return a.price - b.price;
    });

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <main className="listing">
      <div className="listing__content">
        <aside className="sidebar-wrapper">
          <Sidebar 
            brands={brands}
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

export default TvListing;