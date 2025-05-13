import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const ExamsPage = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const exams = [
    {
      id: 1,
      title: 'History Quiz',
      subject: 'History',
      topic: 'World History',
      duration: 30,
      totalQuestions: 5,
      passingScore: 70,
      status: 'active',
      dateCreated: '2025-05-10',
      attempts: 42
    },
    {
      id: 2,
      title: 'Mathematics Final',
      subject: 'Mathematics',
      topic: 'Algebra',
      duration: 60,
      totalQuestions: 20,
      passingScore: 65,
      status: 'active',
      dateCreated: '2025-05-08',
      attempts: 31
    },
    {
      id: 3,
      title: 'Biology Midterm',
      subject: 'Biology',
      topic: 'Cell Biology',
      duration: 45,
      totalQuestions: 15,
      passingScore: 60,
      status: 'active',
      dateCreated: '2025-05-06',
      attempts: 35
    },
    {
      id: 4,
      title: 'Physics Test',
      subject: 'Physics',
      topic: 'Mechanics',
      duration: 40,
      totalQuestions: 12,
      passingScore: 70,
      status: 'inactive',
      dateCreated: '2025-05-05',
      attempts: 0
    },
    {
      id: 5,
      title: 'Chemistry Assessment',
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      duration: 50,
      totalQuestions: 18,
      passingScore: 65,
      status: 'draft',
      dateCreated: '2025-05-04',
      attempts: 0
    }
  ];
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const filteredExams = exams
    .filter(exam => {
      if (filter === 'all') return true;
      return exam.status === filter;
    })
    .filter(exam => 
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const handleCreateExam = () => {
    navigate('/admin/exams/create');
  };
  
  const handleViewExam = (id) => {
    navigate(`/admin/exams/${id}`);
  };
  
  const handleEditExam = (id) => {
    navigate(`/admin/exams/${id}/edit`);
  };
  
  const handleAddQuestions = (id) => {
    navigate(`/admin/exams/${id}/questions`);
  };
  
  const handleViewResults = (id) => {
    navigate(`/admin/exams/${id}/results`);
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
              <h1 className="text-3xl font-display font-bold text-gray-800">Exams</h1>
              <p className="text-gray-600 mt-1">Manage your exams and assessments</p>
            </div>
            
            <motion.button
              onClick={handleCreateExam}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create New Exam
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
                    placeholder="Search exams by title, subject or topic"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <select
                  className="input-field"
                  value={filter}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Exams</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            
            {filteredExams.length > 0 ? (
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
                        Exam Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attempts
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredExams.map((exam) => (
                      <motion.tr 
                        key={exam.id} 
                        variants={itemVariants}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{exam.subject}</div>
                          <div className="text-xs text-gray-500">{exam.topic}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{exam.duration} min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{exam.totalQuestions}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            exam.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : exam.status === 'inactive'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exam.attempts}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewExam(exam.id)}
                              className="text-primary hover:text-primary-700"
                              title="View Exam"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditExam(exam.id)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Exam"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleAddQuestions(exam.id)}
                              className="text-purple-600 hover:text-purple-800"
                              title="Add Questions"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleViewResults(exam.id)}
                              className="text-green-600 hover:text-green-800"
                              title="View Results"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-700">No exams found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;