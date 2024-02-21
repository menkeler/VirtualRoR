import React, { useState, useEffect } from "react";
import client from "../../api/client";
import Navbar from "../../components/wholepage/Navbar";
import Cookies from "js-cookie";
import { useAuth } from "../../contexts/AuthContext";
import InventoryTable from "../../components/Displaycomponents/InventoryTable";
import Footer from "../../components/wholepage/Footer";
const InventoryPage = () => {
  const { userData } = useAuth();

  return (
    <>
      <Navbar />

      <div className="container mx-auto my-8 p-6 bg-white shadow-md rounded-md md:w-[84vw] lg:w-[64vw]">
        <div>
          <InventoryTable type={1} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InventoryPage;
