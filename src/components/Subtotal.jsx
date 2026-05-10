import { useStateValue } from '../StateProvider.js'
import { getBasketTotal } from '../reducer.js'

function Subtotal() {
  const [{ basket }] = useStateValue()
  const itemLabel = basket.length === 1 ? 'item' : 'items'

  return (
    <aside className="subtotal">
      <p>
        Subtotal ({basket.length} {itemLabel}):{' '}
        <strong>R{getBasketTotal(basket).toFixed(2)}</strong>
      </p>
      <p className="subtotal__hint">Review your basket and continue checkout from the cart icon or basket summary.</p>
      <label className="subtotal__gift">
        <input type="checkbox" />
        This order contains a gift
      </label>
    </aside>
  )
}

export default Subtotal
