import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { authAPI } from '../services/api'

interface LoginProps {
  onLogin: (username: string, type: 'user' | 'hr') => void
}

export default function Login({ onLogin }: LoginProps) {
  const [userType, setUserType] = useState<'user' | 'hr'>('hr')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login({ username, password, userType })
      if (response.success) {
        onLogin(response.user, response.userType)
        navigate(response.userType === 'hr' ? '/dashboard' : '/upload')
      } else {
        setError(response.message || 'Invalid credentials')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900">VeriSelect</h1>
          <p className="mt-2 text-gray-600">Automated Background Verification</p>
        </motion.div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setUserType('hr')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${userType === 'hr' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Building size={20} />
            <span>Admin</span>
          </button>
          <button
            onClick={() => setUserType('user')}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${userType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <User size={20} />
            <span>Candidate</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {userType === 'hr' ? (
            <>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-center text-gray-500">
                Demo: hr / hr123
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">You will be redirected to the upload portal.</p>
              <button
                type="button"
                onClick={() => navigate('/upload')}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Upload Portal
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          {userType === 'hr' && (
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
