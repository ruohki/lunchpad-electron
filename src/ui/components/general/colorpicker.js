import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { darken } from "polished";

const Overlay = styled.div`
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(auto-fill, minmax(24px, 1fr));

  transform: translateY(-10px);
  position: absolute;
  padding: 5px;
  margin: 0;
  max-width: 40vw;

  background-color: #23272a;
  border-radius: 8px;
  box-shadow: 0 0 25px black;

  &::-webkit-scrollbar {
    width: 1rem;
    background-color: transparent;
  }
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

const ColorButton = styled.button`
  cursor: pointer;
  margin: 1px;
  padding: 0;
  outline: none;
  border: 2px solid ${({ color }) => darken(0.2, color)};
  width: 24px;
  height: 24px;
  border-radius: ${({ selected }) => (selected ? 999 : 3)}px;
  background-color: ${({ color }) => color};
`;

const Outside = styled.div`
  min-width: 10vw;
  min-width: 50vw;
  background-color: #23272a;
  border: 2px solid #111111;
  border-radius: 7px;
  outline: none;
  height: 40px;
  padding: 8px;

  margin-bottom: 1rem;
`;

const DropDown = styled.div`
  background-color: ${({ color }) => color};
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 0 0 0 2px ${({ color }) => darken(0.2, color)};
  width: 100%;
  height: 100%;
`;

const ColorPicker = ({ colors = [], value, onSelectColor = () => true }) => {
  const [show, setShow] = useState(false);
  const [selectedColor, setSelectedColor] = useState(value || Math.floor(Math.random() * colors.length));

  const setColorAndClose = (i) => {
    setSelectedColor(i);
    setShow(false);

    onSelectColor(i);
  };

  const color = colors[selectedColor];

  return (
    <Outside color={color}>
      <DropDown color={color} onClick={() => setShow(!show)} />
      {show && (
        <Overlay>
          {colors.map((c, i) => (
            <ColorButton
              key={i}
              selected={color === i}
              onClick={() => setColorAndClose(i)}
              color={c}
            />
          ))}
        </Overlay>
      )}
    </Outside>
  );
};

export default ColorPicker;