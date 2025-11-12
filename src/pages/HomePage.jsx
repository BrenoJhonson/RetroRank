import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (token) {
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

