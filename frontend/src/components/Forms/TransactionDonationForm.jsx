import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import CreateItemProfile from '../CustomButtons/Inventory/CreateItemProfile';

const TransactionDonationForm = () => {
  const [users, setUsers] = useState([]);
  const [chosenUser, setChosenUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = Cookies.get('authToken');

        const usersResponse = await client.get('users/users/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        const itemsResponse = await client.get('/inventory/inventories/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        console.log(itemsResponse.data);
        setUsers(usersResponse.data);
        setAllItems(itemsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = users.results && users.results.filter(user =>
      user.first_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered || []);
  }, [searchInput, users.results]);

  const handlePickUser = (user) => {
    setChosenUser(user);
    document.getElementById('SelectUser').close();
  };

  return (
    <div>
      <button className="btn" onClick={() => document.getElementById('TransactionDonationForm').showModal()}>
        Pick User
      </button>
      <dialog id="TransactionDonationForm" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Transaction Donation</h3>
          <div className="chosen-user-container flex space-x-4">
            {chosenUser && (
              <div className="chosen-user-info flex flex-col">
                <h4 className="text-lg font-bold">Chosen User:</h4>
                <div className="flex space-x-2">
                  <p>ID: {chosenUser.user_id}</p>
                  <p>Name: {chosenUser.first_name} {chosenUser.last_name}</p>
                  <p>Email: {chosenUser.email}</p>
                </div>
              </div>
            )}
            <button className="btn" onClick={() => document.getElementById('SelectUser').showModal()}>Choose a User</button>
            <div>
              <CreateItemProfile />
              <button className="btn" onClick={() => document.getElementById('SelectItem').showModal()}>Select Item</button>
            </div>
          </div>
          <dialog id="SelectUser" className="modal">
          <div className="modal-box">
              <input
                type="text"
                className="border-2 border-gray-300 p-2 w-full"
                placeholder="Search for a user"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <table className="table-auto w-full mt-4">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id}>
                      <td className="border px-4 py-2">{user.user_id}</td>
                      <td className="border px-4 py-2">{user.first_name}</td>
                      <td><button className='btn btn-secondary' onClick={() => handlePickUser(user)}>Pick</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <form method="dialog" className="modal-backdrop">
                <button>Close</button>
              </form>
            </div>
          </dialog>
          <dialog id="SelectItem" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Select Item</h3>
              <input
                type="text"
                className="border-2 border-gray-300 p-2 w-full"
                placeholder="Search for an item"
              />
              <table className="table-auto w-full mt-4">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Name</th>
                    {/* Add more table headers as needed */}
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border px-4 py-2">{item.id}</td>
                      <td className="border px-4 py-2">{item.name}</td>
                      {/* Add more table cells as needed */}
                    </tr>
                  ))}
                </tbody>
              </table>
              <form method="dialog" className="modal-backdrop">
                <button onClick={() => document.getElementById('SelectItem').close()}>Close</button>
              </form>
            </div>
          </dialog>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => document.getElementById('TransactionDonationForm').close()}>Close</button>
        </form>
      </dialog>
    </div>
  );
};

export default TransactionDonationForm;
