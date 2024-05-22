import React, { useState } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';

const InquiryDonation = ({ postID }) => {
  const [message, setMessage] = useState('');
  const [datePreferred, setDatePreferred] = useState('');

  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  const authToken = Cookies.get('authToken');

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (message && datePreferred) {
      const selectedDateTime = new Date(datePreferred).getTime();
      const currentDateTime = new Date().getTime();
      if (selectedDateTime <= currentDateTime) {
        alert('Cannot select past dates/times.');
        return; // Prevent form submission
      }
      try {
        setLoading(true);
        console.log(userData.user.user_id);
        const response = await client.post('transactions/inquiries/', {
          message: message,
          inquiry_type: 'Donation',
          status: 'Pending',
          date_preferred: datePreferred,
          inquirer: userData.user.user_id,
          post: postID !== null ? postID : null,
        });
        reset();
        setInputError(false);
        document.getElementById('InquiryDonation').close();
        console.log('Submission successful:', response.data);
      } catch (error) {
        console.error('Error submitting donation:', error);
      } finally {
        setLoading(false); // Set loading back to false after processing
      }
    } else {
      setInputError(true);
    }
  };
  

  const handleCloseModal = () => {
    reset();
    document.getElementById('InquiryDonation').close();
  };

  const reset = () => {
    setDatePreferred('');
    setMessage('');
  };

  const handleDateChange = (e) => {
    const selectedDateTime = new Date(e.target.value).getTime();
    const currentDateTime = new Date().getTime();
  
    // Check if the selected date is in the past
    if (selectedDateTime <= currentDateTime) {
      // If the selected date is in the past, set it to the current time
      const currentISODateTime = new Date().toISOString().slice(0, 16);
      setDatePreferred(currentISODateTime);
        
      // You can display a message, prevent form submission, or handle it in any other way
      console.log('Cannot select past dates/times.');
    } else {
      setDatePreferred(e.target.value);
    }
  };
  

  return (
    <>
      <dialog id="InquiryDonation" className="modal">
        <div className="modal-box p-6 bg-white rounded-md shadow-md">
          {postID ? (
            <h3 className="font-bold text-2xl mb-4">Inquiry Donation - {postID}</h3>
          ) : (
            <h3 className="font-bold text-2xl mb-4">Inquiry Donation</h3>
          )}

          <div className="border-t border-gray-200 my-4"></div>
          <p className="text-gray-600 mb-4">Please Complete the Form</p>
          <form>
            <div className={`mb-4 ${inputError && !message ? 'border-red-500' : ''}`}>
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
                className={`border rounded-md p-2 w-full bg-white ${
                  inputError && !message ? 'border-red-500' : ''
                }`}
                rows="4"
              ></textarea>
            </div>

            <div className={`mb-4 ${inputError && !datePreferred ? 'border-red-500' : ''}`}>
              <label htmlFor="datePreferred" className="text-lg font-bold mb-2">
                Date Preferred
              </label>
              <input
                type="datetime-local"
                id="datePreferred"
                name="datePreferred"
                value={datePreferred}
                onChange={handleDateChange} // Update to use custom handler
                min={new Date().toISOString().slice(0, 16)}
                required
                className={`border rounded-md p-2 w-full ${
                  inputError && !datePreferred ? 'border-red-500' : ''
                }`}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleDonationSubmit}
                className="btn bg-accent text-white"
                disabled={loading}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn bg-gray-400 text-white ml-2"
                onClick={handleCloseModal}
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
