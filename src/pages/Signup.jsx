import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import googleLogo from '../assets/google.svg'
import logo from '../assets/logo.png'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase.js'
import { useStateValue } from '../StateProvider.js'
import { getAuthErrorMessage } from '../utils/authErrors.js'
import { setLastActiveTime } from '../utils/sessionPersistence.js'

function Signup() {
  const navigate = useNavigate()
  const [, dispatch] = useStateValue()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authAction, setAuthAction] = useState('')
  const canUseFirebase = isFirebaseConfigured && auth

  const register = async (event) => {
    event.preventDefault()
    setError('')
    const trimmedUsername = username.trim()

    if (!trimmedUsername) {
      setError('Enter a username to create your account.')
      return
    }

    if (!canUseFirebase) {
      setError('Add Firebase values to .env and restart the dev server to enable account creation.')
      return
    }

    setIsSubmitting(true)
    setAuthAction('signup')

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, {
        displayName: trimmedUsername,
      })
      dispatch({
        type: 'SET_USER',
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: trimmedUsername,
        },
      })
      setLastActiveTime() // Set session activity timestamp on successful signup
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
      setLastActiveTime()
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
        <img src={logo} alt="Amazon" />
      </Link>

      <section className="login__container">
        <h1>Create account</h1>
        <form onSubmit={register}>
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength="6"
            required
          />

          {error && <div className="auth__status" role="alert">{error}</div>}

          <button className="amazonButton login__signInButton" type="submit" disabled={isSubmitting}>
            {isSubmitting && authAction === 'signup' ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <button className="login__googleButton" type="button" onClick={signInWithGoogle} disabled={isSubmitting}>
          <img src={googleLogo} alt="" aria-hidden="true" />
          <span>{isSubmitting && authAction === 'google' ? 'Connecting Google...' : 'Continue with Google'}</span>
        </button>

        <p className="login__legal">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  )
}

export default Signup
