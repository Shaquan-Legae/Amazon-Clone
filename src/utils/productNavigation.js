const PRODUCT_RETURN_STORAGE_KEY = 'amazon_product_return'
const RETURN_STATE_MAX_AGE_MS = 30 * 60 * 1000

export function createProductReturnLocation(location) {
  return {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    scrollY: window.scrollY,
    timestamp: Date.now(),
  }
}

export function saveProductReturnLocation(returnLocation) {
  try {
    window.sessionStorage.setItem(PRODUCT_RETURN_STORAGE_KEY, JSON.stringify(returnLocation))
  } catch {
    // Navigation should continue even if sessionStorage is unavailable.
  }
}

export function readProductReturnLocation() {
  try {
    const storedReturnLocation = window.sessionStorage.getItem(PRODUCT_RETURN_STORAGE_KEY)
    return storedReturnLocation ? JSON.parse(storedReturnLocation) : null
  } catch {
    return null
  }
}

export function clearProductReturnLocation() {
  try {
    window.sessionStorage.removeItem(PRODUCT_RETURN_STORAGE_KEY)
  } catch {
    // Silently fail if sessionStorage is unavailable.
  }
}

export function isFreshReturnLocation(returnLocation) {
  return Boolean(
    returnLocation?.timestamp &&
      Date.now() - returnLocation.timestamp <= RETURN_STATE_MAX_AGE_MS,
  )
}

export function isMatchingReturnLocation(returnLocation, location) {
  return Boolean(
    returnLocation &&
      returnLocation.pathname === location.pathname &&
      returnLocation.search === location.search &&
      (returnLocation.hash || '') === (location.hash || ''),
  )
}
