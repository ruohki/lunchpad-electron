import React from 'react';
import { useMediaDevices } from 'react-use';
import _ from 'lodash';

import Select from '../general/select';

import { useSettings } from '../hooks';

import { SELECTED_SOUND_OUTPUT_DEVICE } from '../../../shared/constants/settings';

const OutputSelector = ({ onChange }) => {
  const { devices = [] } = useMediaDevices();
  const [ outputDevice, setOutputDevice ] = useSettings(SELECTED_SOUND_OUTPUT_DEVICE)
  return (
    <Select
      value={_.get(outputDevice, 'deviceId', 0)}
      onChange={e => {
        const device = devices.find(({ deviceId }) => deviceId == e.target.value);
        setOutputDevice(device)
        onChange(device)
      }}
    >
      {devices.filter(d => d.kind === "audiooutput").map(e =>
        <option key={e.deviceId} value={e.deviceId}>{e.label}</option>
      )}
    </Select>
  );
};

export default OutputSelector