import React, { useState } from 'react';
import client from '../../../api/client';
import { saveAs } from 'file-saver';

const ExportButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClick = async () => {
    try {
      setIsLoading(true); // Set loading state to true
      const res = await client.get('/inventory/export', { responseType: 'blob' }); // Send request to fetch the Excel file

      // Extract filename from Content-Disposition header or generate default filename
      const filename = (() => {
        const contentDisposition = res.headers['content-disposition'];
        if (contentDisposition) {
          return contentDisposition.split('filename=')[1];
        } else {
          const currentDate = new Date();
          const formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}(${formatAMPM(currentDate)})`;
          return `VirtualRorData_${formattedDate}.xlsx`;
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

  return (
    <div>
      <button onClick={handleSaveClick} className='btn btn-primary' disabled={isLoading}>
        {isLoading ? 'Exporting...' : 'Export'}
      </button>
    </div>
  );
};

export default ExportButton;
