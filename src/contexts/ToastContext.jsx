import { createContext, useContext, useState, useCallback } from 'react'
import ToastContainer from '../components/ToastContainer'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, type }

    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((message) => showToast(message, 'success'), [showToast])
  const error = useCallback((message) => showToast(message, 'error'), [showToast])
  const info = useCallback((message) => showToast(message, 'info'), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, removeToast, success, error, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

