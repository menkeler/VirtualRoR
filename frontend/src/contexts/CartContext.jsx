import React, { useState, createContext, useReducer, useContext, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const initialState = {
  cartItems: [],
};

const secretKey = '6YWxYE4dT6xW7QQ3YhcSbzEXdwj39LD6'; // Replace with a strong secret key

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.inventory !== action.payload && item.item !== action.payload),
      };
    case 'REMOVE_ALL_ITEMS':
      return {
        ...state,
        cartItems: [],
      };
    case 'LOAD_CART_DATA':
      return {
        ...state,
        cartItems: action.payload,
      };
      case 'UPDATE_CART_ITEM':
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.inventory === action.payload.inventoryId && item.item === action.payload.itemId
              ? { ...item, quantity: action.payload.newQuantity }
              : item
          ),
        };
    default:
      return state;
  }
};

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedEncryptedCartData = sessionStorage.getItem('encryptedCartData');
    if (storedEncryptedCartData) {
      try {
        const decryptedCartData = CryptoJS.AES.decrypt(storedEncryptedCartData, secretKey).toString(CryptoJS.enc.Utf8);
        dispatch({ type: 'LOAD_CART_DATA', payload: JSON.parse(decryptedCartData) });
        
      } catch (error) {
        //If Data is Tampered Delete the Data
        console.error('Error decoding UTF-8 data:', error);
        // Handle the error as needed, e.g., by removing the tampered data and logging out the user.
        dispatch({ type: 'REMOVE_ALL_ITEMS' });
        sessionStorage.removeItem('encryptedCartData');
        setIsLoaded(true);
        return;
      }
    }
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    // Save encrypted cart data to sessionStorage whenever it changes after the initial load
    if (isLoaded) {
      const encryptedCartData = CryptoJS.AES.encrypt(JSON.stringify(state.cartItems), secretKey).toString();
      sessionStorage.setItem('encryptedCartData', encryptedCartData);
    }
  }, [state.cartItems, isLoaded]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { state } = context;

  // Utility function to calculate the total quantity in the cart
  const getTotalQuantity = () => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return { ...context, getTotalQuantity };
};

export { CartProvider, useCart };