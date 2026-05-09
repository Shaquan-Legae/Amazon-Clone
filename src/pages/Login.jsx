import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase.js'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canUseFirebase = isFirebaseConfigured && auth

  const signIn = async (event) => {
    event.preventDefault()
    setError('')

    if (!canUseFirebase) {
      setError('Add Firebase values to .env and restart the dev server to enable authentication.')
      return
    }

    setIsSubmitting(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (authError) {
      setError(authError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const signInWithGoogle = async () => {
    setError('')

    if (!canUseFirebase || !googleProvider) {
      setError('Add Firebase values to .env and restart the dev server to enable Google sign-in.')
      return
    }

    setIsSubmitting(true)

    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (authError) {
      setError(authError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login">
      <Link to="/" className="login__logo" aria-label="Amazon home">
        amazon
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

          {error && <p className="login__error">{error}</p>}

          <button className="amazonButton login__signInButton" type="submit" disabled={isSubmitting}>
            Sign In
          </button>
        </form>

        <button className="login__googleButton" type="button" onClick={signInWithGoogle} disabled={isSubmitting}>
          Sign in with Google
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
