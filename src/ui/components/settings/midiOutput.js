import React, { Fragment, useState, useContext } from 'react';
import _ from 'lodash';

import Select from '../general/select';

import { globalContext } from '../../../index';
import { useSettings, useInterval } from '../hooks';

import { SELECTED_MIDI_OUTPUT_DEVICE } from '../../../shared/constants/settings';

const MIDIOutputs = ({ onChange = () => false }) => {
  const { Midi } = useContext(globalContext);

  const [ outputDevices, setOutputDevices ] = useState(Midi.getAvailableOutputs());
  const [ selectedDevice, setSelectedDevice ] = useSettings(SELECTED_MIDI_OUTPUT_DEVICE)

  const selected = outputDevices.find(({ name }) => name === _.get(selectedDevice, 'name', "NONE"))

  useInterval(() => {
    const devices = Midi.getAvailableOutputs();
    if (!_.isEqual(outputDevices, devices)) {
      setOutputDevices(devices);
    }
  }, 100)
  return (
    <Select
      onChange={(e) => {
        onChange(outputDevices[e.target.value])
        if (outputDevices[e.target.value]) {
          setSelectedDevice(outputDevices[e.target.value])
        } else {
          setSelectedDevice("NONE");
        }
      }}
      value={_.get(selected, 'id', "NONE")}
    >
      <Fragment>
        <option value="NONE">Please select an Output device</option>
        {outputDevices.map(({ id, name}) => <option  key={id} value={id}>{name}</option>)}
      </Fragment>
    </Select>
  )
}

export default MIDIOutputs;