import DarkModeIcon from '@mui/icons-material/DarkMode'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import { signOut } from 'firebase/auth'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../assets/logo.png'
import { auth, isFirebaseConfigured } from '../firebase.js'
import { useStateValue } from '../StateProvider.js'
import { clearActivityTime } from '../utils/sessionPersistence.js'

function Header() {
  const [{ basket, isDarkMode, user }, dispatch] = useStateValue()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' })
  }

  const getUserName = () => {
    if (!user) {
      return 'Guest'
    }

    if (user.displayName) {
      return user.displayName.split(' ')[0]
    }

    const emailName = user.email?.split('@')[0] || 'Customer'
    return emailName.charAt(0).toUpperCase() + emailName.slice(1)
  }

  const handleAuthentication = async () => {
    if (user && isFirebaseConfigured && auth) {
      clearActivityTime() // Clear session activity timestamp on logout
      await signOut(auth)
      navigate('/')
      return
    }

    if (!user) {
      navigate('/login')
    }
  }

  const handleSearch = (event) => {
    const nextQuery = event.target.value
    if (nextQuery.trim()) {
      setSearchParams({ q: nextQuery })
    } else {
      setSearchParams({})
    }
  }

  return (
    <header className="header">
      <Link to="/" className="header__logoLink" aria-label="Amazon home">
        <img className="header__logo" src={logo} alt="Amazon Logo" />
      </Link>

      <div className="header__search">
        <input
          className="header__searchInput"
          type="search"
          value={query}
          onChange={handleSearch}
          placeholder="Search Amazon"
          aria-label="Search products"
        />
        <SearchIcon className="header__searchIcon" />
      </div>

      <nav className="header__nav" aria-label="Primary navigation">
        <button
          className="header__themeToggle"
          type="button"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
        </button>

        <button className="header__option header__optionButton" type="button" onClick={handleAuthentication}>
          <span className="header__optionLineOne">Hello, {getUserName()}</span>
          <span className="header__optionLineTwo">{user ? 'Logout' : 'Sign In'}</span>
        </button>

        <Link to="/orders" className="header__option">
          <span className="header__optionLineOne">Returns</span>
          <span className="header__optionLineTwo">& Orders</span>
        </Link>

        <Link to="/prime" className="header__option">
          <span className="header__optionLineOne">Your</span>
          <span className="header__optionLineTwo">Prime</span>
        </Link>

        <Link to="/checkout" className="header__basket" aria-label={`Basket with ${basket.length} items`}>
          <ShoppingBasketIcon />
          <span className="header__basketCount">{basket.length}</span>
        </Link>
      </nav>
    </header>
  )
}

export default Header
