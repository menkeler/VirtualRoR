import React, { useState, useEffect } from "react";
import client from "../../api/client";
import Cookies from "js-cookie";
import InventoryTable from "../Displaycomponents/InventoryTable";
import UsersTable from "../Displaycomponents/UsersTable";
import ManualUserCreation from "../CustomButtons/Transactions/ManualUserCreation";
const TransactionRelease = ({ refresh }) => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [Remarks, setRemarks] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialPayload = {
    user_id: null,
    remarks: null,
    transaction_items: [],
    inquiry: null,
    return_date: null,
  };

  const [payload, setPayload] = useState(initialPayload);

  const handleUserIdChange = (userData) => {
    handleSelectUser(userData);
    // You can perform additional actions or set state in the parent component if needed
  };

  const handleSelectUser = (selectedUser) => {
    handleReset();
    // console.log(`Selected user in TransactionDonation:`, selectedUser);

    const { user_id, first_name, last_name, email } = selectedUser;
    setPayload((prevPayload) => ({
      ...prevPayload,
      user_id: user_id,
    }));
    setCurrentUser({ user_id, first_name, last_name, email });
    console.log(`Selected user in TransactionDonation:`, selectedUser);
    document.getElementById("ChooseUserRelease").close();
  };

  const handleReset = () => {
    setCurrentUser("");
    setSelectedInquiry(null); //
    setPayload(initialPayload);
    setRemarks("");
    setReturnDate(null);
  };

  const addItemToPayload = (item) => {
    // Check if the item ID or inventory ID already exists in the transaction_items array
    const isDuplicate = payload.transaction_items.some((existingItem) => {
      return (
        (existingItem.item &&
          item.item &&
          existingItem.item.id === item.item.id) ||
        (existingItem.inventory &&
          !item.item &&
          existingItem.inventory.id === item.inventory.id)
      );
    });

    if (!isDuplicate) {
      // If neither the item ID nor the inventory ID is a duplicate, add the item to the payload
      setPayload((prevState) => ({
        ...prevState,
        transaction_items: [
          ...prevState.transaction_items,
          {
            ...item,
            max_quantity: item.inventory ? item.inventory.quantity : 1,
            quantity: 1,
          },
        ],
      }));
    } else {
      // Handle duplicate item or inventory ID here, maybe show an error message
      console.log("Duplicate item or inventory ID found.");
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    // Remove the item from payload.transaction_items
    const updatedTransactionItems = payload.transaction_items.filter(
      (item) => item !== itemToRemove
    );
    setPayload((prevState) => ({
      ...prevState,
      transaction_items: updatedTransactionItems,
    }));
  };

  const handleQuantityChange = (newValue, item) => {
    // Find the item in the payload that matches the item's inventory ID
    const payloadItem = payload.transaction_items.find((payloadItem) => {
      return (
        payloadItem.inventory && payloadItem.inventory.id === item.inventory.id
      );
    });

    if (payloadItem) {
      // Update the quantity of the payloadItem with the new value
      payloadItem.quantity = parseInt(newValue);

      // Ensure the quantity does not exceed max_quantity
      if (payloadItem.quantity > payloadItem.max_quantity) {
        payloadItem.quantity = payloadItem.max_quantity;
      }

      // Update the payload state
      setPayload((prevState) => ({
        ...prevState,
        transaction_items: prevState.transaction_items.map((existingItem) =>
          existingItem === payloadItem ? payloadItem : existingItem
        ),
      }));
    } else {
      console.error("Item not found in payload:", item);
    }
  };

  const handleItemAdd = (item) => {
    console.log("item addeed", item);
    addItemToPayload(item);
  };

  const fetchInquiries = async (page) => {
    try {
      const response = await client.get(
        `transactions/inquiries/?page=${page}&ordering=status&status=Accepted&type=Reservation&search=${searchQuery}`
      );
      console.log(response.data);
      const { results, count } = response.data;
      setInquiries(results);
      setTotalPages(Math.ceil(count / 50));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchInquiries(currentPage);
    console.log("payload", payload);
    console.log("inquiries", selectedInquiry);
  }, [currentPage, searchQuery, selectedInquiry, payload]);

  // INquiry selected
  const handleSelectInquiry = (inquiry) => {
    // Reset payload to initial state
    setPayload(initialPayload);
    setCurrentUser(inquiry.inquirer);
    // Set the selected inquiry
    setSelectedInquiry(inquiry);

    // Create transaction items from reserved items of the selected inquiry
    const newTransactionItems = inquiry.reserved_items.map((reservedItem) => ({
      id: reservedItem.id, // Assuming reservedItem has an ID field
      ...(reservedItem.item
        ? { item: reservedItem.item } // Use item if it exists
        : {
            inventory: {
              // Otherwise, use inventory
              id: reservedItem.inventory.id, // Assuming inventory is nested within the reservedItem
              item: reservedItem.inventory.item,
              // Add other inventory fields as needed
            },
          }),
      quantity: reservedItem.quantity,
      // Add other fields from the reservedItem as needed
    }));

    // Update payload to include the new transaction items
    setPayload((prevState) => ({
      ...prevState,
      inquiry: inquiry.id,
      user_id: inquiry.inquirer.user_id,
      transaction_items: [
        ...newTransactionItems,
        ...prevState.transaction_items,
      ],
    }));
    console.log("Updated payload of all", payload);

    // Close the SelectTransaction element
    document.getElementById("SelectTransaction").close();
  };

  //REmarks
  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };
  const handleDateSelected = (e) => {
    setReturnDate(e.target.value);
  };

  //user token ehre for now

  const authToken = Cookies.get("authToken");
  //SUbmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (payload.transaction_items.length > 0) {
      console.log("submit");

      try {
        // Assuming payload is an object containing transaction-related data
        const updatedPayload = {
          ...payload, // Copy existing payload data
          remarks: Remarks, // Update remarks with the new value
          return_date: returnDate,
        };

        // Now you can use the updatedPayload in your application

        const responseTransaction = await client.post(
          `transactions/process_transaction/`,
          updatedPayload,
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (
          responseTransaction.status >= 200 &&
          responseTransaction.status < 300
        ) {
          // Request was successful
          console.log("Transaction successful:", responseTransaction.data);
        } else {
          // Request was not successful
          console.error(
            "Transaction failed with status:",
            responseTransaction.status
          );
        }
      } catch (error) {
        // Handle error
        console.error("Error:", error);
      } finally {
        // Set loading state back to false to re-enable buttons
        setIsLoading(false);
      }

      handleReset();
      refresh();
      document.getElementById("CreateTransaction").close();
    }
  };

  return (
    <>
      <button
        className="btn"
        onClick={() => document.getElementById("CreateTransaction").showModal()}
      >
        Release
      </button>

      {/* Modal */}
      <dialog id="CreateTransaction" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Create Transaction</h3>

          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <ManualUserCreation onUserIdChange={handleUserIdChange} />
              <button
                className="btn btn-accent ml-2" // Use Tailwind spacing utility classes to add margin
                onClick={() =>
                  document.getElementById("ChooseUserRelease").showModal()
                }
              >
                Choose user
              </button>
              <button
                className="btn ml-2"
                onClick={() =>
                  document.getElementById("SelectTransaction").showModal()
                }
              >
                Load Reservations
              </button>
            </div>
            <div className="flex flex-row">
              <button
                className="btn mx-2 mt-2"
                onClick={() =>
                  document.getElementById("SelectInventoryRelease").showModal()
                }
                disabled={!currentUser}
              >
                Add Item
              </button>

              <button className="btn mx-2 mt-2" onClick={handleReset}>
                Remove All
              </button>
            </div>

            <h3 className="font-bold mt-3 text-lg">Inquirer</h3>
            {selectedInquiry && (
              <>
                <h3 className="font-bold mt-3 text-lg">
                  Reservation ID: {selectedInquiry.id}
                </h3>
              </>
            )}

            <h1 className="mb-4">
              <div className="flex items-center space-x-4 mt-3">
                {currentUser && (
                  <>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-semibold text-gray-600">ID:</p>
                      <p className="text-blue-500">{currentUser.user_id}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-semibold text-gray-600">Name:</p>
                      <p className="text-blue-500">
                        {currentUser.first_name} {currentUser.last_name}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-semibold text-gray-600">Email:</p>
                      <p className="text-blue-500">{currentUser.email}</p>
                    </div>
                  </>
                )}
              </div>
            </h1>

            {currentUser && (
              <>
                {payload.transaction_items.some((item) => item.item) && (
                  <>
                    <h3 className="font-bold mt-3 text-lg">Return Date</h3>
                    <div className="date-selector-container">
                      <label htmlFor="datePicker">Select a date:</label>
                      <input
                        type="date"
                        id="datePicker"
                        value={returnDate}
                        onChange={handleDateSelected}
                        className="input input-bordered w-full max-w-xs"
                        min={new Date().toISOString().split("T")[0]}
                        max={
                          new Date(
                            new Date().getTime() + 100 * 24 * 60 * 60 * 1000
                          )
                            .toISOString()
                            .split("T")[0]
                        }
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <h3 className="font-bold mt-3 text-lg">Items</h3>
            <div className="overflow-x-auto w-full max-h-screen">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th className="text-center">ID</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Category</th>
                    <th className="text-center">Quantity/Condition</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payload &&
                    payload.transaction_items.map((result, index) => (
                      <tr key={result.id}>
                        <td>{index + 1}</td>
                        {result.item ? ( // If the item exists
                          <>
                            <td className="truncate text-center">
                              ID: {result.item.display_id}
                            </td>
                            <td className="text-center">
                              {result.item.inventory.itemprofiling.item_name}{" "}
                            </td>
                            <td className="text-center">
                              {result.item.inventory.category.name}{" "}
                            </td>
                            <td className="text-center">
                              {result.item.condition}
                            </td>
                          </>
                        ) : (
                          // If the item does not exist (i.e., inventory item)
                          <>
                            <td className="text-center">
                              ID: {result.inventory.id}
                            </td>
                            <td className="text-center">
                              {result.inventory.item.name}
                            </td>
                            <td className="text-center">
                              {result.inventory.item.category.name}
                            </td>

                            <td className="text-center">
                              <input
                                className="input input-bordered w-full max-w-xs"
                                type="number"
                                min="1"
                                max={
                                  result.inventory
                                    ? result.max_quantity // Use max_quantity if it exists
                                    : result.quantity // Otherwise, use quantity
                                }
                                value={result.quantity} // Bind the input value to the quantity from the payload
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  handleQuantityChange(newValue, result); // Call handleQuantityChange function when input changes
                                }}
                              />
                            </td>
                          </>
                        )}
                        <td className="text-center">
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRemoveItem(result)} // Call handleRemoveItem function when the button is clicked
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Rmearks   */}

            <h3 className="mt-5 font-bold text-lg">Remarks</h3>
            <textarea
              className="resize-none border rounded-md p-2 mt-2 w-full"
              placeholder="Enter your remarks here... (optional)"
              value={Remarks}
              onChange={handleRemarksChange}
            />
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button
                type="button"
                className="btn btn-accent mr-2 text-white"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Submit
              </button>

              <button className="btn" onClick={handleReset}>Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="SelectTransaction" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Select Reservation</h3>
          <p className="py-4"></p>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
          />
          <div className="mt-4 grid gap-4 grid-cols-2">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="p-5 bg-white rounded-lg shadow-md"
              >
                <h2 className="text-base font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 text-truncate">
                  Reservation ID: {inquiry.id}
                </h2>
                <p className="text-sm text-gray-600 overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 text-truncate">
                  Inquirer: {inquiry.inquirer.first_name}{" "}
                  {inquiry.inquirer.last_name}
                </p>
                <h2 className="text-base font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 text-truncate">
                  Items
                </h2>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th></th>

                        <th className="text-center">Name</th>
                        <th className="text-center">Quantity/Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiry.reserved_items.map((result, index) => (
                        <tr key={result.id}>
                          <td>{index + 1}</td>
                          {result.item ? (
                            <>
                              <td className="truncate text-center">
                                ID: {result.item.display_id}{" "}
                                {result.item.inventory.itemprofiling.item_name}
                              </td>
                              <td className="text-center">
                                {result.item.condition}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="text-center">
                                {result.inventory.item.name}
                              </td>
                              <td className="text-center">{result.quantity}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => handleSelectInquiry(inquiry)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                >
                  Select
                </button>
              </div>
            ))}
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* inventor ymodal */}

      <dialog id="SelectInventoryRelease" className="modal">
        <div className="container mx-auto my-8 p-6 bg-white shadow-md rounded-md md:w-[84vw] lg:w-[64vw]">
          <div>
            <InventoryTable handleItemAdd={handleItemAdd} />
          </div>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </dialog>
      {/* User Modal Content */}
      <dialog id="ChooseUserRelease" className="modal">
        <div className="modal-box w-11/12 max-w-5xl h-full">
          <h3 className="font-bold text-lg">Users</h3>
          <UsersTable type={2} onSelectUser={handleSelectUser} />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-error">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TransactionRelease;
