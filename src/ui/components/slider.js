import React, { useState } from 'react'
import styled from 'styled-components'
import { COLOR_NOTBLACK, COLOR_REDISH, COLOR_ALMOSTBLACK } from '../../shared/constants/uiColors'

const StyledSlider = styled.input.attrs({
  type: "range"
})`
  overflow: hidden;
  display: block;
  appearance: none;
  
  width: 100%;
  margin: 0;
  height: 32px;
  cursor: pointer;

  background-color: transparent;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    background: ${COLOR_NOTBLACK};
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    height: 16px;
    width: 16px;
    background: ${COLOR_REDISH};
    border-radius: 100%;
    border: 0;
    top: 50%;
    transform: translateY(-50%);
    transition: background-color 150ms;
  }

  &:hover,
  &:focus {
    outline: none;
    &::-webkit-slider-thumb {
      background-color: ${COLOR_REDISH};
    }
  }
`

const Slider = ({ ...props }) => {

  return (
    <StyledSlider type="range" {...props} />
  )
}

export default Slider;