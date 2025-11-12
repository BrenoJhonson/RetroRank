// API Mockada - Simula requisições HTTP usando LocalStorage

// Função auxiliar para simular delay de requisição
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Função auxiliar para obter dados do LocalStorage
const getStorageData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    return defaultValue
  }
}

// Função auxiliar para salvar dados no LocalStorage
const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar no LocalStorage:', error)
  }
}

// Função auxiliar para gerar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Inicializar dados mockados se não existirem
const initializeMockData = () => {
  const users = getStorageData('retrorank_users', [])
  const posts = getStorageData('retrorank_posts', [])
  const comments = getStorageData('retrorank_comments', [])

  // Criar usuário padrão se não existir
  if (users.length === 0) {
    const defaultUser = {
      id: '1',
      name: 'Gamer Retro',
      email: 'gamer@retro.com',
      password: '123456'
    }
    users.push(defaultUser)
    setStorageData('retrorank_users', users)
  }

  // Criar posts iniciais sobre jogos clássicos se não existirem
  if (posts.length === 0) {
    const initialPosts = [
      {
        id: '1',
        creatorId: '1',
        creatorName: 'Gamer Retro',
        title: 'Top 5 jogos do Super Nintendo',
        content: '1. Super Mario World - O clássico que definiu uma geração\n2. The Legend of Zelda: A Link to the Past - Uma aventura épica\n3. Chrono Trigger - RPG perfeito\n4. Super Metroid - Atmosfera única\n5. Donkey Kong Country - Gráficos revolucionários',
        likes: 42,
        dislikes: 2,
        commentsCount: 8,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        creatorId: '1',
        creatorName: 'Gamer Retro',
        title: 'Melhores trilhas sonoras de 8-bit',
        content: 'A música dos jogos 8-bit tem um charme único. Minhas favoritas:\n- Mega Man 2 (Dr. Wily Stage)\n- Castlevania (Vampire Killer)\n- Super Mario Bros (Overworld Theme)\n- The Legend of Zelda (Dungeon Theme)\n\nQual é a sua favorita?',
        likes: 35,
        dislikes: 1,
        commentsCount: 12,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        creatorId: '1',
        creatorName: 'Gamer Retro',
        title: 'Discussão: Qual o melhor Zelda?',
        content: 'Sempre há debate sobre qual é o melhor jogo da série Zelda. Para mim, A Link to the Past do SNES é imbatível, mas entendo quem prefere Ocarina of Time ou Breath of the Wild. O que vocês acham?',
        likes: 28,
        dislikes: 3,
        commentsCount: 15,
        createdAt: new Date().toISOString()
      }
    ]
    setStorageData('retrorank_posts', initialPosts)
  }

  if (comments.length === 0) {
    const initialComments = [
      {
        id: '1',
        postId: '1',
        creatorId: '1',
        creatorName: 'Gamer Retro',
        content: 'Super Mario World é realmente incrível!',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        postId: '1',
        creatorId: '1',
        creatorName: 'Gamer Retro',
        content: 'Concordo totalmente com essa lista!',
        createdAt: new Date().toISOString()
      }
    ]
    setStorageData('retrorank_comments', initialComments)
  }
}

// Inicializar dados na primeira importação
initializeMockData()

// Função de Login
export const login = async (body) => {
  await delay(800)
  
  const { email, password } = body
  const users = getStorageData('retrorank_users', [])
  
  const user = users.find(u => u.email === email && u.password === password)
  
  if (!user) {
    throw new Error('Email ou senha incorretos')
  }

  const token = `token_${user.id}_${Date.now()}`
  
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}

// Função de Cadastro
export const signup = async (body) => {
  await delay(800)
  
  const { name, email, password } = body
  const users = getStorageData('retrorank_users', [])
  
  // Verificar se email já existe
  const existingUser = users.find(u => u.email === email)
  if (existingUser) {
    throw new Error('Email já cadastrado')
  }

  // Criar novo usuário
  const newUser = {
    id: generateId(),
    name,
    email,
    password
  }
  
  users.push(newUser)
  setStorageData('retrorank_users', users)

  const token = `token_${newUser.id}_${Date.now()}`
  
  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  }
}

// Função para buscar todos os posts
export const getPosts = async () => {
  await delay(600)
  
  const posts = getStorageData('retrorank_posts', [])
  const comments = getStorageData('retrorank_comments', [])
  
  // Adicionar contagem de comentários
  return posts.map(post => ({
    ...post,
    commentsCount: comments.filter(c => c.postId === post.id).length
  }))
}

// Função para criar um novo post
export const createPost = async (body) => {
  await delay(800)
  
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Não autenticado')
  }

  // Extrair userId do token (simplificado)
  const userId = token.split('_')[1] || '1'
  const users = getStorageData('retrorank_users', [])
  const user = users.find(u => u.id === userId) || { name: 'Usuário' }

  const posts = getStorageData('retrorank_posts', [])
  
  const newPost = {
    id: generateId(),
    creatorId: userId,
    creatorName: user.name,
    title: body.title,
    content: body.content,
    likes: 0,
    dislikes: 0,
    commentsCount: 0,
    createdAt: new Date().toISOString()
  }
  
  posts.unshift(newPost) // Adicionar no início
  setStorageData('retrorank_posts', posts)
  
  return newPost
}

// Função para buscar post por ID
export const getPostById = async (id) => {
  await delay(600)
  
  const posts = getStorageData('retrorank_posts', [])
  const post = posts.find(p => p.id === id)
  
  if (!post) {
    throw new Error('Post não encontrado')
  }
  
  return post
}

// Função para buscar comentários de um post
export const getComments = async (postId) => {
  await delay(500)
  
  const comments = getStorageData('retrorank_comments', [])
  return comments.filter(c => c.postId === postId)
}

// Função para criar um comentário
export const createComment = async (postId, body) => {
  await delay(800)
  
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Não autenticado')
  }

  const userId = token.split('_')[1] || '1'
  const users = getStorageData('retrorank_users', [])
  const user = users.find(u => u.id === userId) || { name: 'Usuário' }

  const comments = getStorageData('retrorank_comments', [])
  const posts = getStorageData('retrorank_posts', [])
  
  const newComment = {
    id: generateId(),
    postId,
    creatorId: userId,
    creatorName: user.name,
    content: body.content,
    createdAt: new Date().toISOString()
  }
  
  comments.push(newComment)
  setStorageData('retrorank_comments', comments)

  // Atualizar contagem de comentários no post
  const post = posts.find(p => p.id === postId)
  if (post) {
    post.commentsCount = comments.filter(c => c.postId === postId).length
    setStorageData('retrorank_posts', posts)
  }
  
  return newComment
}

// Função para dar like/dislike em um post
export const likePost = async (postId, isLike) => {
  await delay(500)
  
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Não autenticado')
  }

  const posts = getStorageData('retrorank_posts', [])
  const post = posts.find(p => p.id === postId)
  
  if (!post) {
    throw new Error('Post não encontrado')
  }

  // Simular sistema de like/dislike simples
  if (isLike) {
    post.likes = (post.likes || 0) + 1
  } else {
    post.dislikes = (post.dislikes || 0) + 1
  }
  
  setStorageData('retrorank_posts', posts)
  
  return post
}
