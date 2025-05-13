import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const CreateExamPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    topic: '',
    duration: 30,
    totalQuestions: 10,
    passingScore: 70,
    instructions: '',
    isActive: true,
    showResults: true,
    randomizeQuestions: true,
    preventBacktracking: false,
    webcamRequired: true,
    fullscreenRequired: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Created exam:', formData);
      setIsSubmitting(false);
      navigate('/admin/exams');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-6 overflow-auto ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-800">Create New Exam</h1>
              <p className="text-gray-600 mt-1">Set up the details for your new exam</p>
            </div>
            
            <button
              onClick={() => navigate('/admin/exams')}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Exams
            </button>
          </div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-soft overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-primary-700 to-primary p-6">
              <h2 className="text-2xl font-display font-bold text-white">Exam Configuration</h2>
              <p className="text-blue-100 mt-1">
                Fill in the details below to create a new exam
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Enter exam title"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="e.g. Mathematics, History, Science"
                  />
                </div>
                
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. World History, Algebra, Human Anatomy"
                  />
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    max="300"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="totalQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Questions <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="totalQuestions"
                    name="totalQuestions"
                    value={formData.totalQuestions}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700 mb-1">
                    Passing Score (%) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="passingScore"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleChange}
                    required
                    min="1"
                    max="100"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      <span className="ml-2">Active</span>
                    </label>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows="4"
                    className="input-field"
                    placeholder="Enter instructions for students taking this exam"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-display font-semibold text-gray-800 mb-3">Exam Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-4">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          name="showResults"
                          checked={formData.showResults}
                          onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                        <span className="ml-2">Show Results After Completion</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          name="randomizeQuestions"
                          checked={formData.randomizeQuestions}
                          onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                        <span className="ml-2">Randomize Questions</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          name="preventBacktracking"
                          checked={formData.preventBacktracking}
                          onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                        <span className="ml-2">Prevent Backtracking</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          name="webcamRequired"
                          checked={formData.webcamRequired}
                          onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                        <span className="ml-2">Require Webcam</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          name="fullscreenRequired"
                          checked={formData.fullscreenRequired}
                          onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                        <span className="ml-2">Require Fullscreen Mode</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-8 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/admin/exams')}
                  className="btn-secondary flex items-center gap-2"
                >
                  Cancel
                </button>
                
                <motion.button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Exam...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Create Exam
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateExamPage;