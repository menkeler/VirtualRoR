import React, { useState } from 'react';
import client from '../../api/client';
import useUserData from '../../hooks/useUserData';

const DonationInquiryForm = () => {
    const userDataLogged = useUserData();
    const [formData, setFormData] = useState({
        message: '',
        inquiry_type: 'Donation',
        date_preferred: '',
        user: ''  
    });
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value, user: userDataLogged.user.user_id });
      };

  const handleSubmit = async () => {
    if (!formData.message || !formData.date_preferred || !formData.user) {
        window.alert('Please fill in all required fields.');
        return;
      }
    console.log('Submitting data:', formData);
     try {
      const response = await client.post('transactions/inquiries/', formData);
      console.log('Server response:', response.data);

     // Close the modal after successful submission

      document.getElementById('DonationFormModal').close();
      document.getElementById('InquiryModal').close();
    } catch (error) {
      console.error('Error submitting data:', error);

    }
    
  };

  return (
    <>
      <button className="btn" onClick={() => document.getElementById('DonationFormModal').showModal()}>
        Donation
      </button>
      <dialog id="DonationFormModal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Donation Form</h3>
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
  );
};

export default DonationInquiryForm;







  