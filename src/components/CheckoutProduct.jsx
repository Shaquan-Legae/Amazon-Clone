import { useStateValue } from '../StateProvider.js'

function CheckoutProduct({ id, title, image, price, rating, category, quantity = 1 }) {
  const [{ user }, dispatch] = useStateValue()

  const increaseQuantity = () => {
    if (!user) {
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
          <small>R</small>
          <strong>{Number(price).toFixed(2)}</strong>
        </p>
        <div className="checkoutProduct__rating" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, index) => (
            <span key={`${id}-checkout-star-${index}`}>{'\u2605'}</span>
          ))}
        </div>
        <div className="checkoutProduct__quantity" aria-label={`Quantity ${quantity}`}>
          <button type="button" onClick={removeFromBasket} disabled={!user}>
            -
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={increaseQuantity} disabled={!user}>
            +
          </button>
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
