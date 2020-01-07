import React, { useState, Fragment } from 'react';

import _ from 'lodash';

import { Modal } from '../modal';
import { Input, Textarea, FileSelect, Hr } from '../controls';
import ColorPicker from '../general/colorpicker';
import Select from '../general/select';
import Slider from '../slider';

import { BUTTON_TYPES, BUTTON_TYPE_SOUND, BUTTON_TYPE_LOOP_SOUND, BUTTON_TYPE_WEB_REQUEST } from '../../../shared/constants/buttonTypes'
import { COLOR_REDISH } from '../../../shared/constants/uiColors';
import { Split, Child } from '../layout';

const ButtonConfig = ({ config, availableColors = [], onConfirm = () => true, onCancel = () => true }) => {
  const [ caption, setCaption ] = useState(_.get(config, 'caption', ''))
  const [ color, setColor ] = useState(_.get(config, 'color', 0))
  const [ type, setType ] = useState(_.get(config, 'type', 'sound'))
  
  const [ volume, setVolume ] = useState(_.get(config, 'volume', 0.9));
  const [ soundFile, setSoundFile ] = useState(_.get(config, 'soundFile', undefined))

  const [ url, setUrl ] = useState(_.get(config, 'url', ''))
  
  const [ method, setMethod ] = useState(_.get(config, 'method', 'GET'))
  
  const [ header, setHeader ] = useState(_.get(config, 'header', '{}'))
  const [ headerError, setHeaderError ] = useState();
  const [ body, setBody ] = useState(_.get(config, 'body', '{}'))
  const [ bodyError, setBodyError ] = useState();

  return (
    <Modal
      title="Button Configuration..."
      onClose={() => onConfirm(_.omit({ caption, color, type, soundFile, volume, url, method, header, body }))}
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
      <Hr />
      <p>Buttontype:</p>
      <Select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        {BUTTON_TYPES.map(({ label, type }) => <option key={type} value={type}>{label}</option>)}
      </Select>
      {_.includes([BUTTON_TYPE_SOUND, BUTTON_TYPE_LOOP_SOUND], type) && <Fragment>
        <p>Soundfile:</p>
        <FileSelect 
          selectedFile={soundFile}
          onFileSelect={setSoundFile}
        />
        <p>Volume: ({Math.floor(volume * 100)}%)</p>
        <Slider step={0.01} min={0} max={1} value={0.9} value={volume} onChange={(e) => setVolume(e.target.value)} />
      </Fragment>}
      {_.includes([BUTTON_TYPE_WEB_REQUEST], type) && <Fragment>
        <p>URL:</p>
        <Input
          placeholder="URL to be called"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <p>Method:</p>
        <Select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </Select>
        <Split>
          <Child fill="fill">
            <p>Header (JSON):</p>
            {headerError && <p style={{ color: COLOR_REDISH}}>{headerError}</p>}
            <Textarea
              value={header}
              onChange={(e) => {
                try {
                  const headerJson = JSON.parse(e.target.value)
                  setHeaderError(false)
                } catch {
                  setHeaderError("Invalid JSON!")
                }
                setHeader(e.target.value)
              }}
            />

          </Child>
          <Child fill="fill">
            <p>Body (JSON):</p>
            {bodyError && <p style={{ color: COLOR_REDISH}}>{bodyError}</p>}
            <Textarea
              value={body}
              onChange={(e) => {
                try {
                  const bodyJson = JSON.parse(e.target.value)
                  setBodyError(false)
                } catch {
                  setBodyError("Invalid JSON!")
                }
                setBody(e.target.value)
              }}
            />
          </Child>
        </Split>

      </Fragment>}
    </Modal>
  )
};

export default ButtonConfig;