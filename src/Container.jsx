import { useState, useEffect } from 'react';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import './Container.scss';

function Container() {
  // Глобальное состояние: текущая страница
  const [pageType, setPageType] = useState('tv');
  
  // Глобальное состояние: корзина { id: quantity }
  const [cart, setCart] = useState(() => {
    // Загружаем из sessionStorage при первом рендере
    const saved = sessionStorage.getItem('cart');
    return saved ? JSON.parse(saved) : {};
  });

  // Сохраняем корзину в sessionStorage при каждом изменении
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Функция добавления товара в корзину
  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  // Функция удаления товара из корзины
  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  // Функция изменения количества товара
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
    }
  };

  // Сброс фильтров при смене категории
  const handleCategoryChange = (category) => {
    setPageType(category);
    // Фильтры и сортировка сбрасываются внутри Listing-компонентов
  };

  return (
    <div className="container">
      <Header 
        pageType={pageType}
        onPageChange={handleCategoryChange}
        cart={cart}
        onCartClick={() => setPageType('cart')}
      />
      
      <Content 
        pageType={pageType}
        setPageType={setPageType}
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
      />
      
      <Footer />
    </div>
  );
}

export default Container;