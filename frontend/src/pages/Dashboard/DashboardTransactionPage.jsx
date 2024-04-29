import React, { useState, useEffect } from "react";
import TransactionDonation from "../../components/Forms/TransactionDonation";
import TransactionsTable from "../../components/Displaycomponents/TransactionsTable";
import TransactionRelease from "../../components/Forms/TransactionRelease";

const DashboardTransactionPage = ({ User, userBack }) => {

  const [flag, setFlag] = useState(false);
  const backUsers = () => {
    userBack(User);
  };
  const test = () => {
    setFlag(!flag); 
  };
  return (
    <>
      <div className="flex items-center justify-center">
        {User ? (
          <button className="btn btn-primary" onClick={backUsers}>
            Back
          </button>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-2">
            <TransactionRelease refresh={test}/>
          </div>
          <div className=" p-2">
            <TransactionDonation refresh={test}/>
          </div>
        </div>
      </div>
      <TransactionsTable User={User} rerenderFlag={flag ? test : null} />
    </>
  );
};

export default DashboardTransactionPage;
