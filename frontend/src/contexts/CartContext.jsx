import React, { useState, createContext, useReducer, useContext, useEffect } from 'react';

const initialState = {
  cartItems: [],
};

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
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
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
    default:
      return state;
  }
};

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedCartData = sessionStorage.getItem('cartData');
    if (storedCartData) {
      dispatch({ type: 'LOAD_CART_DATA', payload: JSON.parse(storedCartData) });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save cart data to sessionStorage whenever it changes after the initial load
    if (isLoaded) {
      sessionStorage.setItem('cartData', JSON.stringify(state.cartItems));
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
  return context;
};

export { CartProvider, useCart };