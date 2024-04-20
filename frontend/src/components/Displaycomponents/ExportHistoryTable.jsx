import React from 'react';

const ExportHistoryTable = ({ Exports }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {Exports.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.filename}</td>
              <td className="border px-4 py-2">{new Date(item.export_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExportHistoryTable;
    