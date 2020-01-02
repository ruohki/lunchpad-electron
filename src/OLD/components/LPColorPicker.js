import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { LPColors } from '../constants/lpcolors';
import { Split, Child, AspectBox } from './layout';
import { darken } from 'polished';

const ColorButton = styled.button`
  margin: 2px;
  outline: none;
  width: 32px;
  height: 32px;
  border: 2px solid ${({ color }) => darken(0.2, color) };
  border-radius: ${({ highlight }) => highlight ? "999px" : "3px"};
  background-color: ${({ color }) => color};
  cursor: pointer;
  transition: all .1s ease;
`;

const LPColorPicker = ({ selectedColor, onSelectColor }) => (
  <Split items="flex-start" wrap="wrap">
    {LPColors.map((e,i) => i === 0 ? (
      <Child key={`color-${i}`}>
        <ColorButton color={'gray'} highlight={i === selectedColor} onClick={(e) => onSelectColor(i, e)}>X</ColorButton>
      </Child>
    ) : (
      <Child key={`color-${i}`}>
        <ColorButton color={e} highlight={i === selectedColor} onClick={(e) => onSelectColor(i, e)} />
      </Child>
    ))}
  </Split>
)

export default LPColorPicker;