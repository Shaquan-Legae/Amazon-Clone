export function detectCardType(cardNumber) {
  const sanitized = cardNumber.replace(/\D/g, '')

  if (sanitized.length === 0) {
    return 'empty'
  }

  if (sanitized.startsWith('4')) {
    return 'visa'
  }

  if (sanitized.startsWith('5')) {
    return 'mastercard'
  }

  if (sanitized.startsWith('3')) {
    return 'amex'
  }

  return 'unknown'
}
