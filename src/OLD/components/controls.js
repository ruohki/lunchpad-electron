import React from 'react';
import styled from 'styled-components';
import { COLOR_WHITE, COLOR_NOTBLACK, COLOR_ALMOSTBLACK } from './constants'

export const Input = styled.input`
  padding: 10px;
  width: 100%;
  background-color: ${COLOR_NOTBLACK};
  border-radius: 7px;
  border: 2px solid ${COLOR_ALMOSTBLACK};
  font-size: 1.6rem;
  font-weight: normal;
  font-style: normal;

  color: ${COLOR_WHITE};
  outline: none;
`