import React from 'react';
import Select from '../general/select';
import { useSettings } from '../hooks';

import { SELECTED_LAYOUT, AVAILABLE_LAYOUTS, CURRENT_BUTTON_CONFIGURATION } from '../../../shared/constants/settings';

import _ from 'lodash';

const OperationMode = ({ onChange = () => true }) => {
  const [ selectedLayout, setSelectedLayout ] = useSettings(SELECTED_LAYOUT)
  const [ buttonConfig, setButtonConfig ] = useSettings(CURRENT_BUTTON_CONFIGURATION);

  const [ availableLayouts = [] ] = useSettings(AVAILABLE_LAYOUTS);
  return (
    <Select
      value={_.get(selectedLayout, 'name', 0)}
      onChange={e => {
        const element = availableLayouts.find(l => l.name === e.target.value)
        setButtonConfig({ using: _.get(selectedLayout, 'name', 'Software Only') })
        setSelectedLayout(element)
        //onChange(element)
      }}
    >
      {availableLayouts.map(l => 
        <option key={l.name} value={l.name}>{l.name}</option>
      )}
    </Select>
  );
};

export default OperationMode