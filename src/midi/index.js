import { EventEmitter } from 'events';
import { remote } from 'electron';

import _ from 'lodash';

const midi = remote.getGlobal('midi');

class Midi extends EventEmitter {
  constructor(inputDevice, outputDevice, props) {
    super(props);

    this.removeAllListeners();

    this.output = new midi.output();
    this.input = new midi.input();

    // DEV
    _.range(this.output.getPortCount()).map(i => this.output.closePort(i))
    _.range(this.input.getPortCount()).map(i => this.input.closePort(i))

    if (inputDevice) {
      const { id, name } = inputDevice;
      // DEV
      _.range(this.input.getPortCount()).map(i => this.input.closePort(i))

      if (this.input.getPortName(id) === `${name} ${id}`) {

        this.input.openPort(id);
        this.openedInput = id;
      } else {
        this.openedInput = -1;
      }
    } else {
      this.openedInput = -1;
    }
    
    if (outputDevice) {
      const { id, name } = outputDevice;
      // DEV
      _.range(this.output.getPortCount()).map(i => this.output.closePort(i))

      if (this.output.getPortName(id) === `${name} ${id}`) {
        this.output.openPort(id);
        this.openedOutput = id;
      } else {
        this.openedOutput = -1;
      }
    } else {
      this.openedOutput = -1;
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

  closeInputDevice = () =>  this.input.closePort(this.openedInput)
  closeOutputDevice = () =>  this.output.closePort(this.openedOutput)

  changeInputDevice({ id, name }) {
    console.log("Trying to change MIDI Input to", `${id}: ${name}`)
    if (this.openedInput != -1) {
      console.log("Closeing Input:", this.openedInput)
      _.range(this.input.getPortCount()).map(i => this.input.closePort(i))
      this.openedInput = -1;
    }

    if (this.input.getPortName(id) === `${name} ${id}`) {
      console.log("Opening MIDI Input:", `${id}: ${name}`)
      this.input.openPort(id);
      this.openedInput = id;
    }
  }

  changeOutputDevice({ id, name }) {
    console.log("Trying to change MIDI Output to", `${id}: ${name}`)
    if (this.openedOutput != -1) {
      console.log("Closeing Output:", this.openedOutput)
      _.range(this.output.getPortCount()).map(i => this.output.closePort(i))
      this.openedOutput = -1;
    }

    if (this.output.getPortName(id) === `${name} ${id}`) {
      console.log("Opening MIDI Output:", `${id}: ${name}`)
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
      //console.log("Sending: ", status, note, velocity, this.openedOutput)
      return this.output.sendMessage([ status, note, velocity ])
    }
  }


}

export default Midi;