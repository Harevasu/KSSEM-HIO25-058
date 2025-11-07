import { useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, File as FileIcon, CheckCircle } from 'lucide-react'
import { uploadAPI } from '../services/api'

export default function CandidateUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      handleUpload(Array.from(e.target.files))
    }
  }

  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return

    setUploading(true)
    setError('')
    
    try {
      // In a real app, you'd get the candidateId from the URL token
      const candidateId = `cand_${Date.now()}`
      const response = await uploadAPI.uploadFiles(filesToUpload, candidateId)
      if (response.success) {
        setUploaded(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (uploaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white shadow-lg rounded-lg"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Upload Complete!</h1>
          <p className="mt-2 text-gray-600">
            Your documents are being verified.
            <br />
            Your employer will be notified shortly.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Upload Your Documents</h1>
          <p className="mt-2 text-gray-600">Please upload your documents for verification.</p>
        </div>

        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.zip"
              onChange={handleFileChange}
              className="hidden"
            />
            <UploadCloud className="w-16 h-16 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">
              <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, JPG, PNG, or ZIP</p>
          </motion.div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Selected files:</h3>
              {files.map((file, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm">
                  <FileIcon className="w-4 h-4 text-gray-500" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {uploading && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        )}

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      </div>
    </div>
  )
}
