import { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import useForm from '../hooks/useForm'
import './CreateCommentForm.css'

function CreateCommentForm() {
  const { id: postId } = useParams()
  const { createComment, getComments } = useContext(GlobalContext)
  const [form, handleInputChange, resetForm] = useForm({ content: '' })
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.content.trim()) {
      setError('O comentário não pode estar vazio')
      return
    }

    try {
      await createComment(postId, form)
      resetForm()
      // Recarregar comentários
      await getComments(postId)
    } catch (err) {
      setError(err.message || 'Erro ao criar comentário. Tente novamente.')
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
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button">
          Comentar
        </button>
      </form>
    </div>
  )
}

export default CreateCommentForm

