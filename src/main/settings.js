import { screen } from 'electron';
import settings from 'electron-settings';

import * as Constants from '../shared/constants/settings';
import * as Configs from '../controller'

export const checkOrCreateDefaultOptions = () => {
  const { workAreaSize } = screen.getPrimaryDisplay();

  // Window Placement
  if (!settings.has(Constants.WINDOW_PLACEMENT)) {
    settings.set(Constants.WINDOW_PLACEMENT, {
      width: 972,
      height: 972,
      x: (workAreaSize.width / 2) - (972 / 2),
      y: (workAreaSize.height / 2) - (972 / 2)
    })
  }

  // Available Layouts
  settings.set(Constants.AVAILABLE_LAYOUTS, Object.keys(Configs).map(key => Configs[key]));
  
  // Current Config
  if (!settings.has(Constants.SELECTED_LAYOUT)) {
    settings.set(Constants.SELECTED_LAYOUT, Configs.Default);
  }

  // Button configuration
  if (!settings.has(Constants.CURRENT_BUTTON_CONFIGURATION)) {
    settings.set(Constants.CURRENT_BUTTON_CONFIGURATION, {
      using: Configs.Default.name
    })
  }
}