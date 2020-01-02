import React, { Component } from 'react';

import { COLOR_REDISH, COLOR_NOTBLACK, COLOR_ALMOSTBLACK } from './constants'
import { Split, Child, Outer } from './layout';
import LPColorPicker from './LPColorPicker';

import { Input, Border, Button, TabPane, FileSelect } from './LPControls';

class LPButtonConfig extends Component {
  constructor(props) {
    super(props);

    const {
      selectedKey = 0,
      description = "",
      selectedFile = "",
      selectedColor = 0,
    } = props;

    this.state = {
      description,
      selectedFile,
      selectedColor,
      selectedTab: 0
    }
  }

  onAccept() {
    const { selectedKey, onAccept = () => true} = this.props;

    const result = {
      selectedKey,
      color: this.state.selectedColor,
      description: this.state.description,
      file: this.state.selectedFile
    }

    onAccept(result);
  }

  onCancel() {
    const {onCancel = () => true } = this.props;
    onCancel();
  }

  render() {
    

    return (
      <Split direction="column">
        <Child>
          <h2>Description</h2>
        </Child>
        <Child padding="0 0 3rem 0">
          <Input
            placeholder="Description that is shown on the Button"
            value={this.state.description}
            onChange={(e) => this.setState({ description: e.target.value })}
          />
        </Child>
        <Child>
          <h2>Color</h2>
        </Child>
        <Child padding="0 0 3rem 0">
          <Border>
            <LPColorPicker selectedColor={this.state.selectedColor} onSelectColor={(e) => this.setState({ selectedColor: e })} />
          </Border>
        </Child>
        <Child>
          <h2>Macrotype</h2>
        </Child>
        <Child padding="0 0 3rem 0">
          <TabPane
            tabs={["None", "Play Sound", "Keyboard", "Run Application"]}
            onTabChanged={(e) => this.setState({selectedTab: e})}
            selectedTab={this.state.selectedTab}
          />
        </Child>
        <Child padding="0 0 3rem 0">
          <Border>
            <FileSelect selectedFile={this.state.selectedFile} onFileSelect={(f) => this.setState({ selectedFile: f })} />
          </Border>
        </Child>
        <Child>
          <Split justify="flex-end">
            <Child padding="0 1rem 0 0">
              <Button color={COLOR_REDISH} onClick={this.onCancel.bind(this)}>Cancel</Button>
            </Child>
            <Child>
              <Button onClick={this.onAccept.bind(this)}>Accept</Button>
            </Child>
          </Split>
        </Child>
      </Split>
    )
  }
}

export default LPButtonConfig;