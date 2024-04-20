import React from "react";
import Postcard from "../Posts/Postcard";

const InquiryDisplay = ({ inquiry }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Inquiry Details
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
              {inquiry.id}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Date Created</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
              {new Date(inquiry.date_created).toLocaleString()}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Date Preferred
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
              {inquiry.date_preferred}
            </dd>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Post Details
          </h3>
          {inquiry.post && <Postcard admin={true} Data={inquiry.post} />}
        </dl>
      </div>
    </div>
  );
};

export default InquiryDisplay;
