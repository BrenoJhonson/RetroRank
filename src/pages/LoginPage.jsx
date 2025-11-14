import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import useForm from '../hooks/useForm'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, setError: clearGlobalError } = useContext(GlobalContext)
  const [form, handleInputChange, resetForm] = useForm({ email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Limpa erros globais quando a página é montada
  useEffect(() => {
    clearGlobalError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateForm = () => {
    const errors = {}
    
    if (!form.email.trim()) {
      errors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Email inválido'
    }
    
    if (!form.password) {
      errors.password = 'Senha é obrigatória'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    clearGlobalError(null) // Limpa erro global também

    if (!validateForm()) {
      return
    }

    try {
      await login(form)
      resetForm()
      clearGlobalError(null) // Garante que não há erro após sucesso
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
              className={fieldErrors.email ? 'input-error' : ''}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
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
              className={fieldErrors.password ? 'input-error' : ''}
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
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

