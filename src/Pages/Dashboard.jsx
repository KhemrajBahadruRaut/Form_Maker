import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiBarChart2, FiCalendar, FiFileText } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get('https://jotform.gr8.com.np/GR8_JOTFORM/Backend/get_form.php');
      if (response.data.success) {
        setForms(response.data.data);
      } else {
        throw new Error(response.data.error || 'Failed to fetch forms');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    
    try {
      const response = await axios.delete(`https://jotform.gr8.com.np/GR8_JOTFORM/Backend/delete_form.php?id=${formId}`);
      if (response.data.success) {
        setForms(forms.filter(form => form.id !== formId));
      } else {
        throw new Error(response.data.error || 'Failed to delete form');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateNewForm = () => {
    const formNumber = Date.now().toString();
    localStorage.setItem('formNumber', formNumber);
    navigate(`/build/${formNumber}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading your forms...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">My Forms</h1>
              <p className="text-gray-400 text-sm mt-1">{forms.length} form{forms.length !== 1 ? 's' : ''} created</p>
            </div>
            <button
              onClick={handleCreateNewForm}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              <FiPlus size={18} />
              <span>Create New Form</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {forms.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFileText className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">No forms yet</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Create your first form to start collecting responses from your audience.
            </p>
            <button
              onClick={handleCreateNewForm}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5"
            >
              <FiPlus size={18} />
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map(form => (
              <div key={form.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-gray-200">
                {/* Card Top Accent */}
                <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                
                <div className="p-6">
                  {/* Title & Date */}
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {form.title || `Form ${form.id}`}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <FiCalendar size={12} />
                    <span>{new Date(form.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {/* Description */}
                  {form.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {form.description}
                    </p>
                  )}
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
                    <Link
                      to={`/form/${form.form_number}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <FiEye size={14} />
                      View
                    </Link>
                    
                    <Link
                      to={`/build/${form.form_number}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </Link>
                    
                    <Link
                      to={`/responses/${form.form_number}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <FiBarChart2 size={14} />
                      Responses
                      {form.response_count > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-purple-600 rounded-full">
                          {form.response_count}
                        </span>
                      )}
                    </Link>

                    <button
                      onClick={() => handleDelete(form.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors ml-auto"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;