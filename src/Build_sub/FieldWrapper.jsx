import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiMove } from 'react-icons/fi';

const FieldWrapper = ({ children, onRemove, field }) => (
  <div className="mb-3 relative border border-gray-200 p-5 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all duration-200 group bg-white">
    <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={() => onRemove(field.id)}
        className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md"
        aria-label={`Remove ${field.type} field`}
      >
        <IoMdClose size={12} />
      </button>
    </div>
    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-40 transition-opacity duration-200 cursor-grab">
      <FiMove size={14} className="text-gray-400" />
    </div>
    {children}
  </div>
);

export default FieldWrapper;
