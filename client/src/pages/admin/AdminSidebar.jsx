import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      )
    },
    {
      title: 'Exams',
      path: '/admin/exams',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      )
    },
    {
      title: 'Questions',
      path: '/admin/questions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    {
      title: 'Students',
      path: '/admin/students',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      )
    },
    {
      title: 'Results',
      path: '/admin/results',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      )
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      )
    }
  ];
  
  return (
    <motion.div 
      className="w-64 bg-white h-screen shadow-md flex flex-col fixed left-0 top-0"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold text-xl mr-2">
              SE
            </div>
            <h1 className="text-xl font-display font-bold text-gray-900">Admin Portal</h1>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center p-3 text-base font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="ml-3">{item.title}</span>
                
                {item.path === location.pathname && (
                  <motion.div
                    layoutId="activeTab"
                    className="w-1 h-6 bg-white rounded-full ml-auto"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <NavLink
          to="/"
          className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span className="ml-3">Logout</span>
        </NavLink>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;