import { EventEmitter } from 'events';
import { v4 } from 'uuid'

import _ from 'lodash';

class AudioManager extends EventEmitter {
  constructor(...props) {
    super(props);
    
    this.removeAllListeners();

    this.defaultOutput = "default"
    this.AudioCollection = new Map();

    this.on('onFinished', () => {
      if (this.AudioCollection.size <= 0) {
        this.emit('onEndedPlayback');
      }
    })

  }

  loadFile(fileName, loop = false, context = false) {
    const uuid = v4()
    const audio = new Audio(fileName);
    
    audio.loop = loop;
    audio.context = context

    return new Promise((resolve) => {
      audio.setSinkId(this.defaultOutput).then(() => {
        audio.onerror = (err) => this.emit('onError', err, uuid);
        audio.onended = () => {
          this.AudioCollection.delete(uuid);
          this.emit('onFinished', uuid)
        }
        
        this.AudioCollection.set(uuid, audio)
        resolve(uuid);
      });
    })
  }

  setSinkId(sinkId) {
    this.defaultOutput = sinkId;
  }

  findSinkId(name) {
    return new Promise((res, rej) => {
      navigator.getUserMedia({ audio: true }, () => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          devices.map(d => {
            if ((d.kind === "audiooutput") && (d.label === name)) {
              return res(d.deviceId)
            }
          })
          rej(null);
        });
      },
      (err) => rej(err)
    )});
  }

  getAvailableDevices() {
    return new Promise((res, rej) => 
      navigator.mediaDevices.enumerateDevices().then(devices => res(devices.filter(({ kind }) => kind === "audiooutput"))).catch(rej)
    )
  }

  playAudio(uuid, volume = 1) {
    if (this.AudioCollection.size === 1) {
      this.emit('onStartedPlayback');
    }
    if (this.AudioCollection.has(uuid)) {
      const audio = this.AudioCollection.get(uuid);
      audio.volume = volume;
      audio.play();
    }
  }
  
  stopAudio(uuid) {
    if (this.AudioCollection.has(uuid)) {
      const audio = this.AudioCollection.get(uuid);
      audio.pause();
      this.AudioCollection.delete(uuid)
      return true;
    }
    return false;
  }

  stopAllAudio() {
    this.AudioCollection.forEach((audio, uuid) => {
      audio.pause();
    });
    this.AudioCollection.clear();
    this.emit('onEndedPlayback');
  }

  findByContext(context) {
    return new Promise(res => {
      this.AudioCollection.forEach((audio, uuid) => {
        if (_.isEqual(audio.context, context)) {
          res(uuid);
        }
      });
      res(undefined)
    })
    
  }
}

export default AudioManager;