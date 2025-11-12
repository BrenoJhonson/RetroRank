import { createContext, useState } from 'react'

export const GlobalContext = createContext()

export const GlobalState = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [postDetails, setPostDetails] = useState(null)
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const contextValue = {
    posts,
    setPosts,
    postDetails,
    setPostDetails,
    comments,
    setComments,
    isLoading,
    setIsLoading,
    error,
    setError
  }

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

