import React from 'react';
import LunchpadAudio from '../audio';

export const soundContext = React.createContext({});

export const PLAY_NEW_SOUND = "PLAY_NEW_SOUND"
export const STOP_SOUND = "STOP_SOUND"
export const STOP_ALL_SOUNDS = "STOP_ALL_SOUNDS"

const reducer = (state, action) => {
  switch (action.type) {
    case PLAY_NEW_SOUND: 
      const { fileName, sinkId, uuid } = action.payload;
      const audio = new LunchpadAudio({ fileName, sinkId, uuid })
      
      
      return ({});
    case STOP_SOUND:
      const { id, pressed , color = state[id].color} = action.payload
      return {...state, [id]: Object.assign({}, state[id], {
        pressed,
        color
      })}
    case STOP_ALL_SOUNDS:
  }
}

export const ButtonStateContextProvider = (props) => {
  let [state, dispatch] = React.useReducer(reducer, {});
  return (
    <ButtonStateContext.Provider value={{ state, dispatch}}>{props.children}</ButtonStateContext.Provider>
  )
}

export const ButtonStateContextConsumer = ButtonStateContext.Consumer