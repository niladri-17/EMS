import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const QuestionsPage = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [questionType, setQuestionType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const questions = [
    {
      id: 1,
      question: 'Which ancient civilization built the Machu Picchu complex in Peru?',
      subject: 'History',
      type: 'Multiple Choice',
      difficulty: 'Medium',
      exams: ['History Quiz'],
      dateCreated: '2025-05-01'
    },
    {
      id: 2,
      question: 'What is the value of π (pi) to two decimal places?',
      subject: 'Mathematics',
      type: 'Multiple Choice',
      difficulty: 'Easy',
      exams: ['Mathematics Final'],
      dateCreated: '2025-05-02'
    },
    {
      id: 3,
      question: 'Which organelle is known as the "powerhouse of the cell"?',
      subject: 'Biology',
      type: 'Multiple Choice',
      difficulty: 'Easy',
      exams: ['Biology Midterm'],
      dateCreated: '2025-05-03'
    },
    {
      id: 4,
      question: 'What is Newton\'s first law of motion?',
      subject: 'Physics',
      type: 'Free Text',
      difficulty: 'Hard',
      exams: ['Physics Test'],
      dateCreated: '2025-05-04'
    },
    {
      id: 5,
      question: 'Explain the difference between ionic and covalent bonds.',
      subject: 'Chemistry',
      type: 'Free Text',
      difficulty: 'Medium',
      exams: ['Chemistry Assessment'],
      dateCreated: '2025-05-05'
    },
    {
      id: 6,
      question: 'In which year did World War II end?',
      subject: 'History',
      type: 'Multiple Choice',
      difficulty: 'Easy',
      exams: ['History Quiz'],
      dateCreated: '2025-05-06'
    },
    {
      id: 7,
      question: 'What is the formula for calculating the area of a circle?',
      subject: 'Mathematics',
      type: 'Multiple Choice',
      difficulty: 'Easy',
      exams: ['Mathematics Final'],
      dateCreated: '2025-05-07'
    }
  ];
  
  const subjects = ['All', 'History', 'Mathematics', 'Biology', 'Physics', 'Chemistry'];
  const types = ['all', 'Multiple Choice', 'Free Text', 'True/False'];
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const handleTypeChange = (e) => {
    setQuestionType(e.target.value);
  };
  
  const filteredQuestions = questions
    .filter(question => {
      if (filter === 'All' || filter === 'all') return true;
      return question.subject === filter;
    })
    .filter(question => {
      if (questionType === 'all') return true;
      return question.type === questionType;
    })
    .filter(question => 
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const handleCreateQuestion = () => {
    setShowCreateModal(true);
  };
  
  const handleEditQuestion = (id) => {
    navigate(`/admin/questions/${id}/edit`);
  };
  
  const handleCloseModal = () => {
    setShowCreateModal(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-6 overflow-auto ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-800">Question Bank</h1>
              <p className="text-gray-600 mt-1">Manage your exam questions</p>
            </div>
            
            <motion.button
              onClick={handleCreateQuestion}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Question
            </motion.button>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="Search questions"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48">
                  <select
                    className="input-field"
                    value={filter}
                    onChange={handleFilterChange}
                  >
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full sm:w-48">
                  <select
                    className="input-field"
                    value={questionType}
                    onChange={handleTypeChange}
                  >
                    {types.map((type, index) => (
                      <option key={index} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {filteredQuestions.length > 0 ? (
              <motion.div
                className="overflow-x-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Question
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Used In
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredQuestions.map((question) => (
                      <motion.tr 
                        key={question.id} 
                        variants={itemVariants}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {question.question}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{question.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{question.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            question.difficulty === 'Easy' 
                              ? 'bg-green-100 text-green-800' 
                              : question.difficulty === 'Medium'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {question.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {question.exams.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(question.dateCreated).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditQuestion(question.id)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Question"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              title="Delete Question"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-700">No questions found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display font-semibold text-gray-800">Create New Question</h3>
                  <button 
                    onClick={handleCloseModal} 
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <form>
                  <div className="mb-4">
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                      Question <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="question"
                      rows="3"
                      className="input-field"
                      placeholder="Enter your question"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-danger">*</span>
                      </label>
                      <select id="subject" className="input-field" required>
                        <option value="">Select Subject</option>
                        {subjects.filter(subject => subject !== 'All').map((subject, index) => (
                          <option key={index} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Question Type <span className="text-danger">*</span>
                      </label>
                      <select id="type" className="input-field" required>
                        <option value="">Select Type</option>
                        {types.filter(type => type !== 'all').map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty <span className="text-danger">*</span>
                      </label>
                      <select id="difficulty" className="input-field" required>
                        <option value="">Select Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="exam" className="block text-sm font-medium text-gray-700 mb-1">
                        Add to Exam
                      </label>
                      <select id="exam" className="input-field">
                        <option value="">None</option>
                        <option value="1">History Quiz</option>
                        <option value="2">Mathematics Final</option>
                        <option value="3">Biology Midterm</option>
                        <option value="4">Physics Test</option>
                        <option value="5">Chemistry Assessment</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Options</h4>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="correctOption" 
                            id={`option${option}`} 
                            className="h-4 w-4 text-primary focus:ring-primary"
                          />
                          <input
                            type="text"
                            placeholder={`Option ${option}`}
                            className="input-field"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6 space-x-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Create Question
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionsPage;