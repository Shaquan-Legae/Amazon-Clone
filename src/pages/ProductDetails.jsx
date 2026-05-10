import { useParams, useNavigate } from 'react-router-dom'
import { useStateValue } from '../StateProvider.js'
import { fallbackProducts } from '../data/products.js'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [{ user, basket, wishlist }, dispatch] = useStateValue()

  // Find product from fallbackProducts or basket/wishlist (in case of dynamic data)
  const product = fallbackProducts.find(p => p.id === id) ||
                  basket.find(p => p.id === id) ||
                  wishlist.find(p => p.id === id)

  const isInBasket = basket.some(item => item.id === id)
  const isWishlisted = wishlist.some(item => item.id === id)

  const addToBasket = () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!isInBasket) {
      dispatch({
        type: 'ADD_TO_BASKET',
        item: product,
      })
    }
  }

  const toggleWishlist = () => {
    dispatch({
      type: 'TOGGLE_WISHLIST',
      item: product,
    })
  }

  if (!product) {
    return (
      <div className="productDetails productDetails--notFound">
        <div className="productDetails__container">
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
          <button className="amazonButton" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="productDetails">
      <div className="productDetails__container">
        <div className="productDetails__image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="productDetails__info">
          <h1 className="productDetails__title">{product.title}</h1>

          <div className="productDetails__rating">
            {Array.from({ length: product.rating }).map((_, index) => (
              <span key={`star-${index}`}>{'\u2605'}</span>
            ))}
            <span className="productDetails__ratingText">
              {product.rating} out of 5 stars
            </span>
          </div>

          <p className="productDetails__category">Category: {product.category}</p>

          <p className="productDetails__price">
            <small>R</small>
            <strong>{Number(product.price).toFixed(2)}</strong>
          </p>

          <p className="productDetails__description">{product.description}</p>

          <div className="productDetails__actions">
            <button
              className={`amazonButton productDetails__basket ${isInBasket ? 'amazonButton--secondary' : ''}`}
              onClick={addToBasket}
              disabled={!user}
            >
              {user ? (isInBasket ? 'Added to Basket' : 'Add to Basket') : 'Sign in to Add'}
            </button>

            <button
              className={`productDetails__wishlist ${isWishlisted ? 'productDetails__wishlist--active' : ''}`}
              onClick={toggleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {'\u2665'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails