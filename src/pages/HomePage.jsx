import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isTokenValid } from '../utils/auth'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isTokenValid()) {
      navigate('/feed')
    } else {
      navigate('/login')
    }
  }, [navigate])

  return (
    <div className="home-page">
      <div className="loading-container">
        <p>Carregando...</p>
      </div>
    </div>
  )
}

export default HomePage

