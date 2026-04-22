// SidePanel/FormTitleSettings.jsx
import React, { useEffect, useState } from 'react';

const FormTitleSettings = ({ title, setTitle }) => {
  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Form Title</h2>
      <input
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="Enter form title..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
     
    </div>
  );
};

export default FormTitleSettings;
