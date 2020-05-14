import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const storagedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );
      if (storagedProducts) {
        setProducts(JSON.parse(storagedProducts));
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function updateStoragedProducts(): Promise<void> {
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    }

    updateStoragedProducts();
  }, [products]);

  const increment = useCallback(
    async (id: string) => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const productIndex = products.findIndex(item => item.id === id);

      const newProducts = [...products];

      newProducts[productIndex].quantity += 1;

      setProducts([...newProducts]);
    },
    [products],
  );

  const decrement = useCallback(
    async (id: string) => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const productIndex = products.findIndex(item => item.id === id);

      if (productIndex < 0) {
        throw new Error('You can not incremment an unexistent item');
      }

      const newProducts = [...products];

      newProducts[productIndex].quantity -= 1;

      if (newProducts[productIndex].quantity < 1) {
        newProducts.splice(productIndex, 1);
      }

      setProducts([...newProducts]);
    },
    [products],
  );

  const addToCart = useCallback(
    async ({ id, title, price, image_url }: Omit<Product, 'quantity'>) => {
      // TODO ADD A NEW ITEM TO THE CART
      const product: Product = {
        id,
        title,
        price,
        image_url,
        quantity: 0,
      };
      const duplicatedProduct = products.find(item => item.id === product.id);

      if (duplicatedProduct) {
        increment(duplicatedProduct.id);
        return;
      }

      product.quantity = 1;

      setProducts([...products, product]);
    },
    [products, increment],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
