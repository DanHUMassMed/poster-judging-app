import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

const JudgingForm = () => {
  const { posterId } = useParams();
  const [judges, setJudges] = useState([]);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [judgesResponse, postersResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/judges'),
          axios.get('http://localhost:8000/api/posters')
        ]);
        
        setJudges(judgesResponse.data);
        setPosters(postersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors({ fetch: 'Failed to load judges or posters. Please refresh the page.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!formData.Judge.trim()) {
      newErrors.Judge = 'Please select a judge';
    }
    
    if (!formData.Poster_Title.trim()) {
      newErrors.Poster_Title = 'Please select a poster';
    }
    
    // Rating criteria validations
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
    const parsedValue = ['Scientific_Clarity', 'Data_Presentation', 'Visual_Design', 'Impact', 'Tiebreaker'].includes(name)
      ? (value === '' ? '' : parseInt(value))
      : value;
    
    setFormData({ ...formData, [name]: parsedValue });
    
    // Clear error for this field when user starts typing/selecting
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      setSubmitting(true);
      setErrors({});
      
      await axios.post('http://localhost:8000/api/scores', formData);
      
      alert('Score submitted successfully!');
      
      // Reset form
      setFormData({
        Judge: 'Anonymous',
        Poster_Title: '',
        Scientific_Clarity: '',
        Data_Presentation: '',
        Visual_Design: '',
        Impact: '',
        Tiebreaker: '',
        Comment: ''
      });
      
    } catch (error) {
      console.error('Error submitting score:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Unknown server error';
        
        if (status === 400) {
          setErrors({ submit: `Validation error: ${message}` });
        } else if (status === 500) {
          setErrors({ submit: 'Server error. Please try again later.' });
        } else {
          setErrors({ submit: `Error ${status}: ${message}` });
        }
      } else if (error.request) {
        // Network error
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
      } else {
        // Other error
        setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Poster Judging</h1>
      
      {errors.fetch && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.fetch}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Judge and Poster Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Judge <span className="text-red-500">*</span>
            </label>
            <select 
              name="Judge" 
              value={formData.Judge} 
              onChange={handleChange} 
              className={`w-full p-2 border rounded ${errors.Judge ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="Anonymous">Anonymous</option>
              {judges.map(judge => (
                <option key={judge} value={judge}>{judge}</option>
              ))}
            </select>
            {errors.Judge && <p className="text-red-500 text-sm mt-1">{errors.Judge}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Poster <span className="text-red-500">*</span>
            </label>
            <select 
              name="Poster_Title" 
              value={formData.Poster_Title} 
              onChange={handleChange} 
              className={`w-full p-2 border rounded ${errors.Poster_Title ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a Poster</option>
              {posters.map(poster => (
                <option key={poster.Poster_Id} value={poster.Poster_Title}>{poster.Poster_Title}</option>
              ))}
            </select>
            {errors.Poster_Title && <p className="text-red-500 text-sm mt-1">{errors.Poster_Title}</p>}
          </div>
        </div>

        {/* Scoring Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {Object.entries(criteriaLabels).map(([key, label]) => (
            <div key={key}>
              <label className="block text-gray-700 font-medium mb-1">
                {label} <span className="text-red-500">*</span>
              </label>
              <select 
                name={key} 
                value={formData[key]} 
                onChange={handleChange} 
                className={`w-full p-2 border rounded ${errors[key] ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a Rating</option>
                {ratingOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
            </div>
          ))}
        </div>

        {/* Comment Box */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Comment</label>
          <textarea 
            name="Comment" 
            value={formData.Comment} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded" 
            rows="4"
            placeholder="Optional comments about the poster..."
          ></textarea>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.submit}
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={submitting}
          className={`px-4 py-2 rounded text-white font-medium ${
            submitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {submitting ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Submitting...
            </>
          ) : (
            'Submit Score'
          )}
        </button>
      </form>
    </div>
  );
};

export default JudgingForm;