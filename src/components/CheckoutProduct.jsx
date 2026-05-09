import { useStateValue } from '../StateProvider.js'

function CheckoutProduct({ id, title, image, price, rating }) {
  const [{ user }, dispatch] = useStateValue()

  const removeFromBasket = () => {
    if (!user) {
      return
    }

    dispatch({
      type: 'REMOVE_FROM_BASKET',
      id,
    })
  }

  return (
    <article className="checkoutProduct">
      <img className="checkoutProduct__image" src={image} alt={title} />
      <div className="checkoutProduct__info">
        <p className="checkoutProduct__title">{title}</p>
        <p className="checkoutProduct__price">
          <small>$</small>
          <strong>{Number(price).toFixed(2)}</strong>
        </p>
        <div className="checkoutProduct__rating" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, index) => (
            <span key={`${id}-checkout-star-${index}`}>{'\u2605'}</span>
          ))}
        </div>
        <button
          className="amazonButton checkoutProduct__button"
          type="button"
          onClick={removeFromBasket}
          disabled={!user}
        >
          Remove from Basket
        </button>
      </div>
    </article>
  )
}

export default CheckoutProduct
