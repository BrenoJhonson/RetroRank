import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import { useToast } from '../context/ToastContext'
import { getUserPostInteraction } from '../services/api'
import { getCurrentUserId } from '../utils/auth'
import { formatRelativeTime } from '../utils/dateFormatter'
import ConfirmDialog from './ConfirmDialog'
import './PostCard.css'

function PostCard({ post }) {
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
      <div className="post-card" onClick={handleCardClick}>
        <div className="post-header">
          <div className="post-header-info">
            <p className="post-author">Por: {post.creatorName}</p>
            <p className="post-date" title={post.createdAt ? new Date(post.createdAt).toLocaleString('pt-BR') : ''}>
              {formatRelativeTime(post.createdAt)}
            </p>
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <span className="post-edited-badge" title={`Editado em ${new Date(post.updatedAt).toLocaleString('pt-BR')}`}>
                ✏️ Editado
              </span>
            )}
          </div>
          {isOwner && (
            <button
              className="delete-post-button"
              onClick={handleDeleteClick}
              type="button"
              disabled={isDeleting}
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
        <div className="post-interactions">
          <button 
            className={`like-button ${userInteraction === 'like' ? 'active' : ''}`}
            onClick={handleLike}
            type="button"
          >
            👍 {post.likes || 0}
          </button>
          <button 
            className={`dislike-button ${userInteraction === 'dislike' ? 'active' : ''}`}
            onClick={handleDislike}
            type="button"
          >
            👎 {post.dislikes || 0}
          </button>
        </div>
        <p className="post-comments">
          💬 {post.commentsCount || 0} comentários
        </p>
      </div>
    </div>

    <ConfirmDialog
      isOpen={showConfirmDialog}
      title="Excluir Post"
      message={`⚠️ ATENÇÃO!

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

