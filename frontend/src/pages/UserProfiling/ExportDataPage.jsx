import React from 'react';
import ExportButton from '../../components/CustomButtons/Dashboard/ExportButton';

const ExportDataPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Export Data Page</h1>
      <p className="text-lg mb-4">
        Welcome to the Export Data page. Here you can export your data in various formats.
      </p>

      <ExportButton />
    </div>
  );
};

export default ExportDataPage;
