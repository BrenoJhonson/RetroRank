import { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import { useToast } from '../context/ToastContext'
import useForm from '../hooks/useForm'
import './CreateCommentForm.css'

function CreateCommentForm() {
  const { id: postId } = useParams()
  const { createComment, getComments, isLoading } = useContext(GlobalContext)
  const { showSuccess, showError } = useToast()
  const [form, handleInputChange, resetForm] = useForm({ content: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const MIN_CONTENT_LENGTH = 3

  const getCharCountStatus = (current, min) => {
    if (current === 0) return 'empty'
    if (current < min) return 'invalid'
    if (current < min + 2) return 'warning'
    return 'valid'
  }

  const contentStatus = getCharCountStatus(form.content.trim().length, MIN_CONTENT_LENGTH)

  const validateForm = () => {
    const errors = {}
    
    if (!form.content.trim()) {
      errors.content = 'O comentário não pode estar vazio'
    } else if (form.content.trim().length < MIN_CONTENT_LENGTH) {
      errors.content = `Comentário deve ter pelo menos ${MIN_CONTENT_LENGTH} caracteres`
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})

    if (!validateForm()) {
      return
    }

    try {
      await createComment(postId, form)
      resetForm()
      // Recarregar comentários
      await getComments(postId)
      showSuccess('Comentário adicionado com sucesso!')
    } catch (err) {
      const errorMessage = err.message || 'Erro ao criar comentário. Tente novamente.'
      setError(errorMessage)
      showError(errorMessage)
    }
  }

  return (
    <section className="create-comment-form-container" aria-labelledby="create-comment-title">
      <h4 id="create-comment-title">Deixe seu comentário</h4>
      <form onSubmit={onSubmit} className="create-comment-form" aria-label="Formulário para criar comentário">
        <div className="form-group">
          <label htmlFor="comment-content">Comentário</label>
          <textarea
            id="comment-content"
            name="content"
            value={form.content}
            onChange={handleInputChange}
            placeholder="Escreva seu comentário..."
            rows="3"
            required
            aria-required="true"
            aria-invalid={fieldErrors.content ? 'true' : 'false'}
            aria-describedby={fieldErrors.content ? 'comment-error comment-counter' : 'comment-counter'}
            className={fieldErrors.content ? 'input-error' : ''}
          />
          <div 
            id="comment-counter" 
            className={`char-counter char-counter-${contentStatus}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {form.content.trim().length}/{MIN_CONTENT_LENGTH} caracteres mínimos
            {contentStatus === 'valid' && ' ✓'}
          </div>
          {fieldErrors.content && (
            <span 
              id="comment-error" 
              className="field-error" 
              role="alert"
              aria-live="polite"
            >
              {fieldErrors.content}
            </span>
          )}
        </div>

        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isLoading}
          aria-label={isLoading ? 'Comentando...' : 'Publicar comentário'}
        >
          {isLoading ? 'Comentando...' : 'Comentar'}
        </button>
      </form>
    </section>
  )
}

export default CreateCommentForm

