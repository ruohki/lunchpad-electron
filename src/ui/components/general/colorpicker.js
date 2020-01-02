import React, { useState } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { Split, Child, AspectBox } from '../layout';
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

const ColorPicker = ({ colors, value, onSelectColor = () => true}) => {
  const [ color, setColor ] = useState(value)
  
  return (
    <Split items="flex-start" wrap="wrap">
      {colors.map((e,i) => i === 0 ? (
        <Child key={`color-${i}`}>
          <ColorButton color={'gray'} highlight={i === color} onClick={(e) => {
            setColor(i)
            onSelectColor(i, e)
          }} />
        </Child>
      ) : (
        <Child key={`color-${i}`}>
          <ColorButton color={e} highlight={i === color} onClick={(e) => {
            setColor(i)
            onSelectColor(i, e)
          }} />
        </Child>
      ))}
    </Split>
  )
}

export default ColorPicker;