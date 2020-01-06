import 'babel-polyfill';

import { remote } from 'electron';

import { Cantor } from 'number-pairings'

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';

import GlobalStyle from './ui/components/globalStyle'
import App from './ui';

import midi from './midi'
import audio from './audio';

import { SELECTED_SOUND_OUTPUT_DEVICE, SELECTED_MIDI_INPUT_DEVICE, SELECTED_MIDI_OUTPUT_DEVICE, CURRENT_BUTTON_CONFIGURATION, AVAILABLE_LAYOUTS, CURRENT_PAGE } from './shared/constants/settings';

const settings = remote.getGlobal('settings');
const robot = remote.getGlobal('robotjs');

// Constructing Global Context for Manager Classes
const Midi = new midi();
const AudioManager = new audio();
const Robot = robot;

export const globalContext = React.createContext({
  Midi,
  AudioManager,
  Robot
});

if (module.hot) {
  Midi.closeInputDevice();
  Midi.closeOutputDevice();
  Midi.removeAllListeners();

  module.hot.accept();
}
// Setting default Output from settings
if(settings.has(SELECTED_SOUND_OUTPUT_DEVICE)) {
  const { deviceId } = settings.get(SELECTED_SOUND_OUTPUT_DEVICE);
  if (_.filter(AudioManager.getAvailableDevices(), (e) => e.deviceId === deviceId)) {
    AudioManager.setSinkId(deviceId);
  } else {
    settings.delete(SELECTED_SOUND_OUTPUT_DEVICE);
  }
}

// Subscribe for button config so the colors will update
const updateColors = (config) => {
  // Color Subscriber
  const { using, ...keys } = config;
  const layouts = settings.get(AVAILABLE_LAYOUTS);
  const usedLayout = _.find(layouts, ({ name }) => name === using);
  if (usedLayout.type === "midi") {

    //console.log(keys)
    Object.keys(keys).map((key) => {
      const button = _.get(config, key, {})
      const { id = key, color = 0 } = button;
      const [ status, note ] = Cantor().split(id);
      
      Midi.sendMessage([status, note, color]);
    })
  }
}

// Setting default Midi devices from settings
// Input
const updateMidiInput = (device) => {
  Midi.changeInputDevice(device);
}
settings.watch(SELECTED_MIDI_INPUT_DEVICE, updateMidiInput)

if (settings.has(SELECTED_MIDI_INPUT_DEVICE)) {
 const midiInputDevice = settings.get(SELECTED_MIDI_INPUT_DEVICE) 
 updateMidiInput(midiInputDevice)
}

// Output
const updateMidiOutput = (device) => {
  Midi.changeOutputDevice(device);
  updateColors(settings.get(CURRENT_BUTTON_CONFIGURATION));
}
settings.watch(SELECTED_MIDI_OUTPUT_DEVICE, updateMidiOutput)

if (settings.has(SELECTED_MIDI_OUTPUT_DEVICE)) {
 const midiOutputDevice = settings.get(SELECTED_MIDI_OUTPUT_DEVICE) 
 updateMidiOutput(midiOutputDevice)
}

settings.watch(CURRENT_BUTTON_CONFIGURATION, updateColors);

// Construct top level component
const StyledApp = () => (
  <Fragment>
    <GlobalStyle />
    <App />
  </Fragment>
)

//  Print settings
console.log(settings.getAll());

// Mount app to dom
ReactDOM.render(<StyledApp />, document.getElementById('root'));