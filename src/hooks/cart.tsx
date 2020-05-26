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
      const storagedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );
      if (storagedProducts) {
        setProducts([...JSON.parse(storagedProducts)]);
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
      const newProducts = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );

      setProducts(newProducts);
    },
    [products],
  );

  const decrement = useCallback(
    async (id: string) => {
      const productIndex = products.findIndex(item => item.id === id);

      if (productIndex < 0) {
        throw new Error('You can not incremment an unexistent item');
      }

      const newProducts = [...products];

      newProducts[productIndex].quantity -= 1;

      if (newProducts[productIndex].quantity < 1) {
        newProducts.splice(productIndex, 1);
      }

      setProducts(newProducts);
    },
    [products],
  );

  const addToCart = useCallback(
    async (product: Omit<Product, 'quantity'>) => {
      const duplicatedProduct = products.find(item => item.id === product.id);

      if (duplicatedProduct) {
        setProducts(
          products.map(item =>
            item.id === product.id
              ? { ...product, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }
    },
    [products],
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
