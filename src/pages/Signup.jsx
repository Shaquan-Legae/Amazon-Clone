import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth, isFirebaseConfigured } from '../firebase.js'
import { getAuthErrorMessage } from '../utils/authErrors.js'
import { setLastActiveTime } from '../utils/sessionPersistence.js'

function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authAction, setAuthAction] = useState('')

  const register = async (event) => {
    event.preventDefault()
    setError('')

    if (!isFirebaseConfigured || !auth) {
      setError('Add Firebase values to .env and restart the dev server to enable account creation.')
      return
    }

    setIsSubmitting(true)
    setAuthAction('signup')

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setLastActiveTime() // Set session activity timestamp on successful signup
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
        amazon
      </Link>

      <section className="login__container">
        <h1>Create account</h1>
        <form onSubmit={register}>
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

        <p className="login__legal">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  )
}

export default Signup
