import React from 'react';

const ShortField = ({ field, onUpdateField }) => {
  const fontSize = field.settings?.fontSize || 'text-base';
  const align = field.settings?.align || 'left';
  const color = field.settings?.color || '#000000';

  const resolveAlignment = (alignment) => {
    switch (alignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const handleSettingChange = (key, newValue) => {
    if (!onUpdateField) return;
    let updatedField;
    if (key === 'value') {
      updatedField = { ...field, value: newValue };
    } else {
      updatedField = {
        ...field,
        settings: {
          ...field.settings,
          [key]: newValue,
        },
      };
    }
    onUpdateField(field.id, updatedField);
  };

  return (
    <div className="space-y-4">
      {/* Question input */}
      <input
        type="text"
        placeholder="Enter your question here"
        className={`w-full mb-2 p-2 border border-gray-300 rounded-md ${fontSize} ${resolveAlignment(align)}`}
        style={{ color }}
        value={field.value || ''}
        onChange={(e) => handleSettingChange('value', e.target.value)}
      />

      {/* Answer input (disabled preview) */}
      <input
        type="text"
        placeholder="Answer here"
        disabled
        className={`w-full p-2 border border-gray-300 rounded-md ${fontSize} ${resolveAlignment(align)}`}
        style={{ color }}
      />

      {/* Customization Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
        {/* Font Size */}
        <div>
          <label className="block font-medium mb-1">Font Size</label>
          <select
            value={fontSize}
            onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="text-sm">Small</option>
            <option value="text-base">Base</option>
            <option value="text-lg">Large</option>
            <option value="text-xl">Extra Large</option>
            <option value="text-2xl">2XL</option>
            <option value="text-3xl">3XL</option>
            <option value="text-4xl">4XL</option>
          </select>
        </div>

        {/* Text Alignment */}
        <div>
          <label className="block font-medium mb-1">Text Alignment</label>
          <select
            value={align}
            onChange={(e) => handleSettingChange('align', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        {/* Text Color */}
        <div>
          <label className="block font-medium mb-1">Text Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => handleSettingChange('color', e.target.value)}
            className="w-full h-10 p-1 border rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ShortField;