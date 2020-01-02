import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

export const Color = styled.div`
  color: ${({ color }) => (color || 'inherit')};
  background-color: ${({ bg }) => (bg || 'transparent')};
`;

export const Outer = styled(Color)`
  padding: ${({ padding }) => (padding || 'initial')};
  margin: ${({ margin }) => (margin || 'initial')};
  
  max-width: ${({ maxWidth }) => (maxWidth || 'initial')};
  min-width: ${({ minWidth }) => (minWidth || 'initial')};

  max-height: ${({ maxHeight }) => (maxHeight || 'initial')};
  min-height: ${({ minHeight }) => (minHeight || 'initial')};

  width: ${({ width }) => (width || 'initial')};
  height: ${({ height }) => (height || 'initial')};

  border: ${({ border }) => border || "none"};
  border-radius: ${({ radius }) => (radius || 'initial')};

  overflow:   ${({ overflow }) => (overflow || 'initial')};
  text-align: ${({ align }) => (align || 'default')};
  
  &:hover {
    background-color: ${({ hover = {}, bg }) => (hover.bg || (bg || 'transparent'))};
    color: ${({ hover = {} }) => (hover.color || 'inherit')};
  }

  cursor: ${({ onClick }) => onClick ? 'pointer' : 'inherit'}

  ${({ transition }) => {
    if (!transition) return '';

    if (_.isArray(transition)) {
      return transition.map(t => `transition: ${t};`).join('\r\n');
    }

    return `transition: ${transition};`;
  }}

`;

export const Main = styled(Outer)`
  width: 100vw;
  height: 100vh;
`;

export const Child = styled(Outer)`
  box-sizing: border-box;
  transition: flex-basis 150ms ease;

  padding: ${({ padding }) => (padding || 'initial')};
  flex-grow: ${({ fill }) => (fill ? '1' : '0')};
  align-self: ${({ self }) => (self || 'stretch')};
  flex-basis: ${({ basis }) => (basis || 'content')};
  
  white-space: nowrap;
  text-overflow: ${({ truncate }) => (truncate ? 'ellipsis' : 'clip')};

  overflow: ${({ truncate }) => (truncate ? 'hidden' : 'initial')};

  overflow-y: ${({ scroll }) => (scroll ? 'scroll' : 'visible')};
  &::-webkit-scrollbar {
    width: 1rem;
    background-color: transparent;
  }

  ${({ responsive }) => responsive ? `
    @media only screen and (max-width: 1200px) {
      flex-basis: 100%;

      > * {
        padding: 0 !important;
      }
    }
  ` : ''}

  &::-webkit-scrollbar-thumb:vertical {
    background: rgba(255, 255, 255, 0.1);
    background-clip: padding-box;
    border-radius: 999rem;
    border: 0.2rem solid transparent;
    min-height: 1rem;
  }
  &::-webkit-scrollbar-thumb:vertical:active {
    background: rgba(255, 255, 255, 0.2);
    background-clip: padding-box;
    border-radius: 999rem;
    border: 0.2rem solid transparent;
  }
`;

export const Split = styled(Outer)`
  display: flex;
  height: ${({ height }) => (height || '100%')};
  width: ${({ width }) => (width || '100%')};
  min-height: ${({ minHeight }) => (minHeight || 'initial')};
  min-width: ${({ minWidth }) => (minWidth || 'initial')};

  justify-content: ${({ justify }) => (justify || 'flex-start')};
  flex-direction: ${({ direction }) => (direction || 'row')};
  align-items: ${({ items }) => (items || 'stretch')};
  align-content: ${({ content }) => (content || 'flex-start')};
  flex-wrap: ${({ wrap }) => wrap || "nowrap"}

  ${({ responsive }) => responsive ? `
    @media only screen and (max-width: 1200px) {
      flex-wrap: wrap;
      align-content: stretch;
    }
  ` : ''}

  > ${Child} {
    margin-top: ${({ spacing }) => (spacing ? '1rem' : '0')};
    margin-bottom: ${({ spacing }) => (spacing ? '1rem' : '0')};
    margin-right: ${({ spacing }) => (spacing ? '1rem' : '0')};

    &:first-child {
      margin-left: ${({ spacing }) => (spacing ? '1rem' : '0')};
    }
  }
`;

export const Text = styled.span`
  display: ${({ inline }) => inline ? 'inline' : 'block'};
  font-size: ${({ size }) => (size || 'inherit')};
  font-weight: ${({ weight }) => (weight || 'normal')};
  font-style: ${({ textStyle }) => (textStyle || 'normal')};
  text-transform: ${({ transform }) => (transform || 'initial')};
  text-align: ${({ align }) => (align || 'initial')};
  color: ${({ color }) => (color || 'inherit')};
  background-color: ${({ bg }) => (bg || 'transparent')};

  width: ${({ width }) => (width || 'initial')};
  height: ${({ height }) => (height || 'initial')};

  letter-spacing: ${({ spacing }) => (spacing || 'initial')};

  white-space: nowrap;
  text-overflow: ${({ truncate }) => (truncate ? 'ellipsis' : 'clip')};
  overflow: hidden;

  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'initial')};
`;

export const List = ({ children, alternative }) => (
  React.Children.count(children) <= 0 ? alternative : children
);