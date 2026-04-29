import './Header.scss';

function Header({ pageType, onPageChange, cart, onCartClick }) {
  const categories = ['tv', 'phone', 'laptop'];
  
  // Считаем общее количество товаров в корзине
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <header className="header">
      <div className="header__left">
        <div 
          className="logo" 
          onClick={() => onPageChange('tv')}
          style={{ cursor: 'pointer' }}
        >
          TechStore
        </div>
        
        <nav className="nav-categories">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`nav-tab ${cat === pageType ? 'active' : ''}`}
              onClick={() => onPageChange(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="header__actions">
        <button 
          aria-label="Cart" 
          className="icon-btn"
          onClick={onCartClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
        <button aria-label="User" className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;