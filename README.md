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
- **Editar Post**: Edição de posts pelo autor (título e conteúdo)
- **Excluir Post**: Exclusão de posts pelo autor com confirmação
- **Detalhes do Post**: Página dedicada com informações completas do post
- **Like/Dislike**: Sistema de interação único (um usuário pode dar like OU dislike por post)
- **Contagem de Comentários**: Exibição do número de comentários em cada post
- **Busca e Filtros**: Busca por título, conteúdo ou autor com debounce
- **Ordenação**: Ordenar por mais recentes, mais curtidos ou mais comentados
- **Scroll Infinito**: Carregamento progressivo de posts ao rolar a página

### 💬 Comentários
- **Listagem**: Visualização de todos os comentários de um post
- **Criar Comentário**: Adicionar comentários em posts
- **Excluir Comentário**: Exclusão de comentários pelo autor com confirmação
- **Autor**: Exibição do nome do autor de cada comentário

### 🎨 Interface
- **Tema Retro**: Design inspirado em jogos 8-bit/pixel art
- **Responsivo**: Adaptado para mobile, tablet e desktop
- **Loading States**: Indicadores visuais durante carregamento
- **Tratamento de Erros**: Mensagens de erro amigáveis com opção de retry
- **Validação de Formulários**: Validação client-side com feedback visual
- **Toast Notifications**: Sistema de notificações toast para feedback de ações
- **Confirmação de Ações**: Diálogos de confirmação para ações destrutivas
- **Animações e Transições**: Animações suaves de entrada e transições em elementos
- **Formatação de Datas**: Tempo relativo ("há X tempo") com tooltip de data completa
- **Contadores de Caracteres**: Feedback visual de contagem de caracteres em formulários
- **Acessibilidade (A11y)**: ARIA attributes, navegação por teclado, HTML semântico

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
│   │   ├── ConfirmDialog.jsx
│   │   ├── CreateCommentForm.jsx
│   │   ├── CreatePostForm.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Loading.jsx
│   │   ├── PostCard.jsx
│   │   └── Toast.jsx
│   ├── pages/               # Páginas da aplicação
│   │   ├── FeedPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   └── SignUpPage.jsx
│   ├── hooks/               # Custom Hooks
│   │   ├── useDebounce.js
│   │   ├── useForm.js
│   │   └── useProtectedPage.js
│   ├── context/             # Context API
│   │   ├── GlobalState.jsx
│   │   └── ToastContext.jsx
│   ├── services/            # API Mockada
│   │   └── api.js
│   ├── utils/               # Funções utilitárias
│   │   ├── auth.js
│   │   └── dateFormatter.js
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
2. Use a barra de busca para filtrar posts por título, conteúdo ou autor
3. Selecione a ordenação desejada (Mais recentes, Mais curtidos, Mais comentados)
4. Clique em um post para ver detalhes e comentários
5. Use os botões "Gostei" ou "Não Gostei" para interagir
6. Crie novos posts usando o formulário no topo do Feed
7. Role a página para carregar mais posts automaticamente (scroll infinito)
8. Use o botão "Sair" para fazer logout

### Comentar em Posts

1. Abra um post clicando nele
2. Role até a seção de comentários
3. Digite seu comentário (mínimo 3 caracteres)
4. Clique em "Comentar"

### Editar e Excluir Posts

1. Abra um post que você criou
2. Clique no botão "Editar" para modificar título e conteúdo
3. Salve as alterações ou cancele a edição
4. Clique no botão "Delete" para excluir o post (com confirmação)

### Excluir Comentários

1. Em qualquer comentário que você criou, clique no botão "Delete"
2. Confirme a exclusão no diálogo de confirmação

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

### `useDebounce`
Otimiza performance ao atrasar a execução de funções até que o usuário pare de digitar.

```javascript
const debouncedValue = useDebounce(searchTerm, 300)
```

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
- Animações de entrada escalonadas para posts e comentários
- Transições suaves em hover e interações
- Efeitos ripple em botões
- Animações de loading aprimoradas

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
- Título: obrigatório, mínimo 5 caracteres (com contador visual)
- Conteúdo: obrigatório, mínimo 10 caracteres (com contador visual)

### Editar Post
- Título: obrigatório, mínimo 5 caracteres (com contador visual)
- Conteúdo: obrigatório, mínimo 10 caracteres (com contador visual)

### Criar Comentário
- Conteúdo: obrigatório, mínimo 3 caracteres (com contador visual)

## ♿ Acessibilidade

O projeto foi desenvolvido com foco em acessibilidade:

- **ARIA Attributes**: Labels, descrições e estados para screen readers
- **Navegação por Teclado**: Todos os elementos interativos são acessíveis via teclado
- **HTML Semântico**: Uso de `<main>`, `<article>`, `<section>`, `<header>`, `<time>`
- **Focus Visible**: Indicadores visuais claros para navegação por teclado
- **Screen Reader Support**: Textos alternativos e descrições para leitores de tela
- **Contraste**: Cores com contraste adequado para leitura
- **Feedback Visual**: Mensagens de erro e sucesso claramente identificadas

## 🔒 Segurança

**Importante**: Este é um projeto acadêmico com funcionalidades simuladas. A autenticação e validações são apenas no front-end. Em um ambiente de produção, todas as validações e autenticação devem ser implementadas no backend.

## 📚 Conceitos Demonstrados

- ✅ React Hooks (useState, useEffect, useContext, useCallback, useMemo, useRef)
- ✅ Custom Hooks (useForm, useProtectedPage, useDebounce)
- ✅ Context API para estado global (GlobalState, ToastContext)
- ✅ React Router DOM para navegação (useNavigate, useParams)
- ✅ Formulários controlados
- ✅ Proteção de rotas
- ✅ Gerenciamento de estado
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ Validação de formulários
- ✅ Responsividade
- ✅ Persistência local (LocalStorage)
- ✅ Debounce para otimização de performance
- ✅ Scroll infinito com Intersection Observer
- ✅ Sistema de notificações (Toast)
- ✅ Diálogos de confirmação
- ✅ Formatação de datas e tempo relativo
- ✅ Acessibilidade (ARIA, navegação por teclado, HTML semântico)
- ✅ Animações e transições CSS
- ✅ Contadores de caracteres com feedback visual

## 👨‍💻 Desenvolvido por

Projeto desenvolvido como trabalho acadêmico para demonstrar conhecimentos em React e desenvolvimento front-end.

## 📄 Licença

Este projeto é de uso educacional.

---

**RetroRank** - Revivendo a nostalgia dos jogos clássicos! 🎮✨
