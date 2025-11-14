import './CommentCard.css'

function CommentCard({ comment }) {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <p className="comment-author">{comment.creatorName}</p>
        <p className="comment-date">
          {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <div className="comment-content">
        <p>{comment.content}</p>
      </div>
    </div>
  )
}

export default CommentCard

