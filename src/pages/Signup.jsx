import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth, isFirebaseConfigured } from '../firebase.js'

function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const register = async (event) => {
    event.preventDefault()
    setError('')

    if (!isFirebaseConfigured || !auth) {
      setError('Add Firebase values to .env and restart the dev server to enable account creation.')
      return
    }

    setIsSubmitting(true)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
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

          {error && <p className="login__error">{error}</p>}

          <button className="amazonButton login__signInButton" type="submit" disabled={isSubmitting}>
            Create account
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
