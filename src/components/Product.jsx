import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStateValue } from '../StateProvider.js'
import { createProductReturnLocation, saveProductReturnLocation } from '../utils/productNavigation.js'

function Product({ id, title, image, price, rating, category }) {
  const [{ user, wishlist }, dispatch] = useStateValue()
  const location = useLocation()
  const navigate = useNavigate()
  const isWishlisted = wishlist.some((item) => item.id === id)

  const addToBasket = () => {
    if (!user) {
      navigate('/login')
      return
    }

    dispatch({
      type: 'ADD_TO_BASKET',
      item: {
        id,
        title,
        image,
        price,
        rating,
        category,
      },
    })
  }

  const toggleWishlist = () => {
    dispatch({
      type: 'TOGGLE_WISHLIST',
      item: {
        id,
        title,
        image,
        price,
        rating,
        category,
      },
    })
  }

  const openProductDetails = () => {
    const returnLocation = createProductReturnLocation(location)
    saveProductReturnLocation(returnLocation)
    navigate(`/product/${id}`, {
      state: {
        returnLocation,
      },
    })
  }

  return (
    <article className="product" onClick={openProductDetails} style={{ cursor: 'pointer' }}>
      <div className="product__info">
        <p className="product__title">{title}</p>
        <p className="product__price">
          <small>R</small>
          <strong>{Number(price).toFixed(2)}</strong>
        </p>
        <div className="product__rating" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, index) => (
            <span key={`${id}-star-${index}`}>{'\u2605'}</span>
          ))}
        </div>
      </div>

      <img className="product__image" src={image} alt={title} />
      <div className="product__actions">
        <button className="amazonButton product__button" type="button" onClick={(e) => {
          e.stopPropagation()
          addToBasket()
        }} disabled={!user}>
          {user ? 'Add to Basket' : 'Sign in to Add'}
        </button>

        <button
          className={`product__wishlist${isWishlisted ? ' product__wishlist--active' : ''}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist()
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </button>
      </div>
    </article>
  )
}

export default Product

