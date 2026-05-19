import { products } from './products';

// Создаём Map один раз при импорте — O(1) доступ к товарам
export const productMap = new Map(
  products.map(product => [product.id, product])
);

// Хелпер для получения товара по ID
export const getProductById = (id) => {
  const numericId = Number(id);
  return productMap.get(numericId);
};

// Хелпер для получения товаров категории
export const getProductsByCategory = (category) => {
  return products.filter(p => p.category === category);
};

// Хелпер для получения уникальных брендов категории
export const getBrandsByCategory = (category) => {
  return [...new Set(
    products
      .filter(p => p.category === category)
      .map(p => p.brand)
  )].sort();
};