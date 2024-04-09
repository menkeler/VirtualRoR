import React, { useState, useEffect } from "react";
import client from "../../api/client";
const TransactionDetails = ({ transaction, fetchTransactions }) => {
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectStatus, setSelectStatus] = useState("");

  //purpose for loadgin is to not send multiple transactions and spam
  const [loading, setLoading] = useState(false);
  // console.log(transaction);
  const handleConditionButtonClick = (condition) => {
    setSelectedCondition(condition);
  };

  const handleselectStatus = (status) => {
    //if status is lost change the condition to lost
    if (status === "Lost") {
      setSelectedCondition("Lost");
    } else {
      //if selected status is lost and then change to returned reset condition for no error
      setSelectedCondition("");
    }

    setSelectStatus(status);
  };

  const handleSubmit = async (e, itemId) => {
    e.preventDefault();

    if (selectStatus && selectedCondition) {
      try {
        setLoading(true);
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
            `transactions/transaction_items/${itemId.id}/`,
            payload
          );
          // console.log("Transaction Item Updated:", response);

          const responseCopy = await client.patch(
            `/inventory/item-copies/${itemId.item.id}/`,
            Copypayload
          );
          // console.log("Item Copy Updated:", responseCopy);

          const updatedItemCopy = await client.get(
            `/inventory/item-copies/${itemId.item.id}/`
          );
          // console.log("Updated Item Copy:", updatedItemCopy);
        } else {
          //if Item is Lost
          const payload = {
            status: "Lost",
            return_date: new Date().toISOString().split("T")[0],
            condition: "Lost",
          };

          const Copypayload = {
            condition: "Lost",
            is_borrowed: true,
            previous_is_borrowed: true,
          };

          const response = await client.patch(
            `transactions/transaction_items/${itemId.id}/`,
            payload
          );
          // console.log("Transaction Item Updated:", response);

          const responseCopy = await client.patch(
            `/inventory/item-copies/${itemId.item.id}/`,
            Copypayload
          );
          // console.log("Item Copy Updated:", responseCopy);

          const updatedItemCopy = await client.get(
            `/inventory/item-copies/${itemId.item.id}/`
          );
          // console.log("Updated Item Copy:", updatedItemCopy);
        }
      } catch (error) {
        console.error("Error Accept:", error);
        console.error("Response Data:", error.response.data);
      } finally {
        fetchTransactions();
        document.getElementById(`Update${itemId.item.id}`).close();
        setLoading(false);
      }
    }
  };

  return (
    <dialog
      key={`Detail${transaction.id}`}
      id={`Detail${transaction.id}`}
      className="modal"
    >
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex w-full">
          {/* Transaction Details */}
          <div className="flex-grow card rounded-box place-items-center p-6">
            <h3 className="font-bold text-lg mb-4">Transaction Details</h3>
            <div className="mb-2">ID: {transaction.id}</div>
            <div className="mb-2">
              Date: {new Date(transaction.date_created).toLocaleDateString()}
            </div>
            <div className="mb-2">Type: {transaction.transaction_type}</div>
            <div className="mb-2">
              {transaction.is_active ? (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">
                  Completed
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center mx-4 text-gray-500"></div>

          {/* User Details */}
          <div className="flex-grow card rounded-box place-items-center p-6">
            <h3 className="font-bold text-lg mb-4">Client Details</h3>
            <div className="mb-2">
              Name: {transaction.participant.first_name}{" "}
              {transaction.participant.last_name}
            </div>
            <div className="mb-2">
              Department: {transaction.participant.department}
            </div>
            <div className="mb-2">
              Position:{" "}
              {transaction.participant.staff
                ? transaction.participant.staff.position
                : "Client"}
            </div>
            <div className="mb-2">Email: {transaction.participant.email}</div>
            <div className="mb-2">
              Contact: {transaction.participant.contact}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 my-8"></div>
        {transaction.inquiry && (
          <>
            <h3 className="font-bold text-lg mb-4">Inquiry Connected</h3>
            <table className="table-auto w-full border-collapse border border-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(transaction.inquiry).map(
                  ([key, value]) =>
                    typeof value !== "object" && (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {key}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {value}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </>
        )}

        <div className="flex flex-col w-full">
          <h3 className="font-bold text-lg mb-4">Transaction Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full mb-5 bg-white border border-gray-300">
              {/* Head */}
              <thead className="bg-gray-200">
                <tr>
                <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Quantity/Condition</th>
                  <th className="py-2 px-4 border-b">Return Date</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              {/* Body */}
              <tbody>
                {/* Rows */}
                {transaction.transaction_items.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="py-2 px-4 border-b">
                    {item.inventory ? item.inventory.id : item.item.display_id}
                      
                    </td>
                    <td className="py-2 px-4 border-b">
                      {item.inventory && item.inventory.item
                        ? item.inventory.item.name
                        : item.item.inventory.itemprofiling.item_name}
                    </td>
                    <td className="py-2 px-4 border-b">
                    {item.inventory && item.inventory.item
                        ? item.inventory.item.category.name
                        : item.item.inventory.category.name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {item.item ? "Borrowable" : "Consumable"}
                    </td>
                    <td
                      className={`py-2 px-4 border-b ${
                        item.item && item.condition === "Lost"
                          ? "bg-red-500"
                          : ""
                      }`}
                    >
                      {item.item ? item.item.condition : item.quantity}
                    </td>
                      <td
                      className='py-2 px-4 border-b '
                      
                    >
                      returndate idk yet talk later
                    </td>
                    <td className="py-2 px-4 border-b">
                      {/* Modal for item udpates */}
                      {item.status === "Active" && transaction.is_active && (
                        <>
                          <button
                            className="btn  btn-accent"
                            onClick={() =>
                              document
                                .getElementById(`Update${item.item.id}`)
                                .showModal()
                            }
                          >
                            Update
                          </button>

                          <dialog
                            id={`Update${item.item.id}`}
                            className="modal"
                          >
                            <div className="modal-box">
                              <h3 className="font-bold text-lg">Return</h3>
                              <div className="button-container">
                                <button
                                  type="button"
                                  className={`btn  mr-2 ${
                                    selectStatus === "Returned"
                                      ? "btn-accent selected"
                                      : "btn"
                                  }`}
                                  onClick={() => handleselectStatus("Returned")}
                                >
                                  Returned
                                </button>
                                <button
                                  type="button"
                                  className={`btn  mr-2 ${
                                    selectStatus === "Lost"
                                      ? "btn-accent selected"
                                      : "btn"
                                  }`}
                                  onClick={() => handleselectStatus("Lost")}
                                >
                                  Lost
                                </button>
                              </div>
                              <h3 className="font-bold text-lg mb-5">
                                Condition!
                              </h3>

                              <h3 className="font-bold text-lg">
                                Selected Condition:
                              </h3>
                              <div className="button-container">
                                <button
                                  type="button"
                                  className={`btn  mr-2 ${
                                    selectedCondition === "Acceptable" &&
                                    selectStatus !== "Lost"
                                      ? "btn-accent selected"
                                      : "btn"
                                  }`}
                                  onClick={() =>
                                    handleConditionButtonClick("Acceptable")
                                  }
                                  disabled={selectStatus === "Lost"}
                                >
                                  Acceptable
                                </button>
                                <button
                                  type="button"
                                  className={`btn  mr-2 ${
                                    selectedCondition === "Good" &&
                                    selectStatus !== "Lost"
                                      ? "btn-accent selected"
                                      : "btn"
                                  }`}
                                  onClick={() =>
                                    handleConditionButtonClick("Good")
                                  }
                                  disabled={selectStatus === "Lost"}
                                >
                                  Good
                                </button>
                                <button
                                  type="button"
                                  className={`btn  mr-2 ${
                                    selectedCondition === "Like new" &&
                                    selectStatus !== "Lost"
                                      ? "btn-accent selected"
                                      : "btn"
                                  }`}
                                  onClick={() =>
                                    handleConditionButtonClick("Like new")
                                  }
                                  disabled={selectStatus === "Lost"}
                                >
                                  Like new
                                </button>
                                <button
                                  type="button"
                                  className={`btn mr-2 ${
                                    selectedCondition === "Damaged" &&
                                    selectStatus !== "Lost"
                                      ? "btn-accent selected"
                                      : "btn"
                                  }`}
                                  onClick={() =>
                                    handleConditionButtonClick("Damaged")
                                  }
                                  disabled={selectStatus === "Lost"}
                                >
                                  Damaged
                                </button>
                              </div>

                              <div className="modal-action">
                                <form method="dialog">
                                  <button
                                    className="btn btn-accent mr-2"
                                    type="button"
                                    onClick={(e) => handleSubmit(e, item)}
                                    disabled={loading}
                                  >
                                    Submit
                                  </button>

                                  <button className="btn">Close</button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="border rounded p-4 bg-gray-100">
            <h3 className="font-bold text-lg mb-4">Remarks</h3>
            <p className="text-gray-800">
              {transaction.remarks ? transaction.remarks : "No Remarks"}
            </p>
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn"
              onClick={() =>
                document.getElementById(`Detail${transaction.id}`).close()
              }
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default TransactionDetails;
