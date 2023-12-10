import React,{useState,useEffect} from 'react'
import client from '../../api/client'
import Navbar from '../../components/wholepage/Navbar'

const InventoryPage = () => {

  // const fetchData = async () => {
  //   const authToken = Cookies.get('authToken');

  //   try {
  //     if (authToken) {
  //       const res = await client.get('users/in/', {
  //         headers: {
  //           Authorization: `Token ${authToken}`,
  //         },
  //       });

  //       setIsLoggedIn(true);
  //       setUserData(res.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   } finally {
  //     setIsDataLoaded(true);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);




  return (
    <>
        <Navbar/>

        Invnetorty Page
    </>



  )
}

export default InventoryPage