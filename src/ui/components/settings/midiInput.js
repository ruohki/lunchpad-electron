import React, { Fragment, useState, useContext } from 'react';
import _ from 'lodash';

import Select from '../general/select';

import { globalContext } from '../../../index';
import { useSettings, useInterval } from '../hooks';

import { SELECTED_MIDI_INPUT_DEVICE } from '../../../shared/constants/settings';

const MIDIInputs = ({ onChange = () => false }) => {
  const { Midi } = useContext(globalContext);

  const [ inputDevices, setInputDevices ] = useState(Midi.getAvailableInputs());
  const [ selectedDevice, setSelectedDevice ] = useSettings(SELECTED_MIDI_INPUT_DEVICE)

  const selected = inputDevices.find(({ name }) => name === _.get(selectedDevice, 'name', "NONE"))

  useInterval(() => {
    const devices = Midi.getAvailableInputs();
    if (!_.isEqual(inputDevices, devices)) {
      setInputDevices(devices);
    }
  }, 100)
  return (
    <Select
      onChange={(e) => {
        onChange(inputDevices[e.target.value])
        if (inputDevices[e.target.value]) {
          setSelectedDevice(inputDevices[e.target.value])
        } else {
          setSelectedDevice("NONE");
        }
      }}
      value={_.get(selected, 'id', "NONE")}
    >
      <Fragment>
        <option value="NONE">Please select an Input device</option>
        {inputDevices.map(({ id, name}) => <option  key={id} value={id}>{name}</option>)}
      </Fragment>
    </Select>
  )
}

export default MIDIInputs;