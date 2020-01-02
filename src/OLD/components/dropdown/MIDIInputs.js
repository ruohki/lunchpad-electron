import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { ipcRenderer } from 'electron'
import { GET_INPUT_PORTS } from '../../../ui/constants/ipcChannels';

const MIDIInputs = ({ onChange = () => false, value }) => {
  const [ loading, setLoading ] = useState(true);
  const [ InputDevices, setInputDevices ] = useState([]);

  useEffect(() => {
    const callback = (event, arg) => {
      setInputDevices(arg)
      setLoading(false);
    }
    ipcRenderer.on(GET_INPUT_PORTS, callback)
    const handle = setTimeout(() => ipcRenderer.send(GET_INPUT_PORTS), 500)

    return () => {
      ipcRenderer.removeListener(GET_INPUT_PORTS, callback)
      clearTimeout(handle);
    }
  })

  return loading ? (
    <input defaultValue="Loading MIDI Input devices..." />
  ) : _.isEmpty(InputDevices) ? (
    <input defaultValue="No Input MIDI devices found :(" />
  ) : (
    <select
      onChange={(e) => {
        onChange(InputDevices[e.target.value])
      }}
      value={_.get(value, 'id')}
    >
      <option defaultValue="">Please select an Input device</option>
      {InputDevices.map(({ id, name}) => <option  key={id} value={id}>{name}</option>)}
    </select>
  )
}

export default MIDIInputs;