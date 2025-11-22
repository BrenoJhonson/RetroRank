import { useEffect, useContext, useState, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import useProtectedPage from '../hooks/useProtectedPage'
import useDebounce from '../hooks/useDebounce'
import { clearAuth } from '../utils/auth'
import PostCard from '../components/PostCard'
import CreatePostForm from '../components/CreatePostForm'
import Loading from '../components/Loading'
import './FeedPage.css'

const POSTS_PER_PAGE = 10
const SEARCH_DEBOUNCE_DELAY = 300

function FeedPage() {
  useProtectedPage()
  const navigate = useNavigate()
  const { posts, getPosts, isLoading, error } = useContext(GlobalContext)
  
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY)
  const [sortBy, setSortBy] = useState('recent') // 'recent', 'likes', 'comments'
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerTarget = useRef(null)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  useEffect(() => {
    getPosts()
  }, [getPosts])

  // Resetar contador quando busca ou ordenação mudar
  useEffect(() => {
    setVisiblePostsCount(POSTS_PER_PAGE)
  }, [debouncedSearchTerm, sortBy])

  // Filtrar e ordenar posts usando o termo de busca debounced
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts]

    // Filtro por busca (título, conteúdo ou autor) usando debouncedSearchTerm
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase()
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
  }, [posts, debouncedSearchTerm, sortBy])

  // Posts visíveis (para scroll infinito)
  const visiblePosts = useMemo(() => {
    return filteredAndSortedPosts.slice(0, visiblePostsCount)
  }, [filteredAndSortedPosts, visiblePostsCount])

  // Carregar mais posts
  const loadMorePosts = useCallback(() => {
    if (isLoadingMore || visiblePostsCount >= filteredAndSortedPosts.length) {
      return
    }

    setIsLoadingMore(true)
    // Simular um pequeno delay para melhor UX
    setTimeout(() => {
      setVisiblePostsCount(prev => Math.min(prev + POSTS_PER_PAGE, filteredAndSortedPosts.length))
      setIsLoadingMore(false)
    }, 300)
  }, [isLoadingMore, visiblePostsCount, filteredAndSortedPosts.length])

  // Intersection Observer para detectar quando chegar ao final
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && visiblePostsCount < filteredAndSortedPosts.length) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMorePosts, isLoadingMore, visiblePostsCount, filteredAndSortedPosts.length])

  return (
    <main className="feed-page">
      <header className="feed-header">
        <div>
          <h1>Feed RetroRank</h1>
          <p className="feed-subtitle">Explore os melhores posts sobre jogos clássicos</p>
        </div>
        <button 
          className="logout-button" 
          onClick={handleLogout}
          aria-label="Sair da conta"
        >
          Sair
        </button>
      </header>

      <CreatePostForm />

      {/* Barra de busca e filtros */}
      {!isLoading && !error && posts.length > 0 && (
        <div className="search-filters-container">
          <div className="search-bar">
            <label htmlFor="search-input" className="sr-only">Buscar posts</label>
            <input
              id="search-input"
              type="search"
              placeholder="Buscar posts, títulos ou autores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Buscar posts, títulos ou autores"
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
                aria-label="Limpar busca"
              >
                Limpar busca
              </button>
            )}
          </div>

          {debouncedSearchTerm && filteredAndSortedPosts.length !== posts.length && (
            <p className="filter-results" aria-live="polite" aria-atomic="true">
              Mostrando {filteredAndSortedPosts.length} de {posts.length} posts
              {searchTerm !== debouncedSearchTerm && (
                <span className="search-status"> (buscando...)</span>
              )}
            </p>
          )}
        </div>
      )}

      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="error-container" role="alert">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button" 
            onClick={() => getPosts()}
            aria-label="Tentar carregar posts novamente"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="posts-container">
          {filteredAndSortedPosts.length === 0 ? (
            <p className="no-posts">
              {debouncedSearchTerm
                ? 'Nenhum post encontrado com a busca aplicada.'
                : 'Nenhum post ainda. Seja o primeiro a compartilhar!'}
            </p>
          ) : (
            <>
              {visiblePosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
              
              {/* Elemento sentinela para scroll infinito */}
              {visiblePostsCount < filteredAndSortedPosts.length && (
                <div ref={observerTarget} className="scroll-sentinel">
                  {isLoadingMore && (
                    <div className="loading-more">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <p>Carregando mais posts...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Mensagem quando todos os posts foram carregados */}
              {visiblePostsCount >= filteredAndSortedPosts.length && filteredAndSortedPosts.length > POSTS_PER_PAGE && (
                <div className="all-posts-loaded">
                  <p>✨ Todos os posts foram carregados!</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  )
}

export default FeedPage

