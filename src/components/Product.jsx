import { useNavigate } from 'react-router-dom'
import { useStateValue } from '../StateProvider.js'

function Product({ id, title, image, price, rating, category }) {
  const [{ user }, dispatch] = useStateValue()
  const navigate = useNavigate()

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

  return (
    <article className="product">
      <div className="product__info">
        <p className="product__title">{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{Number(price).toFixed(2)}</strong>
        </p>
        <div className="product__rating" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, index) => (
            <span key={`${id}-star-${index}`}>{'\u2605'}</span>
          ))}
        </div>
      </div>

      <img className="product__image" src={image} alt={title} />
      <button className="amazonButton product__button" type="button" onClick={addToBasket} disabled={!user}>
        {user ? 'Add to Basket' : 'Sign in to Add'}
      </button>
    </article>
  )
}

export default Product
