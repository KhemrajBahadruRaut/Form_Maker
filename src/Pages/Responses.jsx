import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from '../TopNav/Nav';
import { FiArrowLeft, FiClock, FiInbox, FiDownload } from 'react-icons/fi';

const Responses = () => {
  const { formNumber } = useParams();
  const [responses, setResponses] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://jotform.gr8.com.np/GR8_JOTFORM/Backend/get_responses.php?formNumber=${formNumber}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to fetch responses');
        setResponses(data.responses || []);
        setFormTitle(data.form?.title || 'Untitled Form');
        setTotalResponses(data.totalResponses || 0);
        // Mark responses as "seen" so Dashboard badge updates
        localStorage.setItem(`seen_responses_${formNumber}`, String(data.totalResponses || 0));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [formNumber]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value || '—';
  };

  // Get all unique field labels from all responses
  const getFieldLabels = () => {
    const labels = new Map();
    responses.forEach(r => {
      r.fields?.forEach(f => {
        if (!labels.has(f.field_id)) {
          labels.set(f.field_id, f.field_label || f.field_type);
        }
      });
    });
    return Array.from(labels.entries()); // [[fieldId, label], ...]
  };

  const fieldLabels = getFieldLabels();

  const exportCSV = () => {
    if (responses.length === 0) return;
    
    const headers = ['#', 'Submitted At', ...fieldLabels.map(([, label]) => label)];
    const rows = responses.map((r, i) => {
      const values = fieldLabels.map(([fieldId]) => {
        const field = r.fields?.find(f => f.field_id === fieldId);
        const val = field ? formatValue(field.value) : '';
        return `"${val.replace(/"/g, '""')}"`;
      });
      return [i + 1, formatDate(r.submittedAt), ...values].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formTitle}_responses.csv`;
    link.click();
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  to="/" 
                  className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-gray-800"
                >
                  <FiArrowLeft size={18} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Responses</h1>
              </div>
              <p className="text-gray-500 ml-12">{formTitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <span className="text-2xl font-bold text-blue-600">{totalResponses}</span>
                <span className="text-gray-500 text-sm ml-2">total responses</span>
              </div>
              {responses.length > 0 && (
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm font-medium"
                >
                  <FiDownload size={16} />
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading responses...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && responses.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiInbox className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No responses yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Share your form link to start collecting responses. They'll appear here in real-time.
              </p>
              <Link
                to={`/publish/${formNumber}`}
                className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                Go to Publish
              </Link>
            </div>
          )}

          {/* Responses Table */}
          {!loading && !error && responses.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <FiClock size={12} />
                          Submitted
                        </div>
                      </th>
                      {fieldLabels.map(([fieldId, label]) => (
                        <th key={fieldId} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {responses.map((response, idx) => (
                      <tr 
                        key={response.id} 
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedResponse(selectedResponse === response.id ? null : response.id)}
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {formatDate(response.submittedAt)}
                        </td>
                        {fieldLabels.map(([fieldId]) => {
                          const field = response.fields?.find(f => f.field_id === fieldId);
                          return (
                            <td key={fieldId} className="px-6 py-4 text-sm text-gray-800 max-w-[200px] truncate">
                              {field ? formatValue(field.value) : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detail Modal */}
          {selectedResponse && (() => {
            const response = responses.find(r => r.id === selectedResponse);
            if (!response) return null;
            return (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedResponse(null)}>
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Response Details</h3>
                    <button onClick={() => setSelectedResponse(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    <FiClock className="inline mr-1" />
                    {formatDate(response.submittedAt)}
                  </p>
                  <div className="space-y-4">
                    {response.fields?.map((field, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          {field.field_label || field.field_type}
                        </p>
                        <p className="text-gray-800 font-medium">
                          {formatValue(field.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
};

export default Responses;
