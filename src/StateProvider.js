import { createContext, createElement, useContext, useReducer } from 'react'

export const StateContext = createContext()

export const StateProvider = ({ reducer, initialState, children }) =>
  createElement(
    StateContext.Provider,
    { value: useReducer(reducer, initialState) },
    children,
  )

export const useStateValue = () => useContext(StateContext)
