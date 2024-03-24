import React, { useState, useEffect } from "react";
import client from "../../api/client";
import TransactionDetails from "./TransactionDetails";
const ViewItemLog = ({ item }) => {
  const [transactions, setTransactions] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await client.get(`inventory/itemscopylog/${item.id}`);
      // Update the state with fetched data
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const openModal = () => {
    fetchItems(); // Call fetchItems to fetch data
    console.log(transactions);
    // Show modal
    document.getElementById(`ViewItem${item.display_id}`).showModal();
  };

  return (
    <>
      <button
        className="btn bg-emerald-500"
        onClick={openModal}
      >
        View Logs
      </button>
      <dialog id={`ViewItem${item.display_id}`} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="text-3xl text-center mb-5">Item Logs</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Remarks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
  {transactions.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center py-4">No transactions available</td>
    </tr>
  ) : (
    transactions.map((transaction) => (
      <tr
        key={transaction.id}
        className="hover:bg-green-50"
        onClick={() =>
          document
            .getElementById(`Detail${transaction.id}`)
            .showModal()
        }
      >
        <td className="py-2 px-4 border-b">{transaction.id}</td>
        <td className="py-2 px-4 border-b">
          {new Date(transaction.date_created).toLocaleString(
            "en-US",
            { dateStyle: "medium", timeStyle: "medium" }
          )}
        </td>
        <td className="py-2 px-4 border-b">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                  alt="Avatar"
                />
              </div>
            </div>
            <div>
              <div className="font-bold">
                {transaction.participant.first_name}{" "}
                {transaction.participant.last_name}
              </div>
            </div>
          </div>
        </td>
        <td className="py-2 px-4 border-b">
          {transaction.transaction_type}
        </td>
        <td className="py-2 px-4 border-b">
          {transaction.remarks && transaction.remarks.length > 0
            ? transaction.remarks.length > 50
              ? `${transaction.remarks.substring(0, 50)}...`
              : transaction.remarks
            : "No Remarks"}
        </td>
        <td
          className={`py-2 px-4 border-b text-center ${
            transaction.is_active
              ? "bg-green-300"
              : "bg-yellow-200"
          }`}
        >
          {transaction.is_active ? "Active" : "Completed"}
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
            {/* Render transaction details */}
            {transactions.map((transaction) => (
              <TransactionDetails
                key={`Detail${transaction.id}`}
                transaction={transaction}
              />
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ViewItemLog;
