import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="notFound">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link className="amazonButton notFound__button" to="/">
        Back to Home
      </Link>
    </main>
  )
}

export default NotFound
