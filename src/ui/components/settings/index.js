import React, { Fragment, useState } from 'react';

import _ from 'lodash';

import MIDIInputs from './midiInput';
import OperationMode from './operationMode';
import MIDIOutputs from './midiOutput';
import OutputSelector from './audioOutput';

import { Modal } from '../modal';
import { Hr } from '../controls';
import Select from '../general/select';
import { USE_PUSH_TO_TALK, PUSH_TO_TALK } from '../../../shared/constants/settings';
import { useSettings } from '../hooks';

const ApplicationConfig = ({ layout, audioManager, onClose = () => true }) => {

  const [ usePushToTalk, setUsePushToTalk ] = useSettings(USE_PUSH_TO_TALK);
  const [ pushToTalk, setPushToTalk ] = useSettings(PUSH_TO_TALK);

  return (
    <Modal
      title="General Settings..."
      onClose={onClose}
    >
      <p>Operation Mode: (will reset current config)</p>
      <OperationMode />
      <Hr />
      {_.get(layout, 'type', 'none') === "midi" && <Fragment>
        <p>MIDI Input Device:</p>
        <MIDIInputs />
      </Fragment>}

      {_.get(layout, 'type', 'none') === "midi" && <Fragment>
        <p>MIDI Output Device:</p>
        <MIDIOutputs />
      </Fragment>}

      <p>Default Audio Output:</p>
      <OutputSelector onChange={({ deviceId }) => audioManager.setSinkId(deviceId)}/>
      <Hr />
      <p>Push-to-talk for Sound-Buttons:</p>
      <Select value={usePushToTalk} onChange={(e) => setUsePushToTalk(e.target.value)}>
        <option value="disabled">Disabled</option>
        <option value="mouse">Mouse</option>
        <option value="keyboard">Keyboard</option>
      </Select>
      
      {usePushToTalk === "mouse" && <Select value={pushToTalk} onChange={(e) => setPushToTalk(e.target.value)}>
        <option value="left">Left Button</option>
        <option value="right">Right Button</option>
        <option value="center">Middle Button</option>
        <option value="x1">Mouse 4</option>
        <option value="x2">Mouse 5</option>
      </Select>}

    </Modal>
  )
};

export default ApplicationConfig;