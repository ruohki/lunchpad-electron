import React from 'react';

export const ButtonStateContext = React.createContext({});

export const RESET_BUTTON_STATE = "RESET_BUTTON_STATE"
export const SET_BUTTON_STATE = "SET_BUTTON_STATE"

const reducer = (state, action) => {
  switch (action.type) {
    case RESET_BUTTON_STATE: 
      return ({});
    case SET_BUTTON_STATE:
      const { id, pressed , color = state[id].color} = action.payload
      return {...state, [id]: Object.assign({}, state[id], {
        pressed,
        color
      })}
  }
}

export const ButtonStateContextProvider = (props) => {
  let [state, dispatch] = React.useReducer(reducer, {});
  return (
    <ButtonStateContext.Provider value={{ state, dispatch}}>{props.children}</ButtonStateContext.Provider>
  )
}

export const ButtonStateContextConsumer = ButtonStateContext.Consumer