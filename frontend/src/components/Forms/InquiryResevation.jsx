import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import {useAuth } from '../../contexts/AuthContext';
const InquiryResevation = () => {
    const [message, setMessage] = useState('');
    const [datePreferred, setDatePreferred] = useState('');
    const {userData} = useAuth();


    // {
    //     "message": message,
    //     "inquiry_type": "Reservation",
    //     "status": "Pending",
    //     "date_preferred": datePreferred,
    //     "inquirer": userData.user.user_id
    // }



  return (
    <div>InquiryResevation</div>
  )
}

export default InquiryResevation