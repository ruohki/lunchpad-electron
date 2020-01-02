import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { COLOR_ALMOSTBLACK, COLOR_BLURPLE, COLOR_YETNOTBLACK, COLOR_REDISH } from '../../shared/constants/uiColors';

import { transparentize } from 'polished'
import { Split, Child, Text } from './layout';
import { Button } from './controls';

import { useFirstMountState } from 'react-use'

const StartColor = transparentize(1, COLOR_ALMOSTBLACK)
const EndColor = transparentize(0.25, COLOR_ALMOSTBLACK)

const FadeBackdrop = keyframes`
  from {
    transform: scaleX(0);
    background-color: ${StartColor}
  }

  1% {
    transform: scaleX(1);
    background-color: ${StartColor}
  }

  to {
    transform: scaleX(1);
    background-color: ${EndColor}
  }
`;

const FadeContent = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;
/* ${({ show, firstMount }) => firstMount ? null : (show ? fadeInBackdropAnimationMixin : fadeOutBackdropAnimationMixin)} */

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  
  
  display: flex;
  
  justify-content: center;
  align-items: center;
  
  background-color: ${EndColor};
`

const Content = styled.div`
  background-color: ${COLOR_ALMOSTBLACK};
  overflow: hidden;
  min-width: 50vw;
  min-height: 50vw;
  max-width: 90vw;
  max-height: 90vh;

  border-radius: 8px;
  box-shadow: 0 0 25px black;
`

export const Modal = ({ onClick, onClose, onCancel = () => true, title, hasCancel, children, ...props }) => {
  const firstMount = useFirstMountState();

  return (
    <Backdrop {...props}>
      <Content >
        {/* Temp */}
        <Split direction="column" minHeight="50vh" minWidth="50vw">
          <Child padding="0.8rem 1rem" bg={COLOR_YETNOTBLACK}>
            <Text size="1.7rem" spacing="1.5px">
              {title}
            </Text>
            
          </Child>
          
          <Child fill="fill" padding="1rem">
            {children}
          </Child>
          <Child bg={COLOR_YETNOTBLACK}>
            <Split justify="flex-end"  spacing="1rem">
              {hasCancel && <Child>
                <Button color={COLOR_REDISH} onClick={onCancel}>{hasCancel}</Button>
              </Child>}
              <Child>
                <Button onClick={onClose}>Accept</Button>
              </Child>
            </Split>
          </Child>
        </Split>
      </Content>
    </Backdrop>
  )
}