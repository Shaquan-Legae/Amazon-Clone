import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import amazonLogo from '../assets/amazon.svg'
import amazonLightLogo from '../assets/amazon_light.svg'
import googleLogo from '../assets/google.svg'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase.js'
import { useStateValue } from '../StateProvider.js'
import { getAuthErrorMessage } from '../utils/authErrors.js'
import { setLastActiveTime } from '../utils/sessionPersistence.js'

function Login() {
  const navigate = useNavigate()
  const [{ isDarkMode }] = useStateValue()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authAction, setAuthAction] = useState('')

  const canUseFirebase = isFirebaseConfigured && auth
  const authLogo = isDarkMode ? amazonLogo : amazonLightLogo

  const signIn = async (event) => {
    event.preventDefault()
    setError('')

    if (!canUseFirebase) {
      setError('Add Firebase values to .env and restart the dev server to enable authentication.')
      return
    }

    setIsSubmitting(true)
    setAuthAction('signIn')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setLastActiveTime() // Set session activity timestamp on successful login
      navigate('/')
    } catch (authError) {
      setError(getAuthErrorMessage(authError.code))
    } finally {
      setIsSubmitting(false)
      setAuthAction('')
    }
  }

  const signInWithGoogle = async () => {
    setError('')

    if (!canUseFirebase || !googleProvider) {
      setError('Add Firebase values to .env and restart the dev server to enable Google sign-in.')
      return
    }

    setIsSubmitting(true)
    setAuthAction('google')

    try {
      await signInWithPopup(auth, googleProvider)
      setLastActiveTime() // Set session activity timestamp on successful Google sign-in
      navigate('/')
    } catch (authError) {
      setError(getAuthErrorMessage(authError.code))
    } finally {
      setIsSubmitting(false)
      setAuthAction('')
    }
  }

  return (
    <main className="login">
      <Link to="/" className="login__logo" aria-label="Amazon home">
        <img src={authLogo} alt="Amazon" />
      </Link>

      <section className="login__container">
        <h1>Sign in</h1>
        <form onSubmit={signIn}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <div className="auth__status" role="alert">{error}</div>}

          <button className="amazonButton login__signInButton" type="submit" disabled={isSubmitting}>
            {isSubmitting && authAction === 'signIn' ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button className="login__googleButton" type="button" onClick={signInWithGoogle} disabled={isSubmitting}>
          <img src={googleLogo} alt="" aria-hidden="true" />
          <span>{isSubmitting && authAction === 'google' ? 'Connecting Google...' : 'Continue with Google'}</span>
        </button>

        <p className="login__legal">
          By signing in you agree to the conditions of use and privacy notice.
        </p>

        <Link className="login__registerButton" to="/signup">
          Create your account
        </Link>
      </section>
    </main>
  )
}

export default Login
