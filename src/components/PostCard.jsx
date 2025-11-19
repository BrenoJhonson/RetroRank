import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import { getUserPostInteraction } from '../services/api'
import { getCurrentUserId } from '../utils/auth'
import './PostCard.css'

function PostCard({ post }) {
  const navigate = useNavigate()
  const { likePost, getPosts, deletePost } = useContext(GlobalContext)
  const [userInteraction, setUserInteraction] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
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

  const handleDelete = async (event) => {
    event.stopPropagation()
    
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
      await deletePost(post.id)
      await getPosts()
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      alert(error.message || 'Erro ao deletar post. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-header">
        <p className="post-author">Por: {post.creatorName}</p>
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
  )
}

export default PostCard

