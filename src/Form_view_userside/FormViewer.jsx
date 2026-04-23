import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const resolveAlignment = (alignment) => {
  switch (alignment) {
    case 'justify-left': return 'text-left';
    case 'justify-right': return 'text-right';
    case 'justify': return 'text-justify';
    case 'left': return 'text-left';
    case 'right': return 'text-right';
    default: return `text-${alignment || 'left'}`;
  }
};

const FormViewer = () => {
  const { formNumber } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [shakeSubmit, setShakeSubmit] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          // `http://localhost/GR8_JOTFORM/Backend/form_view/get_form_by_number.php?formNumber=${formNumber}`
          `https://jotform.gr8.com.np/GR8_JOTFORM/Backend/form_view/get_form_by_number.php?formNumber=${formNumber}`
        );
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to fetch form');
        
        const normalizedForm = {
          ...data.form,
          fields: data.form.fields?.map(field => ({
            ...field,
            id: field.id?.toString().startsWith('field-') ? field.id : `field-${field.id}`,
            settings: field.settings || {}
          })) || []
        };
        
        setForm(normalizedForm);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formNumber]);

  const updateAnswer = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // --- Validation ---
    const fillableFields = (form.fields || []).filter(f =>
      ['Short', 'Long', 'MCQ', 'MultipleAnswers', 'ImageChoice'].includes(f.type)
    );
    const errors = {};
    fillableFields.forEach(f => {
      const val = answers[f.id];
      if (
        val === undefined ||
        val === null ||
        val === '' ||
        (Array.isArray(val) && val.length === 0)
      ) {
        errors[f.id] = 'This field is required';
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setShakeSubmit(true);
      setTimeout(() => setShakeSubmit(false), 600);
      // Scroll to first error
      const firstErrorId = Object.keys(errors)[0];
      const el = document.getElementById(`field-wrapper-${firstErrorId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setValidationErrors({});
    // --- End Validation ---

    setSubmitting(true);

    try {
      const responses = fillableFields
        .map(f => ({
          fieldId: f.id,
          fieldType: f.type,
          fieldLabel: f.value || f.settings?.label || f.type,
          value: answers[f.id] || ''
        }));

      // const res = await fetch('http://localhost/GR8_JOTFORM/Backend/submit_response.php', {
      const res = await fetch('https://jotform.gr8.com.np/GR8_JOTFORM/Backend/submit_response.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formNumber, responses })
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Failed to submit');
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading form...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );

  if (!form) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <p className="text-gray-500 text-lg">Form not found.</p>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank You!</h2>
        <p className="text-gray-500 text-lg">Your response has been submitted successfully.</p>
        <button
          onClick={() => { setSubmitted(false); setAnswers({}); }}
          className="mt-8 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
        >
          Submit Another Response
        </button>
      </div>
    </div>
  );

  const fields = form.fields || [];
  const submitSettings = form.submitSettings || {
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

  const getHeadingClass = (settings = {}) =>
    `${settings.fontSize || 'text-xl'} font-bold`;

  const renderField = (field, index) => {
    const settings = field.settings || {};
    const alignClass = resolveAlignment(settings.align);
    const textColor = settings.color || '#000000';

    switch (field.type) {
      case 'Heading':
        return (
          <div 
            key={field.id || index} 
            className={getHeadingClass(settings)} 
            style={getHeadingStyle(settings)}
          >
            {field.value}
          </div>
        );
      
      case 'Paragraph':
        return (
          <p 
            key={field.id || index} 
            className={`${settings.fontSize || 'text-base'} ${alignClass}`} 
            style={{ color: textColor }}
          >
            {field.value}
          </p>
        );
      
      case 'Image':
        return settings.image && (
          <div 
            key={field.id || index} 
            className={`${alignClass} my-4`}
          >
            <img 
              src={settings.image} 
              alt="" 
              className="rounded-xl max-w-full h-auto inline-block shadow-sm" 
            />
          </div>
        );
      
      case 'Short':
        return (
          <div key={field.id || index} id={`field-wrapper-${field.id}`} className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">
              {field.value || settings.label || 'Text Input'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 ${validationErrors[field.id] ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
              placeholder={settings.placeholder || 'Type your answer...'}
              value={answers[field.id] || ''}
              onChange={(e) => { updateAnswer(field.id, e.target.value); setValidationErrors(prev => { const n = {...prev}; delete n[field.id]; return n; }); }}
            />
            {validationErrors[field.id] && <p className="text-red-500 text-xs font-medium mt-1">{validationErrors[field.id]}</p>}
          </div>
        );

      case 'Long':
        return (
          <div key={field.id || index} id={`field-wrapper-${field.id}`} className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">
              {field.value || settings.label || 'Text Input'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 resize-y min-h-[100px] ${validationErrors[field.id] ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
              placeholder={settings.placeholder || 'Type your answer...'}
              rows="4"
              value={answers[field.id] || ''}
              onChange={(e) => { updateAnswer(field.id, e.target.value); setValidationErrors(prev => { const n = {...prev}; delete n[field.id]; return n; }); }}
            />
            {validationErrors[field.id] && <p className="text-red-500 text-xs font-medium mt-1">{validationErrors[field.id]}</p>}
          </div>
        );
      
      case 'MCQ':
        return (
          <div key={field.id || index} id={`field-wrapper-${field.id}`} className="space-y-3">
            <label className="block text-gray-700 font-medium text-sm">
              {field.value || settings.label || 'Multiple Choice'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className={`space-y-2 ${validationErrors[field.id] ? 'ring-2 ring-red-300 rounded-xl p-1' : ''}`}>
              {(field.options || []).map((option, i) => (
                <label 
                  key={i} 
                  className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers[field.id] === option.value 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${field.id}`}
                    value={option.value}
                    checked={answers[field.id] === option.value}
                    onChange={(e) => { updateAnswer(field.id, e.target.value); setValidationErrors(prev => { const n = {...prev}; delete n[field.id]; return n; }); }}
                    className="w-4 h-4 text-blue-600 mr-3"
                  />
                  <span className="text-gray-700">{option.value}</span>
                </label>
              ))}
            </div>
            {validationErrors[field.id] && <p className="text-red-500 text-xs font-medium mt-1">{validationErrors[field.id]}</p>}
          </div>
        );

      case 'MultipleAnswers':
        return (
          <div key={field.id || index} id={`field-wrapper-${field.id}`} className="space-y-3">
            <label className="block text-gray-700 font-medium text-sm">
              {field.value || settings.label || 'Multiple Answers'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className={`space-y-2 ${validationErrors[field.id] ? 'ring-2 ring-red-300 rounded-xl p-1' : ''}`}>
              {(field.options || []).map((option, i) => {
                const selected = (answers[field.id] || []);
                const isChecked = selected.includes(option.value);
                return (
                  <label 
                    key={i} 
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isChecked 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const current = answers[field.id] || [];
                        const updated = isChecked
                          ? current.filter(v => v !== option.value)
                          : [...current, option.value];
                        updateAnswer(field.id, updated);
                        setValidationErrors(prev => { const n = {...prev}; delete n[field.id]; return n; });
                      }}
                      className="w-4 h-4 text-blue-600 mr-3 rounded"
                    />
                    <span className="text-gray-700">{option.value}</span>
                  </label>
                );
              })}
            </div>
            {validationErrors[field.id] && <p className="text-red-500 text-xs font-medium mt-1">{validationErrors[field.id]}</p>}
          </div>
        );
      
      case 'ImageChoice':
        return (
          <div key={field.id || index} id={`field-wrapper-${field.id}`} className="space-y-3">
            <label className="block text-gray-700 font-medium text-sm">
              {field.question || settings.label || 'Image Choice'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${validationErrors[field.id] ? 'ring-2 ring-red-300 rounded-xl p-1' : ''}`}>
              {(field.options || []).map((option, i) => {
                const optionValue = option.label || `option-${i}`;
                const isSelected = answers[field.id] === optionValue;
                return (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateAnswer(field.id, optionValue);
                      setValidationErrors(prev => { const n = {...prev}; delete n[field.id]; return n; });
                    }}
                    className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200 relative ${
                      isSelected 
                        ? 'border-blue-500 shadow-lg scale-[1.02]' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {option.imageUrl && (
                      <img 
                        src={option.imageUrl} 
                        alt={option.label || ''} 
                        className="w-full h-32 object-cover pointer-events-none"
                      />
                    )}
                    <div className="p-3 text-center text-sm font-medium text-gray-700 bg-white pointer-events-none">
                      {option.label}
                    </div>
                  </div>
                );
              })}
            </div>
            {validationErrors[field.id] && <p className="text-red-500 text-xs font-medium mt-1">{validationErrors[field.id]}</p>}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {/* Form Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{form.title || 'Untitled Form'}</h1>
            {form.description && (
              <p className="text-gray-500 text-lg">{form.description}</p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        {fields.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">This form doesn't contain any fields yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div key={field.id || idx} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                {renderField(field, idx)}
              </div>
            ))}
          </div>
        )}

        {/* Submit Error */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
            <p className="font-medium">Error: {submitError}</p>
          </div>
        )}

        {/* Validation Summary */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
            <p className="font-medium">⚠️ Please fill in all required fields before submitting.</p>
          </div>
        )}

        {/* Submit Button */}
        {fields.length > 0 && (
          <div className={`mt-6 ${resolveAlignment(submitSettings.align)}`}>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center px-8 py-3.5 rounded-xl font-semibold ${submitSettings.fontSize} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${shakeSubmit ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
              style={{
                backgroundColor: submitSettings.bgColor,
                color: submitSettings.textColor,
                animation: shakeSubmit ? 'shake 0.5s ease-in-out' : undefined,
              }}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : submitSettings.label}
            </button>
          </div>
        )}

        {/* Shake Animation Keyframes */}
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
          }
        `}</style>
      </form>
    </div>
  );
};

export default FormViewer;