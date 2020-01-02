import React from 'react';

import { createGlobalStyle } from 'styled-components';

import { COLOR_DARKER, COLOR_WHITE } from '../../shared/constants/uiColors';
import 'react-tippy/dist/tippy.css'




const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%;
    //font-size: calc(16px + (20 - 16) * (100vw - 320px) / (1280 - 320));
  }

  * {
    margin: 0;
    padding: 0;

    overflow: hidden;
    user-select: none;

    box-sizing: border-box;
  }

  body {
    font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
    
    font-size: 1.6rem;
    font-weight: normal;
    font-style: normal;

    color: ${COLOR_WHITE};
    background-color: ${COLOR_DARKER};
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 100;
    text-transform: uppercase;
    text-shadow: 2px 2px #000000;
    margin-bottom: 1rem;
  }
`;

export default GlobalStyle;
