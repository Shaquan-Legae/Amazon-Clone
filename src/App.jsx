import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigationType,
} from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
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
import {
  clearProductReturnLocation,
  isFreshReturnLocation,
  isMatchingReturnLocation,
  readProductReturnLocation,
} from './utils/productNavigation.js'
import { clearActivityTime, setupSessionTimeout } from './utils/sessionPersistence.js'

function SessionTimeoutController() {
  const [{ user }, dispatch] = useStateValue()
  const navigate = useNavigate()
  const [showWarning, setShowWarning] = useState(false)
  const userId = user?.uid

  useEffect(() => {
    if (!userId || !isFirebaseConfigured || !auth) {
      return undefined
    }

    const cleanupSessionTimeout = setupSessionTimeout({
      onWarningChange: setShowWarning,
      onTimeout: async () => {
        clearActivityTime()
        dispatch({
          type: 'SET_USER',
          user: null,
        })

        try {
          await signOut(auth)
        } catch {
          // Local state is already cleared; still send the user back to sign in.
        } finally {
          navigate('/login', { replace: true })
        }
      },
    })

    return cleanupSessionTimeout
  }, [dispatch, navigate, userId])

  if (!showWarning || !userId) {
    return null
  }

  return (
    <div className="sessionWarning" role="status" aria-live="polite">
      You will be logged out due to inactivity
    </div>
  )
}

function ProductReturnScrollRestorer() {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollToTop) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      })
      return undefined
    }

    const returnLocation = readProductReturnLocation()

    if (!returnLocation) {
      return undefined
    }

    if (!isFreshReturnLocation(returnLocation)) {
      clearProductReturnLocation()
      return undefined
    }

    if (!isMatchingReturnLocation(returnLocation, location)) {
      return undefined
    }

    if (navigationType !== 'POP') {
      clearProductReturnLocation()
      return undefined
    }

    const targetScrollY = Number(returnLocation.scrollY) || 0
    let animationFrameId = null
    let retryTimerId = null
    let attempts = 0

    const restoreScroll = () => {
      attempts += 1

      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      )
      const maxScrollY = Math.max(0, documentHeight - window.innerHeight)

      if (targetScrollY <= maxScrollY || attempts >= 12) {
        window.scrollTo({
          top: targetScrollY,
          left: 0,
          behavior: 'auto',
        })
        clearProductReturnLocation()
        return
      }

      retryTimerId = window.setTimeout(restoreScroll, 50)
    }

    animationFrameId = window.requestAnimationFrame(restoreScroll)

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }

      if (retryTimerId) {
        window.clearTimeout(retryTimerId)
      }
    }
  }, [location, navigationType])

  return null
}

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

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is authenticated
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
        <SessionTimeoutController />
        <ProductReturnScrollRestorer />
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
