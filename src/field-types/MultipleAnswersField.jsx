import React from 'react';
import { IoMdClose } from 'react-icons/io';

const MultipleAnswersField = ({ field, onUpdateField, onRemoveOption }) => {
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

  const handleSettingChange = (key, value) => {
    let updatedField;

    if (key === 'value') {
      updatedField = { ...field, value };
    } else {
      updatedField = {
        ...field,
        settings: {
          ...field.settings,
          [key]: value,
        },
      };
    }

    onUpdateField(field.id, updatedField);

    const storedFields = JSON.parse(localStorage.getItem('formFields') || '[]');
    const updatedFields = storedFields.map((f) =>
      f.id === field.id ? updatedField : f
    );
    localStorage.setItem('formFields', JSON.stringify(updatedFields));
  };

  // Use grid with 1 column if <= 2 options, else 2 columns
  const optionsGridClass =
    (field.options?.length || 0) > 2
      ? 'grid grid-cols-2 gap-4'
      : 'grid grid-cols-1 gap-4';

  return (
    <div className="space-y-4">
      {/* Question Input */}
      <input
        type="text"
        placeholder="Enter your question"
        className={`w-full mb-2 p-2 border border-gray-300 rounded-md ${fontSize} ${resolveAlignment(align)}`}
        style={{ color }}
        value={field.value || ''}
        onChange={(e) => handleSettingChange('value', e.target.value)}
      />

      {/* Options List in grid */}
      <div className={optionsGridClass}>
   {(field.options || []).map((option, idx) => (
  <div key={`${field.id}-multi-${idx}`} className="flex items-center mb-2">
    <input
      type="checkbox"
      className="mr-2"
      checked={option.correct || false}
      onChange={() => {
        const updatedOptions = [...field.options];
        updatedOptions[idx].correct = !updatedOptions[idx].correct;
        onUpdateField(field.id, { ...field, options: updatedOptions });
      }}
    />
    <input
      type="text"
      value={option.value}
      onChange={(e) => {
        const updatedOptions = [...field.options];
        updatedOptions[idx].value = e.target.value;
        onUpdateField(field.id, { ...field, options: updatedOptions });
      }}
      placeholder={`Option ${idx + 1}`}
      className={`w-full p-2 border border-gray-300 rounded-md ${fontSize} ${resolveAlignment(align)}`}
      style={{ color }}
    />
    <button
      onClick={() => onRemoveOption(field.id, idx)}
      className="ml-2 text-red-500 hover:text-red-700"
    >
      <IoMdClose size={14} />
    </button>
  </div>
))}
      </div>

      {/* Add Option Button */}
      <button
  onClick={() =>
    onUpdateField(field.id, {
      ...field,
      options: [...(field.options || []), { value: '', correct: false }],
    })
  }
  className="mt-2 text-sm text-blue-600 hover:underline"
>
  + Add Option
</button>

      {/* Customization Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-700 mt-4">
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

        {/* Required Toggle */}
        <div>
          <label className="block font-medium mb-1">Required</label>
          <div
            onClick={() => handleSettingChange('required', !(field.settings?.required !== false))}
            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${field.settings?.required !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${field.settings?.required !== false ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleAnswersField;
