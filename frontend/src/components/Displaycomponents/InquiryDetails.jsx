import React, { useState, useEffect } from "react";
import client from "../../api/client";
import PostCard from "../../components/Posts/Postcard";

const InquiryDetails = ({ inquiry, Admin, fetchData }) => {
  const [isLoading, setIsLoading] = useState(false);




  //to confirm inquiries donation and for reserving items
  const handleAccept = async (e, inquiryId, purpose) => {
    e.preventDefault();
    const reply = prompt("Enter reply message:");
    if (!reply) return; // If the user cancels the prompt, do nothing
    
    setIsLoading(true);
    try {
      const responseReply = await client.patch(`transactions/inquiries/${inquiryId}/`, {
        reply: reply
      });
      const response = await client.post(
        `transactions/confirm_reservation/${inquiryId}/${purpose}/`
      );

      fetchData();
      document.getElementById(`DetailInquiry${inquiryId}`).close();
      console.log("Submission successful:", response.data);
    } catch (error) {
      console.error("Error Accept:", error);
      console.error("Error Response:", error.response?.data?.detail);
    } finally {
      // Set loading state back to false to re-enable buttons
      setIsLoading(false);
    }
  };
  

  const handleCancelInquiry = async (e, inquiryId) => {
    e.preventDefault();
    const reply = prompt("Enter reply message:");
    if (!reply) return; // If the user cancels the prompt, do nothing
    
    setIsLoading(true);
    try {
      const responseReply = await client.patch(`transactions/inquiries/${inquiryId}/`, {
        reply: reply
      });
      const response = await client.post(
        `transactions/cancel_reserved_items/${inquiryId}/`
      );

      fetchData();
      document.getElementById(`DetailInquiry${inquiryId}`).close();
      console.log("Submission successful:", response.data);
    } catch (error) {
      console.error("Error Response:", error.response?.data?.detail);
    } finally {
      // Set loading state back to false to re-enable buttons
      setIsLoading(false);
    }
  };
  
  return (
    <dialog
      key={`DetailInquiry${inquiry.id}`}
      id={`DetailInquiry${inquiry.id}`}
      className="modal"
    >
      {/* MODAL */}

      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex w-full">
          {/* Transaction Details */}
          <div className="flex-grow card rounded-box place-items-center p-6">
            <h3 className="font-bold text-lg mb-4">inquiry Details</h3>
            <div className="mb-2">ID: {inquiry.id}</div>
            <div className="mb-2">
              Date: {new Date(inquiry.date_created).toLocaleDateString()}
            </div>
            <div className="mb-2">Type: {inquiry.inquiry_type}</div>
            <div className="mb-2">
              {inquiry.status && (
                <span
                  className={`px-2 py-1 rounded-full ${
                    inquiry.status === "Pending"
                      ? "bg-gray-500 text-white"
                      : inquiry.status === "Rejected"
                      ? "bg-red-500 text-white"
                      : inquiry.status === "Cancelled"
                      ? "bg-yellow-500 text-white"
                      : inquiry.status === "Accepted"
                      ? "bg-green-500 text-white"
                      : inquiry.status === "Processed"
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                >
                  {inquiry.status}
                </span>
              )}
            </div>
          </div>

          {/* DVIDIER */}
          <div className="flex items-center mx-4 text-gray-500"></div>
              
          {/* User Details */}
          <div className="flex-grow card rounded-box place-items-center p-6">
            <h3 className="font-bold text-lg mb-4">Client Details</h3>
            <div className="mb-2">
              Name: {inquiry.inquirer.first_name} {inquiry.inquirer.last_name}
            </div>
            <div className="mb-2">
              Department: {inquiry.inquirer.department? inquiry.inquirer.department.name: "None"}
              
            </div>
            <div className="mb-2">
              Position:{" "}
              {inquiry.inquirer.staff
                ? inquiry.inquirer.staff.position
                : "Client"}
            </div>
            <div className="mb-2">Email: {inquiry.inquirer.email}</div>
            <div className="mb-2">Contact: {inquiry.inquirer.contact}</div>
          </div>
        </div>
       
      
        {inquiry.inquiry_type === "Reservation" && (
          <div className="flex flex-col w-full">
            <h3 className="font-bold text-lg mb-4">Inquiry Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full mb-5 bg-white border border-gray-300">
                {/* Head */}
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Quantity/Condition</th>
                  </tr>
                </thead>
                {/* Body */}
                <tbody>
                  {/* Rows */}
                  {inquiry.reserved_items.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="py-2 px-4 border-b">
                        {item.inventory && item.inventory.item
                          ? item.inventory.item.id
                          : item.item.display_id}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {item.inventory && item.inventory.item
                          ? item.inventory.item.name
                          : item.item.inventory.itemprofiling.item_name}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {item.item ? "Borrowable" : "Consumable"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {item.item ? item.item.condition : item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="flex flex-col w-full">
          <div className="border rounded p-4 bg-gray-100">
            <h3 className="font-bold text-lg mb-4">Message</h3>
            <p className="text-gray-800">
              {inquiry.message ? inquiry.message : "No Remarks"}
            </p>
          </div>
          <h3 className="font-bold text-lg my-4">Post</h3>
          {inquiry.post !== null ? (
            <PostCard Data={inquiry.post} display={true} />
          ) : null}
        </div>

        <div className="modal-action">
          <form method="dialog">
            {Admin ? (
              inquiry.status === "Pending" && (
                <>
                  <button
                    className="btn btn-accent mr-2 text-white"
                    type="button"
                    onClick={(e) => handleAccept(e, inquiry.id, "Accept")}
                    disabled={isLoading}
                  >
                    Accept
                  </button>

                  <button
                    className="btn btn-error mr-2 text-white"
                    type="button"
                    onClick={(e) => handleAccept(e, inquiry.id, "Rejected")}
                    disabled={isLoading}
                  >
                    Reject
                  </button>
                </>
              )
            ) : inquiry.status === "Pending" ? (
              <>
                <button
                  className="btn btn-error mr-2 text-white"
                  type="button"
                  onClick={(e) => handleAccept(e, inquiry.id, "Cancelled")}
                >
                  Cancel
                </button>
              </>
            ) : (
              inquiry.status === "Accepted" && (
                <>
                  <button
                    className="btn btn-error mr-2 text-white"
                    type="button"
                    onClick={(e) => handleCancelInquiry(e, inquiry.id)}
                  >
                    Canceled
                  </button>
                </>
              )
            )}

            <button
              className="btn bg-red-500 text-white"
              onClick={() =>
                document.getElementById(`DetailInquiry${inquiry.id}`).close()
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

export default InquiryDetails;
