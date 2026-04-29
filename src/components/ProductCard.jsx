import { useState } from 'react';
import './ProductCard.scss';

function ProductCard({ product, cartQuantity, onAddToCart, onUpdateQuantity, onRemove }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card">
      {product.isSpecialOffer && (
        <span className="badge-special">Special Offer</span>
      )}
      
      <button 
        className="btn-favorite"
        onClick={() => setIsFavorite(!isFavorite)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" 
             fill={isFavorite ? "#e11d48" : "none"} 
             stroke={isFavorite ? "#e11d48" : "currentColor"} 
             strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      <div className="product-image-wrapper">
        <img 
          src={product.images[currentImageIndex]} 
          alt={product.model}
          className="product-image"
        />
        
        {product.images.length > 1 && (
          <>
            <div className="image-indicators">
              {product.images.map((_, idx) => (
                <span key={idx} className={`dot ${idx === currentImageIndex ? 'active' : ''}`} />
              ))}
            </div>
            
            <button className="nav-arrow prev" onClick={prevImage}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="nav-arrow next" onClick={nextImage}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="product-info">
        <p className="product-brand">{product.make}</p>
        <h3 className="product-model">{product.model}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>

      {cartQuantity > 0 ? (
        <div className="cart-counter">
          <button onClick={() => onUpdateQuantity(product.id, cartQuantity - 1)}>−</button>
          <span>{cartQuantity} in cart</span>
          <button onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}>+</button>
        </div>
      ) : (
        <button 
          className="btn-add-to-cart"
          onClick={() => onAddToCart(product.id)}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}

export default ProductCard;