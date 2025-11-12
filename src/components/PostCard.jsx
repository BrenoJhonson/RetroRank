import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../context/GlobalState'
import './PostCard.css'

function PostCard({ post }) {
  const navigate = useNavigate()
  const { likePost } = useContext(GlobalContext)

  const handleCardClick = () => {
    navigate(`/post/${post.id}`)
  }

  const handleLike = async (event) => {
    event.stopPropagation()
    try {
      await likePost(post.id, true)
    } catch (error) {
      console.error('Erro ao dar like:', error)
    }
  }

  const handleDislike = async (event) => {
    event.stopPropagation()
    try {
      await likePost(post.id, false)
    } catch (error) {
      console.error('Erro ao dar dislike:', error)
    }
  }

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-header">
        <p className="post-author">Por: {post.creatorName}</p>
      </div>
      <div className="post-content">
        <h3>{post.title || 'Sem título'}</h3>
        <p>{post.content}</p>
      </div>
      <div className="post-footer">
        <div className="post-interactions">
          <button 
            className="like-button" 
            onClick={handleLike}
            type="button"
          >
            👍 {post.likes || 0}
          </button>
          <button 
            className="dislike-button" 
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

