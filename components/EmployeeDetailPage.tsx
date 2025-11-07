
import React from 'react';
import { Employee, Document, VerificationStatus } from '../types';
import { ArrowLeftIcon, CheckIcon, CrossIcon } from './Icons';

interface EmployeeDetailPageProps {
  employee: Employee;
  onBack: () => void;
}

const VerificationItem: React.FC<{ doc: Document }> = ({ doc }) => {
  const isVerified = doc.status === VerificationStatus.Verified;
  const isNotVerified = doc.status === VerificationStatus.NotVerified;

  const statusIcon = isVerified ? (
    <CheckIcon className="w-6 h-6 text-brand-accent-green" />
  ) : (
    <CrossIcon className="w-6 h-6 text-brand-accent-pink" />
  );

  const containerClasses = `relative flex items-center justify-between p-4 bg-brand-gray rounded-lg group transition-all duration-300 ${
    isNotVerified ? 'shadow-lg shadow-brand-accent-pink/20' : ''
  }`;

  return (
    <div className={containerClasses}>
      <p className="text-brand-light">{doc.name}</p>
      {doc.status !== VerificationStatus.Pending ? statusIcon : <p className="text-sm text-white-500">Pending</p>}
      {isNotVerified && doc.reason && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-black text-white rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          {doc.reason}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
        </div>
      )}
    </div>
  );
};


export const EmployeeDetailPage: React.FC<EmployeeDetailPageProps> = ({ employee, onBack }) => {
  return (
    <div className="p-4 sm:p-8 text-brand-light max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center space-x-2 text-gray-400 hover:text-brand-light transition-colors duration-300 mb-8">
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Directory</span>
        </button>
        
        <div className="flex items-start space-x-6 mb-12">
            <img 
                src={employee.imageUrl} 
                alt={employee.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-brand-gray"
            />
            <div>
                <h1 className="text-4xl font-light tracking-wide">{employee.name}</h1>
                <p className="text-lg text-gray-400 font-mono mt-2">{employee.identityId}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Identity Documents */}
            <section>
                <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-6">Identity Verification</h2>
                <div className="space-y-4">
                    {employee.identityDocs.map((doc, index) => <VerificationItem key={index} doc={doc} />)}
                </div>
            </section>

            {/* Education Documents */}
            <section>
                <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-6">Education Verification</h2>
                <div className="space-y-4">
                    {employee.educationDocs.map((doc, index) => <VerificationItem key={index} doc={doc} />)}
                </div>
            </section>
        </div>
    </div>
  );
};
