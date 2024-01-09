import { useState, useEffect } from 'react';
import client from '../api/client';

const TransactionsHook = (initialUserId) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  // Define fetchTransactions before useEffect
  const fetchTransactions = async (
    page = currentPage,
    status = statusQuery,
    type = typeQuery
  ) => {
    try {
      const encodedSearchQuery = encodeURIComponent(searchQuery);
      const response = await client.get(`transactions/transactions/?page=${page}&is_active=${encodeURIComponent(status)}&type=${encodeURIComponent(type)}&search=${encodedSearchQuery}&user=${initialUserId}`);

      const { results, count } = response.data;
      setTransactions(results);
      setTotalPages(Math.ceil(count / 50));

    } catch (error) {
      console.error('Error fetching transactions:', error);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchTransactions();
    console.log("Fetching transactions with:", currentPage, statusQuery, typeQuery, searchQuery);
  }, [currentPage, statusQuery, typeQuery, searchQuery]);



  const handleStatusQuery = function (status) {
    setStatusQuery(status);
  };

  const handleTypeQuery = function (type) {
    setTypeQuery(type);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return {
    transactions,
    currentPage,
    searchQuery,
    typeQuery,
    statusQuery,
    totalPages,
    handleStatusQuery,
    handleTypeQuery,
    handlePageChange,
    fetchTransactions,
    setSearchQuery,
  };
};

export default TransactionsHook;