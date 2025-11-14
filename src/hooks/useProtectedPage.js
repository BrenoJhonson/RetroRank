import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isTokenValid } from '../utils/auth'

function useProtectedPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/login')
    }
  }, [navigate])
}

export default useProtectedPage

