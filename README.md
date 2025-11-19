# 🎮 RetroRank: Comunidade de Jogos Clássicos

Uma aplicação de blog simplificada com tema retro, focada em nostalgia, engajamento e listas de ranking sobre jogos clássicos. Desenvolvida como projeto acadêmico para demonstrar conceitos de React, Hooks, Context API e React Router.

## 📋 Sobre o Projeto

O RetroRank é uma plataforma onde usuários podem compartilhar suas experiências e opiniões sobre jogos clássicos, criar posts sobre rankings (como "Top 5 jogos do Super Nintendo"), discutir trilhas sonoras de 8-bit e muito mais. Todas as funcionalidades são simuladas usando LocalStorage, sem necessidade de backend real.

## 🚀 Tecnologias Utilizadas

- **React 18.3.1** - Biblioteca JavaScript para construção de interfaces
- **React Router DOM 6.26.0** - Roteamento e navegação
- **Vite 5.4.2** - Build tool e dev server
- **Context API** - Gerenciamento de estado global
- **LocalStorage** - Persistência de dados (simulação de backend)
- **CSS3** - Estilização com tema retro/pixel art

## ✨ Funcionalidades

### 🔐 Autenticação
- **Login**: Autenticação com email e senha
- **Cadastro**: Criação de nova conta com nome, email e senha
- **Proteção de Rotas**: Páginas protegidas que redirecionam para login se não autenticado
- **Expiração de Token**: Sistema de expiração de sessão (24 horas)

### 📝 Posts
- **Feed**: Visualização de todos os posts da comunidade
- **Criar Post**: Formulário para criar novos posts com título e conteúdo
- **Detalhes do Post**: Página dedicada com informações completas do post
- **Like/Dislike**: Sistema de interação único (um usuário pode dar like OU dislike por post)
- **Contagem de Comentários**: Exibição do número de comentários em cada post

### 💬 Comentários
- **Listagem**: Visualização de todos os comentários de um post
- **Criar Comentário**: Adicionar comentários em posts
- **Autor**: Exibição do nome do autor de cada comentário

### 🎨 Interface
- **Tema Retro**: Design inspirado em jogos 8-bit/pixel art
- **Responsivo**: Adaptado para mobile, tablet e desktop
- **Loading States**: Indicadores visuais durante carregamento
- **Tratamento de Erros**: Mensagens de erro amigáveis com opção de retry
- **Validação de Formulários**: Validação client-side com feedback visual

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório ou navegue até a pasta do projeto:
```bash
cd RetroRank
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse a aplicação no navegador:
```
http://localhost:5173
```

## 🏗️ Estrutura do Projeto

```
RetroRank/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── CommentCard.jsx
│   │   ├── CreateCommentForm.jsx
│   │   ├── CreatePostForm.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Loading.jsx
│   │   └── PostCard.jsx
│   ├── pages/               # Páginas da aplicação
│   │   ├── FeedPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   └── SignUpPage.jsx
│   ├── hooks/               # Custom Hooks
│   │   ├── useForm.js
│   │   ├── useProtectedPage.js
│   │   └── useRequestData.js
│   ├── context/             # Context API
│   │   └── GlobalState.jsx
│   ├── services/            # API Mockada
│   │   └── api.js
│   ├── utils/               # Funções utilitárias
│   │   └── auth.js
│   ├── constants/           # Constantes
│   │   └── constants.js
│   ├── App.jsx              # Componente principal
│   ├── App.css
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos globais
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Como Usar

### Primeiro Acesso

1. Ao acessar a aplicação, você será redirecionado para a página de login
2. Use uma das contas pré-cadastradas ou crie uma nova conta

### Contas Pré-cadastradas

- **Email**: `gamer@retro.com` | **Senha**: `123456`
- **Email**: `pixel@retro.com` | **Senha**: `123456`
- **Email**: `nostalgia@retro.com` | **Senha**: `123456`
- **Email**: `collector@retro.com` | **Senha**: `123456`
- **Email**: `hero@retro.com` | **Senha**: `123456`

### Criar Nova Conta

1. Clique em "Cadastre-se" na página de login
2. Preencha nome, email e senha (mínimo 6 caracteres)
3. Após o cadastro, você será redirecionado para o Feed

### Usar o Feed

1. Visualize todos os posts da comunidade
2. Clique em um post para ver detalhes e comentários
3. Use os botões 👍 (like) ou 👎 (dislike) para interagir
4. Crie novos posts usando o formulário no topo do Feed
5. Use o botão "Sair" para fazer logout

### Comentar em Posts

1. Abra um post clicando nele
2. Role até a seção de comentários
3. Digite seu comentário (mínimo 3 caracteres)
4. Clique em "Comentar"

## 🔧 Custom Hooks

### `useForm`
Gerencia o estado de formulários com múltiplos campos.

```javascript
const [form, handleInputChange, resetForm] = useForm({
  email: '',
  password: ''
})
```

### `useProtectedPage`
Protege rotas, redirecionando para login se o usuário não estiver autenticado.

```javascript
function FeedPage() {
  useProtectedPage()
  // ... resto do componente
}
```

### `useRequestData`
Encapsula lógica de requisições HTTP (não utilizado no projeto atual, mas disponível).

## 🌐 Rotas

- `/` - Home (redireciona para feed ou login)
- `/login` - Página de login
- `/signup` - Página de cadastro
- `/feed` - Feed de posts (protegida)
- `/post/:id` - Detalhes do post (protegida)

## 💾 Persistência de Dados

Todos os dados são armazenados no **LocalStorage** do navegador:

- `retrorank_token` - Token de autenticação
- `retrorank_users` - Lista de usuários
- `retrorank_posts` - Lista de posts
- `retrorank_comments` - Lista de comentários
- `retrorank_user_interactions` - Interações de like/dislike por usuário

**Nota**: Os dados são locais ao navegador e serão perdidos se o LocalStorage for limpo.

## 🎨 Tema e Estilização

O projeto utiliza um tema retro inspirado em jogos 8-bit:
- Paleta de cores escuras com acentos vibrantes
- Gradientes e sombras para profundidade
- Tipografia legível com contraste adequado
- Animações suaves para feedback visual

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Desktop**: Layout completo com espaçamento otimizado
- **Tablet**: Ajustes de padding e fontes
- **Mobile**: Layout adaptado com elementos empilhados

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📝 Validações

### Login
- Email: obrigatório e formato válido
- Senha: obrigatória

### Cadastro
- Nome: obrigatório, mínimo 3 caracteres
- Email: obrigatório e formato válido
- Senha: obrigatória, mínimo 6 caracteres

### Criar Post
- Título: obrigatório, mínimo 5 caracteres
- Conteúdo: obrigatório, mínimo 10 caracteres

### Criar Comentário
- Conteúdo: obrigatório, mínimo 3 caracteres

## 🔒 Segurança

**Importante**: Este é um projeto acadêmico com funcionalidades simuladas. A autenticação e validações são apenas no front-end. Em um ambiente de produção, todas as validações e autenticação devem ser implementadas no backend.

## 📚 Conceitos Demonstrados

- ✅ React Hooks (useState, useEffect, useContext, useCallback)
- ✅ Custom Hooks
- ✅ Context API para estado global
- ✅ React Router DOM para navegação
- ✅ Formulários controlados
- ✅ Proteção de rotas
- ✅ Gerenciamento de estado
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ Validação de formulários
- ✅ Responsividade
- ✅ Persistência local (LocalStorage)

## 👨‍💻 Desenvolvido por

Projeto desenvolvido como trabalho acadêmico para demonstrar conhecimentos em React e desenvolvimento front-end.

## 📄 Licença

Este projeto é de uso educacional.

---

**RetroRank** - Revivendo a nostalgia dos jogos clássicos! 🎮✨
