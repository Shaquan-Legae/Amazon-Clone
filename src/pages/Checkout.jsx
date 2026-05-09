import CheckoutProduct from '../components/CheckoutProduct.jsx'
import RecommendedProducts from '../components/RecommendedProducts.jsx'
import Subtotal from '../components/Subtotal.jsx'
import { useStateValue } from '../StateProvider.js'
import { Link } from 'react-router-dom'

function Checkout() {
  const [{ basket, user }] = useStateValue()

  if (!user) {
    return (
      <main className="checkout checkout--locked">
        <section className="checkout__authMessage">
          <h1>Please sign in to continue checkout</h1>
          <p>Sign in to view items, update your basket, and continue checkout.</p>
          <Link className="amazonButton checkout__authButton" to="/login">
            Sign In
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="checkout">
      <section className="checkout__left">
        <div className="checkout__ad">
          <div>
            <strong>Fast delivery on everyday essentials</strong>
          </div>
        </div>

        <h1 className="checkout__title">Your Shopping Basket</h1>
        {user?.email && <p className="checkout__user">Shopping as {user.email}</p>}

        {basket.length === 0 ? (
          <div className="checkout__empty">
            <h2>Your basket is empty</h2>
            <p>Add items from the homepage and they will appear here.</p>
          </div>
        ) : (
          <div className="checkout__items">
            {basket.map((item, index) => (
              <CheckoutProduct
                key={`${item.id}-${index}`}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        )}
      </section>

      <section className="checkout__right">
        <Subtotal />
      </section>

      <RecommendedProducts />
    </main>
  )
}

export default Checkout
