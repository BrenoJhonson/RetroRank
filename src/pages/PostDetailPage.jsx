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
        <div className="error-container" role="alert">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button" 
            onClick={() => {
              if (id) {
                getPostById(id)
                getComments(id)
              }
            }}
            aria-label="Tentar carregar post novamente"
          >
            Tentar novamente
          </button>
          <button 
            className="back-button" 
            onClick={() => navigate('/feed')}
            aria-label="Voltar para o Feed"
          >
            Voltar para o Feed
          </button>
        </div>
      </div>
    )
  }

  if (!postDetails) {
    return (
      <div className="post-detail-page">
        <div className="error-container" role="alert">
          <p className="error-message">Post não encontrado</p>
          <button 
            className="back-button" 
            onClick={() => navigate('/feed')}
            aria-label="Voltar para o Feed"
          >
            Voltar para o Feed
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="post-detail-page">
      <button 
        className="back-button" 
        onClick={() => navigate('/feed')}
        aria-label="Voltar para o Feed"
      >
        ← Voltar para o Feed
      </button>

      <article className="post-detail-card" aria-label={`Post: ${postDetails.title || 'Sem título'}`}>
        <div className="post-header">
          <div className="post-header-info">
            <p className="post-author">Por: {postDetails.creatorName}</p>
            <div className="post-meta">
              <time 
                className="post-date" 
                dateTime={postDetails.createdAt}
                title={postDetails.createdAt ? formatFullDateTime(postDetails.createdAt) : ''}
              >
                {formatRelativeTime(postDetails.createdAt)}
              </time>
              {postDetails.updatedAt && postDetails.updatedAt !== postDetails.createdAt && (
                <span 
                  className="post-edited-badge" 
                  title={`Editado em ${formatFullDateTime(postDetails.updatedAt)}`}
                  aria-label={`Post editado em ${formatRelativeTime(postDetails.updatedAt)}`}
                >
                  Editado {formatRelativeTime(postDetails.updatedAt)}
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
                aria-label={`Editar post: ${postDetails.title || 'Sem título'}`}
                title="Editar post"
              >
                Editar
              </button>
              <button
                className="delete-post-button"
                onClick={handleDeleteClick}
                type="button"
                disabled={isDeleting}
                aria-label={isDeleting ? 'Excluindo post...' : `Excluir post: ${postDetails.title || 'Sem título'}`}
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
                aria-required="true"
                aria-invalid={fieldErrors.title ? 'true' : 'false'}
                aria-describedby={fieldErrors.title ? 'edit-title-error edit-title-counter' : 'edit-title-counter'}
                className={fieldErrors.title ? 'input-error' : ''}
              />
              <div 
                id="edit-title-counter" 
                className={`char-counter char-counter-${titleStatus}`}
                aria-live="polite"
                aria-atomic="true"
              >
                {editForm.title.trim().length}/{MIN_TITLE_LENGTH} caracteres mínimos
                {titleStatus === 'valid' && ' ✓'}
              </div>
              {fieldErrors.title && (
                <span 
                  id="edit-title-error" 
                  className="field-error" 
                  role="alert"
                  aria-live="polite"
                >
                  {fieldErrors.title}
                </span>
              )}
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
                aria-required="true"
                aria-invalid={fieldErrors.content ? 'true' : 'false'}
                aria-describedby={fieldErrors.content ? 'edit-content-error edit-content-counter' : 'edit-content-counter'}
                className={fieldErrors.content ? 'input-error' : ''}
              />
              <div 
                id="edit-content-counter" 
                className={`char-counter char-counter-${contentStatus}`}
                aria-live="polite"
                aria-atomic="true"
              >
                {editForm.content.trim().length}/{MIN_CONTENT_LENGTH} caracteres mínimos
                {contentStatus === 'valid' && ' ✓'}
              </div>
              {fieldErrors.content && (
                <span 
                  id="edit-content-error" 
                  className="field-error" 
                  role="alert"
                  aria-live="polite"
                >
                  {fieldErrors.content}
                </span>
              )}
            </div>

            {editError && (
              <div className="error-message" role="alert" aria-live="assertive">
                {editError}
              </div>
            )}

            <div className="edit-form-actions">
              <button 
                type="submit" 
                className="save-button" 
                disabled={isLoading}
                aria-label={isLoading ? 'Salvando alterações...' : 'Salvar alterações do post'}
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={handleCancelEdit}
                aria-label="Cancelar edição do post"
              >
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
              aria-label={`Gostei. ${postDetails.likes || 0} ${postDetails.likes === 1 ? 'curtida' : 'curtidas'}. ${userInteraction === 'like' ? 'Você já curtiu este post' : 'Clique para curtir'}`}
              aria-pressed={userInteraction === 'like'}
            >
              Gostei {postDetails.likes || 0}
            </button>
            <button 
              className={`dislike-button ${userInteraction === 'dislike' ? 'active' : ''}`}
              onClick={handleDislike}
              type="button"
              aria-label={`Não Gostei. ${postDetails.dislikes || 0} ${postDetails.dislikes === 1 ? 'não curtida' : 'não curtidas'}. ${userInteraction === 'dislike' ? 'Você já não curtiu este post' : 'Clique para não curtir'}`}
              aria-pressed={userInteraction === 'dislike'}
            >
              Não Gostei {postDetails.dislikes || 0}
            </button>
          </div>
        </div>
      </article>

      <section className="comments-section" aria-labelledby="comments-title">
        <h3 id="comments-title">Comentários ({comments.length})</h3>
        
        <CreateCommentForm />

        {comments.length === 0 ? (
          <p className="no-comments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        ) : (
          <div className="comments-list">
            {comments.map((comment, index) => (
              <CommentCard key={comment.id} comment={comment} index={index} />
            ))}
          </div>
        )}
      </section>

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
    </main>
  )
}

export default PostDetailPage

