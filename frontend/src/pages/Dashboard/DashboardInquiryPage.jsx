import React from 'react'
import Navbar from '../../components/wholepage/Navbar';
import InquiryTable from '../../components/Displaycomponents/InquiryTable';

const DashboardInquiryPage = ({User,Admin}) => {
  return (
  <>
    {!Admin ? (
      <InquiryTable User={User} />
    ) : (
      <InquiryTable User={User} Admin={Admin} />
    )}
  </>
    
  )
}

export default DashboardInquiryPage