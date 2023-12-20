import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import {useAuth } from '../../contexts/AuthContext';

const InquiryResevation = () => {
    const [message, setMessage] = useState('');
    const [datePreferred, setDatePreferred] = useState('');
    const {userData} = useAuth();
    const [items, setItems] = useState([]);
    const [inquiryItems , setInquiryItems] = useState([]);

    // {
    //     "message": message,
    //     "inquiry_type": "Reservation",
    //     "status": "Pending",
    //     "date_preferred": datePreferred,
    //     "inquirer": userData.user.user_id
    // }



  return (
    <>
    <div>InquiryResevation</div>

    <button className="btn" onClick={()=>document.getElementById('InquiryReservation').showModal()}>open modal</button>

      <dialog id="InquiryReservation" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Reserve</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>





















          
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>


  </>
  )
}

export default InquiryResevation