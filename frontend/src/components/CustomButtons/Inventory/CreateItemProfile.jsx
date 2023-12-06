import React, { useState, useEffect } from 'react';
import client from '../../../api/client';
import Cookies from 'js-cookie';

const CreateItemProfile = () => {
  useEffect(() => {
    fetchData();
  }, []);
  const [categoryData, setcategoryData] = useState([]);


  async function fetchData() {
    try {
      const authToken = Cookies.get('authToken');
      const res = await client.get('inventory/itemprofilings/', {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      const itemRes = await client.get('inventory/itemprofilings/');  
      const categRes = await client.get('inventory/categories/');
      setcategoryData(categRes.data);
      // Handle the response data here
      console.log('Item Profilings:', res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <>
    <button className="btn" onClick={() => document.getElementById('ItemProfileModal').showModal()}>
      Add Item Profile
    </button>
    <dialog id="ItemProfileModal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">ItemProfiling</h3>
        <div>
          <label htmlFor="message">Message</label>
          <textarea id="message" rows="4" style={{ resize: 'both' }} ></textarea>
        </div>
        <div>
          <label htmlFor="date_preferred">Preferred Date</label>
          <input type="date" id="date_preferred"  />
        </div>
          {/* HIDDEN INPUT FOR USER ID */}
        {/* <input type="text" id="user_id" value={userDataLogged.user.user_id} readOnly /> */}
        <div className="flex justify-end mt-4">
          <button className="btn btn-accent mr-4">
            Add Item
          </button>
          <form method="dialog">
            <button className="btn btn-accent" onClick={() => document.getElementById('ItemProfileModal').close()}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </>
    )
};

export default CreateItemProfile;
