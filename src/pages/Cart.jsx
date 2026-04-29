import { products } from '../data/products';
import './Cart.scss';

function Cart({ cart, updateCartQuantity, removeFromCart, setPageType }) {
  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(p => p.id === Number(id));
    return product ? { ...product, quantity } : null;
  }).filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const formatPrice = (price, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <main className="cart cart--empty">
        <div className="cart__empty">
          <h2>Your cart is empty</h2>
          <button className="btn btn--primary" onClick={() => setPageType('tv')}>
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart">
      <div className="cart__container">
        <h1 className="cart__title">Shopping Cart</h1>
        
        <div className="cart__layout">
          {/* Товары */}
          <div className="cart__items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.images[0]} alt={item.model} className="cart-item__image" />
                
                <div className="cart-item__body">
                  <div className="cart-item__header">
                    <div className="cart-item__meta">
                      <span className="cart-item__brand">{item.make}</span>
                      <span className="cart-item__model">{item.model}</span>
                    </div>
                    <button 
                      className="cart-item__delete"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="cart-item__footer">
                    <div className="cart-item__qty">
                      <button 
                        className="qty-btn qty-btn--minus"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn qty-btn--plus"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="cart-item__total">
                      {formatPrice(item.price * item.quantity, 0)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Сводка */}
          <div className="cart__summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="shipping-text">Calculated at checkout</span>
            </div>
            
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            <div className="cart__actions">
              <button 
                className="btn btn--primary btn--full" 
                onClick={() => {}}
              >
                Proceed to Checkout
              </button>
              <button 
                className="btn btn--outline btn--full" 
                onClick={() => setPageType('tv')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;