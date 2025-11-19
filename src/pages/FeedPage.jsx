import { useEffect, useContext, useState, useMemo } from 'react'
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
  
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent') // 'recent', 'likes', 'comments'

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  useEffect(() => {
    getPosts()
  }, [getPosts])

  // Filtrar e ordenar posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts]

    // Filtro por busca (título, conteúdo ou autor)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.creatorName?.toLowerCase().includes(searchLower)
      )
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return (b.likes || 0) - (a.likes || 0)
        case 'comments':
          return (b.commentsCount || 0) - (a.commentsCount || 0)
        case 'recent':
        default:
          // Ordenar por data de criação (mais recente primeiro)
          const dateA = new Date(a.createdAt || 0)
          const dateB = new Date(b.createdAt || 0)
          return dateB - dateA
      }
    })

    return filtered
  }, [posts, searchTerm, sortBy])

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

      {/* Barra de busca e filtros */}
      {!isLoading && !error && posts.length > 0 && (
        <div className="search-filters-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Buscar posts, títulos ou autores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="sort-select">Ordenar por:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="recent">Mais recentes</option>
                <option value="likes">Mais curtidos</option>
                <option value="comments">Mais comentados</option>
              </select>
            </div>

            {searchTerm && (
              <button
                className="clear-filters-button"
                onClick={() => setSearchTerm('')}
              >
                Limpar busca
              </button>
            )}
          </div>

          {filteredAndSortedPosts.length !== posts.length && (
            <p className="filter-results">
              Mostrando {filteredAndSortedPosts.length} de {posts.length} posts
            </p>
          )}
        </div>
      )}

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
          {filteredAndSortedPosts.length === 0 ? (
            <p className="no-posts">
              {searchTerm
                ? 'Nenhum post encontrado com a busca aplicada.'
                : 'Nenhum post ainda. Seja o primeiro a compartilhar!'}
            </p>
          ) : (
            filteredAndSortedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default FeedPage

