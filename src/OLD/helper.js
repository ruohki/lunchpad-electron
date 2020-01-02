import midi from 'midi';

export const getInputs = () => {
  const input = new midi.input();
  let inputs = []
  for(let i = 0; i < input.getPortCount(); i++) {
    inputs.push(input.getPortName(i));
  }

  return inputs;
}

export const getOutputs = () => {
  const output = new midi.output();
  let outputs = []
  for(let i = 0; i < output.getPortCount(); i++) {
    outputs.push(output.getPortName(i));
  }

  return outputs;
}