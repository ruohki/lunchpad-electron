
import React, { Component } from 'react';

import _ from 'lodash';
import midi from 'midi';
import settings from 'electron-settings';

import { getInputs, getOutputs } from './helper';

import { Main, Split, Child } from './components/layout';
import LPButton from './components/LPButton';
import styled from 'styled-components'
import { Launchpad as MK2 } from './controller/LaunchpadMK2';
import LPButtonConfig from './components/LPBButtonConfig';
import Preferences from './components/settings';

const { Provider } = React.createContext({
  setKeyColor(key, color) {
    this.midiOutput.sendMessage(144, key, color);
  }
});

const createDefaultConfig = () => {
  settings.set('devices', {
    input: 0,
    output: 0
  });
}

const VR = styled.div`
  height: 100%;
  width: 50%;
  border-right: 2px solid rgba(0,0,0,0.25);
`

class App extends Component {
  constructor(props) {
    super(props);

    let buttons = {}
    _.range(0, 8).map(y =>
      _.range(0, 8).map(x =>
        buttons[81 - (y * 10) + x] = { color: 0, pressed: false, file: "", description: "" }
      )
    )
    
    this.state = {
      buttons,
      btn: new Map(),
      selectedKey: 0,
      selectedColor: 3,
      showPreferences: false
    }


    if (!settings.has('devices')) {
      createDefaultConfig();
      this.state.showPreferences = true;
    } else {
      this.state.config = {
        devices: settings.get('devices')
      }
    }

  }

  initializeMidi() {
    this.midiInput = new midi.input();
    this.midiOutput = new midi.output();

    this.midiInput.on('message', (deltaTime, [id, key, val]) => {
      let pressed = val ? true : false
console.log(id)
      if (id === 144 /* Normal Keys */) {
        if (key % 10 === 9 /* Side Bar Keys */) {
          this.launchpadSideKeyEvent(key/*  % 9 - 1< */, pressed);
        } else {
          this.launchpadKeyEvent(key, pressed);
        }
      } else if (id === 176 /* Top Row Keys*/) {
        this.launchpadTopKeyEvent(key/*  % 104 */, pressed)
      }

      const { btn } = this.state;
      let btnConfig = btn.get(key) || { color: 0};
      btnConfig.pressed = pressed
      btn.set(key, btnConfig);

      this.setState(prevState => ({
        btn,
        buttons: {
          ...prevState.buttons,
          [key]: {
            ...prevState.buttons[key],
            pressed
          }
        }
      }))
    });

    let { input, output, inputName, outputName } = settings.get('devices');
    
    try {
      // Name & DeviceID Check
      const inputs = getInputs();
      const outputs = getOutputs();
      if (inputs[input] !== inputName) {
        input = inputs.indexOf(inputName);
      }
      
      if (input !== -1) {
        this.midiInput.openPort(input);
        settings.set('devices.input', input)
      }
      
      if (outputs[output] !== outputName) {
        output = outputs.indexOf(outputName)
        settings.set('devices.output', output)
      }

      if (output !== -1) {
        this.midiOutput.openPort(output);
        settings.set('devices.output', output)
      }
    } catch (ex) {
      console.error("Error setting up MIDI devices.")
    }
  }

  componentDidMount() {
    this.initializeMidi();
    this.clearLaunchpad();
  }

  launchpadKeyEvent(key, pressed) {
    const { btn } = this.state;
    const buttonConfig = btn.get(key) || { color: 0}

    this.midiOutput.sendMessage([144, key, pressed ? 123 : buttonConfig.color])
    console.log(`Main Button: ${key}, pressed: ${pressed}`)
  }

  clearLaunchpad() {
    _.range(11, 89).map(i => this.midiOutput.sendMessage([144, i, 0]))
  }

  buildLights() {
    const { btn } = this.state;
    _.range(11, 89).map(i => {
      const buttonConfig = btn.get(i) || { color: 0}
      this.midiOutput.sendMessage([144, i, buttonConfig.color])
    })
  }

  launchpadTopKeyEvent(key, pressed) {
    this.clearLaunchpad();
    console.log(`Top Button: ${key}, pressed: ${pressed}`)
  }

  launchpadSideKeyEvent(key, pressed) {
    console.log(`Side Button: ${key}, pressed: ${pressed}`)
  }

  selectKey(key) {
    const { selectedKey } = this.state;
    this.setState({ selectedKey: selectedKey === key ? 0 : key });
  }

  acceptButtonConfig(e) {
    const { description, file, color, selectedKey } = e;
    const { btn } = this.state;
    let buttonConfig = btn.get(e.selectedKey) || { pressed: false, description, color, file}

    btn.set(selectedKey, buttonConfig);
    this.setState({ btn, selectedKey: 0 })
    this.buildLights()
  }
  render() {
    const { btn, selectedKey } = this.state;
    const buttonConfig = btn.get(selectedKey) || { pressed: false, color: 0, file: "", description: ""};
    
    return (
      <Main>
        <div style={{ padding: "1rem", width: "100%", height: "100%"}}>
          <Split>
            {this.state.selectedKey !== 0 ? (
              <Child>
                <LPButtonConfig
                  selectedKey={this.state.selectedKey}
                  selectedColor={buttonConfig.color}
                  description={buttonConfig.description}
                  selectedFile={buttonConfig.file}

                  onCancel={() => this.setState({ selectedKey: 0 })}
                  onAccept={this.acceptButtonConfig.bind(this)}
                />
              </Child>
            ) : (
              <Child fill>
                {this.state.showPreferences ? (
                  <Preferences
                    onCancel={() => this.setState({ showPreferences: false}) }
                    onAccpet={() => {
                      this.setState({ showPreferences: false })
                      this.initializeMidi();
                    }}
                  />
                ) : (
                  <MK2 selected={this.state.selectedKey} btn={this.state.btn} buttons={this.state.buttons} onKeyPressed={(e, selectedKey) => this.selectKey(selectedKey)} />
                )}
              </Child>
            )}
          </Split>
        </div>
      </Main>
    )
  }
}

//

export default App;


/*
<Split direction="column">
              <Split justify="center" self="stretch" content="stretch">
                <Child fill padding="15px">
                  <LPButton color={"light"} round />
                </Child>
                <Child fill padding="15px">
                  <LPButton color={"light"} round />
                </Child>
                <Child fill padding="15px">
                  <LPButton color={"light"} round />
                </Child>
                <Child fill padding="15px">
                  <LPButton color={"light"} round />
                </Child>
                <Child fill padding="15px">
                  <LPButton color={"light"} round />
                </Child>
                <Child fill padding="15px">
                  <LPButton color={"light"} round />
                </Child>
                <Child fill padding="15px">
                  <LPButton color={"light"} round />
                </Child>
                <Child fill padding="15px">
                  <LPButton color={"light"} round />
                </Child>
              </Split>
              {_.range(0, 8).map(y => (
                <Split key={`row-${y}`} justify="center" self="stretch" content="stretch">
                  {_.range(0, 8).map(x => {
                    const buttonIndex = y * 8 + x;
                    const LPIndex = 81 - (y * 10) + x
                    return (
                      <Child key={`col-${x}`} fill={true} padding="5px">
                        <LPButton index={buttonIndex} color={this.state.buttons[LPIndex].pressed ? 'red' : 'light'}>{LPIndex}</LPButton>
                      </Child>
                    )
                  })}
                </Split>
              ))}
            </Split>
*/