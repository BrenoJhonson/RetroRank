import { useState, useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import useForm from '../hooks/useForm'
import './CreatePostForm.css'

function CreatePostForm() {
  const { createPost } = useContext(GlobalContext)
  const [form, handleInputChange, resetForm] = useForm({ 
    title: '', 
    content: '' 
  })
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.title.trim() || !form.content.trim()) {
      setError('Preencha todos os campos')
      return
    }

    try {
      await createPost(form)
      resetForm()
    } catch (err) {
      setError(err.message || 'Erro ao criar post. Tente novamente.')
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
          />
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
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button">
          Publicar
        </button>
      </form>
    </div>
  )
}

export default CreatePostForm

