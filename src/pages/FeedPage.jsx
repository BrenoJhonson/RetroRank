import { useEffect, useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import useProtectedPage from '../hooks/useProtectedPage'
import PostCard from '../components/PostCard'
import CreatePostForm from '../components/CreatePostForm'
import Loading from '../components/Loading'
import './FeedPage.css'

function FeedPage() {
  useProtectedPage()
  const { posts, getPosts, isLoading } = useContext(GlobalContext)

  useEffect(() => {
    getPosts()
  }, [getPosts])

  useEffect(() => {
    console.log('Estado atual - isLoading:', isLoading, 'posts:', posts.length)
  }, [isLoading, posts.length])

  return (
    <div className="feed-page">
      <h2>🎮 Feed RetroRank</h2>
      <p className="feed-subtitle">Explore os melhores posts sobre jogos clássicos</p>

      <CreatePostForm />

      {isLoading ? (
        <Loading />
      ) : (
        <div className="posts-container">
          {posts.length === 0 ? (
            <p className="no-posts">Nenhum post ainda. Seja o primeiro a compartilhar!</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default FeedPage

