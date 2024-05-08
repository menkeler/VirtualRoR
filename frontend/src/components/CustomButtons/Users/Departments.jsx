import React, { useState, useEffect } from "react";
import client from "../../../api/client";
import AddDepartment from "./AddDeparment";

const Departments = () => {
  const [departments, setDepartments] = useState([]);

  const fetchData = async () => {
    try {
      const response = await client.get("users/departments/");
      console.log(response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteDepartment = async (e, departmentID) => {
    e.preventDefault();

    // Display confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    // Proceed with deletion if confirmed
    if (confirmDelete) {
      try {
        const res = await client.delete(`users/departments/${departmentID}/`);
        fetchData();
      } catch (error) {
        alert("Error deleting department. Please try again.");
      }
    }
  };

  return (
    <>
      <button
        className="btn"
        onClick={() => {
          document.getElementById("departments").showModal();
        }}
      >
        Departmens
      </button>
      <dialog id="departments" className="modal">
        <div className="modal-box  w-11/12 max-w-3xl">
          <h3 className="font-bold text-lg mb-8">Departments!</h3>
          <AddDepartment refetch={fetchData} />
          <div className="overflow-x-auto mt-8">
            <table className="table">
              {/* Table head */}
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-lg"></th>
                  <th className="px-4 py-2 text-left font-semibold text-lg">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {/* Render table rows dynamically */}
                {departments.map((department, index) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-lg">{index + 1}</td>
                    <td className="px-4 py-2 text-lg">{department.name}</td>
                    <td className="px-4 py-2 text-lg">
                      {department.name !== "None" && (
                        <button
                          type="button"
                          className="btn bg-red-400"
                          onClick={(e) =>
                            handleDeleteDepartment(e, department.id)
                          }
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
};

export default Departments;
