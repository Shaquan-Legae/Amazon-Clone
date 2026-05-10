const SESSION_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes
const SESSION_WARNING_MS = 4 * 60 * 1000 // 4 minutes
const ACTIVITY_STORAGE_KEY = 'amazon_last_active'
const ACTIVITY_EVENTS = ['mousemove', 'click', 'keypress', 'scroll', 'touchstart']

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

export function setupSessionTimeout({
  onTimeout,
  onWarningChange,
  timeoutMs = SESSION_TIMEOUT_MS,
  warningMs = SESSION_WARNING_MS,
} = {}) {
  let warningTimer = null
  let timeoutTimer = null
  let warningVisible = false
  let hasTimedOut = false

  const clearTimers = () => {
    if (warningTimer) {
      window.clearTimeout(warningTimer)
      warningTimer = null
    }

    if (timeoutTimer) {
      window.clearTimeout(timeoutTimer)
      timeoutTimer = null
    }
  }

  const notifyWarning = (nextVisible) => {
    if (warningVisible === nextVisible) {
      return
    }

    warningVisible = nextVisible
    if (onWarningChange) {
      onWarningChange(nextVisible)
    }
  }

  const expireSession = () => {
    if (hasTimedOut) {
      return
    }

    hasTimedOut = true
    clearTimers()
    notifyWarning(false)
    clearActivityTime()
    if (onTimeout) {
      onTimeout()
    }
  }

  const scheduleTimers = () => {
    if (hasTimedOut) {
      return
    }

    clearTimers()

    const now = Date.now()
    let lastActive = getLastActiveTime()

    if (!lastActive) {
      lastActive = now
      setLastActiveTime(now)
    }

    const elapsedMs = now - lastActive
    const timeoutDelay = timeoutMs - elapsedMs

    if (timeoutDelay <= 0) {
      expireSession()
      return
    }

    if (elapsedMs >= warningMs) {
      notifyWarning(true)
    } else {
      warningTimer = window.setTimeout(() => notifyWarning(true), warningMs - elapsedMs)
    }

    timeoutTimer = window.setTimeout(expireSession, timeoutDelay)
  }

  const handleActivity = () => {
    if (hasTimedOut) {
      return
    }

    setLastActiveTime()
    notifyWarning(false)
    scheduleTimers()
  }

  const listenerOptions = { capture: true, passive: true }

  ACTIVITY_EVENTS.forEach((event) => {
    document.addEventListener(event, handleActivity, listenerOptions)
  })

  scheduleTimers()

  return () => {
    clearTimers()
    notifyWarning(false)

    ACTIVITY_EVENTS.forEach((event) => {
      document.removeEventListener(event, handleActivity, listenerOptions)
    })
  }
}

export function setupActivityTracking(onActivity) {
  const handleActivity = () => {
    setLastActiveTime()
    if (onActivity) {
      onActivity()
    }
  }

  const listenerOptions = { capture: true, passive: true }

  ACTIVITY_EVENTS.forEach((event) => {
    document.addEventListener(event, handleActivity, listenerOptions)
  })

  return () => {
    ACTIVITY_EVENTS.forEach((event) => {
      document.removeEventListener(event, handleActivity, listenerOptions)
    })
  }
}
