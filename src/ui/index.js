import React, { useContext, useState, useEffect } from 'react';
import _ from 'lodash'
import { Cantor } from 'number-pairings';
import { remote } from 'electron';

import Controller from './components/controller';
import ButtonConfig from './components/buttonConfig';
import ApplicationConfig from './components/settings';

import { Main } from './components/layout';
import { globalContext } from '../index'

import { useSettings, useButtonConfig } from './components/hooks';

import { SELECTED_LAYOUT, CURRENT_BUTTON_CONFIGURATION, USE_PUSH_TO_TALK, PUSH_TO_TALK } from '../shared/constants/settings';
import { COLOR_DARKER, COLOR_WHITE } from '../shared/constants/uiColors';
import { BUTTON_TYPE_SOUND, BUTTON_TYPE_STOP_SOUND, BUTTON_TYPE_LAUNCH_COMMAND, BUTTON_TYPE_WEB_REQUEST, BUTTON_TYPE_LOOP_SOUND, BUTTON_TYPE_PAGE } from '../shared/constants/buttonTypes';

const request = remote.getGlobal('request');
const Robot = remote.getGlobal('robotjs');

const App = () => {
  const [ selectedLayout ] = useSettings(SELECTED_LAYOUT);
  //const [ buttonConfig, setButton, changePage ] = useSettings(CURRENT_BUTTON_CONFIGURATION);
  
  const [ buttonConfig, setButton, changePage ] = useButtonConfig();

  const [ usePushToTalk ] = useSettings(USE_PUSH_TO_TALK);
  const [ pushToTalk ] = useSettings(PUSH_TO_TALK);

  const { Midi, AudioManager } = useContext(globalContext);
  
  // Modals
  const [ showSettings, setShowSettings ] = useState(false);
  const [ showButtonConfig, setShowButtonConfig ] = useState(false);

  useEffect(() => {
    const onStartedPlayback = () => {
      if (usePushToTalk === "mouse") {
        Robot.mouseToggle('down', pushToTalk)
      }
    }

    const onEndedPlayback = () => {
      if (usePushToTalk === "mouse") {
        Robot.mouseToggle('up', pushToTalk)
      }
    }

    const onMidiMessage = ([status, note, velo]) => {
      console.log(status, note, velo)
      const id = Cantor().join(status, note)
      const button = _.get(buttonConfig, id, false)
      
      if (button) {
        let loop = button.type === BUTTON_TYPE_LOOP_SOUND;
        if (velo != 0) {
          console.log("Button type:", button.type)
          switch(button.type) {
            case BUTTON_TYPE_SOUND:
            case BUTTON_TYPE_LOOP_SOUND:
              if (button.soundFile) {
                AudioManager.loadFile(button.soundFile, loop, id).then(uuid => {
                  AudioManager.playAudio(uuid, _.get(button, 'volume', 1))
                })
              }
              break;
            case BUTTON_TYPE_STOP_SOUND:
              AudioManager.stopAllAudio();
              break;
            case BUTTON_TYPE_WEB_REQUEST:
              const { url, method, body, header } = button;
              request({
                url,
                method,
                headers: JSON.parse(header),
                body,
              }, (err, res, body) => {
                if (err) { return console.log(err); }
              });
              break;
            case BUTTON_TYPE_PAGE:
              changePage(button.pageIdentifier)
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
    }

    AudioManager.on('onStartedPlayback', onStartedPlayback)
    AudioManager.on('onEndedPlayback', onEndedPlayback)
    Midi.on('message', onMidiMessage)

    return () => {
      AudioManager.off('onStartedPlayback', onStartedPlayback)
      AudioManager.off('onEndedPlayback', onEndedPlayback)
      Midi.off('message', onMidiMessage)
    }
  })

  return (
    <Main bg={COLOR_DARKER} color={COLOR_WHITE}>
      {selectedLayout && <Controller
        layout={selectedLayout}
        config={buttonConfig}

        onContextMenu={(id) => setShowButtonConfig(id)}
        onSettings={() => setShowSettings(true)}
        onMouseDown={(e, status, note, velo) => Midi.emit('message', [status, note, velo])}
        onMouseUp={(e, status, note, velo) => Midi.emit('message', [status, note, velo])}
        onMiddleMouse={(e, id) => {
          if (_.get(buttonConfig, id, undefined)) {
            setButton(id, undefined);
          }
        }}
        onDropFile={(id, { name, path}) => {
          let button = {
            type: BUTTON_TYPE_SOUND,
            caption: name,
            soundFile: path,
            volume: 1,
            color: Math.floor(Math.random() * selectedLayout.colors.length)
          }
          setButton(id, button)
        }}

        onSwapButtons={(oldId, newId) => {
          let oldButton = _.get(buttonConfig, oldId, undefined);
          let newButton = _.get(buttonConfig, newId, undefined);

          if (!_.isEmpty(newButton) && !_.isEmpty(oldButton)) {
            // Swap
            setButton([[oldId, newButton], [newId, oldButton]])

          } else if (_.isEmpty(newButton) && !_.isEmpty(oldButton)) {
            // Target is Empty
            setButton([[newId, oldButton], [oldId, undefined]])
          } else {
            // Source is Empty
            setButton([[oldId, newButton], [newId, undefined]])
          }
        }}
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
          setButton(showButtonConfig, c)
          setShowButtonConfig(false)
        }}
        onCancel={() => setShowButtonConfig(false)}
      />}
    </Main>
  )
}

export default App