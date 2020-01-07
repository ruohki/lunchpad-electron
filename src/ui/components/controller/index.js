import React from 'react';
import _ from 'lodash'

import { Cantor } from 'number-pairings';

import { COLOR_BLURPLE } from '../../../shared/constants/uiColors';

import { PadContainerInner, PadContainerOuter, PadRow, PadCol, Button} from './helper'

const Controller = ({ layout: currentLayout,
  config,
  onMouseDown = () => true,
  onMouseUp = () => true,
  onMiddleMouse = () => true,
  onClick = () => true,
  onContextMenu = () => true,
  onSettings = () => true,
  onDropFile = () => true,
  onSwapButtons = () => true
}) => {
  const { layout, colors } = currentLayout
  // selected={_.get(buttonState, `${id}.pressed`, false)}
  return (
    <PadContainerOuter>
      <PadContainerInner>
        {layout.rows.map(({ cols }, y) => (
          <PadRow key={`row-${y}`}>
            {cols.map(({ appearance, note, status, type }, x) => {
              const id = Cantor().join(status || y, note || x)
              switch (type) {
                case "button":
                  return (
                    <PadCol key={`col-${y}-${x}`}>
                      <Button
                        round={appearance === "round"}
                        color={colors[_.get(config, `${id}.color`, "initial")]}
                        caption={_.get(config, `${id}.caption`, '')}
                        onContextMenu={() => onContextMenu(id, _.get(config, id))}
                        onMouseDown={(e) => e.button === 0 ? onMouseDown(e, status || y,  note || x, 127) : null}
                        onMouseUp={(e) => {
                          if (e.button === 0) {
                            onMouseUp(e, status || y,  note || x, 0)
                          } else if (e.button === 1) {
                            onMiddleMouse(e, id)
                          }
                        }}

                        onDragEnter={(e) => {
                          e.preventDefault();
                          const item = e.dataTransfer.items[0];
                          if (item.kind === "file" && _.includes(item.type, "audio")) {
                            e.dataTransfer.dropEffect = "copyMove"
                            e.dataTransfer.dropEffect = "copyMove"
                          } else if (item.type == "button") {
                            e.dataTransfer.dropEffect = "move"
                            e.dataTransfer.dropEffect = "move"
                          } else {
                            e.dataTransfer.effectAllowed = "none";
                            e.dataTransfer.dropEffect = "none";
                          }
                          
                        }}

                        draggable={true}
                        
                        onDragStart={(e) => {
                          e.dataTransfer.setData("Button", id)
                        }}
                        
                        onDragOver={(e) => {
                          e.preventDefault()
                        }}

                        onDrop={(e) => {
                          e.preventDefault();

                          const item = e.dataTransfer.items[0];
                          
                          if (item.kind === "file" && _.includes(item.type, "audio")) {
                            onDropFile(id, e.dataTransfer.files[0]);
                          } else if (item.type == "button") {
                            var data = e.dataTransfer.getData("button");
                            onSwapButtons(data, id);
                          } else {
                          }
                          {/* console.log()
                          if (e.dataTransfer.files.length > 0) {
                            const item = event.dataTransfer.items[0];
                            if (item.kind === "file" && _.includes(item.type, "audio")) {
                              onDropFile(id, e.dataTransfer.files[0]);
                            }
                          } */}
                        }}
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