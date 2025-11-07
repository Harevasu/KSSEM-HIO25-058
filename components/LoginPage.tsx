
import React from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-brand-light">
      <div className="w-full max-w-sm p-8 space-y-8 bg-brand-dark rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extralight tracking-wider">Hi I'm Certify</h1>
          <p className="mt-2 text-gray-400">Secure Document Verification</p>
        </div>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-400">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue="admin@certify.com"
              className="mt-1 block w-full px-3 py-2 bg-brand-gray border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-light focus:border-brand-light sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-400">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              defaultValue="password"
              className="mt-1 block w-full px-3 py-2 bg-brand-gray border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-light focus:border-brand-light sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-dark bg-brand-light hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-light transition-colors duration-300"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
