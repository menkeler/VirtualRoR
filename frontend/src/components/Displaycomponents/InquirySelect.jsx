import React, { useState, useEffect } from "react";
import client from "../../api/client";

const InquirySelect = ({ user, onSelectInquiry }) => {
  const [inquiryData, setInquiryData] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const userParam = user && user.user_id ? user.user_id : "";
        const response = await client.get(
          `transactions/inquiries/?ordering=status&status=Accepted&type=Donation&user=${userParam}`
        );
        setInquiryData(response.data.results);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, [user]);

  const handleSelectInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    onSelectInquiry(inquiry); // Invoke the callback function with the selected inquiry
    document.getElementById("ChooseInquiry").close();
  };

  return (
    <>
      <button
        className="btn btn-accent"
        disabled={!user}
        onClick={() => document.getElementById("ChooseInquiry").showModal()}
      >
        Select Inquiry
      </button>
      {/* Inquiry Content */}
      <dialog id="ChooseInquiry" className="modal">
        <div className="modal-box w-11/12 max-w-5xl h-full">
          <h3 className="font-bold text-lg">Inquiry Select</h3>
          {/* Map inquiry data here in a list */}
          <ul className="mt-4">
            {inquiryData.map((inquiry, index) => (
              <li
                key={index}
                className={`border-b py-2 ${
                  selectedInquiry === inquiry ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSelectInquiry(inquiry)}
              >
                <p className="font-bold">Inquiry ID: {inquiry.id}</p>
                <p>
                  Date Created:{" "}
                  {new Date(inquiry.date_created).toLocaleString()}
                </p>
                <p>Date Preferred: {inquiry.date_preferred}</p>
                <p>
                  Inquirer: {inquiry.inquirer.first_name}{" "}
                  {inquiry.inquirer.last_name}
                </p>
                <p>Inquiry Type: {inquiry.inquiry_type}</p>
                <p>Message: {inquiry.message}</p>
                <p>Status: {inquiry.status}</p>
              </li>
            ))}
          </ul>
          <div className="modal-action mt-4">
            <button
              className="btn btn-error"
              onClick={() => document.getElementById("ChooseInquiry").close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default InquirySelect;
