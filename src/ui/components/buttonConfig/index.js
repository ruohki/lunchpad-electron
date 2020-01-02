import React, { useState } from 'react';

import _ from 'lodash';

import { Modal } from '../modal';
import { Input, FileSelect } from '../controls';
import ColorPicker from '../general/colorpicker';
import Select from '../general/select';

import { BUTTON_TYPES } from '../../../shared/constants/buttonTypes'

const ButtonConfig = ({ config, availableColors = [], onConfirm = () => true, onCancel = () => true }) => {
  const [ caption, setCaption ] = useState(_.get(config, 'caption', ''))
  const [ color, setColor ] = useState(_.get(config, 'color', 0))
  const [ type, setType ] = useState(_.get(config, 'type', 'sound'))

  const [ soundFile, setSoundFile ] = useState(_.get(config, 'soundFile', undefined))
  return (
    <Modal
      title="Button Configuration..."
      onClose={() => onConfirm(_.omit({ caption, color, type, soundFile }))}
      hasCancel="Cancel"
      onCancel={onCancel}
    >
      <p>Button caption:</p>
      <Input
        placeholder="Description shown on the button"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <p>Color:</p>
      <ColorPicker
        colors={availableColors}
        value={color}
        onSelectColor={setColor}
      />
      <p>Buttontype:</p>
      <Select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        {BUTTON_TYPES.map(({ label, type }) => <option key={type} value={type}>{label}</option>)}
      </Select>
      <p>Soundfile:</p>
      <FileSelect 
        selectedFile={soundFile}
        onFileSelect={setSoundFile}
      />
    </Modal>
  )
};

export default ButtonConfig;