import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import { useToast } from '../context/ToastContext'
import { getCurrentUserId } from '../utils/auth'
import ConfirmDialog from './ConfirmDialog'
import './CommentCard.css'

function CommentCard({ comment }) {
  const { id: postId } = useParams()
  const { deleteComment, getComments } = useContext(GlobalContext)
  const { showSuccess, showError } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const currentUserId = getCurrentUserId()
  const isOwner = comment.creatorId === currentUserId

  const handleDeleteClick = (event) => {
    event.stopPropagation()
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false)
    setIsDeleting(true)
    try {
      await deleteComment(comment.id, postId)
      // Recarregar comentários para atualizar a lista
      if (postId) {
        await getComments(postId)
      }
      showSuccess('Comentário excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar comentário:', error)
      showError(error.message || 'Erro ao deletar comentário. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirmDialog(false)
  }

  return (
    <>
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
              onClick={handleDeleteClick}
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

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Excluir Comentário"
        message={`⚠️ ATENÇÃO!

Tem certeza que deseja excluir este comentário?

Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </>
  )
}

export default CommentCard

