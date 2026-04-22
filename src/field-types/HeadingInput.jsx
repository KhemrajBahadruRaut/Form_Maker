import React from 'react';

const HeadingInput = ({ field, onUpdateField }) => {
  const fontSize = field.settings?.fontSize || 'text-xl';
  const align = field.settings?.align || 'left';
  const color = field.settings?.color || '#000000';

  const handleSettingChange = (key, value) => {
    onUpdateField(field.id, {
      ...field,
      settings: {
        ...field.settings,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter heading"
        className={`w-full ${fontSize} font-bold p-2 border border-gray-300 rounded-md text-${align}`}
        style={{ color }}
        value={field.value || ''}
        onChange={(e) =>
          onUpdateField(field.id, { ...field, value: e.target.value })
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
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

export default HeadingInput;
