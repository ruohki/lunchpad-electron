import React, { useState, useEffect, useRef } from 'react';
import { remote } from 'electron'

const settings = remote.require('electron-settings');

export const useSettings = (key) => {
  const [ value, setValue ] = useState(settings.get(key));
  useEffect(() => {
    const observer = settings.watch(key, setValue);

    return () => {
      observer.dispose();
    }
  }, [value])

  const set = (value) => {
    console.log("Setting Key", key, value)
    
    settings.set(key, value)
    console.log(settings.get(key))
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