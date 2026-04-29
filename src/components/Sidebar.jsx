import './Sidebar.scss';

function Sidebar({ brands, filters, onFilterChange, onApply }) {
  return (
    <aside className="sidebar">
      <div className="filter-section">
        <label className="filter-label">Brand</label>
        <select 
          className="filter-select"
          value={filters.brand}
          onChange={(e) => onFilterChange && onFilterChange('brand', e.target.value)}
        >
          <option value="">All brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-section">
        <label className="filter-label">Price Range</label>
        <div className="price-range">
          <input 
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0" 
            className="price-input"
            value={filters.minPrice}
            onChange={(e) => {
              let val = e.target.value;
              // Оставляем только цифры (убираем минусы, буквы, спецсимволы)
              val = val.replace(/[^0-9]/g, '');
              onFilterChange && onFilterChange('minPrice', val);
            }}
          />
          <span className="price-separator">-</span>
          <input 
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="5000" 
            className="price-input"
            value={filters.maxPrice}
            onChange={(e) => {
              let val = e.target.value;
              // Оставляем только цифры (убираем минусы, буквы, спецсимволы)
              val = val.replace(/[^0-9]/g, '');
              onFilterChange && onFilterChange('maxPrice', val);
            }}
          />
        </div>
      </div>
      
      <button 
        className="btn-apply" 
        onClick={onApply}
      >
        Apply Filters
      </button>

      <div className="special-deal">
        <button className="special-deal__close">×</button>
        <div className="special-deal__header">
          <span className="special-deal__icon">🔥</span>
          <h4 className="special-deal__title">Special Deal!</h4>
        </div>
        <p className="special-deal__text">Register now to unlock exclusive offers and discounts</p>
        <div className="special-deal__timer">0:53:59</div>
      </div>
    </aside>
  );
}

export default Sidebar;