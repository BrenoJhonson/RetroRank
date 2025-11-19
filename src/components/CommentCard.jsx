import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import { getCurrentUserId } from '../utils/auth'
import './CommentCard.css'

function CommentCard({ comment }) {
  const { id: postId } = useParams()
  const { deleteComment, getComments } = useContext(GlobalContext)
  const [isDeleting, setIsDeleting] = useState(false)
  const currentUserId = getCurrentUserId()
  const isOwner = comment.creatorId === currentUserId

  const handleDelete = async (event) => {
    event.stopPropagation()
    
    const confirmed = window.confirm(
      '⚠️ ATENÇÃO!\n\n' +
      'Tem certeza que deseja excluir este comentário?\n\n' +
      'Esta ação não pode ser desfeita.'
    )
    
    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteComment(comment.id, postId)
      // Recarregar comentários para atualizar a lista
      if (postId) {
        await getComments(postId)
      }
    } catch (error) {
      console.error('Erro ao deletar comentário:', error)
      alert(error.message || 'Erro ao deletar comentário. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-header-info">
          <p className="comment-author">{comment.creatorName}</p>
          <p className="comment-date">
            {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        {isOwner && (
          <button
            className="delete-comment-button"
            onClick={handleDelete}
            type="button"
            disabled={isDeleting}
            title="Excluir comentário"
          >
            {isDeleting ? 'Excluindo...' : 'Delete'}
          </button>
        )}
      </div>
      <div className="comment-content">
        <p>{comment.content}</p>
      </div>
    </div>
  )
}

export default CommentCard

