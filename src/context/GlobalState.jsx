import { createContext, useState, useCallback } from 'react'
import * as api from '../services/api'
import { saveToken } from '../utils/auth'

export const GlobalContext = createContext()

export const GlobalState = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [postDetails, setPostDetails] = useState(null)
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Função de Login
  const login = async (body) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.login(body)
      saveToken(response.token)
      setIsLoading(false)
      return response
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }

  // Função de Cadastro
  const signup = async (body) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.signup(body)
      saveToken(response.token)
      setIsLoading(false)
      return response
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }

  // Função para buscar todos os posts
  const getPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.getPosts()
      setPosts(response)
      setIsLoading(false)
      return response
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }, [])

  // Função para criar um novo post
  const createPost = useCallback(async (body) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.createPost(body)
      setPosts(prevPosts => [response, ...prevPosts])
      setIsLoading(false)
      return response
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }, [])

  // Função para atualizar um post
  const updatePost = useCallback(async (postId, body) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.updatePost(postId, body)
      // Atualiza o post na lista de posts
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return response
        }
        return post
      }))
      // Atualiza também o postDetails se estiver visualizando
      setPostDetails(prevDetails => {
        if (prevDetails && prevDetails.id === postId) {
          return response
        }
        return prevDetails
      })
      setIsLoading(false)
      return response
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }, [])

  // Função para buscar detalhes de um post
  const getPostById = useCallback(async (id) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.getPostById(id)
      setPostDetails(response)
      setIsLoading(false)
      return response
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }, [])

  // Função para buscar comentários de um post
  const getComments = useCallback(async (postId) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.getComments(postId)
      setComments(response)
      setIsLoading(false)
      return response
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }, [])

  // Função para criar um comentário
  const createComment = useCallback(async (postId, body) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.createComment(postId, body)
      setComments(prevComments => [...prevComments, response])
      setIsLoading(false)
      return response
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }, [])

  // Função para deletar um comentário
  const deleteComment = useCallback(async (commentId, postId) => {
    setIsLoading(true)
    setError(null)
    try {
      await api.deleteComment(commentId)
      // Remove o comentário da lista
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId))
      // Atualiza a contagem de comentários no post
      if (postId) {
        await getPostById(postId)
        await getPosts()
      }
      setIsLoading(false)
      return { success: true }
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }, [getPostById, getPosts])

  // Função para dar like em um post
  const likePost = useCallback(async (postId, isLike) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.likePost(postId, isLike)
      // Atualiza o post na lista de posts usando forma funcional
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return response
        }
        return post
      }))
      // Atualiza também o postDetails se estiver visualizando
      setPostDetails(prevDetails => {
        if (prevDetails && prevDetails.id === postId) {
          return response
        }
        return prevDetails
      })
      setIsLoading(false)
      return response
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }, [])

  // Função para deletar um post
  const deletePost = useCallback(async (postId) => {
    setIsLoading(true)
    setError(null)
    try {
      await api.deletePost(postId)
      // Remove o post da lista
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
      // Limpa postDetails se estiver visualizando o post deletado
      setPostDetails(prevDetails => {
        if (prevDetails && prevDetails.id === postId) {
          return null
        }
        return prevDetails
      })
      setIsLoading(false)
      return { success: true }
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      throw err
    }
  }, [])

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
    setError,
    login,
    signup,
    getPosts,
    createPost,
    updatePost,
    getPostById,
    getComments,
    createComment,
    deleteComment,
    likePost,
    deletePost
  }

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

