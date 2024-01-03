import { useState, useEffect } from 'react';
import client from '../api/client';
import Cookies from 'js-cookie';

const ItemProfileHook = (initialPage, initialType, initialCategory, initialSearchQuery) => {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const fetchItems = async () => {
    try {
      const authToken = Cookies.get('authToken');
      const response = await client.get(`inventory/item-profiling/?page=${currentPage}&search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}&returnable=${type}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      const { results, count } = response.data;

      setItems(results);
      setTotalPages(Math.ceil(count / 30));
    } catch (error) {
      console.error('Error fetching items:', error);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, type, category, searchQuery]); // Dependency array ensures the effect runs when these values change

  const updateParams = (newPage, newType, newCategory, newSearchQuery) => {
    setCurrentPage(newPage);
    setType(newType);
    setCategory(newCategory);
    setSearchQuery(newSearchQuery);
  };

  return { items, totalPages, currentPage, type, category, searchQuery, fetchItems, updateParams };
};

export default ItemProfileHook;