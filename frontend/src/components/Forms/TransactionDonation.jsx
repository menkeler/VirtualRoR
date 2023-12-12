import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import UsersTable from '../Displaycomponents/UsersTable';

const TransactionDonation = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (selectedUser) => {
    console.log(`Selected user in TransactionDonation:`, selectedUser);

    const { user_id, first_name, last_name, email } = selectedUser;

    setSelectedUser({ user_id, first_name, last_name, email });
    document.getElementById('ChooseUser').close();
  };

  return (
    <>
      <div>TransactionDonation</div>

      <button className="btn" onClick={() => document.getElementById('TransactionDonation').showModal()}>open modal</button>
      <dialog id="TransactionDonation" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Transaction Donation</h3>
          <p className="py-4">Fill in the form</p>
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg">User Details</h3>
            <h1 className="mb-4">
              <div className="flex items-center space-x-4">
                {selectedUser && (
                  <>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-semibold text-gray-600">ID:</p>
                      <p className="text-blue-500">{selectedUser.user_id}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-semibold text-gray-600">Name:</p>
                      <p className="text-blue-500">{selectedUser.first_name} {selectedUser.last_name}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-semibold text-gray-600">Email:</p>
                      <p className="text-blue-500">{selectedUser.email}</p>
                    </div>
                  </>
                )}
                <button className="btn" onClick={() => document.getElementById('ChooseUser').showModal()}>Choose user</button>
              </div>
            </h1>
            {/* User Modal Content */}
            <dialog id="ChooseUser" className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Users</h3>
                <UsersTable type={2} onSelectUser={handleSelectUser} />
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          <h3 className="font-bold text-lg">Item</h3>
          <h1 className="mb-4">
            <button className="btn" onClick={() => document.getElementById('ChooseItems').showModal()}>Choose Items</button>
            <div className="flex items-center space-x-4">
             table here enxt ime
            </div>
          </h1>
          <dialog id="ChooseItems" className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Items Here</h3>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          <div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default TransactionDonation;