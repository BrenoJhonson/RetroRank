import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import useForm from '../hooks/useForm'
import './SignUpPage.css'

function SignUpPage() {
  const navigate = useNavigate()
  const { signup, isLoading, setError: clearGlobalError } = useContext(GlobalContext)
  const [form, handleInputChange, resetForm] = useForm({ 
    name: '', 
    email: '', 
    password: '' 
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Limpa erros globais quando a página é montada
  useEffect(() => {
    clearGlobalError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateForm = () => {
    const errors = {}
    
    if (!form.name.trim()) {
      errors.name = 'Nome é obrigatório'
    } else if (form.name.trim().length < 3) {
      errors.name = 'Nome deve ter pelo menos 3 caracteres'
    }
    
    if (!form.email.trim()) {
      errors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Email inválido'
    }
    
    if (!form.password) {
      errors.password = 'Senha é obrigatória'
    } else if (form.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres'
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
      await signup(form)
      resetForm()
      clearGlobalError(null) // Garante que não há erro após sucesso
      navigate('/feed')
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar. Tente novamente.')
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-container">
        <h1>Cadastro</h1>
        <p className="subtitle">Junte-se à comunidade RetroRank</p>
        
        <form onSubmit={onSubmit} className="signup-form" aria-label="Formulário de cadastro">
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
              aria-required="true"
              aria-invalid={fieldErrors.name ? 'true' : 'false'}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              className={fieldErrors.name ? 'input-error' : ''}
            />
            {fieldErrors.name && (
              <span 
                id="name-error" 
                className="field-error" 
                role="alert"
                aria-live="polite"
              >
                {fieldErrors.name}
              </span>
            )}
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
              aria-required="true"
              aria-invalid={fieldErrors.email ? 'true' : 'false'}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className={fieldErrors.email ? 'input-error' : ''}
            />
            {fieldErrors.email && (
              <span 
                id="email-error" 
                className="field-error" 
                role="alert"
                aria-live="polite"
              >
                {fieldErrors.email}
              </span>
            )}
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
              aria-required="true"
              aria-invalid={fieldErrors.password ? 'true' : 'false'}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              className={fieldErrors.password ? 'input-error' : ''}
            />
            {fieldErrors.password && (
              <span 
                id="password-error" 
                className="field-error" 
                role="alert"
                aria-live="polite"
              >
                {fieldErrors.password}
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
            aria-label={isLoading ? 'Cadastrando...' : 'Criar conta'}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="login-link">
          Já tem uma conta? <a href="/login" aria-label="Ir para página de login">Faça login</a>
        </p>
      </div>
    </main>
  )
}

export default SignUpPage

