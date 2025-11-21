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

  const validateForm = () => {
    const errors = {}
    
    if (!form.title.trim()) {
      errors.title = 'Título é obrigatório'
    } else if (form.title.trim().length < 5) {
      errors.title = 'Título deve ter pelo menos 5 caracteres'
    }
    
    if (!form.content.trim()) {
      errors.content = 'Conteúdo é obrigatório'
    } else if (form.content.trim().length < 10) {
      errors.content = 'Conteúdo deve ter pelo menos 10 caracteres'
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
    <div className="create-post-form-container">
      <h3>Criar Novo Post</h3>
      <form onSubmit={onSubmit} className="create-post-form">
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
            className={fieldErrors.title ? 'input-error' : ''}
          />
          {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
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
            className={fieldErrors.content ? 'input-error' : ''}
          />
          {fieldErrors.content && <span className="field-error">{fieldErrors.content}</span>}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  )
}

export default CreatePostForm

