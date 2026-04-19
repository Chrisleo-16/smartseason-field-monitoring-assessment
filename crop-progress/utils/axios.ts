import axios from "axios"
import { config } from "process"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})
api.interceptors.response.use((config) => {
    if typeof window !== "undefined" {
        config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    }
  return config
})

export default api