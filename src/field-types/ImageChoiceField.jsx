import React from 'react';
import { IoMdAdd, IoMdClose } from 'react-icons/io';

const ImageChoiceField = ({ field, onUpdateField }) => {
  const alignmentClass =
    field.settings?.align === 'center'
      ? 'text-center'
      : field.settings?.align === 'right'
      ? 'text-right'
      : 'text-left';

  const justifyClass =
    field.settings?.align === 'center'
      ? 'justify-center'
      : field.settings?.align === 'right'
      ? 'justify-end'
      : 'justify-start';

  const fontSizeClass = field.settings?.fontSize || 'text-base';
  const textColor = field.settings?.color || '#000000';

  return (
    <div className="space-y-4 p-4 border border-gray-300 rounded-md">
      <input
        type="text"
        placeholder="Enter your question here"
        className={`w-full p-2 border border-gray-300 rounded-md ${fontSizeClass} ${alignmentClass}`}
        value={field.question || ''}
        style={{ color: textColor }}
        onChange={(e) => onUpdateField(field.id, { question: e.target.value })}
      />

      <div className="space-y-2">
        {(field.options || []).map((option, index) => (
  <div
    key={`${field.id}-img-${index}`}
    className={`flex items-center gap-2 flex-wrap ${justifyClass}`}
    style={{ color: textColor }}
  >
            <input
              type="radio"
              name={`correct-answer-${field.id}`}
              checked={option.isCorrect || false}
              onChange={() => {
                const newOptions = field.options.map((opt, i) => ({
                  ...opt,
                  isCorrect: i === index,
                }));
                onUpdateField(field.id, { options: newOptions });
              }}
              className="h-4 w-4"
            />

            <input
              type="text"
              placeholder="Label"
              className={`flex-1 p-2 border border-gray-300 rounded ${fontSizeClass}`}
              value={option.label}
              style={{ color: textColor }}
              onChange={(e) => {
                const newOptions = [...field.options];
                newOptions[index].label = e.target.value;
                onUpdateField(field.id, { options: newOptions });
              }}
            />

            <label
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm"
              style={{ color: textColor }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const newOptions = [...field.options];
                      newOptions[index].imageUrl = reader.result;
                      onUpdateField(field.id, { options: newOptions });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>

            {option.imageUrl ? (
              <div className="relative">
                <img
                  src={option.imageUrl}
                  alt={`Option ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
                {option.isCorrect && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            <button
              onClick={() => {
                const newOptions = field.options.filter((_, i) => i !== index);
                onUpdateField(field.id, { options: newOptions });
              }}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <IoMdClose size={16} />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            const newOptions = [
              ...(field.options || []),
              {
                label: '',
                imageUrl: '',
                isCorrect: field.options?.length === 0,
              },
            ];
            onUpdateField(field.id, { options: newOptions });
          }}
          className="mt-2 text-blue-600 hover:underline flex items-center gap-1"
        >
          <IoMdAdd size={16} />
          Add Image Option
        </button>
      </div>

      {/* Required Toggle */}
      <div className="flex items-center gap-3 mt-2 text-sm text-gray-700">
        <label className="font-medium">Required</label>
        <div
          onClick={() => {
            const isRequired = field.settings?.required !== false;
            onUpdateField(field.id, {
              settings: { ...field.settings, required: !isRequired },
            });
          }}
          className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${field.settings?.required !== false ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${field.settings?.required !== false ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      </div>
    </div>
  );
};

export default ImageChoiceField;
