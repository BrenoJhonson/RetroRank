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
    getPostById,
    getComments,
    createComment,
    likePost
  }

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

