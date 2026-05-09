import { useStateValue } from '../StateProvider.js'
import { getBasketTotal } from '../reducer.js'

function Subtotal() {
  const [{ basket, user }] = useStateValue()
  const itemLabel = basket.length === 1 ? 'item' : 'items'

  return (
    <aside className="subtotal">
      <p>
        Subtotal ({basket.length} {itemLabel}):{' '}
        <strong>${getBasketTotal(basket).toFixed(2)}</strong>
      </p>
      <label className="subtotal__gift">
        <input type="checkbox" />
        This order contains a gift
      </label>
      <button className="amazonButton subtotal__button" type="button" disabled={basket.length === 0 || !user}>
        Proceed to Checkout
      </button>
    </aside>
  )
}

export default Subtotal
