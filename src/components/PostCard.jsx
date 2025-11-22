import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import { useToast } from '../context/ToastContext'
import { getUserPostInteraction } from '../services/api'
import { getCurrentUserId } from '../utils/auth'
import { formatRelativeTime } from '../utils/dateFormatter'
import ConfirmDialog from './ConfirmDialog'
import './PostCard.css'

function PostCard({ post, index = 0 }) {
  const navigate = useNavigate()
  const { likePost, getPosts, deletePost } = useContext(GlobalContext)
  const { showSuccess, showError } = useToast()
  const [userInteraction, setUserInteraction] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const currentUserId = getCurrentUserId()
  const isOwner = post.creatorId === currentUserId

  useEffect(() => {
    const interaction = getUserPostInteraction(post.id)
    setUserInteraction(interaction)
  }, [post.id])

  const handleCardClick = () => {
    navigate(`/post/${post.id}`)
  }

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate(`/post/${post.id}`)
    }
  }

  const handleLike = async (event) => {
    event.stopPropagation()
    try {
      await likePost(post.id, true)
      const newInteraction = getUserPostInteraction(post.id)
      setUserInteraction(newInteraction)
      // Atualizar lista de posts para refletir mudanças
      await getPosts()
    } catch (error) {
      console.error('Erro ao dar like:', error)
    }
  }

  const handleDislike = async (event) => {
    event.stopPropagation()
    try {
      await likePost(post.id, false)
      const newInteraction = getUserPostInteraction(post.id)
      setUserInteraction(newInteraction)
      // Atualizar lista de posts para refletir mudanças
      await getPosts()
    } catch (error) {
      console.error('Erro ao dar dislike:', error)
    }
  }

  const handleDeleteClick = (event) => {
    event.stopPropagation()
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false)
    setIsDeleting(true)
    try {
      await deletePost(post.id)
      await getPosts()
      showSuccess('Post excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      showError(error.message || 'Erro ao deletar post. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmDialog(false)
  }

  return (
    <>
      <article 
        className="post-card" 
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        tabIndex={0}
        role="article"
        aria-label={`Post: ${post.title || 'Sem título'} por ${post.creatorName}`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="post-header">
          <div className="post-header-info">
            <p className="post-author">Por: {post.creatorName}</p>
            <time 
              className="post-date" 
              dateTime={post.createdAt}
              title={post.createdAt ? new Date(post.createdAt).toLocaleString('pt-BR') : ''}
            >
              {formatRelativeTime(post.createdAt)}
            </time>
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <span 
                className="post-edited-badge" 
                title={`Editado em ${new Date(post.updatedAt).toLocaleString('pt-BR')}`}
                aria-label={`Post editado em ${formatRelativeTime(post.updatedAt)}`}
              >
                Editado
              </span>
            )}
          </div>
          {isOwner && (
            <button
              className="delete-post-button"
              onClick={handleDeleteClick}
              type="button"
              disabled={isDeleting}
              aria-label={isDeleting ? 'Excluindo post...' : `Excluir post: ${post.title || 'Sem título'}`}
              title="Excluir post"
            >
              {isDeleting ? 'Excluindo...' : 'Delete'}
            </button>
          )}
        </div>
        <div className="post-content">
          <h3>{post.title || 'Sem título'}</h3>
          <p>{post.content}</p>
        </div>
        <div className="post-footer">
          <div className="post-interactions" role="group" aria-label="Interações do post">
            <button 
              className={`like-button ${userInteraction === 'like' ? 'active' : ''}`}
              onClick={handleLike}
              type="button"
              aria-label={`Gostei. ${post.likes || 0} ${post.likes === 1 ? 'curtida' : 'curtidas'}. ${userInteraction === 'like' ? 'Você já curtiu este post' : 'Clique para curtir'}`}
              aria-pressed={userInteraction === 'like'}
            >
              Gostei {post.likes || 0}
            </button>
            <button 
              className={`dislike-button ${userInteraction === 'dislike' ? 'active' : ''}`}
              onClick={handleDislike}
              type="button"
              aria-label={`Não Gostei. ${post.dislikes || 0} ${post.dislikes === 1 ? 'não curtida' : 'não curtidas'}. ${userInteraction === 'dislike' ? 'Você já não curtiu este post' : 'Clique para não curtir'}`}
              aria-pressed={userInteraction === 'dislike'}
            >
              Não Gostei {post.dislikes || 0}
            </button>
          </div>
          <p className="post-comments" aria-label={`${post.commentsCount || 0} ${post.commentsCount === 1 ? 'comentário' : 'comentários'}`}>
            {post.commentsCount || 0} comentários
          </p>
        </div>
      </article>

    <ConfirmDialog
      isOpen={showConfirmDialog}
      title="Excluir Post"
      message={`ATENÇÃO!

Tem certeza que deseja excluir este post?

Esta ação não pode ser desfeita e todos os comentários serão removidos permanentemente.`}
      onConfirm={handleConfirmDelete}
      onCancel={handleCancelDelete}
      confirmText="Excluir"
      cancelText="Cancelar"
      type="danger"
    />
    </>
  )
}

export default PostCard

