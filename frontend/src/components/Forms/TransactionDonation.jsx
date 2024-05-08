import React, { useState, useEffect } from "react";
import client from "../../api/client";
import Cookies from "js-cookie";
import UsersTable from "../Displaycomponents/UsersTable";
import CreateItemProfile from "../CustomButtons/Inventory/CreateItemProfile";
import InventoryProfilingTable from "../Displaycomponents/InventoryProfilingTable";
import ManualUserCreation from "../CustomButtons/Transactions/ManualUserCreation";
import InquirySelect from "../Displaycomponents/InquirySelect";
import InquiryDisplay from "../Displaycomponents/InquiryDisplay";

const TransactionDonation = ({ refresh }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [items, setItems] = useState([]);
  const [itemCopies, setItemCopies] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("Good");
  const [Remarks, setRemarks] = useState("");
  const [transactionItems, setTransactionItems] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    console.log("Selected Inquiry:", inquiry);
  };

  const resetState = () => {
    setSelectedUser(null);
    setItems([]);
    setItemCopies([]);
    setSelectedItemId(null);
    setSelectedCondition("Good");
    setRemarks("");
    setTransactionItems([]);
  };

  useEffect(() => {
    console.log(selectedUser);
    const addTransactionItems = async () => {
      try {
        // Step 4: Add The Transactionitems to the Transaction items Backend
        const responseTransactionItems = await client.post(
          "transactions/transaction_items/",
          transactionItems,
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Reset state after successful transaction item addition
        resetState();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call the function when transactionItems state is updated Since it will only happen once at the end of the process
    if (transactionItems.length > 0) {
      addTransactionItems();
    }
  }, [transactionItems]);

  //REmarks
  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };
  //GENERATEUNIQUE ID FOR DELETIOPN
  function generateUniqueId() {
    return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  // set currently selected item for the add copy
  const handleAddCopy = (itemId) => {
    setSelectedItemId(itemId);
    // document.getElementById('AddCopy').showModal();
  };

  const handleAddCopySubmit = (e) => {
    e.preventDefault();

    if (selectedItemId && selectedCondition) {
      const newItemCopy = {
        id: generateUniqueId(), // Using generateUniqueId to create a unique ID for handling delation of single item
        item: selectedItemId.id,
        condition: selectedCondition,
        is_borrowed: false,
      };

      // Add the new copy to the itemCopies array
      setItemCopies((prevItemCopies) => [...prevItemCopies, newItemCopy]);

      // Reset selected condition
      setSelectedCondition("Good");
    }
    document.getElementById("AddCopy").close();
  };

  // remove sinlge item in copies array so only items that have copies can be shown
  const handleRemoveCopy = (itemId, copyId) => {
    // console.log('Removing copy:', itemId, copyId);

    const updatedCopies = itemCopies.filter(
      (copy) => !(copy.item === itemId && copy.id === copyId)
    );

    setItemCopies(updatedCopies);
  };

  //handle selected items that are in const = [items,setItems]
  const handleSelectItems = (selectedItem) => {
    // console.log(`Selected item in TransactionDonation:`, selectedItem);

    const { id, name, returnable } = selectedItem;

    const isItemAlreadyAdded = items.some((item) => item.id === id);

    if (!isItemAlreadyAdded) {
      const selectedItemsData = {
        id,
        name,
        returnable,
        quantity: returnable ? 0 : 1,
      };

      setItems((prevItems) => [...prevItems, selectedItemsData]);
      // console.log("Current Items", items);
    }

    document.getElementById("ChooseItemsDonate").close();
  };

  // handle quantity change of consumable items in the table
  const handleQuantityChange = (index, newQuantity) => {
    const parsedQuantity = Math.max(parseInt(newQuantity, 10) || 1, 1);

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: parsedQuantity,
      };
      return updatedItems;
    });
  };

  const handleRemoveItem = (index) => {
    // Get the ID of the item to be removed
    const itemIdToRemove = items[index].id;

    // Remove the item from the items array
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);

    // Remove item copies with the same ID from the itemCopies array
    const updatedCopies = itemCopies.filter(
      (copy) => copy.item !== itemIdToRemove
    );
    setItemCopies(updatedCopies);
  };
  //handle new user and select it after
  const handleUserIdChange = (userData) => {
    handleSelectUser(userData);
    // You can perform additional actions or set state in the parent component if needed
  };
  //handle selected user for transaction
  const handleSelectUser = (selectedUser) => {
    // console.log(`Selected user in TransactionDonation:`, selectedUser);

    const { user_id, first_name, last_name, email } = selectedUser;

    setSelectedUser({ user_id, first_name, last_name, email });
    document.getElementById("ChooseUserDonate").close();
  };

  const authToken = Cookies.get("authToken");

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedUser && items.length > 0) {
      //Variables
      const createTransaction = {
        transaction_type: "Donation",
        remarks: Remarks,
        is_active: false,
        participant: selectedUser.user_id,
        inquiry: selectedInquiry ? selectedInquiry.id : null,
      };

      const itemsData = items.map((item) => ({
        item: item.id,
        itemDetails: {
          ...item.item,
        },
        quantity: item.quantity,
        returnable: item.returnable,
      }));

      console.log("ITEMSDATA", itemsData);

      const copies = itemCopies.map((item) => ({
        inventory: item.item,
        is_borrowed: false,
        condition: item.condition,
      }));

      let transactionId = "";

      const returnableItemsWithNoCopies = items.filter(
        (item) =>
          item.returnable && itemCopies.every((copy) => copy.item !== item.id)
      );

      if (returnableItemsWithNoCopies.length > 0) {
        // Log a warning or handle the case where returnable items have no copies
        alert("Some returnable items have no copies. Not submitting.");
        return;
      }
    

      //Process
      try {
        //PROBLEM IS WHEN I PUT A EMPTY RETURNABLE ITEM AN DI CREATE TRANSACTION IT CREATS
        //Step 1: Create Transacion
        const responseTransaction = await client.post(
          "transactions/transactions/",
          createTransaction,
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        //Get the Transaction Id from the one you created
        if (responseTransaction.status === 201) {
          //update the transaction id
          transactionId = responseTransaction.data.id;
        }

        //Step 2: Add Items in Inventory
        const responseInventory = await client.post(
          "inventory/inventories/",
          itemsData,
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(responseInventory.data);

        //get the respose items
        if (responseInventory.status === 201) {
          // Filter out items with returnable set to false since handling item copies is different
          const transactionDetails = responseInventory.data
            .filter((item) => !item.item.returnable)
            .map((item) => ({
              inventory: item.id,
              itemDetails: {
                ...item.item,
              },
              quantity:
                itemsData.find((dataItem) => dataItem.item === item.item.id)
                  ?.quantity || 0,
              transaction: transactionId,
            }));

          // console.log("REsponve inveotr ydat",responseInventory.data)

          // Filter out items with returnable set to true
          const filteredTransactionDetails = transactionDetails.filter(
            (item) => !item.returnable
          );
          // console.log("Items Transaction Filtered",filteredTransactionDetails)

          // add the items id in transaction Items
          setTransactionItems(filteredTransactionDetails);
        }

        //Step 3: Add Item Copies If there are item copies available
        if (itemCopies.length > 0) {
          try {
            const responseItemCopy = await client.post(
              "inventory/item-copies/",
              copies,
              {
                headers: {
                  Authorization: `Token ${authToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            // Add the transaction item copies to the SetTransactions
            if (responseItemCopy.status === 201) {
              const newItemCopies = responseItemCopy.data.item_copies.map(
                (itemCopy) => ({
                  item: itemCopy.id,
                  transaction: transactionId,
                  quantity: 1,
                  condition: itemCopy.condition,
                })
              );

              setTransactionItems((prevItems) => [
                ...prevItems,
                ...newItemCopies,
              ]);
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
        console.log("TransactionDonation closed")
        document.getElementById("TransactionDonation").close();
        refresh();
       
       
        //Step 4 is at the use effect
        ///ADD fetch table here
      } catch (error) {
        console.error("Error:", error);
        
      } finally {
        // Set loading state back to false to re-enable buttons
        setIsLoading(false);
      }
    }
  };
  //THIS IS FOR DEBUG PURPOSE
  // useEffect(() => {
  //   console.log("Items Transaction Filtered", transactionItems);
  // }, [transactionItems]);

  return (
    <>
      <button
        className="btn"
        onClick={() =>
          document.getElementById("TransactionDonation").showModal()
        }
      >
        Donation
      </button>
      <dialog id="TransactionDonation" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Transaction Donation</h3>
          <div className="border-t border-gray-200 my-8"></div>
          <p className="py-4">Please Complete the Form</p>
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg">Donor</h3>
            <h1 className="mb-4">
              <div className="flex items-center space-x-4">
                {selectedUser && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-bold text-gray-600">ID:</p>
                      <p className="font-bold">{selectedUser.user_id}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-bold text-gray-600">Name:</p>
                      <p className="font-bold">{`${selectedUser.first_name} ${selectedUser.last_name}`}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-bold text-gray-600">Email:</p>
                      <p className="font-bold">{selectedUser.email}</p>
                    </div>
                  </div>
                )}
                <ManualUserCreation onUserIdChange={handleUserIdChange} />
                <button
                  className="btn btn-accent"
                  onClick={() =>
                    document.getElementById("ChooseUserDonate").showModal()
                  }
                >
                  Choose user
                </button>
              </div>
            </h1>
            {/* User Modal Content */}
            <dialog id="ChooseUserDonate" className="modal">
              <div className="modal-box w-11/12 max-w-5xl h-full">
                <h3 className="font-bold text-lg">Users</h3>
                <UsersTable type={2} onSelectUser={handleUserIdChange} />
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn btn-error">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          <h3 className="font-bold text-lg">Inquiry</h3>
          <InquirySelect
            user={selectedUser}
            onSelectInquiry={handleSelectInquiry}
          />
          {selectedInquiry ? (
            <InquiryDisplay inquiry={selectedInquiry} />
          ) : (
            <h3>Empty</h3>
          )}

          <h3 className="font-bold text-lg">Item</h3>

          <h1 className="mb-4">
            <CreateItemProfile />
            <button
              className="btn btn-accent"
              onClick={() => document.getElementById("ChooseItemsDonate").showModal()}
            >
              Select Items
            </button>
            <div className="overflow-x-auto w-full max-h-screen">
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr className="hover">
                        <td>{item.name}</td>
                        {item.returnable ? (
                          <td>N/A</td>
                        ) : (
                          <td>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                              className="w-16 px-2 py-1 border rounded"
                            />
                          </td>
                        )}
                        <td>{item.returnable ? "Borrowable" : "Consumable"}</td>
                        <td>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="bg-red-500 mr-5 text-white px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                          {item.returnable && (
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded"
                              onClick={() => {
                                handleAddCopy({ id: item.id, name: item.name });
                                document.getElementById("AddCopyDonate").showModal();
                              }}
                            >
                              Add Copy
                            </button>
                          )}
                        </td>
                      </tr>
                      {/* Display nested table only if the item is returnable and has matching itemCopies */}
                      {item.returnable &&
                        itemCopies.some((copy) => copy.item === item.id) && (
                          <tr className="bg-base-200">
                            <td colSpan="3">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-base-200">
                                    <th className="py-2 px-4 border">Copy</th>
                                    <th className="py-2 px-4 border">
                                      Condition
                                    </th>
                                    <th className="py-2 px-4 border">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {itemCopies
                                    .filter((copy) => copy.item === item.id)
                                    .map((filteredCopy, copyIndex) => {
                                      // Log the filtered copy to check its properties
                                      console.log(filteredCopy);

                                      // Check if display_id is available
                                      const displayId =
                                        filteredCopy.display_id || "N/A";

                                      return (
                                        <tr key={copyIndex} className="hover">
                                          <td className="py-2 px-4 border">
                                            Copy: {displayId}
                                          </td>
                                          <td className="py-2 px-4 border">
                                            {filteredCopy.condition}
                                          </td>
                                          <td className="py-2 px-4 border">
                                            <button
                                              onClick={() =>
                                                handleRemoveCopy(
                                                  item.id,
                                                  filteredCopy.id
                                                )
                                              }
                                              className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                              Remove Copy
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </h1>
          <div>
            <h3 className="font-bold text-lg">Remarks</h3>
            <textarea
              className="resize-none border rounded-md p-2 mt-2 w-full"
              placeholder="Enter your remarks here...(Required)"
              value={Remarks}
              onChange={handleRemarksChange}
            />
          </div>

          {/* Item profile Content */}
          <dialog id="ChooseItemsDonate" className="modal">
            <div className="modal-box w-11/12 max-w-5xl h-full">
              <h3 className="font-bold text-lg">Items Here</h3>

              <InventoryProfilingTable onSelectItem={handleSelectItems} />

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-error">Close</button>
                </form>
              </div>
            </div>
          </dialog>

          {/* Item Copy Input */}
          <dialog
            id="AddCopyDonate"
            className="modal fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="modal-box mx-auto max-w-2xl p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Add Copy</h3>
              {selectedItemId && (
                <form>
                  <div className="mb-2">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {selectedItemId.name}
                    </p>
                  </div>
                  <div className="mb-2">
                    <p>
                      <span className="font-semibold">Condition:</span>
                      <select
                        className="border p-2 rounded-md"
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                      >
                        <option value="Good">Good</option>
                        <option value="Slightly Damaged">Slightly Damaged</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Broken">Broken</option>
                      </select>
                    </p>
                  </div>
                  <div className="modal-action mt-6">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                      onClick={handleAddCopySubmit}
                      disabled={isLoading}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => document.getElementById("AddCopyDonate").close()}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                      type="button"
                    >
                      Close
                    </button>
                  </div>
                </form>
              )}
            </div>
          </dialog>

          {/* Transaction MOdel CLOse */}
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-accent mr-2"
                type="button"
                onClick={handleDonationSubmit}
                disabled={isLoading || !items.length > 0}
              >
                Submit
              </button>
              <button className="btn btn-error" onClick={resetState}>Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TransactionDonation;
