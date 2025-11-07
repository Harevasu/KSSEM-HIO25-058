import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { comparisonAPI } from '../services/api'
import { ComparisonData } from '../types'
import VeriScore from '../components/VeriScore'

interface AdminDashboardProps {
  user: string
  onLogout: () => void
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [candidates, setCandidates] = useState<ComparisonData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadCandidates()
    const interval = setInterval(loadCandidates, 10000) // Auto-refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const loadCandidates = async () => {
    setLoading(true)
    try {
      const data = await comparisonAPI.getAllCandidates()
      setCandidates(data)
    } catch (err) {
      setError('Failed to load candidates.')
    } finally {
      setLoading(false)
    }
  }

  const getStatus = (candidate: ComparisonData) => {
    if (candidate.Documents.some(doc => doc.Differences === 'Error')) return 'Flagged'
    if (candidate.Documents.some(doc => doc.Differences === 'Yes' || doc.Differences === 'Missing in DigiLocker')) return 'Pending'
    return 'Verified'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">VeriSelect – Automated Background Verification</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus size={20} />
              <span>Add Candidate</span>
            </button>
            <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-4">Name</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Document Type</th>
                <th className="pb-4">VeriScore™</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(candidate => (
                <motion.tr 
                  key={candidate.Candidate}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b last:border-b-0"
                >
                  <td className="py-4">{candidate.Candidate}</td>
                  <td className="py-4">{`${candidate.Candidate.toLowerCase()}@example.com`}</td>
                  <td className="py-4">{candidate.Documents.map(d => d.Document_Name).join(', ')}</td>
                  <td className="py-4"><VeriScore score={92} /></td>
                  <td className="py-4">{getStatus(candidate)}</td>
                  <td className="py-4">
                    <button 
                      onClick={() => navigate(`/report/${candidate.Candidate}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View Report
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="flex justify-center py-4">
              <RefreshCw className="animate-spin" />
            </div>
          )}
          {error && <p className="text-red-500 text-center py-4">{error}</p>}
        </div>
      </main>
    </div>
  )
}
