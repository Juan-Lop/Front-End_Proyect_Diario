/**
 * Módulo de API
 * Gestiona las solicitudes HTTP a los microservicios del backend
 */

import { getToken } from "./auth"

const DIARY_API_URL = process.env.NEXT_PUBLIC_DIARY_API_URL || "https://micro-servicio-diary-service.onrender.com"

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const url = `${DIARY_API_URL}${endpoint}`
  console.log('🔵 API Request:', { url, method: options.method || 'GET', hasToken: !!token })

  const response = await fetch(url, {
    ...options,
    headers,
  })

  console.log('🟢 API Response:', { url, status: response.status, ok: response.ok })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error en la solicitud" }))
    console.error('🔴 API Error:', { url, status: response.status, error })
    throw new Error(error.message || "Error en la solicitud")
  }

  const data = await response.json()
  console.log('✅ API Data:', { url, dataType: Array.isArray(data) ? 'array' : 'object', length: Array.isArray(data) ? data.length : 'N/A' })
  
  return data
}

// Tipos para el diary service
export interface CheckIn {
  id?: string
  userId: string
  date: string
  mood: number // 1-10
  stress: number // 1-10
  sleep: number // horas
  concern: string
  createdAt?: string
}

export interface DiaryEntry {
  id?: string
  userId: string
  entryText: string
  moodRating: number
  stressLevel?: number // 1-10
  sleepHours?: number // 0-12
  mainWorry?: string
  aiEmotion?: string
  aiIntensity?: number
  aiSummary?: string
  entryDate?: string
}

export interface WeeklyStats {
  averageStress: number
  previousWeekStress: number
  mainWorry: string
  averageSleep: number
  stressHistory: Array<{ date: string; stress: number }>
}

export interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  priority: "high" | "medium" | "low"
}

// API functions
export const checkInApi = {
  create: async (data: CheckIn) => {
    return apiRequest<CheckIn>("api/v1/diary/checkins", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  getAll: async () => {
    return apiRequest<CheckIn[]>("api/v1/diary/checkins")
  },

  getById: async (id: string) => {
    return apiRequest<CheckIn>(`api/v1/diary/checkins/${id}`)
  },
}

export const diaryApi = {
  create: async (data: DiaryEntry) => {
    return apiRequest<DiaryEntry>("api/v1/diary", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: DiaryEntry) => {
    return apiRequest<DiaryEntry>(`api/v1/diary/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  getAll: async () => {
    return apiRequest<DiaryEntry[]>("api/v1/diary")
  },

  getById: async (id: string) => {
    return apiRequest<DiaryEntry>(`api/v1/diary/${id}`)
  },
}

export const statsApi = {
  getWeekly: async () => {
    return apiRequest<WeeklyStats>("api/v1/stats/weekly")
  },

  getRecommendations: async () => {
    return apiRequest<Recommendation[]>("api/v1/stats/recommendations")
  },
}
