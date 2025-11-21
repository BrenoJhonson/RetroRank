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
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-dialog-header confirm-dialog-${type}`}>
          <span className="confirm-dialog-icon">
            {type === 'warning' && '⚠️'}
            {type === 'danger' && '🗑️'}
            {type === 'info' && 'ℹ️'}
          </span>
          <h3 className="confirm-dialog-title">{title}</h3>
        </div>
        <div className="confirm-dialog-body">
          <div className="confirm-dialog-message">
            {processedMessage}
          </div>
        </div>
        <div className="confirm-dialog-actions">
          <button
            className="confirm-dialog-button confirm-dialog-button-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-dialog-button confirm-dialog-button-confirm confirm-dialog-button-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

