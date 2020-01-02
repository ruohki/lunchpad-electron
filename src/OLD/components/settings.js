import React, { Component } from 'react';
import midi from 'midi';
import settings from 'electron-settings';

import { COLOR_REDISH, COLOR_NOTBLACK, COLOR_ALMOSTBLACK } from './constants'
import { Split, Child, Outer } from './layout';

import { Input, Border, Button, TabPane } from './LPControls';

import { getInputs, getOutputs } from '../helper';

class Settings extends Component {
  constructor(props) {
    super(props);

    const {
      description = "",
      selectedFile = "",
      selectedColor = 0,
    } = props;

    const { input, output } = settings.get('devices');
    this.state = {
      selectedInput: input,
      selectedOutput: output,
      inputs: [],
      outputs: []
    }
  }

  componentDidMount() {
    const inputs = getInputs();
    const outputs = getOutputs();

    this.setState({
      inputs,
      outputs
    })
  }
  
  onAccept() {
    const { inputs, outputs, selectedInput, selectedOutput } = this.state;
    const { onAccept = () => true } = this.props;

    settings.set('devices.input', selectedInput)
    settings.set('devices.inputName', inputs[selectedInput])
    
    settings.set('devices.output', selectedOutput)
    settings.set('devices.outputName', outputs[selectedOutput])

    onAccept(config.get('devices'));
  }
  
  selectInput(i) {
    this.setState({ selectedInput: i})
  }

  selectOutput(i) {
    this.setState({ selectedOutput: i});
  }

  render() {
    const { onCancel = () => true } = this.props
    return (
      <Split direction="column">
        <Child>
          <h2>Input Devices</h2>
        </Child>
        <Child padding="0 0 3rem 0">
          <TabPane
            tabs={this.state.inputs}
            vertical
            selectedTab={this.state.selectedInput}
            onTabChanged={this.selectInput.bind(this)}
          />
        </Child>
        <Child>
          <h2>Output Devices</h2>
        </Child>
        <Child padding="0 0 3rem 0">
          <TabPane
            tabs={this.state.outputs}
            vertical
            selectedTab={this.state.selectedOutput}
            onTabChanged={this.selectOutput.bind(this)}
          />
        </Child>
        <Child>
          <Split justify="flex-end">
            <Child padding="0 1rem 0 0">
              <Button color={COLOR_REDISH} onAccept={onCancel}>Cancel</Button>
            </Child>
            <Child>
              <Button onAccept={this.onAccept.bind(this)}>Accept</Button>
            </Child>
          </Split>
        </Child>
      </Split>
    )
  }
}

export default Settings;