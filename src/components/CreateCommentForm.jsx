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

  const validateForm = () => {
    const errors = {}
    
    if (!form.content.trim()) {
      errors.content = 'O comentário não pode estar vazio'
    } else if (form.content.trim().length < 3) {
      errors.content = 'Comentário deve ter pelo menos 3 caracteres'
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
    <div className="create-comment-form-container">
      <h4>Deixe seu comentário</h4>
      <form onSubmit={onSubmit} className="create-comment-form">
        <div className="form-group">
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleInputChange}
            placeholder="Escreva seu comentário..."
            rows="3"
            required
            className={fieldErrors.content ? 'input-error' : ''}
          />
          {fieldErrors.content && <span className="field-error">{fieldErrors.content}</span>}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Comentando...' : 'Comentar'}
        </button>
      </form>
    </div>
  )
}

export default CreateCommentForm

