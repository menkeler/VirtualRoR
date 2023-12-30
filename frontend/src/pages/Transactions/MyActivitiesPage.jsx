import React from 'react';
import Navbar from '../../components/wholepage/Navbar';
import TransactionsTable from '../../components/Displaycomponents/TransactionsTable';
import InquiryTable from '../../components/Displaycomponents/InquiryTable';
import { useAuth } from '../../contexts/AuthContext';

const MyActivitiesPage = () => {
  const { userData } = useAuth();
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-8">My Activities</h1>

        <div className="mb-8">
          <details className="collapse bg-gray-100  rounded-lg p-4 shadow-xl">
            <summary className="collapse-title text-3xl font-medium">Transactions</summary>
            <div className="collapse-content">
              <TransactionsTable User={userData.user.user_id} />
            </div>
          </details>
        </div>

        <div className="mb-8">
          <details className="collapse bg-gray-100  rounded-lg  p-4 shadow-xl">
            <summary className="collapse-title text-3xl font-medium">Inquiries</summary>
            <div className="collapse-content">
              <InquiryTable User={userData.user.user_id} />
            </div>
          </details>
        </div>

        <div className="mb-8">
          <details className="collapse bg-gray-100  rounded-lg  p-4 shadow-xl">
            <summary className="collapse-title text-3xl font-medium">Posts</summary>
            <div className="collapse-content">
              Posts
            </div>
          </details>
        </div>


      </div>
    </>
  );
};

export default MyActivitiesPage;