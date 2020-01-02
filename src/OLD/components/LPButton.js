import React from 'react';
import styled from 'styled-components';

import buttonMask from '../../images/buttonMask.png';
import { Outer } from './layout';

const Button = styled.button`
  border: 2px solid rgba(0,0,0,.25);
  outline: none;
  border-radius: ${({ radius }) => radius || "7px"};

  min-height: ${({ height }) => height || "48px"};
  min-width: ${({ width }) => width || "48px"};

  width: 100%;
  height: 100%;

  background-size: cover;
  background-color: ${({ color }) => color};
  background-image: url(${buttonMask});
`
const LPButton = ({ children, round = false, color = "light" }) => (
  <Button color={color} radius={round ? "999px" : "7px"}>{children}</Button>
)

export default LPButton