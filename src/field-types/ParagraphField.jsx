import React from 'react';

const ParagraphField = ({ field, onUpdateField }) => {
  const fontSize = field.settings?.fontSize || 'text-base';
  const align = field.settings?.align || 'left';
  const color = field.settings?.color || '#000000';

  // Map custom alignments to Tailwind classes
  const resolveAlignment = (alignment) => {
    switch (alignment) {
      case 'justify-left':
        return 'text-left';
      case 'justify-right':
        return 'text-right';
      case 'justify':
        return 'text-justify';
      default:
        return `text-${alignment}`;
    }
  };

  const handleSettingChange = (key, value) => {
  let updatedField;

  if (key === 'value') {
    // Update the main value
    updatedField = { ...field, value };
  } else {
    // Update settings
    updatedField = {
      ...field,
      settings: {
        ...field.settings,
        [key]: value,
      },
    };
  }

  // Update field in parent
  onUpdateField(field.id, updatedField);

  // Persist in localStorage
  const storedFields = JSON.parse(localStorage.getItem('formFields') || '[]');
  const updatedFields = storedFields.map((f) =>
    f.id === field.id ? updatedField : f
  );
  localStorage.setItem('formFields', JSON.stringify(updatedFields));
};

  return (
    <div className="space-y-4">
      {/* Paragraph Input */}
      <textarea
  placeholder="Enter paragraph"
  className={`w-full ${fontSize} p-2 border border-gray-300 rounded-md ${resolveAlignment(align)}`}
  style={{ color }}
  rows="4"
  value={field.value || ''}
  onChange={(e) => handleSettingChange('value', e.target.value)}
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
            <option value="justify">Justify</option>
            <option value="justify-left">Justify Left</option>
            <option value="justify-right">Justify Right</option>
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

export default ParagraphField;
