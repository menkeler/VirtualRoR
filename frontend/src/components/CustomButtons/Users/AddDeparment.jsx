import React, { useState } from "react";
import client from "../../../api/client";

const AddDepartment = ({refetch}) => {
  const [departmentName, setDepartmentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await client.post("users/departments/", {
        name: departmentName,
      });

      setDepartmentName("")
      refetch()
      document.getElementById("my_modal_1").close();
    } catch (error) {
      // Handle error (optional)
      alert("Already have that department");
      setDepartmentName("")
    } finally {
      setIsLoading(false);
    }
  };







  return (
    <>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Add A Department
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box ">
          <h3 className="mb-8 font-bold text-lg">Add A Department</h3>
          <form
            onSubmit={handleAddDepartment}
            className="flex items-center justify-center"
          >
            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter department name"
              className="input input-bordered mr-2"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Department"}
            </button>
          </form>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default AddDepartment;
