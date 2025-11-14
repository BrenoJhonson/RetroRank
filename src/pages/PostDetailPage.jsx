import { useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import useProtectedPage from '../hooks/useProtectedPage'
import CommentCard from '../components/CommentCard'
import CreateCommentForm from '../components/CreateCommentForm'
import Loading from '../components/Loading'
import './PostDetailPage.css'

function PostDetailPage() {
  useProtectedPage()
  const { id } = useParams()
  const navigate = useNavigate()
  const { postDetails, comments, getPostById, getComments, likePost, isLoading, error } = useContext(GlobalContext)

  useEffect(() => {
    if (id) {
      getPostById(id)
      getComments(id)
    }
  }, [id, getPostById, getComments])

  const handleLike = async () => {
    try {
      await likePost(id, true)
      await getPostById(id)
    } catch (error) {
      console.error('Erro ao dar like:', error)
    }
  }

  const handleDislike = async () => {
    try {
      await likePost(id, false)
      await getPostById(id)
    } catch (error) {
      console.error('Erro ao dar dislike:', error)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="post-detail-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => {
            if (id) {
              getPostById(id)
              getComments(id)
            }
          }}>
            Tentar novamente
          </button>
          <button className="back-button" onClick={() => navigate('/feed')}>
            Voltar para o Feed
          </button>
        </div>
      </div>
    )
  }

  if (!postDetails) {
    return (
      <div className="post-detail-page">
        <div className="error-container">
          <p className="error-message">Post não encontrado</p>
          <button className="back-button" onClick={() => navigate('/feed')}>
            Voltar para o Feed
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="post-detail-page">
      <button className="back-button" onClick={() => navigate('/feed')}>
        ← Voltar para o Feed
      </button>

      <div className="post-detail-card">
        <div className="post-header">
          <p className="post-author">Por: {postDetails.creatorName}</p>
        </div>
        <div className="post-content">
          <h2>{postDetails.title || 'Sem título'}</h2>
          <p className="post-text">{postDetails.content}</p>
        </div>
        <div className="post-footer">
          <div className="post-interactions">
            <button className="like-button" onClick={handleLike} type="button">
              👍 {postDetails.likes || 0}
            </button>
            <button className="dislike-button" onClick={handleDislike} type="button">
              👎 {postDetails.dislikes || 0}
            </button>
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h3>💬 Comentários ({comments.length})</h3>
        
        <CreateCommentForm />

        {comments.length === 0 ? (
          <p className="no-comments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetailPage

