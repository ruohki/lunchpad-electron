import { EventEmitter } from 'events';
import _ from 'lodash';
import { getGlobal } from 'electron';

const midi = getGlobal('midi');

class Midi extends EventEmitter {
  constructor(inputDevice, outputDevice, props) {
    super(props);

    this.output = new midi.output();
    this.input = new midi.input();

    if (inputDevice) {
      const { id, name } = inputDevice;

      if (this.input.getPortName(id) === `${name} ${id}`) {
        this.input.openPort(id);
        this.openedInput = id;
      } else {
        this.openedInput = -1;
      }
    }
    
    if (outputDevice) {
      const { id, name } = outputDevice;

      if (this.output.getPortName(id) === `${name} ${id}`) {
        this.output.openPort(id);
        this.openedOutput = id;
      } else {
        this.openedOutput = -1;
      }
    }

    // Setup Message Queue
    this.input.on('message', (deltaTime, [ status, data1, data2 ]) => {
      // The message is an array of numbers corresponding to the MIDI bytes:
      //   [status, data1, data2]
      // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
      // information interpreting the messages.
      const velocity = data2;
      const note = data1;
      console.log(`[Debug] status: ${status}, data1: ${data1}, data2: ${data2}`)

      this.emit('message', [ status, data1, data2])
    });
  }

  inputIsOpened = () => this.openedInput !== -1;
  outputIsOpened = () => this.openedOutput !== -1;

  changeInputDevice({ id, name }) {
    if (this.openedInput != -1) {
      this.input.closePort(this.openedInput);
      this.openedInput = -1;
    }

    if (this.input.getPortName(id) === `${name} ${id}`) {
      this.input.openPort(id);
      this.openedInput = id;
    }
  }

  changeOutputDevice() {
    if (this.openedOutput != -1) {
      this.input.closePort(this.openedOutput);
      this.openedOutput = -1;
    }

    if (this.output.getPortName(id) === `${name} ${id}`) {
      this.output.openPort(id);
      this.openedOutput = id;
    }
  }

  getAvailableInputs() {
    return _.times(this.input.getPortCount()).map((e, id) => ({
      id,
      name: this.input.getPortName(id).replace(/\s\d+$/g, ''),
    }))
  }

  getAvailableOutputs() {
    return _.times(this.output.getPortCount()).map((e, id) => ({
      id,
      name: this.output.getPortName(id).replace(/\s\d+$/g, ''),
    }))
  }

  sendMessage([ status, note, velocity ]) {
    if (this.openedOutput != -1) {
      return this.output.sendMessage([ status, note, velocity ])
    }
  }


}

export default Midi;