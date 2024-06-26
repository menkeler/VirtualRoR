import React, { useState, useEffect } from "react";
import client from "../../api/client";
import Cookies from "js-cookie";
import Select from "react-select";
import CreateItemProfile from "../CustomButtons/Inventory/CreateItemProfile";
import EditItemProfileForm from "../Forms/EditItemProfileForm";
import CategoryHook from "../../hooks/CategoryHook";

const InventoryProfilingTable = ({ onSelectItem, Admin, type }) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categoryQuery, setCategoryQuery] = useState("");
  const { categoryData, loading, error, refetchCategory } = CategoryHook();
  const [typeQuery, setTypeQuery] = useState("");

  useEffect(() => {
    fetchItems(currentPage, typeQuery, categoryQuery?.value ?? "");
  }, [searchQuery, currentPage, typeQuery, categoryQuery]);

  // useEffect(() => {

  //  // fetch once for mount of component
  //  refetchCategory()
  // }, []);

  const handleFormSubmitSuccess = () => {
    // Fetch new data after successful form submission
    fetchItems(currentPage, typeQuery, categoryQuery?.value ?? "");
    console.log("refetched data");
  };

  const fetchItems = async (page, type, category) => {
    try {
      const authToken = Cookies.get("authToken");
      const response = await client.get(
        `inventory/item-profiling/?page=${page}&search=${encodeURIComponent(
          searchQuery
        )}&category=${encodeURIComponent(category)}&returnable=${type}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      const { results, count } = response.data;

      setItems(results);
      setTotalPages(Math.ceil(count / 30));

      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setCurrentPage(1);
    }
  };

  const handleTypeQuery = function (e) {
    e.preventDefault();
    setTypeQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleSelectItem = (itemId) => {
    onSelectItem(itemId);
  };

  if (Admin) {
    return (
      <>
        <div className="flex">
          <CreateItemProfile onFormSubmit={handleFormSubmitSuccess} />
          <button
            className="btn btn-accent mr-2"
            type="button"
            onClick={() => document.getElementById("CategoryList").showModal()}
          >
            Categories
          </button>
          {/* Search bar */}
          <div className="flex ml-2">
            <input
              type="text"
              value={searchQuery}
              className="input bg-white"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Item Profile..."
            />
            <select
              id="ItemType"
              aria-label="Select"
              className="ml-2 px-3 py-2 border rounded-md bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              value={typeQuery}
              onChange={handleTypeQuery}
            >
              <option value="">All</option>
              <option value="true">Borrowables</option>
              <option value="false">Consumables</option>
            </select>

            <Select
              value={categoryQuery}
              onChange={(selected) => {
                setCategoryQuery(selected);
              }}
              options={[
                { value: "", label: "All" },
                ...categoryData.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
              isSearchable
              placeholder="Search or select category"
              className="ml-2 w-full"
              maxMenuHeight={200}
              menuPlacement="auto"
            />
          </div>
        </div>

        {/* List of names */}
        <div className="mt-4 grid gap-6 grid-cols-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white rounded-lg shadow-md overflow-hidden"
            >
              <h2 className="text-lg font-semibold overflow-wrap break-word whitespace-normal mb-2">
                {item.name}
              </h2>

              <p className="text-sm text-gray-600 whitespace-nowrap mb-2">
                {item.description}
              </p>

              {item.returnable ? (
                <span className="badge bg-blue-500 text-white ml-2">
                  Borrowable
                </span>
              ) : (
                <span className="badge bg-green-500 text-white ml-2">
                  Consumable
                </span>
              )}

              {/* Display additional information */}
              <p className="text-sm text-gray-500 mb-2">
                Category: {item.category.name}
              </p>
              {/* Add more details as needed */}
              {categoryData.length > 0 && (
                <EditItemProfileForm
                  item={item}
                  category={item.category}
                  categoriesList={categoryData}
                  onSubmitSuccess={handleFormSubmitSuccess}
                />
              )}
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="join mt-4">
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage)}
          >
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Items..."
            className="input bg-white"
          />

          <select
            id="ItemType"
            aria-label="Select"
            className="ml-2"
            value={typeQuery}
            onChange={handleTypeQuery}
          >
            <option value="">All</option>
            <option value="true">Borrowables</option>
            <option value="false">Consumables</option>
          </select>

          <Select
            value={categoryQuery}
            onChange={(selected) => {
              setCategoryQuery(selected);
              console.log("Selected category:", selected);
            }}
            options={[
              { value: "", label: "All" },
              ...categoryData.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
            isSearchable
            placeholder="Search or select category"
            className="ml-2 bg-gray-100"
            maxMenuHeight={200}
          />
        </div>

        {/* <div className="mt-4 grid gap-6 grid-cols-3">
              {items.map((item) => (
                  <div key={item.id} className="p-6 bg-white rounded-lg shadow-md overflow-hidden">
                  <h2 className="text-lg font-semibold overflow-wrap break-word whitespace-normal mb-2">
                {item.name}
              </h2>

              <figure>
                  <img
                    src='https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
              </figure>

              <p className="text-sm text-gray-600 whitespace-nowrap mb-2">
                  {item.description}
              </p>

              {item.returnable ? (
              <span className="badge bg-blue-500 text-white ml-2">Borrowable</span>
              ) : (
              <span className="badge bg-green-500 text-white ml-2">Consumable</span>
              )}

              
              <p className="text-sm text-gray-500 mb-2">
                  Category: {item.category.name}
              </p>
      
             
              </div>
          ))}
          </div> */}

        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead class="text-slate-800 bg-slate-100">
              <tr>
                <th class="px-4 py-2"></th>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Description</th>
                <th class="px-4 py-2">Returnable</th>
                <th class="px-4 py-2">Category</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody class="text-slate-700">
              {items.map((item, index) => (
                <tr key={item.id} class="hover:bg-slate-200">
                  <td class="px-4 py-2">{index + 1}</td>
                  <td class="px-4 py-2">{item.name}</td>
                  <td class="px-4 py-2">
                    {item.description && item.description.length > 60
                      ? `${item.description.substring(0, 60)}...`
                      : item.description}
                  </td>
                  <td class="px-4 py-2">
                    {item.returnable ? "Borrowable" : "Consumable"}
                  </td>
                  <td class="px-4 py-2">{item.category.name}</td>
                  <td class="px-4 py-2">
                    <button
                      onClick={() => handleSelectItem(item)}
                      class="px-3 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 focus:outline-none focus:shadow-outline-lime active:bg-lime-700"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="join mt-4">
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage)}
          >
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </>
    );
  }
};

export default InventoryProfilingTable;
