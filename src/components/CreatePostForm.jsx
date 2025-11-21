import { useState, useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import { useToast } from '../context/ToastContext'
import useForm from '../hooks/useForm'
import './CreatePostForm.css'

function CreatePostForm() {
  const { createPost, isLoading } = useContext(GlobalContext)
  const { showSuccess, showError } = useToast()
  const [form, handleInputChange, resetForm] = useForm({ 
    title: '', 
    content: '' 
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const MIN_TITLE_LENGTH = 5
  const MIN_CONTENT_LENGTH = 10

  const getCharCountStatus = (current, min) => {
    if (current === 0) return 'empty'
    if (current < min) return 'invalid'
    if (current < min + 2) return 'warning'
    return 'valid'
  }

  const titleStatus = getCharCountStatus(form.title.trim().length, MIN_TITLE_LENGTH)
  const contentStatus = getCharCountStatus(form.content.trim().length, MIN_CONTENT_LENGTH)

  const validateForm = () => {
    const errors = {}
    
    if (!form.title.trim()) {
      errors.title = 'Título é obrigatório'
    } else if (form.title.trim().length < MIN_TITLE_LENGTH) {
      errors.title = `Título deve ter pelo menos ${MIN_TITLE_LENGTH} caracteres`
    }
    
    if (!form.content.trim()) {
      errors.content = 'Conteúdo é obrigatório'
    } else if (form.content.trim().length < MIN_CONTENT_LENGTH) {
      errors.content = `Conteúdo deve ter pelo menos ${MIN_CONTENT_LENGTH} caracteres`
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
      await createPost(form)
      resetForm()
      showSuccess('Post criado com sucesso!')
    } catch (err) {
      const errorMessage = err.message || 'Erro ao criar post. Tente novamente.'
      setError(errorMessage)
      showError(errorMessage)
    }
  }

  return (
    <section className="create-post-form-container" aria-labelledby="create-post-title">
      <h3 id="create-post-title">Criar Novo Post</h3>
      <form onSubmit={onSubmit} className="create-post-form" aria-label="Formulário para criar novo post">
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Ex: Top 5 jogos do Super Nintendo"
            required
            aria-required="true"
            aria-invalid={fieldErrors.title ? 'true' : 'false'}
            aria-describedby={fieldErrors.title ? 'title-error title-counter' : 'title-counter'}
            className={fieldErrors.title ? 'input-error' : ''}
          />
          <div 
            id="title-counter" 
            className={`char-counter char-counter-${titleStatus}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {form.title.trim().length}/{MIN_TITLE_LENGTH} caracteres mínimos
            {titleStatus === 'valid' && ' ✓'}
          </div>
          {fieldErrors.title && (
            <span 
              id="title-error" 
              className="field-error" 
              role="alert"
              aria-live="polite"
            >
              {fieldErrors.title}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="content">Conteúdo</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleInputChange}
            placeholder="Compartilhe seus pensamentos sobre jogos clássicos..."
            rows="4"
            required
            aria-required="true"
            aria-invalid={fieldErrors.content ? 'true' : 'false'}
            aria-describedby={fieldErrors.content ? 'content-error content-counter' : 'content-counter'}
            className={fieldErrors.content ? 'input-error' : ''}
          />
          <div 
            id="content-counter" 
            className={`char-counter char-counter-${contentStatus}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {form.content.trim().length}/{MIN_CONTENT_LENGTH} caracteres mínimos
            {contentStatus === 'valid' && ' ✓'}
          </div>
          {fieldErrors.content && (
            <span 
              id="content-error" 
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
          aria-label={isLoading ? 'Publicando post...' : 'Publicar post'}
        >
          {isLoading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </section>
  )
}

export default CreatePostForm

