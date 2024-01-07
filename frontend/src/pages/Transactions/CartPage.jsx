
import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Navbar from '../../components/wholepage/Navbar';
import Cookies from 'js-cookie';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../../components/wholepage/Footer';
const CartPage = () => {
  const { state: cartState, dispatch } = useCart();

  //REservation
  const [message, setMessage] = useState('');
  const [datePreferred, setDatePreferred] = useState('');
  const {userData} = useAuth();


  
//Cart Functions----------------------------------------------------------------
  const removeFromCart = (itemId, inventoryId) => {
    // Consider showing a confirmation modal before removing the item
    const confirmRemoval = window.confirm('Are you sure you want to remove this item from your cart?');
    if (confirmRemoval) {
      // Check if the item has an inventory ID
      if (inventoryId !== null && typeof inventoryId !== 'undefined') {
        dispatch({ type: 'REMOVE_FROM_CART', payload: inventoryId });
      } else {
        // If there is no inventory ID, assume it's an item ID
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
      }
    }
  };
  const clearAllItems = () => {
    // Consider showing a confirmation modal before clearing all items
    const confirmClearAll = window.confirm('Are you sure you want to clear all items from your cart?');
    if (confirmClearAll) {
      dispatch({ type: 'REMOVE_ALL_ITEMS' });
    }
  };
  const adjustQuantity = (itemId, inventoryId, newQuantity) => {
    dispatch({
      type: 'UPDATE_CART_ITEM',
      payload: {
        itemId,
        inventoryId,
        newQuantity,
      },
    });
  };
  
//Reservation Functions----------------------------------------------------------------



const handleSubmit = async (e)  => {
  e.preventDefault();
  const authToken = Cookies.get('authToken');
    if (message && datePreferred) {
        // Log the data to the console
        const requestData = {
          message: message,
          inquiry_type: 'Reservation',
          status: 'Pending',
          date_preferred: datePreferred,
          inquirer: userData.user.user_id,
        };
        
       
        let responseINquiryID = ""

        try {
          
            //Step 1: Create INquirty
            const responseInquiry = await client.post('transactions/inquiries/', requestData, {
              headers: {
                Authorization: `Token ${authToken}`,
                'Content-Type': 'application/json',
              }
            });
  
            //Get the INquiry Id from the one you created
            if (responseInquiry.status === 201) {
              //update the INquiry id
              responseINquiryID = responseInquiry.data.id;
            }
            //Create Cart Data 
            const cartData = cartState.cartItems.map((item) => ({
              quantity: item.quantity,
              inquiry: responseINquiryID,
              inventory: item.inventory !== null ? item.inventory : null,
              item: item.item !== null ? item.item : null,
            }));

            // console.log("Cart Data",cartData)

            const responseinquiryItems = await client.post('transactions/inquiries_item/', cartData, {
              headers: {
                Authorization: `Token ${authToken}`,
                'Content-Type': 'application/json',
              }
            });

            // if (responseinquiryItems.status === 201) {
            //   // Successful response
            //   console.log('Request was successful:', responseinquiryItems.data);
            // } else {
            //   // Unsuccessful response
            //   console.error('Request failed with status:', responseinquiryItems.status);
            // }


            
          } catch (error) {
            console.error('Error:', error);
          }

        // console.log('API Request Data:', requestData);
        // console.log('Cart Data:', cartData);
        // Clear the cart
        dispatch({ type: 'REMOVE_ALL_ITEMS' });

        // Reset the form fields
        setMessage('');
        setDatePreferred('');

        document.getElementById('InquiryReservation').close();

        // Some SHitty alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-md flex items-center';
        alertDiv.setAttribute('role', 'alert');
        
        // Adding the alert message
        const alertMessage = document.createElement('span');
        alertMessage.innerText = 'Your inquiry has been sent!';
        alertDiv.appendChild(alertMessage);

        document.body.appendChild(alertDiv);

        // Remove the alert after a certain duration 
        setTimeout(() => {
          alertDiv.remove();
        }, 2000);
    }
};


return (
  <>
    <Navbar />
    <div className="md:container mx-auto md:px-4">
      <div className="bg-gray-100 p-4 rounded-md mt-5 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded-md mb-4"
          onClick={clearAllItems}
        >
          Clear All
        </button>
        {cartState.cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartState.cartItems.map((cartItem, index) => (
            <div
              key={index}
              className="bg-white p-4 mb-4 rounded-md shadow-md flex flex-col md:flex-row items-center justify-between"
            >
              <div className="mb-2 md:mb-0 md:mr-4">
                <p className="text-lg font-semibold">{cartItem.name}</p>
                {!cartItem.item && (
                  <>
                    <p className="text-gray-600">Quantity:</p>
                    <input
                      type="number"
                      value={cartItem.quantity}
                      min="1"
                      max={cartItem.maxquantity}
                      onChange={(e) =>
                        adjustQuantity(
                          cartItem.item,
                          cartItem.inventory,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-16 border border-gray-300 rounded-md p-1"
                    />
                  </>
                )}
              </div>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => removeFromCart(cartItem.item, cartItem.inventory)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>

    <div className="md:text-center p-8">
      <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Reserve Items</h2>
        <button
          className="btn btn-secondary text-white mt-4"
          onClick={() => document.getElementById('InquiryReservation').showModal()}
          disabled={cartState.cartItems.length === 0}
        >
          Reserve Items
        </button>

        {cartState.cartItems.length === 0 && (
          <p className="text-red-500 mt-2">Add items to the cart to proceed with the reservation.</p>
        )}

        <dialog id="InquiryReservation" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Reserve</h3>
            <p className="py-4">Reserve the Cart Items</p>

            <div className="mb-4">
              <label htmlFor="datePreferred" className="block text-sm font-medium text-gray-700">
                Preferred Date:
              </label>
              <input
                type="date"
                id="datePreferred"
                name="datePreferred"
                value={datePreferred}
                onChange={(e) => setDatePreferred(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 p-2 border rounded-md w-full"
                rows="4"
              ></textarea>
            </div>

            <div className="modal-action">
              <form method="dialog">
                <button type="button" className="btn btn-accent mr-2" onClick={handleSubmit}>
                  Submit
                </button>
                <button className="btn bg-red-500 text-white">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
    <Footer />
  </>
);
};

export default CartPage;