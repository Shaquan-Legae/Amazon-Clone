export function detectCardType(cardNumber) {
  const sanitized = cardNumber.replace(/\D/g, '')

  if (sanitized.length === 0) {
    return 'empty'
  }

  if (/^4/.test(sanitized)) {
    return 'visa'
  }

  if (/^5[1-5]/.test(sanitized)) {
    return 'mastercard'
  }

  return 'unknown'
}

export function getCardDisplay(cardType) {
  const displays = {
    visa: { label: '💳 Visa', color: '#1435cb' },
    mastercard: { label: '💳 Mastercard', color: '#eb001b' },
    unknown: { label: '💳 Card detected', color: '#999' },
    empty: null,
  }

  return displays[cardType] || null
}
