import React from 'react';

const FormPreview = ({ formFields: fields = [], formTitle, formDesc, submitSettings: submitSettingsProp }) => {
  const submitSettings = submitSettingsProp || {
    label: 'Submit',
    align: 'center',
    bgColor: '#2563eb',
    textColor: '#ffffff',
    fontSize: 'text-base',
  };


  const getHeadingStyle = (settings = {}) => ({
    textAlign: settings.align || 'left',
    color: settings.color || '#000000',
  });

  const resolveAlignment = (alignment) => {
    switch (alignment) {
      case 'justify-left': return 'text-left';
      case 'justify-right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return `text-${alignment}`;
    }
  };

  const getHeadingClass = (settings = {}) => {
    return `${settings.fontSize || 'text-xl'} font-bold`;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Title & Description */}
        {(formTitle || formDesc) && (
          <div className="p-6 pb-0 space-y-2">
            {formTitle && <h1 className="text-2xl font-bold text-gray-800">{formTitle}</h1>}
            {formDesc && <p className="text-gray-500">{formDesc}</p>}
          </div>
        )}

        {/* Form Fields Preview */}
        <div className="p-6 space-y-8">
          {fields.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No form fields to preview</h3>
              <p className="mt-1 text-sm text-gray-500">Add fields to your form to see them here</p>
            </div>
          ) : (
            fields.map((field, idx) => (
              <div key={field.id || idx} className="space-y-4">
                {/* Heading Fields */}
                {(field.type === 'Heading') && (
                  <div
                    className={getHeadingClass(field.settings)}
                    style={getHeadingStyle(field.settings)}
                  >
                    {field.value}
                  </div>
                )}

                {/* Paragraph */}
                {field.type === 'Paragraph' && (
                  <p
                    className={`${field.settings?.fontSize || 'text-base'} text-gray-700 ${field.settings?.align ? resolveAlignment(field.settings.align) : 'text-left'
                      }`}
                    style={{ color: field.settings?.color || '#000000' }}
                  >
                    {field.value}
                  </p>
                )}

                {/* Image */}
                {field.type === 'Image' && field.settings?.image && (
                  <div
                    className="w-full"
                    style={{
                      textAlign: field.settings.align || 'left',
                      padding: field.settings.padding || '0' // Added padding control
                    }}
                  >
                    <img
                      src={field.settings.image}
                      alt={field.settings.altText || 'Form image'} // Better alt text handling
                      className={`${field.settings.className || ''}`} // Allow custom classes
                      style={{
                        width: field.settings.width || '100%',
                        height: field.settings.height || 'auto',
                        maxHeight: field.settings.maxHeight || 'none', // More flexible default
                        objectFit: field.settings.objectFit || 'contain', // Make configurable
                        display: 'inline-block',
                        ...field.settings.customStyles // Allow for additional custom styles
                      }}
                      loading="lazy" // Better performance
                    />
                  </div>
                )}




                {/* Short Answer */}
                {field.type === 'Short' && (
                  <div>
                    <label
                      className={`block ${field.settings?.fontSize || 'text-base'} font-medium text-gray-700 mb-1 ${field.settings?.align ? resolveAlignment(field.settings.align) : 'text-left'
                        }`}
                      style={{ color: field.settings?.color || '#000000' }}
                    >
                      {field.value}
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 ${field.settings?.fontSize || 'text-base'
                        }`}
                      style={{ color: field.settings?.color || '#000000' }}
                      disabled
                    />
                  </div>
                )}

                {/* Long Answer */}
                {field.type === 'Long' && (
                  <div>
                    <label
                      className={`block ${field.settings?.fontSize || 'text-base'} font-medium text-gray-700 mb-1 ${field.settings?.align ? resolveAlignment(field.settings.align) : 'text-left'
                        }`}
                      style={{ color: field.settings?.color || '#000000' }}
                    >
                      {field.value}
                    </label>
                    <textarea
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 ${field.settings?.fontSize || 'text-base'
                        }`}
                      style={{ color: field.settings?.color || '#000000' }}
                      rows="3"
                      disabled
                    />
                  </div>
                )}

                {/* MCQ */}
                {field.type === 'MCQ' && (
                  <div>
                    <label
                      className={`block ${field.settings?.fontSize || 'text-base'} font-medium text-gray-700 mb-3 ${field.settings?.align ? resolveAlignment(field.settings.align) : 'text-left'
                        }`}
                      style={{ color: field.settings?.color || '#000000' }}
                    >
                      {field.value}
                    </label>
                    <div className={`space-y-2 ${(field.options?.length || 0) > 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'
                      }`}>
                      {(field.options || []).map((option, i) => (
                        <div
                          key={i}
                          className={`flex items-center p-3 rounded-md border border-gray-200 bg-gray-50 ${field.settings?.align === 'center' ? 'justify-center' :
                            field.settings?.align === 'right' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          <input
                            type="radio"
                            disabled
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            {option.value}
                            {option.correct && (
                              <span className="ml-2 text-green-500 font-bold">✓</span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Multiple Answers */}
                {field.type === 'MultipleAnswers' && (
                  <div>
                    <label
                      className={`block ${field.settings?.fontSize || 'text-base'} font-medium text-gray-700 mb-3 ${field.settings?.align ? resolveAlignment(field.settings.align) : 'text-left'
                        }`}
                      style={{ color: field.settings?.color || '#000000' }}
                    >
                      {field.value}
                    </label>
                    <div className={`space-y-2 ${(field.options?.length || 0) > 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'
                      }`}>
                      {(field.options || []).map((option, i) => (
                        <div
                          key={i}
                          className={`flex items-center p-3 rounded-md border border-gray-200 bg-gray-50 ${field.settings?.align === 'center' ? 'justify-center' :
                            field.settings?.align === 'right' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          <input
                            type="checkbox"
                            disabled
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            {option.value}
                            {option.correct && (
                              <span className="ml-2 text-green-500 font-bold">✓</span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ImageChoice */}
                {field.type === 'ImageChoice' && (
                  <div>
                    <label
                      className={`block ${field.settings?.fontSize || 'text-lg'} font-semibold text-gray-800 mb-4 ${field.settings?.align ? resolveAlignment(field.settings.align) : 'text-left'
                        }`}
                      style={{ color: field.settings?.color || '#111827' }}
                    >
                      {field.question}
                    </label>
                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${field.settings?.align === 'center' ? 'justify-center' :
                      field.settings?.align === 'right' ? 'justify-end' : 'justify-start'
                      }`}>
                      {(field.options || []).map((option, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center p-2 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <img
                            src={option.imageUrl}
                            alt={option.label}
                            className="w-full h-24 object-cover rounded-md mb-2"
                          />
                          <span className="text-sm font-medium text-center">
                            {option.label}
                            {option.isCorrect && (
                              <span className="ml-1 text-green-500 font-bold">✓</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Submit Button */}
        {fields.length > 0 && (
          <div className={`px-6 pb-6 ${submitSettings.align === 'center' ? 'text-center' :
            submitSettings.align === 'right' ? 'text-right' : 'text-left'
            }`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                alert('Form submitted (preview only)');
              }}
              className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm font-medium ${submitSettings.fontSize
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              style={{
                backgroundColor: submitSettings.bgColor,
                color: submitSettings.textColor,
              }}
            >
              {submitSettings.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPreview;