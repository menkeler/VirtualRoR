import React, { useState } from 'react';
import client from '../../api/client';
import useUserData from '../../hooks/useUserData';
const ReservationInquiryform = () => {

  const [formData, setFormData] = useState({
    message: '',
    inquiry_type: 'Reservation',
    date_preferred: '',
    user: '',
    reserved_items: [],
  });

  const handleReservedItemAdd = () => {
    // Assuming you have input fields for reserved item details, fetch them from the form
    const reservedItem = {

      item: 'Example Item',
      quantity: 2,

    };
    
    // Update the state by appending the new reserved item to the existing reserved_items array
    setFormData((prevData) => ({
      ...prevData,
      reserved_items: [...prevData.reserved_items, reservedItem],
    }));
  };
  const handleChange = (e) => {
      
    };

const handleSubmit = async (e) => {
  e.preventDefault();
 
  console.log('Submitting data:', formData);
   try {

  } catch (error) {
    console.error('Error submitting data:', error);

  }
  
};
  
  return (
    <>
      <button className="btn" onClick={() => document.getElementById('RerservationFormModal').showModal()}>
        Reservation
      </button>
      <dialog id="RerservationFormModal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Reservation Inquiry</h3>
          <div>
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="4" style={{ resize: 'both' }} onChange={handleChange}></textarea>
          </div>
          <div>
            <label htmlFor="date_preferred">Preferred Date</label>
            <input type="date" id="date_preferred" onChange={handleChange} />
          </div>
            {/* HIDDEN INPUT FOR USER ID */}
          {/* <input type="text" id="user_id" value={userDataLogged.user.user_id} readOnly /> */}
          <div className="flex justify-end mt-4">
            <button className="btn btn-accent mr-4" onClick={handleSubmit}>
              Donate
            </button>
            <form method="dialog">
              <button className="btn btn-accent" onClick={() => document.getElementById('DonationFormModal').close()}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default ReservationInquiryform