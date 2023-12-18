import React, { useState } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import {useAuth } from '../../contexts/AuthContext';
const InquiryDonation = () => {
  const [message, setMessage] = useState('');
  const [datePreferred, setDatePreferred] = useState('');
  const {userData} = useAuth();
  const authToken = Cookies.get('authToken');

  const handleDonationSubmit = async (e) => {
        e.preventDefault();
        if(message && datePreferred) {
            try {
                console.log(userData.user.user_id);
                const response = await client.post('transactions/inquiries/', {
                    message: message,
                    inquiry_type: 'Donation',
                    status: 'Pending',  
                    date_preferred: datePreferred,  
                    inquirer: userData.user.user_id,
                });
                setMessage('');
                setDatePreferred('');
                document.getElementById('InquiryDonation').close();
                console.log('Submission successful:', response.data);
            } catch (error) {
                console.error('Error submitting donation:', error)
            }
        };
    }

  return (
    <>
      <div>InquiryDonation</div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button className="btn" onClick={() => document.getElementById('InquiryDonation').showModal()}>
        Open modal
      </button>

      <dialog id="InquiryDonation" className="modal">
        <div className="modal-box p-6 bg-white rounded-md shadow-md">
          <h3 className="font-bold text-2xl mb-4">Inquiry Donation</h3>
          <p className="text-gray-600 mb-4">Fill in the form</p>
          <form>
            <div className="mb-4">
              <label htmlFor="message" className="text-lg font-bold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="border rounded-md p-2 w-full bg-white"
                rows="4"
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="datePreferred" className="text-lg font-bold mb-2">
                Date Preferred
              </label>
              <input
                type="date"
                id="datePreferred"
                name="datePreferred"
                value={datePreferred}
                onChange={(e) => setDatePreferred(e.target.value)}
                required
                className="border rounded-md p-2 w-full"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" onClick={handleDonationSubmit} className="btn bg-accent text-white">
                Submit
              </button>
              <button
                type="button"
                className="btn bg-gray-400 text-white ml-2"
                onClick={() => document.getElementById('InquiryDonation').close()}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default InquiryDonation;

