import { Fragment } from 'react'
import './ConfirmDialog.css'

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning' }) {
  if (!isOpen) return null

  // Processar a mensagem para renderizar quebras de linha
  const processedMessage = typeof message === 'string' 
    ? message.split('\n').map((line, index, array) => (
        <Fragment key={index}>
          {line}
          {index < array.length - 1 && <br />}
        </Fragment>
      ))
    : message

  return (
    <div 
      className="confirm-dialog-overlay" 
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div 
        className="confirm-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className={`confirm-dialog-header confirm-dialog-${type}`}>
          <span className="confirm-dialog-icon" aria-hidden="true">
            {type === 'warning' && '⚠️'}
            {type === 'danger' && '🗑️'}
            {type === 'info' && 'ℹ️'}
          </span>
          <h3 id="confirm-dialog-title" className="confirm-dialog-title">{title}</h3>
        </div>
        <div className="confirm-dialog-body">
          <div id="confirm-dialog-message" className="confirm-dialog-message">
            {processedMessage}
          </div>
        </div>
        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-button confirm-dialog-button-cancel"
            onClick={onCancel}
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-dialog-button confirm-dialog-button-confirm confirm-dialog-button-${type}`}
            onClick={onConfirm}
            aria-label={confirmText}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

