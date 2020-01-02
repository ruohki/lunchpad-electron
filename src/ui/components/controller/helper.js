import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';
import { Text } from '../layout'
import buttonMask from '../../../../images/buttonMask.png'

export const PadContainerOuter = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
`;

export const PadContainerInner = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`

export const PadRow = styled.div`
  display: flex;
  flex-grow: 1;
  
`

export const PadCol = styled.div`
  flex-grow: 1;
  padding: 5px;
`

export const AspectBoxOuter = styled.div`

  width: 100%;
  padding-top: 100%;
  position: relative;
  
  cursor: pointer;
`

export const AspectBoxInner = styled.div`
  background-size: cover;
  background-image: url(${buttonMask});
  border-radius: ${({round}) => round ? "999" : "7"}px;
  border: 0.3rem solid ${({ selected }) => selected ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,.25)"};
  border-bottom: .8rem solid ${({ selected }) => selected ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,.25)"};
  border-radius: ${({round}) => round ? "999" : "7"}px;
  background-color: ${({ color }) => color};
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  &:hover {
    border: 0.3rem solid rgba(0,0,0,.30);
    border-bottom: .8rem solid rgba(0,0,0,.30);
  }

  &:active{
    margin-top: 0.2rem;
    border-bottom: 0.3rem solid rgba(0,0,0,.30);
  }
`

export const AspectBoxContainer = styled.div`

  padding: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 100%;
`

export const Button = ({ caption, round, color, selected, ...rest }) => {
  const Button = (
    <AspectBoxOuter round={round} {...rest} >
      <AspectBoxInner round={round} color={color} selected={selected}>
        <AspectBoxContainer>
          <Text truncate="ellipsis" align="center">{caption}</Text>
        </AspectBoxContainer>
      </AspectBoxInner>
    </AspectBoxOuter>
  )

  return caption.length > 6 ? (
    <Tooltip
      arrow={true}
      offset={1}
      distance={0}
      title={caption}
      size="big"
      position="bottom"
      trigger="mouseenter"
    >
      {Button}
    </Tooltip>
  ) : Button
}