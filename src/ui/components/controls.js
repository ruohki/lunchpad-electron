import React from 'react';
import styled from 'styled-components';
import  { remote } from 'electron'

import _ from 'lodash';

import { lighten, darken } from 'polished';

import { COLOR_WHITE, COLOR_BLURPLE, COLOR_NOTBLACK, COLOR_DARK, COLOR_DARKER, COLOR_ALMOSTBLACK, COLOR_REDISH } from '../../shared/constants/uiColors'

import { Outer, Split, Child, Text } from './layout';

export const Input = styled.input`
  padding: 8px 10px 6px 10px;
  margin-bottom: 1rem;

  width: 100%;
  background-color: ${COLOR_NOTBLACK};
  border: 2px solid ${COLOR_ALMOSTBLACK};
  border-radius: 7px;
  font-size: 1.6rem;
  font-weight: normal;
  font-style: normal;

  color: ${COLOR_WHITE};
  outline: none;
`

export const Button = styled.button.attrs(({ color }) => ({
  basecolor: color || COLOR_BLURPLE
}))`
  padding: 10px 30px 10px 30px;
  min-width: 120px;

  background-color: ${({ basecolor }) => basecolor};

  border: none; 
  border-radius: 7px;

  font-size: 1.6rem;
  font-weight: normal;
  font-style: normal;
  color: ${COLOR_WHITE};
  outline: none;

  &:hover {
    background-color: ${({ basecolor }) => lighten(0.05, basecolor)};
  }

  &:active {
    background-color: ${({ basecolor }) => darken(0.05, basecolor)};
  }
`

export const Border = styled(Outer).attrs({
  padding: "10px",
  bg: COLOR_NOTBLACK,
  border: `2px solid ${COLOR_ALMOSTBLACK}`,
  radius: "7px"
})`
  caret-color: ${COLOR_BLURPLE};

  & > * {
    margin-bottom: 10px;
  }

  & :last-child {
    margin-bottom: 0;
  }

  > ${Input} {
    border: 1px solid ${COLOR_DARKER};

    &:focus {
      border-color: ${COLOR_ALMOSTBLACK};
    }
  }

  > ${this} {
    border: 1px solid ${COLOR_DARKER};
    background-color: ${COLOR_NOTBLACK};
  }
`;

const Pill = styled(Child).attrs(({ vertical, color}) => ({
  padding: "10px",
  align: vertical ? "left" : "center",
  fill: "fill",
  basecolor: color || COLOR_NOTBLACK
}))`
  cursor: pointer;
  color: ${COLOR_WHITE};
  background-color: ${({ basecolor }) => basecolor};
  &:hover {
    background-color: ${({ basecolor }) => lighten(0.05, basecolor)};
  }

  &:active {
    background-color: ${({ basecolor }) => darken(0.05, basecolor)};
  }
`

export const TabPane = ({ tabs = [], selectedTab = 0, onTabChanged = () => true, vertical = false }) => (
  <Border padding="0" overflow="hidden">
    <Split direction={vertical ? "column" : "row"}>
      {tabs.map((t, i) => (
        <Pill vertical={vertical} key={`pill-${t}-${i}`}
          onClick={(e) => onTabChanged(i)}
          color={selectedTab === i ? COLOR_BLURPLE : COLOR_NOTBLACK}
        >
          {t}
        </Pill>)
      )}
    </Split>
  </Border>
);

const FSelect = styled.input.attrs({
  type: "file"
})`
  display: none;
`

export const FileSelect = ({ selectedFile, onFileSelect = () => true}) => (
  <Split>
    <Child self="center" fill="fill">
      <Text>{selectedFile ? selectedFile.replace(/^.*[\\\/]/, '') : "No File selected!"}</Text>
    </Child>
    <Child>
      <Button onClick={() => {
        const result = remote.dialog.showOpenDialogSync({
          properties: ['openFile'],
          filters: [{
            name: "All files (*.*)",
            extensions: ["*"]
          }, {
            name: "Wave files (*.wav)",
            extensions: ["wav"]
          }, {
            name: "MP3 files (*.mp3)",
            extensions: ["mp3"]
          }, {
            name: "OGG Vorbis files (*.ogg)",
            extensions: ["ogg"]
          }]
        })
        onFileSelect(_.first(result));
        
        /* .then(result => {
          if(!result.canceled) {
            <
          } */
      }}>Choose file...</Button>
    </Child>
  </Split>
)

export const Hr = styled.hr`
 border: 1px solid ${COLOR_REDISH};
 margin-bottom: 1rem;
`