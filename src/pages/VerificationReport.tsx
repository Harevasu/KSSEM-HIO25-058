import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, X, FileText, University, Link as LinkIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { comparisonAPI } from '../services/api'
import { ComparisonData } from '../types'
import VeriScore from '../components/VeriScore'

export default function VerificationReport() {
  const { candidateId } = useParams<{ candidateId: string }>()
  const [candidate, setCandidate] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (candidateId) {
      loadReport(candidateId)
    }
  }, [candidateId])

  const loadReport = async (id: string) => {
    setLoading(true)
    try {
      const data = await comparisonAPI.getCandidate(id)
      setCandidate(data)
    } catch (err) {
      setError('Failed to load report.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error || !candidate) {
    return <div className="flex justify-center items-center h-screen">{error || 'Report not found.'}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="flex items-center space-x-2 text-blue-600 hover:underline mb-8">
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{candidate.Candidate}</h1>
              <p className="text-gray-600">Software Engineer</p>
              <p className="text-sm text-gray-500 mt-1">Uploaded: 2025-11-08 14:30</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">VeriScore™</p>
              <VeriScore score={87} />
              <p className="text-xs text-gray-500">87/100</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Document Preview</h2>
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <FileText size={64} className="text-gray-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">AI Verification</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-blue-600" />
                    <h3 className="font-bold">Document Integrity</h3>
                  </div>
                  <ul className="mt-2 text-sm space-y-1">
                    <li>Font consistency: <span className="font-semibold text-green-600">High</span></li>
                    <li>Logo alignment: <span className="font-semibold text-green-600">Verified</span></li>
                    <li>Forgery risk: <span className="font-semibold text-green-600">Low</span></li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <University className="text-blue-600" />
                    <h3 className="font-bold">Authority Check</h3>
                  </div>
                   <ul className="mt-2 text-sm space-y-1">
                    <li>University: <span className="font-semibold">Saveetha Engineering College (UGC Recognized ✅)</span></li>
                    <li>Roll format: <span className="font-semibold text-green-600">Valid ✅</span></li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <LinkIcon className="text-blue-600" />
                    <h3 className="font-bold">Cross-Reference</h3>
                  </div>
                   <ul className="mt-2 text-sm space-y-1">
                    <li>Name matches PAN registry pattern <span className="font-semibold text-green-600">✅</span></li>
                    <li>Degree year aligns with batch cycle <span className="font-semibold text-green-600">✅</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Audit Trail</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>2025-11-08 14:30 – Uploaded</li>
              <li>2025-11-08 14:31 – OCR + AI Analysis</li>
              <li>2025-11-08 14:32 – Verified (Auto-Approved)</li>
            </ul>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2">
              <X size={20} />
              <span>Reject</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
              <Check size={20} />
              <span>Approve</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}