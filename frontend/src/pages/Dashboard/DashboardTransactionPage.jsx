import React, { useState, useEffect } from "react";
import TransactionDonation from "../../components/Forms/TransactionDonation";
import TransactionsTable from "../../components/Displaycomponents/TransactionsTable";
import TransactionRelease from "../../components/Forms/TransactionRelease";

const DashboardTransactionPage = ({ User }) => {
  const [activeComponent, setActiveComponent] = useState("release");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [rerenderFlag, setRerenderFlag] = useState(false); // State variable to trigger rerender

  const toggleComponent = (direction) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveComponent((prevComponent) =>
          direction === "next"
            ? prevComponent === "release"
              ? "donation"
              : "release"
            : prevComponent === "release"
            ? "donation"
            : "release"
        );
        setIsTransitioning(false);
      }, 500); // 500 milliseconds = 0.5 seconds
    }
  };

  // Function to trigger rerender
  const forceRerender = () => {
    setRerenderFlag(prevFlag => !prevFlag);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          disabled={isTransitioning}
          onClick={() => toggleComponent("prev")}
          className="mr-4"
        >
          <i className="fa-solid fa-arrow-left fa-3x"></i>
        </button>
        {activeComponent === "release" && <TransactionRelease refresh={forceRerender}/>}
        {activeComponent === "donation" && <TransactionDonation refresh={forceRerender} />}

        <button
          disabled={isTransitioning}
          onClick={() => toggleComponent("next")}
          className="ml-4"
        >
          <i className="fa-solid fa-arrow-right fa-3x"></i>
        </button>
      </div>
      <TransactionsTable User={User} rerenderFlag={rerenderFlag} />
    </>
  );
};

export default DashboardTransactionPage;
