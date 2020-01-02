import React from 'react';
import _ from 'lodash';
import { remote } from 'electron'

import { CURRENT_BUTTON_CONFIGURATION } from '../shared/constants/settings';

const settings = remote.require('electron-settings');

export const buttonConfigContext = React.createContext(settings.get(CURRENT_BUTTON_CONFIGURATION) || {});

export const CLEAR_BUTTON_CONFIG = "CLEAR_BUTTON_CONFIG"
export const SET_BUTTON_CONFIG = "SET_BUTTON_CONFIG"
export const GET_BUTTON_CONFIG = "GET_BUTTON_CONFIG"

export const SAVE_BUTTON_CONFIG = "SAVE_BUTTON_CONFIG"

const reducer = (state, action) => {
  const { id } = action.payload

  switch (action.type) {
    case CLEAR_BUTTON_CONFIG:
      const { [id]: old , ...newState} = state
      return {...newState}
    case GET_BUTTON_CONFIG:
      return _.get(state, id, false);
    case SET_BUTTON_CONFIG:
      return {...state, [id]: action.payload}
    case SAVE_BUTTON_CONFIG:
      return settings.set(CURRENT_BUTTON_CONFIGURATION, state)
  }
}