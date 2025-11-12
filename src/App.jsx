import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalState } from './context/GlobalState'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <GlobalState>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </GlobalState>
  )
}

export default App

