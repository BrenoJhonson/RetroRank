import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import useForm from '../hooks/useForm'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useContext(GlobalContext)
  const [form, handleInputChange, resetForm] = useForm({ email: '', password: '' })
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login(form)
      resetForm()
      navigate('/feed')
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <p className="subtitle">Entre na comunidade RetroRank</p>
        
        <form onSubmit={onSubmit} className="login-form">
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
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="signup-link">
          Não tem uma conta? <a href="/signup">Cadastre-se</a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

