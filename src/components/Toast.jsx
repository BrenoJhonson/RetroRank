import { useEffect } from 'react'
import './Toast.css'

function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const typeLabels = {
    success: 'Sucesso',
    error: 'Erro',
    warning: 'Aviso',
    info: 'Informação'
  }

  return (
    <div 
      className={`toast toast-${type}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="toast-content">
        <span className="toast-icon" aria-hidden="true">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </span>
        <span className="toast-message">
          <span className="sr-only">{typeLabels[type]}: </span>
          {message}
        </span>
      </div>
      <button 
        className="toast-close" 
        onClick={onClose} 
        aria-label={`Fechar notificação: ${message}`}
      >
        ×
      </button>
    </div>
  )
}

export default Toast

