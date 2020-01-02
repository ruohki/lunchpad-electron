import React from 'react';
import _ from 'lodash'

import { Cantor } from 'number-pairings';

import { COLOR_BLURPLE } from '../../../shared/constants/uiColors';

import { PadContainerInner, PadContainerOuter, PadRow, PadCol, Button} from './helper'

const Controller = ({ layout: currentLayout, config, onClick = () => true, onContextMenu = () => true, onSettings = () => true }) => {
  const { layout, colors } = currentLayout
  // selected={_.get(buttonState, `${id}.pressed`, false)}
  return (
    <PadContainerOuter>
      <PadContainerInner>
        {layout.rows.map(({ cols }, y) => (
          <PadRow key={`row-${y}`}>
            {cols.map(({ appearance, note, status, type }, x) => {
              const id = Cantor().join(status, note)
              switch (type) {
                case "button":
                  return (
                    <PadCol key={`col-${y}-${x}`}>
                      <Button
                        round={appearance === "round"}
                        color={colors[_.get(config, `${id}.color`, "initial")]}
                        caption={_.get(config, `${id}.caption`, `${x}/${y}`)}
                        onContextMenu={() => onContextMenu(id, _.get(config, id))}
                        onClick={() => onClick(id, _.get(config, id))}
                      />
                    </PadCol>
                  )
                case "settings":
                  return (
                    <PadCol key={`col-${y}-${x}`}>
                      <Button
                        round={appearance === "round"}
                        color={COLOR_BLURPLE}
                        caption="SET"
                        onClick={onSettings}
                      />
                    </PadCol>
                  )
                case "spacer":
                  return (
                    <PadCol key={`col-${y}-${x}`} />
                  )
              }
            })}
          </PadRow>
        ))}
      </PadContainerInner>
    </PadContainerOuter>
  )
}

export default Controller;