export const BUTTON_TYPE_SOUND = "sound"
export const BUTTON_TYPE_LOOP_SOUND = "loopsound"
export const BUTTON_TYPE_STOP_SOUND = "stopsound"

export const BUTTON_TYPE_LAUNCH_COMMAND = "launch"

export const BUTTON_TYPE_WEB_REQUEST = "request"

export const BUTTON_TYPES = [{
  label: "Sound",
  type: BUTTON_TYPE_SOUND
}, {
  label: "Looping Sound",
  type: BUTTON_TYPE_LOOP_SOUND
}, {
  label: "Stop all Sounds",
  type: BUTTON_TYPE_STOP_SOUND
}, {
  label: "Launch application",
  type: BUTTON_TYPE_LAUNCH_COMMAND
}, {
  label: "Perform WebRequest",
  type: BUTTON_TYPE_WEB_REQUEST
}]