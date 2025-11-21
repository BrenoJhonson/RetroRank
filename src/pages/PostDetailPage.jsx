import { useEffect, useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import { useToast } from '../context/ToastContext'
import useProtectedPage from '../hooks/useProtectedPage'
import { getUserPostInteraction } from '../services/api'
import { getCurrentUserId } from '../utils/auth'
import { formatRelativeTime, formatFullDateTime } from '../utils/dateFormatter'
import CommentCard from '../components/CommentCard'
import CreateCommentForm from '../components/CreateCommentForm'
import ConfirmDialog from '../components/ConfirmDialog'
import Loading from '../components/Loading'
import './PostDetailPage.css'

function PostDetailPage() {
  useProtectedPage()
  const { id } = useParams()
  const navigate = useNavigate()
  const { postDetails, comments, getPostById, getComments, getPosts, likePost, deletePost, updatePost, isLoading, error } = useContext(GlobalContext)
  const { showSuccess, showError } = useToast()
  const [userInteraction, setUserInteraction] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editError, setEditError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const currentUserId = getCurrentUserId()
  const isOwner = postDetails?.creatorId === currentUserId
  
  // Usar useState diretamente para ter controle total sobre os valores
  const [editForm, setEditForm] = useState({
    title: '',
    content: ''
  })
  
  const handleEditInputChange = (event) => {
    const { name, value } = event.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (id) {
      getPostById(id)
      getComments(id)
      const interaction = getUserPostInteraction(id)
      setUserInteraction(interaction)
    }
  }, [id, getPostById, getComments])

  // Atualizar formulário de edição quando postDetails mudar (apenas quando não estiver editando)
  useEffect(() => {
    if (postDetails && !isEditing) {
      setEditForm({
        title: postDetails.title || '',
        content: postDetails.content || ''
      })
    }
  }, [postDetails, isEditing])

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

  const handleDeleteClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false)
    setIsDeleting(true)
    try {
      await deletePost(id)
      showSuccess('Post excluído com sucesso!')
      navigate('/feed')
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

  const handleEdit = () => {
    // Carregar valores atuais do post no formulário antes de entrar no modo de edição
    if (postDetails) {
      // Atualizar o formulário diretamente com os valores atuais
      setEditForm({
        title: postDetails.title || '',
        content: postDetails.content || ''
      })
    }
    setIsEditing(true)
    setEditError('')
    setFieldErrors({})
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditError('')
    setFieldErrors({})
    // Restaurar valores originais do postDetails
    if (postDetails) {
      setEditForm({
        title: postDetails.title || '',
        content: postDetails.content || ''
      })
    }
  }

  const MIN_TITLE_LENGTH = 5
  const MIN_CONTENT_LENGTH = 10

  const getCharCountStatus = (current, min) => {
    if (current === 0) return 'empty'
    if (current < min) return 'invalid'
    if (current < min + 2) return 'warning'
    return 'valid'
  }

  const titleStatus = getCharCountStatus(editForm.title.trim().length, MIN_TITLE_LENGTH)
  const contentStatus = getCharCountStatus(editForm.content.trim().length, MIN_CONTENT_LENGTH)

  const validateEditForm = () => {
    const errors = {}

    if (!editForm.title.trim()) {
      errors.title = 'Título é obrigatório'
    } else if (editForm.title.trim().length < MIN_TITLE_LENGTH) {
      errors.title = `Título deve ter pelo menos ${MIN_TITLE_LENGTH} caracteres`
    }

    if (!editForm.content.trim()) {
      errors.content = 'Conteúdo é obrigatório'
    } else if (editForm.content.trim().length < MIN_CONTENT_LENGTH) {
      errors.content = `Conteúdo deve ter pelo menos ${MIN_CONTENT_LENGTH} caracteres`
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveEdit = async (event) => {
    event.preventDefault()
    setEditError('')
    setFieldErrors({})

    if (!validateEditForm()) {
      return
    }

    try {
      await updatePost(id, editForm)
      await getPostById(id)
      await getPosts()
      setIsEditing(false)
      showSuccess('Post editado com sucesso!')
    } catch (error) {
      console.error('Erro ao editar post:', error)
      setEditError(error.message || 'Erro ao editar post. Tente novamente.')
      showError(error.message || 'Erro ao editar post. Tente novamente.')
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
          <div className="post-header-info">
            <p className="post-author">Por: {postDetails.creatorName}</p>
            <div className="post-meta">
              <p className="post-date" title={postDetails.createdAt ? formatFullDateTime(postDetails.createdAt) : ''}>
                📅 {formatRelativeTime(postDetails.createdAt)}
              </p>
              {postDetails.updatedAt && postDetails.updatedAt !== postDetails.createdAt && (
                <span className="post-edited-badge" title={`Editado em ${formatFullDateTime(postDetails.updatedAt)}`}>
                  ✏️ Editado {formatRelativeTime(postDetails.updatedAt)}
                </span>
              )}
            </div>
          </div>
          {isOwner && !isEditing && (
            <div className="post-actions">
              <button
                className="edit-post-button"
                onClick={handleEdit}
                type="button"
                title="Editar post"
              >
                Editar
              </button>
              <button
                className="delete-post-button"
                onClick={handleDeleteClick}
                type="button"
                disabled={isDeleting}
                title="Excluir post"
              >
                {isDeleting ? 'Excluindo...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="edit-post-form">
            <div className="form-group">
              <label htmlFor="edit-title">Título</label>
              <input
                id="edit-title"
                name="title"
                type="text"
                value={editForm.title}
                onChange={handleEditInputChange}
                required
                className={fieldErrors.title ? 'input-error' : ''}
              />
              <div className={`char-counter char-counter-${titleStatus}`}>
                {editForm.title.trim().length}/{MIN_TITLE_LENGTH} caracteres mínimos
                {titleStatus === 'valid' && ' ✓'}
              </div>
              {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="edit-content">Conteúdo</label>
              <textarea
                id="edit-content"
                name="content"
                value={editForm.content}
                onChange={handleEditInputChange}
                rows="6"
                required
                className={fieldErrors.content ? 'input-error' : ''}
              />
              <div className={`char-counter char-counter-${contentStatus}`}>
                {editForm.content.trim().length}/{MIN_CONTENT_LENGTH} caracteres mínimos
                {contentStatus === 'valid' && ' ✓'}
              </div>
              {fieldErrors.content && <span className="field-error">{fieldErrors.content}</span>}
            </div>

            {editError && <p className="error-message">{editError}</p>}

            <div className="edit-form-actions">
              <button type="submit" className="save-button" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" className="cancel-button" onClick={handleCancelEdit}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="post-content">
            <h2>{postDetails.title || 'Sem título'}</h2>
            <p className="post-text">{postDetails.content}</p>
          </div>
        )}
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
    </div>
  )
}

export default PostDetailPage

