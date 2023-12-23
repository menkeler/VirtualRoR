import React from 'react'
import Navbar from '../../components/wholepage/Navbar';
import InquiryTable from '../../components/Displaycomponents/InquiryTable';
import InquiryDonation from '../../components/Forms/InquiryDonation';
const InquiryPage = () => {
  return (
    <>
    <Navbar />
    <InquiryDonation />
    <InquiryTable/>
    </>
    
  )
}

export default InquiryPage