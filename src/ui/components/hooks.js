import React, { useState, useEffect, useRef } from 'react';
import { remote } from 'electron'

import _ from 'lodash';

import { CURRENT_BUTTON_CONFIGURATION, CURRENT_PAGE } from '../../shared/constants/settings';

const settings = remote.getGlobal('settings');

export const useSettings = (key) => {
  const [ value, setValue ] = useState(settings.get(key));
  useEffect(() => {
    const observer = settings.watch(key, setValue);

    return () => {
      observer.dispose();
    }
  }, [value])

  const set = (value) => {
    settings.set(key, value)
  }

  return [value, set];
}

export const useButtonConfig = () => {
  const [ buttonConfig, setButtonConfig ] = useSettings(CURRENT_BUTTON_CONFIGURATION)
  const [ selectedPage, setSelectedPage ] = useSettings(CURRENT_PAGE);

  const currentPageConfig = _.get(buttonConfig, selectedPage, {});

  const setButton = (id, config) => {
    if (_.isArray(id)) {
      let omit = _.filter(id, ([i,c]) => _.isEmpty(c)).map(([ i, c]) => i)

      let tempPage = _.omit(Object.assign({}, currentPageConfig, ...id.map(([i,c]) => ({
        [i]: c
      }))), omit);

      setButtonConfig(Object.assign({}, buttonConfig, {
        [selectedPage]: tempPage
      }))
    } else {
      if (_.isEmpty(config)) {
        const tempPage = _.omit(currentPageConfig, id)
        setButtonConfig(Object.assign({}, buttonConfig, {
          [selectedPage]: tempPage
        }))

      } else {
        const tempPage = Object.assign({}, currentPageConfig, {
          [id]: config
        })
        setButtonConfig(Object.assign({}, buttonConfig, {
          [selectedPage]: tempPage
        }))
      }
    }
  }

  return [ currentPageConfig, setButton, setSelectedPage ]
}

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval. 
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}