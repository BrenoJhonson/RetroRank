import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import useForm from '../hooks/useForm'
import './SignUpPage.css'

function SignUpPage() {
  const navigate = useNavigate()
  const { signup, isLoading } = useContext(GlobalContext)
  const [form, handleInputChange, resetForm] = useForm({ 
    name: '', 
    email: '', 
    password: '' 
  })
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await signup(form)
      resetForm()
      navigate('/feed')
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar. Tente novamente.')
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Cadastro</h2>
        <p className="subtitle">Junte-se à comunidade RetroRank</p>
        
        <form onSubmit={onSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Seu nome"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              required
              minLength={6}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="login-link">
          Já tem uma conta? <a href="/login">Faça login</a>
        </p>
      </div>
    </div>
  )
}

export default SignUpPage

