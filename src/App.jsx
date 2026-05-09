import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Checkout from './pages/Checkout.jsx'
import NotFound from './pages/NotFound.jsx'
import { auth, isFirebaseConfigured } from './firebase.js'
import { useStateValue } from './StateProvider.js'

function App() {
  const [{ basket, isDarkMode }, dispatch] = useStateValue()

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      dispatch({
        type: 'SET_USER',
        user: null,
      })
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      dispatch({
        type: 'SET_USER',
        user: authUser
          ? {
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName,
            }
          : null,
      })
    })

    return unsubscribe
  }, [dispatch])

  useEffect(() => {
    document.body.dataset.theme = isDarkMode ? 'dark' : 'light'
    window.localStorage.setItem('amazon_dark_mode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  useEffect(() => {
    window.localStorage.setItem('amazon_basket', JSON.stringify(basket))
  }, [basket])

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
