import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Navbar from '../../components/wholepage/Navbar';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';
import InventoryTable from '../../components/Displaycomponents/InventoryTable';
import InquiryResevation from '../../components/Forms/InquiryResevation';

import { useCart } from '../../contexts/CartContext';
const InventoryPage = () => {

  const { userData } = useAuth(); 
  const { state: cartState } = useCart();
  return (
    <>
      <Navbar />
      {/* --------------------- */}
      <div>
        <h2>Your Cart</h2>
        {cartState.cartItems.map((cartItem) => (
          <div key={cartItem.id}>
            <p>{cartItem.name}</p>
            <p>Quantity: {cartItem.quantity}</p>
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
      {/* ----------------------------- */}
      <div className="container mx-auto my-8 p-6 bg-white shadow-md rounded-md">
        <InquiryResevation/>
        <div><InventoryTable type={1}/></div>
      </div>
      
    </>
  );
};

export default InventoryPage;
