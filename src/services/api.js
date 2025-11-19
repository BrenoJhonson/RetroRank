// API Mockada - Simula requisições HTTP usando LocalStorage

// Função auxiliar para simular delay de requisição
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Função auxiliar para obter dados do LocalStorage
const getStorageData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key)
    if (!data) {
      return defaultValue
    }
    const parsed = JSON.parse(data)
    return parsed || defaultValue
  } catch (error) {
    console.error(`Erro ao ler ${key} do LocalStorage:`, error)
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

  // Criar usuários padrão se não existirem
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: '1',
        name: 'Gamer Retro',
        email: 'gamer@retro.com',
        password: '123456'
      },
      {
        id: '2',
        name: 'PixelMaster',
        email: 'pixel@retro.com',
        password: '123456'
      },
      {
        id: '3',
        name: 'NostalgiaGamer',
        email: 'nostalgia@retro.com',
        password: '123456'
      },
      {
        id: '4',
        name: 'RetroCollector',
        email: 'collector@retro.com',
        password: '123456'
      },
      {
        id: '5',
        name: '8BitHero',
        email: 'hero@retro.com',
        password: '123456'
      }
    ]
    defaultUsers.forEach(user => users.push(user))
    setStorageData('retrorank_users', users)
  }

  // Criar posts iniciais sobre jogos clássicos se não existirem
  // Verifica se não há posts OU se há posts mas nenhum tem id '1' (primeiro post padrão)
  const hasInitialPosts = posts.length > 0 && posts.some(post => post.id === '1')
  if (!hasInitialPosts) {
    const now = Date.now()
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
        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 dias atrás
      },
      {
        id: '2',
        creatorId: '2',
        creatorName: 'PixelMaster',
        title: 'Melhores trilhas sonoras de 8-bit',
        content: 'A música dos jogos 8-bit tem um charme único. Minhas favoritas:\n- Mega Man 2 (Dr. Wily Stage)\n- Castlevania (Vampire Killer)\n- Super Mario Bros (Overworld Theme)\n- The Legend of Zelda (Dungeon Theme)\n\nQual é a sua favorita?',
        likes: 35,
        dislikes: 1,
        commentsCount: 12,
        createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 dia atrás
      },
      {
        id: '3',
        creatorId: '3',
        creatorName: 'NostalgiaGamer',
        title: 'Discussão: Qual o melhor Zelda?',
        content: 'Sempre há debate sobre qual é o melhor jogo da série Zelda. Para mim, A Link to the Past do SNES é imbatível, mas entendo quem prefere Ocarina of Time ou Breath of the Wild. O que vocês acham?',
        likes: 28,
        dislikes: 3,
        commentsCount: 15,
        createdAt: new Date(now - 18 * 60 * 60 * 1000).toISOString() // 18 horas atrás
      },
      {
        id: '4',
        creatorId: '4',
        creatorName: 'RetroCollector',
        title: 'Jogos do Mega Drive que todo mundo deveria jogar',
        content: 'O Sega Mega Drive (Genesis) tinha jogos incríveis! Minhas recomendações:\n\n- Sonic the Hedgehog 2: Velocidade e diversão pura\n- Streets of Rage 2: O melhor beat\'em up da época\n- Phantasy Star IV: RPG épico e emocionante\n- Gunstar Heroes: Ação frenética e criativa\n- Shining Force: Estratégia em turnos perfeita\n\nQual vocês já jogaram?',
        likes: 31,
        dislikes: 0,
        commentsCount: 9,
        createdAt: new Date(now - 12 * 60 * 60 * 1000).toISOString() // 12 horas atrás
      },
      {
        id: '5',
        creatorId: '5',
        creatorName: '8BitHero',
        title: 'A arte pixelada nunca envelhece',
        content: 'Alguém mais acha que os gráficos pixelados dos jogos antigos têm uma beleza atemporal? Cada pixel era colocado com cuidado, criando obras de arte que até hoje impressionam. Jogos como Final Fantasy VI, Secret of Mana e Chrono Trigger são verdadeiras galerias de arte interativas!',
        likes: 47,
        dislikes: 1,
        commentsCount: 18,
        createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString() // 8 horas atrás
      },
      {
        id: '6',
        creatorId: '2',
        creatorName: 'PixelMaster',
        title: 'Melhores jogos de plataforma do NES',
        content: 'O NES tinha os melhores jogos de plataforma! Minha lista:\n\n1. Super Mario Bros 3 - Perfeição absoluta\n2. Mega Man 2 - Desafio e diversão\n3. Castlevania - Atmosfera única\n4. Ninja Gaiden - Cutscenes revolucionárias\n5. DuckTales - Simplesmente incrível\n\nQual é o seu favorito?',
        likes: 39,
        dislikes: 2,
        commentsCount: 14,
        createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString() // 6 horas atrás
      },
      {
        id: '7',
        creatorId: '3',
        creatorName: 'NostalgiaGamer',
        title: 'Trilhas sonoras que marcaram nossa infância',
        content: 'As músicas dos jogos retrô são inesquecíveis! Algumas que me emocionam até hoje:\n\n- Green Hill Zone (Sonic)\n- Overworld Theme (Super Mario Bros)\n- Main Theme (The Legend of Zelda)\n- Stage 1 (Mega Man 2)\n- Bloody Tears (Castlevania)\n\nQual música te traz mais nostalgia?',
        likes: 52,
        dislikes: 0,
        commentsCount: 22,
        createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString() // 4 horas atrás
      },
      {
        id: '8',
        creatorId: '1',
        creatorName: 'Gamer Retro',
        title: 'RPGs clássicos que todo mundo deveria conhecer',
        content: 'Os RPGs dos anos 90 são obras-primas! Recomendo fortemente:\n\n- Chrono Trigger (SNES) - História e gameplay perfeitos\n- Final Fantasy VI (SNES) - Personagens inesquecíveis\n- EarthBound (SNES) - Humor e originalidade\n- Secret of Mana (SNES) - Aventura cooperativa\n- Phantasy Star IV (Mega Drive) - Sci-fi épico\n\nJá jogaram algum desses?',
        likes: 44,
        dislikes: 1,
        commentsCount: 16,
        createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString() // 2 horas atrás
      }
    ]
    setStorageData('retrorank_posts', initialPosts)
  }

  if (comments.length === 0) {
    const now = Date.now()
    const initialComments = [
      {
        id: '1',
        postId: '1',
        creatorId: '2',
        creatorName: 'PixelMaster',
        content: 'Super Mario World é realmente incrível! Definitivamente merece estar no topo.',
        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        postId: '1',
        creatorId: '3',
        creatorName: 'NostalgiaGamer',
        content: 'Concordo totalmente com essa lista! Chrono Trigger é uma obra-prima.',
        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        postId: '2',
        creatorId: '4',
        creatorName: 'RetroCollector',
        content: 'A trilha do Mega Man 2 é simplesmente perfeita! Dr. Wily Stage é épica!',
        createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        postId: '3',
        creatorId: '5',
        creatorName: '8BitHero',
        content: 'A Link to the Past é meu favorito também! A exploração é perfeita.',
        createdAt: new Date(now - 18 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        postId: '4',
        creatorId: '1',
        creatorName: 'Gamer Retro',
        content: 'Gunstar Heroes é um dos melhores jogos de ação que já joguei!',
        createdAt: new Date(now - 12 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString()
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
  
  // Garantir que os dados estão inicializados
  initializeMockData()
  
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

// Função para deletar um comentário
export const deleteComment = async (commentId) => {
  await delay(500)

  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Não autenticado')
  }

  const userId = token.split('_')[1] || '1'
  const comments = getStorageData('retrorank_comments', [])
  const comment = comments.find(c => c.id === commentId)

  if (!comment) {
    throw new Error('Comentário não encontrado')
  }

  // Verificar se o usuário é o dono do comentário
  if (comment.creatorId !== userId) {
    throw new Error('Você não tem permissão para deletar este comentário')
  }

  // Remover o comentário
  const updatedComments = comments.filter(c => c.id !== commentId)
  setStorageData('retrorank_comments', updatedComments)

  // Atualizar contagem de comentários no post
  const posts = getStorageData('retrorank_posts', [])
  const post = posts.find(p => p.id === comment.postId)
  if (post) {
    post.commentsCount = updatedComments.filter(c => c.postId === comment.postId).length
    setStorageData('retrorank_posts', posts)
  }

  return { success: true }
}

// Função para obter interações do usuário
const getUserInteractions = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return {}
  }
  
  // Extrair userId do token
  const userId = token.split('_')[1] || '1'
  const interactions = getStorageData('retrorank_user_interactions', {})
  
  return interactions[userId] || {}
}

// Função para salvar interações do usuário
const saveUserInteractions = (interactions) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return
  }
  
  const userId = token.split('_')[1] || '1'
  const allInteractions = getStorageData('retrorank_user_interactions', {})
  allInteractions[userId] = interactions
  setStorageData('retrorank_user_interactions', allInteractions)
}

// Função para obter a interação atual do usuário em um post
export const getUserPostInteraction = (postId) => {
  const userInteractions = getUserInteractions()
  return userInteractions[postId] || null // retorna 'like', 'dislike' ou null
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

  // Inicializar contadores se não existirem
  post.likes = post.likes || 0
  post.dislikes = post.dislikes || 0

  // Obter interação atual do usuário
  const userInteractions = getUserInteractions()
  const currentInteraction = userInteractions[postId] // 'like', 'dislike' ou undefined

  // Lógica de toggle
  if (currentInteraction === 'like') {
    // Se já deu like
    if (isLike) {
      // Clicou em like novamente: remover like
      post.likes = Math.max(0, post.likes - 1)
      delete userInteractions[postId]
    } else {
      // Clicou em dislike: remover like e adicionar dislike
      post.likes = Math.max(0, post.likes - 1)
      post.dislikes = (post.dislikes || 0) + 1
      userInteractions[postId] = 'dislike'
    }
  } else if (currentInteraction === 'dislike') {
    // Se já deu dislike
    if (isLike) {
      // Clicou em like: remover dislike e adicionar like
      post.dislikes = Math.max(0, post.dislikes - 1)
      post.likes = (post.likes || 0) + 1
      userInteractions[postId] = 'like'
    } else {
      // Clicou em dislike novamente: remover dislike
      post.dislikes = Math.max(0, post.dislikes - 1)
      delete userInteractions[postId]
    }
  } else {
    // Primeira interação: adicionar like ou dislike
    if (isLike) {
      post.likes = (post.likes || 0) + 1
      userInteractions[postId] = 'like'
    } else {
      post.dislikes = (post.dislikes || 0) + 1
      userInteractions[postId] = 'dislike'
    }
  }
  
  // Salvar posts e interações
  setStorageData('retrorank_posts', posts)
  saveUserInteractions(userInteractions)
  
  return post
}

// Função para deletar um post
export const deletePost = async (postId) => {
  await delay(500)

  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Não autenticado')
  }

  const userId = token.split('_')[1] || '1'
  const posts = getStorageData('retrorank_posts', [])
  const post = posts.find(p => p.id === postId)

  if (!post) {
    throw new Error('Post não encontrado')
  }

  // Verificar se o usuário é o dono do post
  if (post.creatorId !== userId) {
    throw new Error('Você não tem permissão para deletar este post')
  }

  // Remover o post
  const updatedPosts = posts.filter(p => p.id !== postId)
  setStorageData('retrorank_posts', updatedPosts)

  // Remover comentários do post
  const comments = getStorageData('retrorank_comments', [])
  const updatedComments = comments.filter(c => c.postId !== postId)
  setStorageData('retrorank_comments', updatedComments)

  // Remover interações do post
  const userInteractions = getUserInteractions()
  delete userInteractions[postId]
  saveUserInteractions(userInteractions)

  return { success: true }
}
