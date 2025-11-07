
import React, { useState } from 'react';
import { Employee } from './types';
import { mockEmployees } from './mockData';
import { LoginPage } from './components/LoginPage';
import { UploadPage } from './components/UploadPage';
import { EmployeeListPage } from './components/EmployeeListPage';
import { EmployeeDetailPage } from './components/EmployeeDetailPage';
import { DocumentPlusIcon, UserGroupIcon } from './components/Icons';


type Page = 'list' | 'upload';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
      setIsLoggedIn(false);
      setSelectedEmployee(null);
      setCurrentPage('list');
  };
  const handleSelectEmployee = (employee: Employee) => setSelectedEmployee(employee);
  const handleBackToList = () => setSelectedEmployee(null);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  const NavButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
  }> = ({ onClick, isActive, children }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
        isActive
          ? 'bg-brand-light text-brand-dark'
          : 'text-gray-300 hover:bg-brand-gray hover:text-brand-light'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-dark font-sans">
      <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-2">
                    <p className="text-xl font-extralight text-brand-light tracking-wider">Certify</p>
                </div>
                <div className="flex items-center space-x-4">
                    <NavButton onClick={() => { setCurrentPage('upload'); handleBackToList(); }} isActive={currentPage === 'upload' && !selectedEmployee}>
                        <DocumentPlusIcon className="w-5 h-5"/>
                        <span>Upload Documents</span>
                    </NavButton>
                    <NavButton onClick={() => { setCurrentPage('list'); handleBackToList(); }} isActive={currentPage === 'list' && !selectedEmployee}>
                        <UserGroupIcon className="w-5 h-5"/>
                        <span>Employee Directory</span>
                    </NavButton>
                     <button onClick={handleLogout} className="text-gray-400 hover:text-brand-light text-sm">Logout</button>
                </div>
            </div>
        </nav>
      </header>

      <main>
        {selectedEmployee ? (
          <EmployeeDetailPage employee={selectedEmployee} onBack={handleBackToList} />
        ) : currentPage === 'list' ? (
          <EmployeeListPage employees={mockEmployees} onSelectEmployee={handleSelectEmployee} />
        ) : (
          <UploadPage />
        )}
      </main>
    </div>
  );
};

export default App;
