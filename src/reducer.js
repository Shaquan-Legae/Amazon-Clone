const readStoredValue = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallback
  } catch {
    return fallback
  }
}

export const initialState = {
  basket: readStoredValue('amazon_basket', []),
  isDarkMode: readStoredValue('amazon_dark_mode', false),
  user: null,
}

export const getBasketTotal = (basket) =>
  basket?.reduce((amount, item) => amount + Number(item.price || 0), 0) || 0

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_BASKET':
      return {
        ...state,
        basket: [...state.basket, action.item],
      }

    case 'REMOVE_FROM_BASKET': {
      const index = state.basket.findIndex((basketItem) => basketItem.id === action.id)
      const newBasket = [...state.basket]

      if (index >= 0) {
        newBasket.splice(index, 1)
      }

      return {
        ...state,
        basket: newBasket,
      }
    }

    case 'SET_USER':
      return {
        ...state,
        user: action.user,
      }

    case 'TOGGLE_THEME':
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      }

    default:
      return state
  }
}

export default reducer
