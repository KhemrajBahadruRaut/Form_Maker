// SidePanel/FormTitleSettings.jsx
import React, { useEffect, useState } from 'react';

const FormDesc = ({ formDesc, setFormDesc }) => {
  const handleChange = (e) => {
    setFormDesc(e.target.value);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Form Description</h2>
      <textarea
        rows="2"
        type="text"
        value={formDesc}
        onChange={handleChange}
        placeholder="Enter form description..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
     
    </div>
  );
};

export default FormDesc;
