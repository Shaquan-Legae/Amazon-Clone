import { useMemo } from 'react'

const formatMoney = (amount) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount)

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))

function readOrders() {
  try {
    return JSON.parse(window.localStorage.getItem('orders') || '[]')
  } catch {
    return []
  }
}

function Orders() {
  const orders = useMemo(() => readOrders(), [])

  return (
    <main className="ordersPage">
      <section className="ordersPage__header">
        <h1>Your Orders</h1>
        <p>Review recent purchases, delivery progress, and order totals.</p>
      </section>

      {orders.length === 0 ? (
        <section className="ordersPage__empty">
          <h2>You have no recent orders</h2>
          <p>When you place an order, it will appear here with delivery details and purchased items.</p>
        </section>
      ) : (
        <section className="ordersPage__list" aria-label="Order history">
          {orders.map((order) => (
            <article className="orderCard" key={order.orderNumber}>
              <header className="orderCard__header">
                <div>
                  <span>Order placed</span>
                  <strong>{formatDate(order.date)}</strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>{formatMoney(order.total)}</strong>
                </div>
                <div>
                  <span>Order #</span>
                  <strong>{order.orderNumber}</strong>
                </div>
              </header>

              <div className="orderCard__body">
                <div>
                  <h2>{order.status}</h2>
                  <p>{order.deliveryMethod?.label || 'Standard Delivery'}</p>
                </div>
                <div className="orderCard__items">
                  {order.items.map((item) => (
                    <div className="orderCard__item" key={item.id}>
                      <img src={item.image} alt={item.title} />
                      <span>
                        {item.title} x {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default Orders
