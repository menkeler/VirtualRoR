import React, { useState, useEffect } from "react";
import client from "../../api/client";
import Cookies from "js-cookie";
import Select from "react-select";
import { useCart } from "../../contexts/CartContext";
import CategoryHook from "../../hooks/CategoryHook";
import ViewItemLog from "./ViewItemLog";

const InventoryTable = ({ type, handleItemAdd }) => {
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const { categoryData, loading, error, refetchCategory } = CategoryHook();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const { state, dispatch } = useCart();
  const [showAlert, setShowAlert] = useState(false);

  const filteredInventory =
    type === 1 ? inventory.filter((item) => !item.is_hidden) : inventory;

  const handleItemClick = () => {
    // Call the handleItemAdd function passed from the parent with the item
    handleItemAdd(item);
  };

  const changeHide = async (e, invetory) => {
    e.preventDefault();
    const payload = {
      is_hidden: !invetory.is_hidden,
    };
    try {
      const res = await client.patch(
        `inventory/inventories/${invetory.id}/`,
        payload
      );
    } catch (error) {
      console.error("Error submitting form data:", error.response);
    }
    console.log("Form submitted with payload:", payload);
    fetchItems(currentPage, "");
  };

  const addToCart = (inventoryId, itemName, displayid, itemId, maxquantity) => {
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
    // Check if the item with the same id already exists in the cart
    const itemExists = state.cartItems.some(
      (item) => item.inventory !== null && item.inventory === inventoryId
    );
    const copyExists = state.cartItems.some(
      (item) => item.item !== null && item.item === itemId
    );

    if (!itemExists && !copyExists) {
      const payload = {
        inventory: inventoryId,
        item: itemId,
        name: itemName,
        quantity: 1,
        displayid: displayid,
        maxquantity: maxquantity,
        // nextime add image here
      };

      dispatch({ type: "ADD_TO_CART", payload });
    } else {
      console.log(`Item with id ${itemId} is already in the cart`);
    }
  };

  const fetchItems = async (page, category) => {
    try {
      setIsFetching(true);
      const authToken = Cookies.get("authToken");
      const encodedSearchQuery = encodeURIComponent(searchQuery);

      const response = await client.get(
        `inventory/inventories/?page=${page}&search_category=${category}&search=${encodedSearchQuery}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      const { results, count } = response.data;
      console.log(results);
      setInventory(results);
      setTotalPages(Math.ceil(count / 30));

      // console.log(response.data);
      // console.log(selectedCategory);
    } catch (error) {
      console.error("Error fetching items:", error);
      setCurrentPage(1);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchItems(currentPage, selectedCategory);
    refetchCategory();
  }, [searchQuery, currentPage, selectedCategory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const Actions = (item) => {
    if (type === 1) {
      return (
        <div className="flex flex-col place-items-center">
          {!item.item.returnable &&
            item.quantity > 0 &&
            item.quantity > item.reserved_quantity && (
              <button
                className="bg-emerald-500 rounded-md text-sm text-white w-40 text-center px-4 py-1 hover:scale-105 hover:bg-emerald-300 transition duration-500"
                onClick={() =>
                  addToCart(
                    item.id,
                    item.item.name,
                    null,
                    null,
                    item.quantity - item.reserved_quantity
                  )
                }
              >
                Reserve Item
              </button>
            )}
          {(item.quantity <= 0 || item.quantity <= item.reserved_quantity) && (
            <div className="bg-red-500 rounded-md text-sm text-white w-40 text-center px-4 py-1 hover:bg-red-800 transition duration-500">
              {item.quantity <= 0 ? "Out of Stock" : "Reserved"}
            </div>
          )}
        </div>
      );
    } else if (type === 2) {
      return <div></div>;
    } else {
      return (
        <div className="flex flex-col place-items-center">
          {!item.item.returnable && item.quantity > 0 && (
            <button
              className="bg-emerald-500 rounded-md text-sm text-white w-40 text-center px-4 py-1 hover:scale-105 hover:bg-emerald-300 transition duration-500"
              onClick={() => handleItemAdd({ inventory: item })}
            >
              Add to Transaction
            </button>
          )}
          {item.quantity <= 0 && (
            <div className="bg-red-500 rounded-md text-sm text-white w-40 text-center px-4 py-1 hover:bg-red-800 transition duration-500">
              Out of Stock
            </div>
          )}
        </div>
      );
    }
  };
  const CopyTable = (item, copy) => {
    if (type === 1) {
      return (
        <td className="py-2 px-4 border-b">
          {!copy.is_borrowed && !copy.is_reserved && (
            <button
              className="bg-emerald-500 rounded-md text-sm text-white w-20 text-center px-4 py-1 hover:scale-105 hover:bg-emerald-300 transition duration-500"
              onClick={() =>
                addToCart(null, item.item.name, copy.display_id, copy.id, 1)
              }
            >
              Reserve
            </button>
          )}
        </td>
      );
    } else if (type === 2) {
      return (
        <td className="py-2 px-4 border-b">
          <ViewItemLog item={copy} />
        </td>
      );
    } else {
      return (
        <td className="py-2 px-4 border-b">
          {!copy.is_borrowed && (
            <button
              className="bg-emerald-500 rounded-md text-sm text-white w-20 text-center px-4 py-1 hover:scale-105 hover:bg-emerald-300 transition duration-500"
              onClick={() => handleItemAdd({ item: copy })}
            >
              Add
            </button>
          )}
        </td>
      );
    }
  };
  const CopyTable2 = () => {
    if (type !== 2) {
      return <th className="py-2 px-4 border-b">Action</th>;
    } else {
      return <div></div>;
    }
  };
  return (
    <div className="container mx-auto p-4 md:w-[75vw] lg:w-[60vw]">
      <h1 className="text-lg font-bold mb-5">Inventory</h1>
      {/* Search bar and Category Selector */}
      <div className="flex flex-wrap mb-4">
        {/* Search bar */}
        <div className="w-full sm:w-3/4 pr-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="border p-2 w-full text-sm"
          />
        </div>

        {/* Category Selector */}
        <div className="w-full sm:w-1/4">
          <Select
            value={selectedCategory}
            // IF SELECTED VALUE IS EMPTY WHICH IS ALL MAKE SELECTEDCATEGORY ""
            onChange={(selected) =>
              setSelectedCategory(selected.value === "" ? "" : selected.label)
            }
            options={[
              { value: "", label: "All" },
              ...categoryData.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
            isSearchable
            placeholder="Select category"
            className="w-full bg-white text-sm"
            maxMenuHeight={200}
            isDisabled={isFetching}
          />
        </div>
      </div>

      {/* Selected Category */}
      <div className="mb-4">
        {selectedCategory && (
          <p className="font-bold text-lg">
            Selected Category: {selectedCategory}
          </p>
        )}
      </div>

      {/* Items */}
      <p className="text-gray-400 text-right text-sm">
        *click on an item to view details
      </p>
      <table className="table table-fixed min-w-full bg-white">
        {/* Header */}
        <thead className="font-bold">
          <tr>
            <th className="py-3 border-b w-10">Item No</th>
            <th className="py-3 border-b w-[30%]">Name</th>
            <th className="py-3 border-b w-20">Type</th>
            <th className="py-3 border-b w-10">Quantity</th>
            <th className="py-3 border-b w-10">Reserved</th>
            <th className="py-3 border-b w-20">Category</th>
            {type === 2 && <th className="py-3 border-b w-20">Hidden</th>}
          </tr>
        </thead>
        <tbody className="font-semibold">
          {filteredInventory.map((item) => (
            <React.Fragment key={item.id}>
              <tr
                className={
                  item.quantity > 0
                    ? "bg-zinc-200 hover:bg-green-200 border-b-4 border-white overflow-hidden transition duration-1000"
                    : "bg-red-200 hover:bg-red-400 border-b-4 border-white overflow-hidden transition duration-1000"
                }
                onClick={() =>
                  document.getElementById(`ItemPanel${item.id}`).showModal()
                }
              >
                <td className="py-2 text-center">{item.id}</td>
                <td className="py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {item.item.name}
                </td>
                <td className="py-2">
                  {item.item.returnable ? (
                    <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      Borrowable
                    </p>
                  ) : (
                    <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      Consumable
                    </p>
                  )}
                </td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">{item.reserved_quantity}</td>

                <td className="py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {item.item.category.name}
                  {/*Item Panel ----------------------------------------------------------------------------- */}
                  <dialog id={`ItemPanel${item.id}`} className="modal">
                    <div
                      className={
                        item.item.returnable && item.quantity > 0
                          ? "modal-box min-w-fit"
                          : "modal-box max-w-fit"
                      }
                    >
                      {showAlert && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                          <div className="bg-green-500 text-white rounded-lg p-8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="stroke-current shrink-0 h-6 w-6 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Item Added!</span>
                          </div>
                        </div>
                      )}

                      <div
                        className={
                          item.item.returnable &&
                          item.quantity > 0 &&
                          "flex space-x-24"
                        }
                      >
                        <div className="max-w-[25vw]">
                          <h3 className="font-bold text-lg text-center">
                            Item Details
                          </h3>
                          <table className="w-full">
                            <tbody>
                              <tr className="border-none max-h-fit whitespace-normal">
                                <td className="w-40 text-gray-500">Name:</td>
                                <td>{item.item.name}</td>
                              </tr>
                              <tr className="border-none">
                                <td className="text-gray-500">Type:</td>
                                {item.item.returnable ? (
                                  <td>Borrowable</td>
                                ) : (
                                  <td>Consumable</td>
                                )}
                              </tr>
                              <tr className="border-none">
                                <td className="text-gray-500">Category:</td>
                                <td>{item.item.category.name}</td>
                              </tr>
                              <tr className="border-none">
                                <td className="text-gray-500">Quantity:</td>
                                <td>{item.quantity}</td>
                              </tr>
                              <tr className="border-none">
                                <td className="text-gray-500">Reserved:</td>
                                <td>{item.reserved_quantity}</td>
                              </tr>
                              <tr className="border-none">
                                <td className="text-gray-500">Borrowed:</td>
                                <td>{item.borrowed_quantity}</td>
                              </tr>
                            </tbody>
                          </table>
                          <article className="whitespace-normal">
                            <p className="m-3 text-sm text-gray-500">
                              Description:
                            </p>
                            <p className="m-3 font-normal text-sm">
                              {item.item.description}
                            </p>
                          </article>
                          {Actions(item)}
                          <p className="text-gray-400 text-center text-xs font-normal mt-2">
                            ---- click outside to close ----
                          </p>
                          {type === 2 && (
                            <button
                              className="btn btn-primary mt-8"
                              onClick={(e) => changeHide(e, item)}
                            >
                              {item.is_hidden ? "Unhide item" : "Hide item"}
                            </button>
                          )}
                        </div>
                        {item.item.returnable && item.quantity > 0 && (
                          <div>
                            <p className="py-4 text-center">Available Copies</p>
                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-white border border-gray-300">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">
                                      Condition
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                      Status
                                    </th>
                                    {CopyTable2()}
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.item_copies.map((copy, index) => {
                                    if (type === 1 && copy.condition === "Lost"|| copy.condition === "Broken"||copy.condition === "Damaged") {
                                      return null; // Skip rendering the row if type is 1 and copy status is Lost ,Damaged,Broken
                                    }

                                    return (
                                      <tr
                                        key={index}
                                        className={
                                          index % 2 === 0 ? "bg-gray-100" : ""
                                        }
                                      >
                                        <td className="py-2 px-4 border-b">
                                          {copy.display_id}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                          {copy.condition}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                          {copy.is_reserved ? (
                                            <div className="border-2 border-blue-500 rounded-lg text-sm text-blue-500 w-30 text-center px-4 py-1">
                                              Reserved
                                            </div>
                                          ) : copy.condition === "Lost" ? (
                                            <div className="border-2 border-red-900 rounded-lg text-sm text-red-900 w-30 text-center px-4 py-1">
                                              Item Lost
                                            </div>
                                          ) : copy.is_borrowed ? (
                                            <div className="border-2 border-red-500 rounded-lg text-sm text-red-500 w-30 text-center px-4 py-1">
                                              Borrowed
                                            </div>
                                          ) : (
                                            <div className="border-2 border-emerald-500 rounded-lg text-sm text-emerald-500 w-30 text-center px-4 py-1">
                                              Available
                                            </div>
                                          )}
                                        </td>
                                        {CopyTable(item, copy)}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </td>
                {type === 2 && ( // Render the cell if type is 2
                  <td style={{ color: item.is_hidden ? "red" : "green" }}>
                    {!item.is_hidden ? "Visible" : "Hidden"}
                  </td>
                )}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isFetching}
        >
          « Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isFetching}
        >
          Next »
        </button>
      </div>
    </div>
  );
};

export default InventoryTable;
