import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { GET_OUTPUT_PORTS } from '../../../ui/constants/ipcChannels';

const { ipcRenderer } = require('electron')

const MIDIOutputs = ({ onChange = () => false, value }) => {
  const [ loading, setLoading ] = useState(true);
  const [ outputDevices, setOutputDevices ] = useState([]);

  useEffect(() => {
    const callback = (event, arg) => {
      setOutputDevices(arg)
      setLoading(false);
    }
    ipcRenderer.on(GET_OUTPUT_PORTS, callback)
    const handle = setTimeout(() => ipcRenderer.send(GET_OUTPUT_PORTS), 500)

    return () => {
      ipcRenderer.removeListener(GET_OUTPUT_PORTS, callback)
      clearTimeout(handle);
    }
  })

  return loading ? (
    <input defaultValue="Loading MIDI output devices..." />
  ) : _.isEmpty(outputDevices) ? (
    <input defaultValue="No output MIDI devices found :(" />
  ) : (
    <select
      onChange={(e) => {
        onChange(outputDevices[e.target.value])
      }}
      value={_.get(value, 'id')}
    >
      <option defaultValue="">Please select an output device</option>
      {outputDevices.map(({ id, name}) => <option  key={id} value={id}>{name}</option>)}
    </select>
  )
}

export default MIDIOutputs;