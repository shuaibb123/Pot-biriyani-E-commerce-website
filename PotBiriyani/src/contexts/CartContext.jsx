import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedItems = sessionStorage.getItem('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('Cart items saved to sessionStorage:', cartItems); // Debugging line
  }, [cartItems]);

  const addToCart = async (itemId) => {
    if (!itemId) {
      console.error('Item ID is undefined');
      return;
    }

    try {
      const response = await axios.get(`/api/menu-items/${itemId}`);
      const item = response.data;
      console.log('Fetched item for cart:', item); // Inspect the fetched item

      setCartItems(prevItems => {
        const existingItem = prevItems.find(i => i._id === item._id);

        if (existingItem) {
          return prevItems.map(i =>
            i._id === item._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          return [...prevItems, { ...item, quantity: 1 }];
        }
      });
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  const increaseQuantity = (itemId) => {
    setCartItems(prevItems => 
      prevItems.map(item =>
        item._id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
