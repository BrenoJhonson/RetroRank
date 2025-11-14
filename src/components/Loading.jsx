import './Loading.css'

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="pixel-dot"></div>
        <div className="pixel-dot"></div>
        <div className="pixel-dot"></div>
      </div>
      <p className="loading-text">Carregando...</p>
    </div>
  )
}

export default Loading

