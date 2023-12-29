import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Navbar from '../../components/wholepage/Navbar';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';
import TransactionDonation from '../../components/Forms/TransactionDonation';
import InquiryDonation from '../../components/Forms/InquiryDonation';

import InquiryTable from '../../components/Displaycomponents/InquiryTable';
import TransactionsTable from '../../components/Displaycomponents/TransactionsTable';
import TransactionRelease from '../../components/Forms/TransactionRelease';
const TransactionPage = () => {

   
  return (
    <>
      <Navbar />

      {/* <InquiryDonation/>
       */}
<TransactionDonation/>
<TransactionRelease/>
      {/* <InquiryTable/> */}
      <TransactionsTable/>
    </>
  );
};

export default TransactionPage;
