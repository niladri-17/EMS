import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const ResultsPage = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  
  const results = [
    {
      id: 1,
      student: 'John Smith',
      email: 'john.smith@example.com',
      examId: 1,
      examTitle: 'History Quiz',
      score: 80,
      totalQuestions: 5,
      duration: '24:15',
      date: '2025-05-10T14:30:00',
      status: 'passed'
    },
    {
      id: 2,
      student: 'Jane Doe',
      email: 'jane.doe@example.com',
      examId: 1,
      examTitle: 'History Quiz',
      score: 60,
      totalQuestions: 5,
      duration: '27:45',
      date: '2025-05-10T15:45:00',
      status: 'failed'
    },
    {
      id: 3,
      student: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      examId: 2,
      examTitle: 'Mathematics Final',
      score: 75,
      totalQuestions: 20,
      duration: '52:30',
      date: '2025-05-08T09:15:00',
      status: 'passed'
    },
    {
      id: 4,
      student: 'Emily Chen',
      email: 'emily.chen@example.com',
      examId: 2,
      examTitle: 'Mathematics Final',
      score: 90,
      totalQuestions: 20,
      duration: '48:20',
      date: '2025-05-08T10:30:00',
      status: 'passed'
    },
    {
      id: 5,
      student: 'Michael Brown',
      email: 'michael.brown@example.com',
      examId: 3,
      examTitle: 'Biology Midterm',
      score: 85,
      totalQuestions: 15,
      duration: '38:45',
      date: '2025-05-06T13:00:00',
      status: 'passed'
    },
    {
      id: 6,
      student: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      examId: 3,
      examTitle: 'Biology Midterm',
      score: 73,
      totalQuestions: 15,
      duration: '42:10',
      date: '2025-05-06T14:15:00',
      status: 'passed'
    }
  ];
  
  const exams = [
    { id: 1, title: 'History Quiz' },
    { id: 2, title: 'Mathematics Final' },
    { id: 3, title: 'Biology Midterm' },
    { id: 4, title: 'Physics Test' },
    { id: 5, title: 'Chemistry Assessment' }
  ];
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleExamFilterChange = (e) => {
    setFilterExam(e.target.value);
  };
  
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };
  
  const filteredResults = results
    .filter(result => {
      if (filterExam === 'all') return true;
      return result.examId === parseInt(filterExam);
    })
    .filter(result => {
      if (dateRange === 'all') return true;
      
      const resultDate = new Date(result.date);
      const now = new Date();
      
      if (dateRange === 'today') {
        const today = new Date();
        return resultDate.toDateString() === today.toDateString();
      } else if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return resultDate >= weekAgo;
      } else if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return resultDate >= monthAgo;
      }
      
      return true;
    })
    .filter(result => 
      result.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.examTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const handleViewResult = (id) => {
    navigate(`/admin/results/${id}`);
  };
  
  const handleExportResults = () => {
    alert('Exporting results to CSV...');
  };
  
  const totalParticipants = filteredResults.length;
  const passedCount = filteredResults.filter(result => result.status === 'passed').length;
  const failedCount = filteredResults.filter(result => result.status === 'failed').length;
  const passRate = totalParticipants > 0 ? Math.round((passedCount / totalParticipants) * 100) : 0;
  const averageScore = totalParticipants > 0 
    ? Math.round(filteredResults.reduce((sum, result) => sum + result.score, 0) / totalParticipants) 
    : 0;
  
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
              <h1 className="text-3xl font-display font-bold text-gray-800">Exam Results</h1>
              <p className="text-gray-600 mt-1">View and analyze student performance</p>
            </div>
            
            <motion.button
              onClick={handleExportResults}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export Results
            </motion.button>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white rounded-xl shadow-soft p-6"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Participants</h3>
                  <div className="text-2xl font-bold text-gray-800">{totalParticipants}</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-soft p-6"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Pass Rate</h3>
                  <div className="text-2xl font-bold text-gray-800">{passRate}%</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-soft p-6"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Average Score</h3>
                  <div className="text-2xl font-bold text-gray-800">{averageScore}%</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-soft p-6"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Exams</h3>
                  <div className="text-2xl font-bold text-gray-800">{exams.length}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
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
                    placeholder="Search by student name, email or exam"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48">
                  <select
                    className="input-field"
                    value={filterExam}
                    onChange={handleExamFilterChange}
                  >
                    <option value="all">All Exams</option>
                    {exams.map(exam => (
                      <option key={exam.id} value={exam.id}>{exam.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full sm:w-48">
                  <select
                    className="input-field"
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredResults.length > 0 ? (
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
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.map((result) => (
                      <motion.tr 
                        key={result.id} 
                        variants={itemVariants}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-medium">
                                  {result.student.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{result.student}</div>
                              <div className="text-sm text-gray-500">{result.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.examTitle}</div>
                          <div className="text-xs text-gray-500">{result.totalQuestions} questions</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            <span className={`${
                              result.score >= 80 ? 'text-green-600' : 
                              result.score >= 70 ? 'text-blue-600' : 
                              result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {result.score}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(result.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(result.date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            result.status === 'passed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewResult(result.id)}
                            className="text-primary hover:text-primary-700"
                          >
                            View Details
                          </button>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-700">No results found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-display font-semibold text-gray-800 mb-4">Performance Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">Pass/Fail Distribution</h3>
                <div className="relative h-60 w-full">
                  <div className="absolute inset-0 flex">
                    <div 
                      className="bg-green-500 h-full rounded-l-lg flex items-center justify-center text-white font-medium"
                      style={{ width: `${passRate}%` }}
                    >
                      {passRate}%
                    </div>
                    <div 
                      className="bg-red-500 h-full rounded-r-lg flex items-center justify-center text-white font-medium"
                      style={{ width: `${100 - passRate}%` }}
                    >
                      {100 - passRate}%
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Passed ({passedCount})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Failed ({failedCount})</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">Score Distribution</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">90% - 100%</span>
                      <span className="font-medium text-gray-800">
                        {filteredResults.filter(r => r.score >= 90).length} students
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ 
                          width: `${filteredResults.length ? 
                            (filteredResults.filter(r => r.score >= 90).length / filteredResults.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">80% - 89%</span>
                      <span className="font-medium text-gray-800">
                        {filteredResults.filter(r => r.score >= 80 && r.score < 90).length} students
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${filteredResults.length ? 
                            (filteredResults.filter(r => r.score >= 80 && r.score < 90).length / filteredResults.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">70% - 79%</span>
                      <span className="font-medium text-gray-800">
                        {filteredResults.filter(r => r.score >= 70 && r.score < 80).length} students
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full" 
                        style={{ 
                          width: `${filteredResults.length ? 
                            (filteredResults.filter(r => r.score >= 70 && r.score < 80).length / filteredResults.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Below 70%</span>
                      <span className="font-medium text-gray-800">
                        {filteredResults.filter(r => r.score < 70).length} students
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ 
                          width: `${filteredResults.length ? 
                            (filteredResults.filter(r => r.score < 70).length / filteredResults.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;