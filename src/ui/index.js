import React, { useContext, useState } from 'react';
import _ from 'lodash'
import { Cantor } from 'number-pairings';

import Controller from './components/controller';
import ButtonConfig from './components/buttonConfig';
import ApplicationConfig from './components/settings';

import { Main } from './components/layout';
import { globalContext } from '../index'

import { useSettings } from './components/hooks';

import { SELECTED_LAYOUT, CURRENT_BUTTON_CONFIGURATION, USE_PUSH_TO_TALK, PUSH_TO_TALK } from '../shared/constants/settings';
import { COLOR_DARKER, COLOR_WHITE } from '../shared/constants/uiColors';
import { BUTTON_TYPE_SOUND, BUTTON_TYPE_STOP_SOUND, BUTTON_TYPE_LAUNCH_COMMAND, BUTTON_TYPE_WEB_REQUEST, BUTTON_TYPE_LOOP_SOUND } from '../shared/constants/buttonTypes';

const App = () => {
  const [ selectedLayout ] = useSettings(SELECTED_LAYOUT);
  const [ buttonConfig, setButtonConfig ] = useSettings(CURRENT_BUTTON_CONFIGURATION);
  
  const [ usePushToTalk ] = useSettings(USE_PUSH_TO_TALK);
  const [ pushToTalk ] = useSettings(PUSH_TO_TALK);

  const { Midi, AudioManager, Robot } = useContext(globalContext);
  
  // Modals
  const [ showSettings, setShowSettings ] = useState(false);
  const [ showButtonConfig, setShowButtonConfig ] = useState(false);

  AudioManager.on('onStartedPlayback', () => {
    console.log("Started")
    if (usePushToTalk === "mouse") {
      Robot.mouseToggle('down', pushToTalk)
    }
  })
  
  AudioManager.on('onEndedPlayback', () => {
    console.log("Ended")
    if (usePushToTalk === "mouse") {
      Robot.mouseToggle('up', pushToTalk)
    }
  })

  Midi.removeAllListeners();
  Midi.on('message', ([status, note, velo]) => {
    const id = Cantor().join(status, note)
    const button = _.get(buttonConfig, id, false)
    
    if (button) {
      let loop = button.type === BUTTON_TYPE_LOOP_SOUND;
      if (velo != 0) {
        console.log(button.type)
        switch(button.type) {
          case BUTTON_TYPE_SOUND:
          case BUTTON_TYPE_LOOP_SOUND:
            if (button.soundFile) {
              AudioManager.loadFile(button.soundFile, loop, id).then(uuid => {
                AudioManager.playAudio(uuid)
              })
            }
            break;
          case BUTTON_TYPE_STOP_SOUND:
            AudioManager.stopAllAudio();
            break;
          }
      } else {
        switch(button.type) {
          case BUTTON_TYPE_SOUND:
          case BUTTON_TYPE_LOOP_SOUND:
            if (loop) {
              AudioManager.findByContext(id).then(uuid => AudioManager.stopAudio(uuid));
            }
            break;
        }
      }
    }
  })

  return (
    <Main bg={COLOR_DARKER} color={COLOR_WHITE}>
      {selectedLayout && <Controller
        layout={selectedLayout}
        config={buttonConfig}

        onContextMenu={(id) => setShowButtonConfig(id)}
        onSettings={() => setShowSettings(true)}
      />}
      {showSettings && <ApplicationConfig
        layout={selectedLayout}
        audioManager={AudioManager}
        onClose={() => setShowSettings(false)}
      />}
      {!!showButtonConfig && <ButtonConfig 
        config={_.get(buttonConfig, showButtonConfig, { id: showButtonConfig })}
        availableColors={selectedLayout.colors}
        onConfirm={(c) => {
          console.log(c)
          setButtonConfig(Object.assign({}, buttonConfig, { [showButtonConfig]: c}));
          setShowButtonConfig(false)
        }}
        onCancel={() => setShowButtonConfig(false)}
      />}
    </Main>
  )
}

export default App







  /* useEffect(() => {
    const callback = (event, { status, note, velocity }) => {
      let id = Cantor().join(status, note);
      
      if (velocity != 0) {
        // Pressed
        //dispatch({ type: SET_BUTTON_STATE, payload: { id, color, pressed: velocity != 0 }})

      } else {
        // Released
        //dispatch({ type: SET_BUTTON_STATE, payload: { id, pressed: velocity != 0 }})
        //ipcRenderer.send(SEND_DEVICE_MESSAGE, { status, note, velocity: 0})
      }
    }
    
    ipcRenderer.on(RECEIVE_DEVICE_MESSAGE, callback)
    return () => {
      ipcRenderer.removeListener(RECEIVE_DEVICE_MESSAGE, callback)
    }
  }) */
