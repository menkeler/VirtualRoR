import React, { useState, useEffect } from "react";
import client from "../../api/client";
import Cookies from "js-cookie";
import TransactionDetails from "./TransactionDetails";
const ViewItemLog = ({ item, refetch }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const authToken = Cookies.get("authToken");
  const initialTransactionPayload = {
    user_id: 1,
    remarks: "Maintainance",
    transaction_items: [{ item: item }],
    return_date: new Date().toISOString().split("T")[0],
  };

  const [Transactionpayload, setTransactionPayload] = useState(
    initialTransactionPayload
  );
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectStatus, setSelectStatus] = useState("");

  const handleConditionButtonClick = (condition) => {
    setSelectedCondition(condition);
  };

  useEffect(() => {
    setTransactionPayload({
      ...initialTransactionPayload,
      transaction_items: [{ item: item }],
    });
  }, [item]);

  const handleReset = () => {
    setTransactionPayload(initialTransactionPayload);
    setSelectStatus("");
    setSelectedCondition("");
  };
  const handleselectStatus = (status) => {
    //if status is lost change the condition to lost
    if (status === "Lost") {
      setSelectedCondition("Lost");
    } else if (status === "Damaged") {
      setSelectedCondition("Damaged");
    } else if (status === "Broken") {
      setSelectedCondition("Broken");
    } else {
      //if selected status is lost and then change to returned reset condition for no error
      setSelectedCondition("");
    }

    setSelectStatus(status);
  };

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
    document.getElementById(`ViewItemLogs${item.display_id}`).showModal();
  };

  const handleSubmit = async (e, itemId) => {
    e.preventDefault();
    console.log("Selected item", item);
    const transactionItems = initialTransactionPayload.transaction_items;

    // Logging the transaction_items array
    console.log("Transaction Items from payload fucker:", transactionItems);
    if (selectStatus && selectedCondition) {
      try {
        const responseTransaction = await client.post(
          `transactions/process_transaction/Maintenance/`,
          Transactionpayload,
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const transactionData = responseTransaction.data;

        // Log the transaction data to the console
        const transactionItemId = transactionData.transaction_items[0].id;

        if (selectStatus === "Returned") {
          const payload = {
            status: "Returned",
            return_date: new Date().toISOString().split("T")[0],
            condition: selectedCondition,
          };

          const Copypayload = {
            condition: selectedCondition,
            is_borrowed: false,
            previous_is_borrowed: true,
          };

          const response = await client.patch(
            `transactions/transaction_items/${transactionItemId}/`,
            payload
          );
          // console.log("Transaction Item Updated:", response);

          const responseCopy = await client.patch(
            `/inventory/item-copies/${item.id}/`,
            Copypayload
          );
          // console.log("Item Copy Updated:", responseCopy);

          const updatedItemCopy = await client.get(
            `/inventory/item-copies/${item.id}/`
          );
          // console.log("Updated Item Copy:", updatedItemCopy);
        } else {
          //if Item is Lost
          const payload = {
            status: "Lost",
            return_date: new Date().toISOString().split("T")[0],
            condition: selectStatus,
          };

          const Copypayload = {
            condition: selectStatus,
            is_borrowed: true,
            previous_is_borrowed: true,
          };

          const response = await client.patch(
            `transactions/transaction_items/${transactionItemId}/`,
            payload
          );
          // console.log("Transaction Item Updated:", response);

          const responseCopy = await client.patch(
            `/inventory/item-copies/${item.id}/`,
            Copypayload
          );
          // console.log("Item Copy Updated:", responseCopy);

          const updatedItemCopy = await client.get(
            `/inventory/item-copies/${item.id}/`
          );
          // console.log("Updated Item Copy:", updatedItemCopy);
        }
      } catch (error) {
        console.error("Error Accept:", error);
      } finally {
        handleReset();
        fetchItems();
        refetch();
        document.getElementById(`UpdateItemStatusMaintain${item.id}`).close();
      }
    }
  };

  return (
    <>
      {/* update iutems molela */}
      <button
        className="btn bg-emerald-500"
        onClick={() =>
          document
            .getElementById(`UpdateItemStatusMaintain${item.id}`)
            .showModal()
        }
        disabled={
          item.is_borrowed &&
          (item.condition === "Good" ||
            item.condition === "Slightly Damaged" ||
            item.condition === "Lost" ||
            item.condition === "Broken" ||
            item.condition === "Damaged")
        }
      >
        {item.is_borrowed &&
        (item.condition === "Good" ||
          item.condition === "Slightly Damaged" ||
          item.condition === "Lost" ||
          item.condition === "Broken" ||
          item.condition === "Damaged")
          ? "Unchangeable"
          : "Update Item"}
      </button>

      <button className="btn bg-emerald-500" onClick={openModal}>
        View Logs
      </button>

      <dialog id={`UpdateItemStatusMaintain${item.id}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <>
            <h3 className="font-bold text-lg">Return</h3>
            <div className="button-container">
              <button
                type="button"
                className={`btn  mr-2 ${
                  selectStatus === "Returned" ? "btn-accent selected" : "btn"
                }`}
                onClick={() => handleselectStatus("Returned")}
              >
                Returned
              </button>

              <button
                type="button"
                className={`btn  mr-2 ${
                  selectStatus === "Damaged" ? "btn-accent selected" : "btn"
                }`}
                onClick={() => handleselectStatus("Damaged")}
              >
                Damaged
              </button>
              <button
                type="button"
                className={`btn  mr-2 ${
                  selectStatus === "Broken" ? "btn-accent selected" : "btn"
                }`}
                onClick={() => handleselectStatus("Broken")}
              >
                Broken
              </button>
              <button
                type="button"
                className={`btn  mr-2 ${
                  selectStatus === "Lost" ? "btn-accent selected" : "btn"
                }`}
                onClick={() => handleselectStatus("Lost")}
              >
                Lost
              </button>
            </div>

            {selectStatus === "Returned" && (
              <>
                <h3 className="font-bold text-lg mt-5">Selected Condition:</h3>
                <div className="button-container">
                  <button
                    type="button"
                    className={`btn  mr-2 ${
                      selectedCondition === "Good" && selectStatus !== "Lost"
                        ? "btn-accent selected"
                        : "btn"
                    }`}
                    onClick={() => handleConditionButtonClick("Good")}
                    disabled={
                      selectStatus === "Lost" ||
                      ["Slightly Damaged", "Damaged", "Broken"].includes(
                        item.condition
                      )
                    }
                  >
                    Good
                  </button>
                  <button
                    type="button"
                    className={`btn  mr-2 ${
                      selectedCondition === "Slightly Damaged" &&
                      selectStatus !== "Lost"
                        ? "btn-accent selected"
                        : "btn"
                    }`}
                    onClick={() =>
                      handleConditionButtonClick("Slightly Damaged")
                    }
                    disabled={
                      selectStatus === "Lost" ||
                      ["Damaged", "Broken"].includes(item.condition)
                    }
                  >
                    Slightly Damaged
                  </button>
                </div>
              </>
            )}

            <div className="modal-action">
              <form method="dialog">
                <button
                  className="btn btn-accent mr-2"
                  type="button"
                  onClick={(e) => handleSubmit(e, item)}
                >
                  Submit
                </button>

                <button className="btn">Close</button>
              </form>
            </div>
          </>
        </div>
      </dialog>

      <dialog id={`ViewItemLogs${item.display_id}`} className="modal">
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
                    <td colSpan="6" className="text-center py-4">
                      No transactions available
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-green-50"
                      onClick={() =>
                        document
                          .getElementById(`DetailTransaction${transaction.id}`)
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
                display={true}
              />
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ViewItemLog;
