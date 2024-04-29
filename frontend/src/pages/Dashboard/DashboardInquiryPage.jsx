import React from "react";
import Navbar from "../../components/wholepage/Navbar";
import InquiryTable from "../../components/Displaycomponents/InquiryTable";

const DashboardInquiryPage = ({ User, Admin, userBack }) => {
  const backUsers = () => {
    userBack(User);
  };
  return (
    <>
      {User ? (
        <button className="btn btn-primary" onClick={backUsers}>
          Back
        </button>
      ) : null}

      {!Admin ? (
        <InquiryTable User={User} />
      ) : (
        <InquiryTable User={User} Admin={Admin} />
      )}
    </>
  );
};

export default DashboardInquiryPage;
