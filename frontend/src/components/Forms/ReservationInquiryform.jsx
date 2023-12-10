import React, { useEffect, useState } from 'react';
import client from '../../api/client';

const ReservationInquiryform = () => {
  const [formData, setFormData] = useState({
    message: '',
    inquiry_type: 'Reservation',
    date_preferred: '',
    user: '',
    reserved_items: [],
    selectedInventoryItem: null,
  });

  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await client.get('inventory/inventories/');
        setInventoryItems(response.data);
        console.log(response.data); // Add this line to check the retrieved data
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };
  
    fetchInventoryItems();
  }, [])

  const handleReservedItemAdd = () => {
    // Fetch reserved item details from the form (you may have input fields for these details)
    const reservedItem = {
      inventory_item: formData.selectedInventoryItem.id,
      item_copy: null, // Replace with the actual value from the form or set to null
      quantity: 1, // Replace with the actual value from the form
    };

    // Update the state by appending the new reserved item to the existing reserved_items array
    setFormData((prevData) => ({
      ...prevData,
      reserved_items: [...prevData.reserved_items, reservedItem],
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleInventoryItemSelect = (inventoryItem) => {
    setFormData({
      ...formData,
      selectedInventoryItem: inventoryItem,
    });
  };

  return (
    <>
      <button className="btn" onClick={() => document.getElementById('RerservationFormModal').showModal()}>
        Reservation
      </button>

      <dialog id="RerservationFormModal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Reservation Inquiry</h3>

          <form>
          <div>
  <h4 className="font-bold text-md mb-2">Select Inventory Item</h4>
  <input
    type="text"
    placeholder="Search items"
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
  />
  <ul>
    {inventoryItems.map((item) => (
      <li key={item.id} onClick={() => handleInventoryItemSelect(item)}>
        {item.name}
      </li>
    ))}
  </ul>
</div>

            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="4" style={{ resize: 'both' }} onChange={handleChange}></textarea>
            </div>
            <div>
              <label htmlFor="date_preferred">Preferred Date</label>
              <input type="date" id="date_preferred" onChange={handleChange} />
            </div>

            {/* Display selected inventory item */}
            {formData.selectedInventoryItem && (
              <div>
                <p>Selected Inventory Item: {formData.selectedInventoryItem.name}</p>
                <button type="button" onClick={handleReservedItemAdd}>
                  Reserve Item
                </button>
              </div>
            )}

            {/* Add hidden input for user ID */}
            <input type="hidden" id="user" value={1} readOnly />

            <div className="flex justify-end mt-4">
              <button className="btn btn-accent mr-4" type="submit">
                Submit
              </button>
              <button className="btn btn-accent" onClick={() => document.getElementById('RerservationFormModal').close()}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ReservationInquiryform;
