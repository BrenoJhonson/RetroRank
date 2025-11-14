import { STORAGE_KEYS, TOKEN_EXPIRATION_TIME } from '../constants/constants'

// Verifica se o token existe e não expirou
export const isTokenValid = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  const tokenTimestamp = localStorage.getItem(STORAGE_KEYS.TOKEN_TIMESTAMP)

  if (!token || !tokenTimestamp) {
    return false
  }

  const now = Date.now()
  const timestamp = parseInt(tokenTimestamp, 10)
  const elapsed = now - timestamp

  // Se passou mais tempo que o permitido, token expirou
  if (elapsed > TOKEN_EXPIRATION_TIME) {
    // Limpar token expirado
    clearAuth()
    return false
  }

  return true
}

// Salva o token e o timestamp
export const saveToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  localStorage.setItem(STORAGE_KEYS.TOKEN_TIMESTAMP, Date.now().toString())
}

// Limpa os dados de autenticação
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.TOKEN_TIMESTAMP)
}

