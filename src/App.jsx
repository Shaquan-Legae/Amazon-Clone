import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import Prime from './pages/Prime.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import NotFound from './pages/NotFound.jsx'
import { auth, isFirebaseConfigured } from './firebase.js'
import { useStateValue } from './StateProvider.js'
import { setupActivityTracking, setLastActiveTime, isSessionActive } from './utils/sessionPersistence.js'

function App() {
  const [{ basket, isDarkMode, wishlist }, dispatch] = useStateValue()

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      dispatch({
        type: 'SET_USER',
        user: null,
      })
      return undefined
    }

    // Set up global activity tracking
    const cleanupActivityTracking = setupActivityTracking(() => {
      // Activity callback - last active time is already updated in setupActivityTracking
    })

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is authenticated
        setLastActiveTime() // Update session timestamp when user state changes
        dispatch({
          type: 'SET_USER',
          user: {
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
          },
        })
      } else {
        // User is not authenticated
        dispatch({
          type: 'SET_USER',
          user: null,
        })
      }
    })

    return () => {
      unsubscribe()
      cleanupActivityTracking()
    }
  }, [dispatch])

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    window.localStorage.setItem('amazon_dark_mode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  useEffect(() => {
    window.localStorage.setItem('amazon_basket', JSON.stringify(basket))
  }, [basket])

  useEffect(() => {
    window.localStorage.setItem('amazon_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/prime" element={<Prime />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
