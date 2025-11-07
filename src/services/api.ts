import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface LoginRequest {
  username: string
  password: string
  userType: 'user' | 'hr'
}

export interface LoginResponse {
  success: boolean
  user: string
  userType: 'user' | 'hr'
  token: string
  message?: string
}

export interface UploadResponse {
  success: boolean
  message: string
  files: string[]
  candidateId: string
}

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', data)
    return response.data
  },
}

// Upload API
export const uploadAPI = {
  uploadFiles: async (files: File[], candidateId: string): Promise<UploadResponse> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('candidateId', candidateId)

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

// Comparison API
export const comparisonAPI = {
  compare: async (candidateId: string): Promise<{ task_id: string }> => {
    const response = await api.post('/compare', { candidateId })
    return response.data
  },

  getStatus: async (taskId: string): Promise<any> => {
    const response = await api.get(`/status/${taskId}`)
    return response.data
  },

  getAllCandidates: async (): Promise<any[]> => {
    const response = await api.get('/candidates')
    return response.data
  },

  getCandidate: async (candidateId: string): Promise<any> => {
    const response = await api.get(`/candidates/${candidateId}`)
    return response.data
  },
}

export default api
