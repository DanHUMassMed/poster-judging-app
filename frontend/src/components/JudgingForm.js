import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_FASTAPI_BASE_URL || "http://localhost:8000/wormcat3";

const ratingOptions = [
  { value: 1, label: '1 – Beginner\'s Glimpse' },
  { value: 2, label: '2 – Developing Understanding' },
  { value: 3, label: '3 – Solid Foundation' },
  { value: 4, label: '4 – Advanced Execution' },
  { value: 5, label: '5 – Trailblazer' },
];

const criteriaLabels = {
  Scientific_Clarity: 'Scientific Clarity and Rigor',
  Data_Presentation: 'Data Presentation and Interpretation',
  Visual_Design: 'Visual Design and Organization',
  Impact: 'Impact and Innovation',
  Tiebreaker: 'Tiebreaker'
};

// Toast Notification Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? '✓' : '✕';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3 transition-all duration-300 transform translate-x-0`}>
      <span className="text-lg font-bold">{icon}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 text-xl leading-none">
        ×
      </button>
    </div>
  );
};

// Success Animation Component
const SuccessAnimation = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center animate-bounce">
        <div className="text-6xl text-green-500 mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
        <p className="text-gray-600">Your score has been submitted</p>
      </div>
    </div>
  );
};

const JudgingForm = () => {

  const { posterId } = useParams();
  const navigate = useNavigate(); 
  const [judges, setJudges] = useState([]);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    Judge: 'Anonymous',
    Poster_Title: posterId || '',
    Scientific_Clarity: '',
    Data_Presentation: '',
    Visual_Design: '',
    Impact: '',
    Tiebreaker: '',
    Comment: ''
  });

  const initialFormData = {
    Judge: 'Anonymous',
    Poster_Title: '',
    Scientific_Clarity: '',
    Data_Presentation: '',
    Visual_Design: '',
    Impact: '',
    Tiebreaker: '',
    Comment: ''
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch judges and posters in parallel
        const [judgesResponse, postersResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/judges`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch judges: ${res.status}`);
            return res.json();
          }),
          fetch(`${BASE_URL}/api/posters`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch posters: ${res.status}`);
            return res.json();
          })
        ]);
        
        setJudges(judgesResponse);
        setPosters(postersResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        setToast({
          message: 'Failed to load data. Please refresh the page.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Judge?.trim()) {
      newErrors.Judge = 'Please select a judge';
    }
    
    if (!formData.Poster_Title?.trim()) {
      newErrors.Poster_Title = 'Please select a poster';
    }
    
    const ratingFields = ['Scientific_Clarity', 'Data_Presentation', 'Visual_Design', 'Impact', 'Tiebreaker'];
    ratingFields.forEach(field => {
      if (!formData[field] || formData[field] === '') {
        newErrors[field] = `Please select a rating for ${criteriaLabels[field]}`;
      }
    });
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const ratingFields = ['Scientific_Clarity', 'Data_Presentation', 'Visual_Design', 'Impact', 'Tiebreaker'];
    const parsedValue = ratingFields.includes(name)
      ? (value === '' ? '' : parseInt(value))
      : value;
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const submitScore = async (data) => {
    const response = await fetch(`${BASE_URL}/api/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error('HTTP error');
      error.response = {
        status: response.status,
        data: errorData
      };
      throw error;
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setToast({
        message: 'Please fix the errors in the form before submitting.',
        type: 'error'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      setErrors({});
      
      await submitScore(formData);
      
      // Show success animation first
      setShowSuccess(true);
      
      // Then show toast after animation
      setTimeout(() => {
        setShowSuccess(false);
        setToast({
          message: 'Score submitted successfully! 🎉',
          type: 'success'
        });
        navigate('/'); 
      }, 2000);
      
      // Reset form
      setFormData(initialFormData);
      
    } catch (error) {
      console.error('Error submitting score:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Unknown server error';
        
        if (status === 400) {
          errorMessage = `Validation error: ${message}`;
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = `Error ${status}: ${message}`;
        }
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading judges and posters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      <SuccessAnimation show={showSuccess} />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Poster Judging</h1>
        <p className="text-gray-600">Evaluate the poster using the criteria below. All fields marked with * are required.</p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        {/* Judge and Poster Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Judge <span className="text-red-500">*</span>
            </label>
            <select 
              name="Judge" 
              value={formData.Judge} 
              onChange={handleChange} 
              className={`w-full p-3 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.Judge ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="Anonymous">Anonymous</option>
              {judges.map(judge => (
                <option key={judge} value={judge}>{judge}</option>
              ))}
            </select>
            {errors.Judge && <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠</span>{errors.Judge}
            </p>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Poster <span className="text-red-500">*</span>
            </label>
            <select 
              name="Poster_Title" 
              value={formData.Poster_Title} 
              onChange={handleChange} 
              className={`w-full p-3 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.Poster_Title ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Select a Poster</option>
              {posters.map(poster => (
                <option key={poster.Poster_Id} value={poster.Poster_Title}>{poster.Poster_Title}</option>
              ))}
            </select>
            {errors.Poster_Title && <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠</span>{errors.Poster_Title}
            </p>}
          </div>
        </div>

        {/* Scoring Criteria */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Scoring Criteria</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(criteriaLabels).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <label className="block text-gray-700 font-semibold">
                  {label} <span className="text-red-500">*</span>
                </label>
                <select 
                  name={key} 
                  value={formData[key]} 
                  onChange={handleChange} 
                  className={`w-full p-3 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[key] ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <option value="">Select a Rating</option>
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors[key] && <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">⚠</span>{errors[key]}
                </p>}
              </div>
            ))}
          </div>
        </div>

        {/* Comment Box */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Comments</label>
          <textarea 
            name="Comment" 
            value={formData.Comment} 
            onChange={handleChange} 
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors" 
            rows="4"
            placeholder="Optional comments about the poster..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              submitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {submitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Score'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JudgingForm;