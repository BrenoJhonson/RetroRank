import { useEffect, useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import useProtectedPage from '../hooks/useProtectedPage'
import { getUserPostInteraction } from '../services/api'
import { getCurrentUserId } from '../utils/auth'
import CommentCard from '../components/CommentCard'
import CreateCommentForm from '../components/CreateCommentForm'
import Loading from '../components/Loading'
import './PostDetailPage.css'

function PostDetailPage() {
  useProtectedPage()
  const { id } = useParams()
  const navigate = useNavigate()
  const { postDetails, comments, getPostById, getComments, likePost, deletePost, isLoading, error } = useContext(GlobalContext)
  const [userInteraction, setUserInteraction] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const currentUserId = getCurrentUserId()
  const isOwner = postDetails?.creatorId === currentUserId

  useEffect(() => {
    if (id) {
      getPostById(id)
      getComments(id)
      const interaction = getUserPostInteraction(id)
      setUserInteraction(interaction)
    }
  }, [id, getPostById, getComments])

  const handleLike = async () => {
    try {
      await likePost(id, true)
      await getPostById(id)
      const newInteraction = getUserPostInteraction(id)
      setUserInteraction(newInteraction)
    } catch (error) {
      console.error('Erro ao dar like:', error)
    }
  }

  const handleDislike = async () => {
    try {
      await likePost(id, false)
      await getPostById(id)
      const newInteraction = getUserPostInteraction(id)
      setUserInteraction(newInteraction)
    } catch (error) {
      console.error('Erro ao dar dislike:', error)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      '⚠️ ATENÇÃO!\n\n' +
      'Tem certeza que deseja excluir este post?\n\n' +
      'Esta ação não pode ser desfeita e todos os comentários serão removidos permanentemente.'
    )
    
    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    try {
      await deletePost(id)
      navigate('/feed')
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      alert(error.message || 'Erro ao deletar post. Tente novamente.')
    } finally {
      setIsDeleting(false)
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
          {isOwner && (
            <button
              className="delete-post-button"
              onClick={handleDelete}
              type="button"
              disabled={isDeleting}
              title="Excluir post"
            >
              {isDeleting ? 'Excluindo...' : 'Delete'}
            </button>
          )}
        </div>
        <div className="post-content">
          <h2>{postDetails.title || 'Sem título'}</h2>
          <p className="post-text">{postDetails.content}</p>
        </div>
        <div className="post-footer">
          <div className="post-interactions">
            <button 
              className={`like-button ${userInteraction === 'like' ? 'active' : ''}`}
              onClick={handleLike} 
              type="button"
            >
              👍 {postDetails.likes || 0}
            </button>
            <button 
              className={`dislike-button ${userInteraction === 'dislike' ? 'active' : ''}`}
              onClick={handleDislike} 
              type="button"
            >
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

