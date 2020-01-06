import React, { useState, useEffect, useRef } from 'react';
import { remote } from 'electron'

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

export const useButtonConfig = (id) => {
  
}