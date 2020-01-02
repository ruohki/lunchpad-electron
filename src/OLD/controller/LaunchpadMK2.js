import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import buttonMask from '../images/buttonmask.png';

import 'react-tippy/dist/tippy.css'
import { Tooltip, withTooltip } from 'react-tippy';
import { LPColors } from '../constants/lpcolors';
import { Text } from '../components/layout';
const PadContainerOuter = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
`;

const PadContainerInner = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`

const PadRow = styled.div`
  display: flex;
  flex-grow: 1;
  
`

const PadCol = styled.div`
  flex-grow: 1;
  padding: 5px;
`

const AspectBoxOuter = styled.div`

  width: 100%;
  padding-top: 100%;
  position: relative;
  
  cursor: pointer;
`

const AspectBoxInner = styled.div`
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

const AspectBoxContainer = styled.div`

  padding: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Button = ({ caption, round, color, selected, onClick }) => {
  const Button = (
    <AspectBoxOuter round={round} onClick={onClick} >
      <AspectBoxInner round={round} color={color} selected={selected}>
        <AspectBoxContainer>
          <Text>{caption}</Text>
        </AspectBoxContainer>
      </AspectBoxInner>
    </AspectBoxOuter>
  )

  return caption.length > 6 ? (
    <Tooltip
      arrow={true}
      offset={0}
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

export const Launchpad = ({ buttons = {}, btn = new Map(), selected, onKeyPressed = () => true }) => (
  <PadContainerOuter>
    <PadContainerInner>
      {/* TopBar */}
      <PadRow>
        {_.range(0,8).map(i => {
          const btnConfig = btn.get(104 + i) || { color: 0, pressed: false, file: "", description: ""}

          return (
            <PadCol key={`top-${i}`}>
              <Button
                round
                color={LPColors[btnConfig.color]}
                selected={104 + i === selected}
                caption={btnConfig.description}
                onClick={(e) => onKeyPressed(e, 104 + i)}
              />
            </PadCol>
          )
        }
        )}
        <PadCol />
      </PadRow>{console.log("rerendering")}
      {_.range(0, 8).map(y => 
        <PadRow key={`row-${y}`}>
          {_.range(0,9).map(x => {
            const buttonIndex = y * 8 + x;
            const LPIndex = 81 - (y * 10) + x
            const btnConfig = btn.get(LPIndex) || { color: 0, pressed: false, file: "", description: ""}
            return (
              <PadCol key={`col-${y}-${x}`}>
                {x === 8 ? <Button
                              round
                              selected={LPIndex === selected}
                              color={LPColors[btnConfig.color]}
                              key={`side-${y}`}
                              caption={btnConfig.description}
                              onClick={(e) => onKeyPressed(e, LPIndex)}
                            />
                         : <Button
                              color={LPColors[btnConfig.color]}
                              selected={LPIndex === selected}
                              key={`btn-${x}`}
                              caption={btnConfig.description}
                              onClick={(e) => onKeyPressed(e, LPIndex)}
                           />
                }
              </PadCol>
            )
          }
          )}
        </PadRow>
      )}
    </PadContainerInner>
  </PadContainerOuter>
)