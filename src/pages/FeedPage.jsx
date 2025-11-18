import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import useProtectedPage from '../hooks/useProtectedPage'
import { clearAuth } from '../utils/auth'
import PostCard from '../components/PostCard'
import CreatePostForm from '../components/CreatePostForm'
import Loading from '../components/Loading'
import './FeedPage.css'

function FeedPage() {
  useProtectedPage()
  const navigate = useNavigate()
  const { posts, getPosts, isLoading, error } = useContext(GlobalContext)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  useEffect(() => {
    getPosts()
  }, [getPosts])

  return (
    <div className="feed-page">
      <div className="feed-header">
        <div>
          <h2>Feed RetroRank</h2>
          <p className="feed-subtitle">Explore os melhores posts sobre jogos clássicos</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <CreatePostForm />

      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => getPosts()}>
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="posts-container">
          {posts.length === 0 ? (
            <p className="no-posts">Nenhum post ainda. Seja o primeiro a compartilhar!</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default FeedPage

