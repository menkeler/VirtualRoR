import React, { useState } from 'react';
import client from '../../../api/client';
import { saveAs } from 'file-saver';

const ExportButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSaveClick = async () => {
    try {
      setIsLoading(true); // Set loading state to true

      // Construct query parameters for start and end dates
      const queryParams = {};
      if (startDate) {
        queryParams.start_date = startDate.toISOString().split('T')[0]; // Convert date to ISO string format and extract date part
      }
      if (endDate) {
        queryParams.end_date = endDate.toISOString().split('T')[0]; // Convert date to ISO string format and extract date part
      }

      // Send request to fetch the Excel file with query parameters
      const res = await client.get('/inventory/export', {
        responseType: 'blob',
        params: queryParams,
      });

      // Extract filename from Content-Disposition header or generate default filename
      const filename = (() => {
        const contentDisposition = res.headers['content-disposition'];
        if (contentDisposition) {
          return contentDisposition.split('filename=')[1];
        } else {
          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
          const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}-${currentDate.getMinutes().toString().padStart(2, '0')}-${currentDate.getSeconds().toString().padStart(2, '0')}`;
          return `VirtualRorData_${formattedDate}_${formattedTime}.xlsx`;
        }
      })();

      // Create a Blob from the response data
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });

      // Trigger file save dialog using FileSaver.js with the extracted filename
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsLoading(false); // Set loading state to false after export is done (whether successful or not)
    }
  };

  // Function to format time in AM/PM format
  const formatAMPM = (date) => {
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    const formattedHours = (hours < 10 ? '0' : '') + hours;
    const formattedMinutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleClearStartDate = () => {
    setStartDate(null);
  };

  const handleClearEndDate = () => {
    setEndDate(null);
  };

  return (
    <div>
      <div>
        <label>Start Date:</label>
        <div className="relative inline-block">
          <input type="date" value={startDate ? startDate.toISOString().split('T')[0] : ''} onChange={(e) => setStartDate(new Date(e.target.value))}  className="input input-bordered w-full max-w-xs pr-12"/>
          {startDate && (
            <button className="absolute top-0 right-0 mt-1 mr-1" onClick={handleClearStartDate}>Clear</button>
          )}
        </div>
      </div>
      <div>
        <label>End Date:</label>
        <div className="relative inline-block">
          <input type="date" value={endDate ? endDate.toISOString().split('T')[0] : ''} onChange={(e) => setEndDate(new Date(e.target.value))} className="input input-bordered w-full max-w-xs pr-12"/>
          {endDate && (
            <button className="absolute top-0 right-0 mt-1 mr-1" onClick={handleClearEndDate}>Clear</button>
          )}
        </div>
      </div>
      <button onClick={handleSaveClick} className='btn btn-primary' disabled={isLoading}>
        {isLoading ? 'Exporting...' : 'Export'}
      </button>
    </div>
  );
};

export default ExportButton;
