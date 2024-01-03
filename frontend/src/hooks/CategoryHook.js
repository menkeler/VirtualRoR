import { useState, useEffect } from 'react';
import client from '../api/client';

const CategoryHook = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategory = async () => {
    try {
      const categRes = await client.get('inventory/categories/');
      setCategoryData(categRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  return { categoryData, loading, error, refetch: fetchCategory };
};

export default CategoryHook;