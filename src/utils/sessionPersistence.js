const SESSION_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes
const ACTIVITY_STORAGE_KEY = 'amazon_last_active'

export function getLastActiveTime() {
  try {
    const stored = window.localStorage.getItem(ACTIVITY_STORAGE_KEY)
    return stored ? Number(stored) : null
  } catch {
    return null
  }
}

export function setLastActiveTime(timestamp = Date.now()) {
  try {
    window.localStorage.setItem(ACTIVITY_STORAGE_KEY, String(timestamp))
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function isSessionActive() {
  const lastActive = getLastActiveTime()
  if (!lastActive) return false

  const now = Date.now()
  const timeSinceActive = now - lastActive

  return timeSinceActive <= SESSION_TIMEOUT_MS
}

export function clearActivityTime() {
  try {
    window.localStorage.removeItem(ACTIVITY_STORAGE_KEY)
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function setupActivityTracking(onActivity) {
  const handleActivity = () => {
    setLastActiveTime()
    if (onActivity) {
      onActivity()
    }
  }

  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

  events.forEach((event) => {
    document.addEventListener(event, handleActivity, true)
  })

  // Return cleanup function
  return () => {
    events.forEach((event) => {
      document.removeEventListener(event, handleActivity, true)
    })
  }
}
