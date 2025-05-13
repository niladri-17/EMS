import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const StudentsPage = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const students = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      examsTaken: 3,
      avgScore: 80,
      lastActivity: '2025-05-10',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      examsTaken: 2,
      avgScore: 68,
      lastActivity: '2025-05-10',
      status: 'active'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      examsTaken: 2,
      avgScore: 75,
      lastActivity: '2025-05-08',
      status: 'active'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@example.com',
      examsTaken: 2,
      avgScore: 90,
      lastActivity: '2025-05-08',
      status: 'active'
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      examsTaken: 1,
      avgScore: 85,
      lastActivity: '2025-05-06',
      status: 'active'
    },
    {
      id: 6,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      examsTaken: 1,
      avgScore: 73,
      lastActivity: '2025-05-06',
      status: 'inactive'
    },
    {
      id: 7,
      name: 'James Taylor',
      email: 'james.taylor@example.com',
      examsTaken: 0,
      avgScore: 0,
      lastActivity: '2025-05-02',
      status: 'inactive'
    }
  ];
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const filteredStudents = students
    .filter(student => {
      if (filter === 'all') return true;
      return student.status === filter;
    })
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const handleAddStudent = () => {
    navigate('/admin/students/add');
  };
  
  const handleViewStudent = (id) => {
    navigate(`/admin/students/${id}`);
  };
  
  const totalStudents = filteredStudents.length;
  const activeStudents = filteredStudents.filter(student => student.status === 'active').length;
  const inactiveStudents = filteredStudents.filter(student => student.status === 'inactive').length;
  const totalExamsTaken = filteredStudents.reduce((sum, student) => sum + student.examsTaken, 0);
  const avgScore = totalStudents > 0 
    ? Math.round(filteredStudents.reduce((sum, student) => sum + student.avgScore, 0) / totalStudents) 
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
              <h1 className="text-3xl font-display font-bold text-gray-800">Students</h1>
              <p className="text-gray-600 mt-1">Manage students and their access</p>
            </div>
            
            <motion.button
              onClick={handleAddStudent}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Student
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
                <div className="p-3 rounded-lg bg-primary-100 text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                  <div className="text-2xl font-bold text-gray-800">{totalStudents}</div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Active Students</h3>
                  <div className="text-2xl font-bold text-gray-800">{activeStudents}</div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Total Exams Taken</h3>
                  <div className="text-2xl font-bold text-gray-800">{totalExamsTaken}</div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Average Score</h3>
                  <div className="text-2xl font-bold text-gray-800">{avgScore}%</div>
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
                    placeholder="Search by student name or email"
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
                  <option value="all">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            {filteredStudents.length > 0 ? (
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
                        Exams Taken
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
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
                    {filteredStudents.map((student) => (
                      <motion.tr 
                        key={student.id} 
                        variants={itemVariants}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-medium">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.examsTaken}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            <span className={`${
                              student.avgScore === 0 ? 'text-gray-500' :
                              student.avgScore >= 80 ? 'text-green-600' : 
                              student.avgScore >= 70 ? 'text-blue-600' : 
                              student.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {student.avgScore === 0 ? '-' : `${student.avgScore}%`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(student.lastActivity).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewStudent(student.id)}
                              className="text-primary hover:text-primary-700"
                              title="View Student"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Student"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button
                              className={`${
                                student.status === 'active' 
                                  ? 'text-red-600 hover:text-red-800' 
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={student.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {student.status === 'active' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              )}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-700">No students found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;