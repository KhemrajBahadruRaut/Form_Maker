// SidePanel/SubmitSettings.jsx
import React from 'react';

const SubmitSettings = ({ submitSettings, onChange }) => {
  const handleChange = (key, value) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Button Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Label</label>
          <input
            type="text"
            value={submitSettings.label ?? ''}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Alignment</label>
          <select
            value={submitSettings.align ?? 'center'}
            onChange={(e) => handleChange('align', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Font Size</label>
          <select
            value={submitSettings.fontSize ?? 'text-base' }
            onChange={(e) => handleChange('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="text-sm">Small</option>
            <option value="text-base">Medium</option>
            <option value="text-lg">Large</option>
            <option value="text-xl">Extra Large</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Background Color</label>
            <input
              type="color"
              value={submitSettings.bgColor ?? '#2563eb'}
              onChange={(e) => handleChange('bgColor', e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Text Color</label>
            <input
              type="color"
              value={submitSettings.textColor ?? '#ffffff'}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitSettings;
