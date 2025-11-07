
import React, { useState } from 'react';
import { UploadIcon } from './Icons';

const FileUploadBox: React.FC<{ title: string }> = ({ title }) => (
    <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-brand-light transition-colors duration-300">
        <UploadIcon className="w-10 h-10 text-gray-500 mb-2"/>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-xs text-gray-500 mt-1">(PDF only)</p>
        <input type="file" accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
    </div>
);

export const UploadPage: React.FC = () => {
  const [hasExperience, setHasExperience] = useState(false);

  return (
    <div className="p-4 sm:p-8 text-brand-light max-w-4xl mx-auto">
      <h1 className="text-3xl font-extralight mb-8 tracking-wide">Upload Your Documents</h1>

      <div className="space-y-12">
        {/* Identity Section */}
        <section>
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-6">Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FileUploadBox title="Aadhaar Card" />
            <FileUploadBox title="PAN Card" />
            <FileUploadBox title="Passport" />
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-6">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FileUploadBox title="10th Marksheet" />
            <FileUploadBox title="12th Marksheet" />
            <FileUploadBox title="UG Degree" />
            <FileUploadBox title="PG Degree" />
          </div>
        </section>

        {/* Experience Section */}
        <section>
            <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-6">Experience</h2>
            <div className="flex items-center space-x-4">
                <p className="text-gray-300">Do you have any other experience certificates to upload?</p>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setHasExperience(true)} className={`px-4 py-2 rounded-md text-sm ${hasExperience ? 'bg-brand-light text-brand-dark' : 'bg-brand-gray text-brand-light'}`}>Yes</button>
                    <button onClick={() => setHasExperience(false)} className={`px-4 py-2 rounded-md text-sm ${!hasExperience ? 'bg-brand-light text-brand-dark' : 'bg-brand-gray text-brand-light'}`}>No</button>
                </div>
            </div>
            {hasExperience && (
                <div className="mt-6 max-w-xs">
                    <FileUploadBox title="Experience Certificate" />
                </div>
            )}
        </section>

        <div className="pt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-12 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-dark bg-brand-light hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-light transition-colors duration-300"
            >
              Submit Documents
            </button>
        </div>
      </div>
    </div>
  );
};
