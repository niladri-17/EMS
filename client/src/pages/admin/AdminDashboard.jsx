import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const dashboardData = {
  exams: 12,
  questionsTotal: 156,
  studentsEnrolled: 348,
  completedExams: 1245,
  examPassRate: 78,
  recentExams: [
    { id: 1, title: 'History Quiz', students: 42, avgScore: 76, date: '2025-05-10' },
    { id: 2, title: 'Mathematics Final', students: 31, avgScore: 68, date: '2025-05-08' },
    { id: 3, title: 'Biology Midterm', students: 35, avgScore: 82, date: '2025-05-06' },
    { id: 4, title: 'Physics Test', students: 28, avgScore: 71, date: '2025-05-05' }
  ],
  topStudents: [
    { id: 1, name: 'Jennifer Wilson', avgScore: 94, examsCompleted: 8 },
    { id: 2, name: 'Michael Chen', avgScore: 91, examsCompleted: 7 },
    { id: 3, name: 'Sarah Johnson', avgScore: 88, examsCompleted: 9 },
    { id: 4, name: 'Raj Patel', avgScore: 87, examsCompleted: 6 }
  ]
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const handleCreateExam = () => {
    navigate('/admin/exams/create');
  };
  
  const handleViewExam = (id) => {
    navigate(`/admin/exams/${id}`);
  };
  
  const handleViewResults = () => {
    navigate('/admin/results');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-6 overflow-auto ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Admin</p>
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
          
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm inline-flex gap-2">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'week' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setSelectedPeriod('week')}
              >
                Weekly
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'month' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setSelectedPeriod('month')}
              >
                Monthly
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'year' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setSelectedPeriod('year')}
              >
                Yearly
              </button>
            </div>
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
                <div className="p-3 rounded-lg bg-primary-100 text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Exams</h3>
                  <div className="text-2xl font-bold text-gray-800">{dashboardData.exams}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  +3 this month
                </span>
                <a href="#" className="text-sm text-primary font-medium">View all</a>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-soft p-6"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Questions</h3>
                  <div className="text-2xl font-bold text-gray-800">{dashboardData.questionsTotal}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  +24 this month
                </span>
                <a href="#" className="text-sm text-primary font-medium">View all</a>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-soft p-6"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Enrolled Students</h3>
                  <div className="text-2xl font-bold text-gray-800">{dashboardData.studentsEnrolled}</div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  +12 this month
                </span>
                <a href="#" className="text-sm text-primary font-medium">View all</a>
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
                  <div className="text-2xl font-bold text-gray-800">{dashboardData.examPassRate}%</div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  +5% this month
                </span>
                <button 
                  onClick={handleViewResults}
                  className="text-sm text-primary font-medium"
                >
                  View details
                </button>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-display font-semibold text-gray-800">Recent Exams</h2>
                  <a href="#" className="text-sm text-primary font-medium">View all exams</a>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentExams.map((exam) => (
                        <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-800">{exam.title}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{exam.students}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${
                              exam.avgScore >= 80 ? 'text-green-600' : 
                              exam.avgScore >= 70 ? 'text-blue-600' : 
                              exam.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {exam.avgScore}%
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{new Date(exam.date).toLocaleDateString()}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <button 
                              onClick={() => handleViewExam(exam.id)}
                              className="text-sm text-primary hover:text-primary-700 font-medium"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-display font-semibold text-gray-800">Top Students</h2>
                  <a href="#" className="text-sm text-primary font-medium">View all</a>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.topStudents.map((student) => (
                    <div key={student.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-800">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.examsCompleted} Exams Completed</div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-lg font-bold text-primary">{student.avgScore}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Performance Overview</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Above 90%</span>
                        <span className="font-medium text-gray-800">24 students</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">80% - 90%</span>
                        <span className="font-medium text-gray-800">86 students</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">70% - 80%</span>
                        <span className="font-medium text-gray-800">112 students</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Below 70%</span>
                        <span className="font-medium text-gray-800">78 students</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;