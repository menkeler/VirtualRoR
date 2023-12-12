import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Navbar from '../../components/wholepage/Navbar';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';
import TransactionDonation from '../../components/Forms/TransactionDonation';






const TransactionPage = () => {

   
  return (
    <>
      <Navbar />
      <TransactionDonation/>
    </>
  );
};

export default TransactionPage;
