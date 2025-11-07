
import React from 'react';
import { Employee } from '../types';

interface EmployeeListPageProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
}

export const EmployeeListPage: React.FC<EmployeeListPageProps> = ({ employees, onSelectEmployee }) => {
  return (
    <div className="p-4 sm:p-8 text-brand-light max-w-4xl mx-auto">
      <h1 className="text-3xl font-extralight mb-8 tracking-wide">Employee Directory</h1>
      <div className="space-y-3">
        {employees.map((employee) => (
          <div
            key={employee.id}
            onClick={() => onSelectEmployee(employee)}
            className="flex items-center p-4 bg-brand-gray rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-300"
          >
            <img
              className="h-12 w-12 rounded-full object-cover"
              src={employee.imageUrl}
              alt={employee.name}
            />
            <div className="ml-4 flex-grow">
              <p className="text-lg font-medium text-brand-light">{employee.name}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-400 font-mono">{employee.identityId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
