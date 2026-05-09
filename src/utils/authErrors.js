export function getAuthErrorMessage(errorCode) {
  const code = String(errorCode || '').toLowerCase()

  const messages = {
    'auth/wrong-password': 'The email or password you entered is incorrect.',
    'auth/invalid-email': 'Enter a valid email address to continue.',
    'auth/user-not-found': 'No account was found with that email address.',
    'auth/network-request-failed': 'Network issue detected. Please check your connection and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled. Please try again if you want to continue with Google.',
    'auth/cancelled-popup-request': 'Google sign-in was cancelled. Please try again.',
    'auth/popup-blocked': 'Google sign-in was blocked by the browser. Please allow popups and try again.',
    'auth/weak-password': 'Your password is too weak. Use at least 6 characters with letters and numbers.',
    'auth/email-already-in-use': 'That email is already registered. Try signing in instead.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/requires-recent-login': 'Please sign in again before making this change.',
  }

  return messages[code] || 'Something went wrong while signing in. Please try again.'
}
