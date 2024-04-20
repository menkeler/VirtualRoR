import React,{ useState, useEffect } from 'react'; 
import ExportButton from '../../components/CustomButtons/Dashboard/ExportButton';
import client from '../../api/client';
import ExportHistoryTable from '../../components/Displaycomponents/ExportHistoryTable';
const ExportDataPage = () => {

  const [exportsHistory, setExportsHistory] = useState(null);

  useEffect(() => {
    const fetchExports = async () => {
      try {
        const response = await client.get(`inventory/export-history/`);
        setExportsHistory( response.data);


      } catch (error) {
        console.error('Error fetching exports:', error);
      }
    };


    fetchExports();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">

    <div className="lg:w-3/4 lg:flex lg:justify-center lg:items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Export Data Page</h1>
        <p className="text-lg mb-4">
          Welcome to the Export Data page. Here you can export your data in various formats.
        </p>
        <ExportButton />
      </div>
    </div>
  
    <div className="mt-12 mr-5 lg:w-1/4">
      <h1 className="text-3xl font-bold mb-8">Export History</h1>
      {exportsHistory && exportsHistory.length > 0 && (
        <ExportHistoryTable Exports={exportsHistory} />
      )}
    </div>
  
  </div>
  
  );
  
};

export default ExportDataPage;
