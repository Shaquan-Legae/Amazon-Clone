import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutProduct from '../components/CheckoutProduct.jsx'
import RecommendedProducts from '../components/RecommendedProducts.jsx'
import Subtotal from '../components/Subtotal.jsx'
import { getBasketTotal } from '../reducer.js'
import { useStateValue } from '../StateProvider.js'
import { detectCardType, getCardDisplay } from '../utils/cardDetection.js'

const deliveryOptions = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    description: 'Free, 3-5 days',
    fee: 0,
  },
  {
    id: 'express',
    label: 'Express Delivery',
    description: '+R99, 1-2 days',
    fee: 99,
  },
  {
    id: 'same-day',
    label: 'Same Day',
    description: '+R199 where available',
    fee: 199,
  },
]

const requiredShippingFields = [
  'fullName',
  'email',
  'addressLine1',
  'city',
  'province',
  'postalCode',
  'phone',
]

const requiredPaymentFields = ['cardholderName', 'cardNumber', 'expiry', 'cvv', 'country', 'billingZip']

const formatMoney = (amount) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount)

function getGroupedBasket(basket) {
  return basket.reduce((groups, item) => {
    const existingItem = groups.find((group) => group.id === item.id)

    if (existingItem) {
      existingItem.quantity += 1
      return groups
    }

    groups.push({ ...item, quantity: 1 })
    return groups
  }, [])
}

function readStoredOrders() {
  try {
    return JSON.parse(window.localStorage.getItem('orders') || '[]')
  } catch {
    return []
  }
}

function Checkout() {
  const [{ basket, user }, dispatch] = useStateValue()
  const [step, setStep] = useState(1)
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  })
  const [shippingErrors, setShippingErrors] = useState({})
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryOptions[0].id)
  const [paymentDetails, setPaymentDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    country: '',
    billingZip: '',
  })
  const [paymentErrors, setPaymentErrors] = useState({})
  const [detectedCardType, setDetectedCardType] = useState('empty')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  const groupedBasket = useMemo(() => getGroupedBasket(basket), [basket])
  const subtotal = getBasketTotal(basket)
  const selectedDelivery = deliveryOptions.find((option) => option.id === deliveryMethod) || deliveryOptions[0]
  const orderTotal = subtotal + selectedDelivery.fee

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

  const updateShipping = (event) => {
    const { name, value } = event.target
    setShippingDetails((currentDetails) => ({
      ...currentDetails,
      [name]: value,
    }))
    setShippingErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const updatePayment = (event) => {
    const { name, value } = event.target
    let nextValue = value

    if (name === 'cardNumber') {
      nextValue = value.replace(/\D/g, '').slice(0, 16)
      nextValue = nextValue.replace(/(.{4})/g, '$1 ').trim()
      setDetectedCardType(detectCardType(nextValue))
    }

    if (name === 'expiry') {
      nextValue = value.replace(/\D/g, '').slice(0, 4)
      if (nextValue.length > 2) {
        nextValue = `${nextValue.slice(0, 2)}/${nextValue.slice(2)}`
      }
    }

    if (name === 'cvv') {
      nextValue = value.replace(/\D/g, '').slice(0, 4)
    }

    if (name === 'billingZip') {
      nextValue = value.toUpperCase().slice(0, 10)
    }

    setPaymentDetails((currentDetails) => ({
      ...currentDetails,
      [name]: nextValue,
    }))
    setPaymentErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const validateShipping = () => {
    const nextErrors = {}

    requiredShippingFields.forEach((field) => {
      if (!shippingDetails[field].trim()) {
        nextErrors[field] = 'This field is required.'
      }
    })

    if (shippingDetails.email && !/^\S+@\S+\.\S+$/.test(shippingDetails.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    setShippingErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validatePayment = () => {
    const nextErrors = {}
    const rawCardNumber = paymentDetails.cardNumber.replace(/\D/g, '')

    // Check required fields
    requiredPaymentFields.forEach((field) => {
      if (!paymentDetails[field].trim()) {
        nextErrors[field] = 'This field is required.'
      }
    })

    // Specific validations
    if (paymentDetails.cardNumber && !/^\d{16}$/.test(rawCardNumber)) {
      nextErrors.cardNumber = 'Enter a valid 16-digit card number.'
    }

    if (paymentDetails.expiry && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiry)) {
      nextErrors.expiry = 'Enter a valid expiry date in MM/YY format.'
    }

    if (paymentDetails.cvv && !/^\d{3,4}$/.test(paymentDetails.cvv)) {
      nextErrors.cvv = 'Enter a valid 3 or 4 digit CVV.'
    }

    setPaymentErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const continueFromShipping = () => {
    if (validateShipping()) {
      setStep(3)
    }
  }

  const placeOrder = () => {
    if (!validatePayment()) {
      return
    }

    setIsProcessingPayment(true)

    const orderSnapshot = {
      orderNumber: `AMZ-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      items: groupedBasket,
      itemCount: basket.length,
      shippingDetails,
      deliveryMethod: selectedDelivery,
      status: selectedDelivery.id === 'same-day' ? 'Arriving today' : 'Preparing for dispatch',
      subtotal,
      total: orderTotal,
    }

    window.setTimeout(() => {
      const storedOrders = readStoredOrders()
      window.localStorage.setItem('orders', JSON.stringify([orderSnapshot, ...storedOrders]))
      setConfirmedOrder(orderSnapshot)
      dispatch({ type: 'EMPTY_BASKET' })
      setIsProcessingPayment(false)
      setStep(5)
    }, 2800)
  }

  if (confirmedOrder && step === 5) {
    return (
      <main className="checkout checkoutFlow">
        <section className="checkoutFlow__confirmation">
          <h1>Order placed successfully {'\u{1F389}'}</h1>
          <p className="checkoutFlow__orderNumber">Order number: {confirmedOrder.orderNumber}</p>

          <div className="checkoutFlow__summaryGrid">
            <article>
              <h2>Shipping address</h2>
              <p>{confirmedOrder.shippingDetails.fullName}</p>
              <p>{confirmedOrder.shippingDetails.addressLine1}</p>
              {confirmedOrder.shippingDetails.addressLine2 && <p>{confirmedOrder.shippingDetails.addressLine2}</p>}
              <p>
                {confirmedOrder.shippingDetails.city}, {confirmedOrder.shippingDetails.province}{' '}
                {confirmedOrder.shippingDetails.postalCode}
              </p>
              <p>{confirmedOrder.shippingDetails.phone}</p>
            </article>

            <article>
              <h2>Delivery method</h2>
              <p>{confirmedOrder.deliveryMethod.label}</p>
              <p>{confirmedOrder.deliveryMethod.description}</p>
            </article>

            <article>
              <h2>Order total</h2>
              <p>{formatMoney(confirmedOrder.total)}</p>
              <p>{confirmedOrder.itemCount} items</p>
            </article>
          </div>

          <section className="checkoutFlow__orderItems">
            <h2>Order summary</h2>
            {confirmedOrder.items.map((item) => (
              <div className="checkoutFlow__orderItem" key={item.id}>
                <span>
                  {item.title} x {item.quantity}
                </span>
                <strong>{formatMoney(item.price * item.quantity)}</strong>
              </div>
            ))}
          </section>

          <Link className="amazonButton checkoutFlow__homeButton" to="/">
            Continue Shopping
          </Link>
        </section>
      </main>
    )
  }

  const isPaymentValid = requiredPaymentFields.every(
    (field) => paymentDetails[field]?.trim()
  )

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes dot-animation {
            0%, 20%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}
      </style>
      <main className="checkout checkoutFlow">
      <section className="checkout__left checkoutFlow__main">
        <div className="checkout__ad">
          <div>
            <strong>Fast delivery on everyday essentials</strong>
          </div>
        </div>

        <ol className="checkoutFlow__steps" aria-label="Checkout steps">
          {['Basket', 'Shipping', 'Delivery', 'Payment', 'Confirmation'].map((label, index) => (
            <li className={step === index + 1 ? 'checkoutFlow__step checkoutFlow__step--active' : 'checkoutFlow__step'} key={label}>
              {label}
            </li>
          ))}
        </ol>

        {step === 1 && (
          <section className="checkoutFlow__panel">
            <h1 className="checkout__title">Basket Review</h1>
            <p className="checkout__user">Total items: {basket.length}</p>

            {basket.length === 0 ? (
              <div className="checkout__empty">
                <h2>Your basket is empty</h2>
                <p>Add items from the homepage and they will appear here.</p>
              </div>
            ) : (
              <div className="checkout__items">
                {groupedBasket.map((item) => (
                  <CheckoutProduct
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    rating={item.rating}
                    category={item.category}
                    quantity={item.quantity}
                  />
                ))}
              </div>
            )}

            <div className="checkoutFlow__actions">
              <button className="amazonButton" type="button" onClick={() => setStep(2)} disabled={basket.length === 0}>
                Continue to Shipping
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="checkoutFlow__panel">
            <h1 className="checkout__title">Shipping Details</h1>
            <form className="checkoutForm">
              <label>
                Full name
                <input name="fullName" value={shippingDetails.fullName} onChange={updateShipping} />
                {shippingErrors.fullName && <span>{shippingErrors.fullName}</span>}
              </label>

              <label>
                Email
                <input name="email" type="email" value={shippingDetails.email} onChange={updateShipping} />
                {shippingErrors.email && <span>{shippingErrors.email}</span>}
              </label>

              <label className="checkoutForm__wide">
                Address line 1
                <input name="addressLine1" value={shippingDetails.addressLine1} onChange={updateShipping} />
                {shippingErrors.addressLine1 && <span>{shippingErrors.addressLine1}</span>}
              </label>

              <label className="checkoutForm__wide">
                Address line 2
                <input name="addressLine2" value={shippingDetails.addressLine2} onChange={updateShipping} />
              </label>

              <label>
                City
                <input name="city" value={shippingDetails.city} onChange={updateShipping} />
                {shippingErrors.city && <span>{shippingErrors.city}</span>}
              </label>

              <label>
                Province / State
                <input name="province" value={shippingDetails.province} onChange={updateShipping} />
                {shippingErrors.province && <span>{shippingErrors.province}</span>}
              </label>

              <label>
                Postal code
                <input name="postalCode" value={shippingDetails.postalCode} onChange={updateShipping} />
                {shippingErrors.postalCode && <span>{shippingErrors.postalCode}</span>}
              </label>

              <label>
                Phone number
                <input name="phone" value={shippingDetails.phone} onChange={updateShipping} />
                {shippingErrors.phone && <span>{shippingErrors.phone}</span>}
              </label>
            </form>

            <div className="checkoutFlow__actions">
              <button type="button" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="amazonButton" type="button" onClick={continueFromShipping}>
                Continue to Delivery
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="checkoutFlow__panel">
            <h1 className="checkout__title">Delivery Method</h1>
            <div className="deliveryOptions">
              {deliveryOptions.map((option) => (
                <label className="deliveryOptions__option" key={option.id}>
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={deliveryMethod === option.id}
                    onChange={(event) => setDeliveryMethod(event.target.value)}
                  />
                  <span>
                    <strong>{option.label}</strong>
                    {option.description}
                  </span>
                </label>
              ))}
            </div>

            <div className="checkoutFlow__actions">
              <button type="button" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="amazonButton" type="button" onClick={() => setStep(4)}>
                Continue to Payment
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="checkoutFlow__panel">
            <h1 className="checkout__title">Shipping & payment details</h1>

            {isProcessingPayment && (
              <div className="paymentLoader">
                <div className="paymentLoader__spinner"></div>
                <h3>Payment processing<span className="dots"></span></h3>
                <p>Securing transaction</p>
              </div>
            )}

            <form className="checkoutForm">
              <label className="checkoutForm__wide">
                Cardholder Name
                <input
                  name="cardholderName"
                  value={paymentDetails.cardholderName}
                  onChange={updatePayment}
                  disabled={isProcessingPayment}
                />
                {paymentErrors.cardholderName && <span>{paymentErrors.cardholderName}</span>}
              </label>

              <label className="checkoutForm__wide">
                Card Number
                <input
                  name="cardNumber"
                  inputMode="numeric"
                  maxLength="19"
                  value={paymentDetails.cardNumber}
                  onChange={updatePayment}
                  placeholder="4242 4242 4242 4242"
                  disabled={isProcessingPayment}
                />
                {paymentErrors.cardNumber && <span>{paymentErrors.cardNumber}</span>}
                {!paymentErrors.cardNumber && getCardDisplay(detectedCardType) && (
                  <span className="cardDetection" style={{ color: getCardDisplay(detectedCardType).color }}>
                    {getCardDisplay(detectedCardType).label}
                  </span>
                )}
              </label>

              <label>
                Expiry Date
                <input
                  name="expiry"
                  value={paymentDetails.expiry}
                  onChange={updatePayment}
                  placeholder="MM/YY"
                  disabled={isProcessingPayment}
                />
                {paymentErrors.expiry && <span>{paymentErrors.expiry}</span>}
              </label>

              <label>
                CVV
                <input
                  name="cvv"
                  inputMode="numeric"
                  maxLength="4"
                  value={paymentDetails.cvv}
                  onChange={updatePayment}
                  disabled={isProcessingPayment}
                />
                {paymentErrors.cvv && <span>{paymentErrors.cvv}</span>}
              </label>

              <label>
                Country
                <select
                  name="country"
                  value={paymentDetails.country}
                  onChange={updatePayment}
                  disabled={isProcessingPayment}
                >
                  <option value="">Select country</option>
                  <option value="South Africa">South Africa</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
                {paymentErrors.country && <span>{paymentErrors.country}</span>}
              </label>

              <label>
                Billing ZIP
                <input
                  name="billingZip"
                  inputMode="text"
                  maxLength="10"
                  value={paymentDetails.billingZip}
                  onChange={updatePayment}
                  disabled={isProcessingPayment}
                />
                {paymentErrors.billingZip && <span>{paymentErrors.billingZip}</span>}
              </label>
            </form>

            <div className="checkoutFlow__actions">
              <button type="button" onClick={() => setStep(3)} disabled={isProcessingPayment}>
                Back
              </button>
              <button className="amazonButton" type="button" onClick={placeOrder} disabled={!isPaymentValid || isProcessingPayment}>
                {isProcessingPayment ? 'Finalizing payment...' : 'Place Order'}
              </button>
            </div>
          </section>
        )}
      </section>

      <section className="checkout__right">
        <Subtotal />
        <aside className="checkoutFlow__totals">
          <p>
            Items: <strong>{basket.length}</strong>
          </p>
          <p>
            Delivery: <strong>{selectedDelivery.fee === 0 ? 'Free' : formatMoney(selectedDelivery.fee)}</strong>
          </p>
          <p>
            Order total: <strong>{formatMoney(orderTotal)}</strong>
          </p>
        </aside>
      </section>

      <RecommendedProducts />
    </main>
    </>
  )
}

export default Checkout

