import TvListing from '../pages/TvListing';
import PhoneListing from '../pages/PhoneListing';
import LaptopListing from '../pages/LaptopListing';
import Cart from '../pages/Cart';

function Content({ pageType, setPageType, cart, setCart, addToCart, updateCartQuantity, removeFromCart }) {
  const commonProps = {
    cart,
    setCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    onPageChange: setPageType
  };

  return (
    <>
      {pageType === 'tv' && <TvListing {...commonProps} />}
      {pageType === 'phone' && <PhoneListing {...commonProps} />}
      {pageType === 'laptop' && <LaptopListing {...commonProps} />}
      {pageType === 'cart' && <Cart {...commonProps} setPageType={setPageType} />}
    </>
  );
}

export default Content;