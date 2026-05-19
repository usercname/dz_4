import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';
import './App.scss';

function App() {
  const [pageType, setPageType] = useState('tv');
  const [cart, setCart] = useState(() => {
    const saved = sessionStorage.getItem('cart');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prev => {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      });
    } else {
      setCart(prev => ({ ...prev, [productId]: newQuantity }));
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  return (
    <div className="app">
      <Header 
        pageType={pageType}
        onPageChange={setPageType}
        cart={cart}
        onCartClick={() => setPageType('cart')}
      />
      
      <main className="app-content">
        {/* Виджет погоды удален отсюда — он теперь живет только в Sidebar */}
        
        <Content 
          pageType={pageType}
          setPageType={setPageType}
          cart={cart}
          setCart={setCart}
          addToCart={addToCart}
          updateCartQuantity={updateCartQuantity}
          removeFromCart={removeFromCart}
        />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;