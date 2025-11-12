import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalState } from './context/GlobalState'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import FeedPage from './pages/FeedPage'
import './App.css'

function App() {
  return (
    <GlobalState>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/feed" element={<FeedPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </GlobalState>
  )
}

export default App

