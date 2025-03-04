'use strict';

function AXEZ() {
const createFrame = (frameData={}) => {

  let frame = [192, 0];
  let destination = (frameData.destination.toString().toLocaleUpperCase() + "      ").split('').map(val=>{
    return val.charCodeAt(0) * 2;
  });
  if (destination.length > 6) {
    destination = destination.slice(0,6);
  }
  for(let i = 0; i < destination.length; i++) {
    frame.push(destination[i]);
  }

  let destinationSSID = (frameData.destinationSSID < 16 && frameData.destinationSSID > -1 ? frameData.destinationSSID : 0)
  frame.push(224 + (destinationSSID * 2));

  let source = (frameData.source.toString().toLocaleUpperCase() + "      ").split('').map(val=>{
    return val.charCodeAt(0) * 2;
  });
  if (source.length > 6) {
    source = source.slice(0,6);
  }
  for(let i = 0; i < source.length; i++) {
    frame.push(source[i]);
  }

  let sourceSSID = (frameData.sourceSSID < 16 && frameData.sourceSSID > -1 ? frameData.sourceSSID : 0);
  if (!frameData.repeaters || !frameData.repeaters.length) {
    frame.push(224 + (sourceSSID * 2) + 1);
  } else {
    frame.push(224 + (sourceSSID * 2));
  }

  let repeaters = frameData.repeaters || [];
  if (repeaters.length > 0) {
    for(let i = 0; i < repeaters.length; i++) {
      let repeater = (repeaters[i].callsign.toLocaleUpperCase() + "      ").split('').map(val=>{
        return val.charCodeAt(0) * 2;
      }).slice(0,6);
      for(let j = 0; j < repeater.length; j++) {
        frame.push(repeater[j]);
      }
      if (i === repeaters.length - 1) {
        frame.push(((repeaters[i].ssid||0)*2) + 1);
      } else {
        frame.push(((repeaters[i].ssid||0)*2));
      }
    }
  }

  // Control
  if (!frameData.aprs) {
    frame.push(0);
  } else {
    frame.push(3);
  }

  // PID
  frame.push(240);

  let content = frameData.message.split('').map(val=>{
    return val.charCodeAt(0);
  });
  for(let i = 0; i < content.length; i++) {
    frame.push(content[i]);
  }
  frame.push(192);
  return new Uint8Array(frame);
};

const readFrame = (data) => {
  let frame = {};
  let result = Array.from(new Uint8Array(data));

  frame.destination = result.slice(2,8).map(val=>{
    return String.fromCharCode(val/2);
  }).join('').trim();
  frame.destinationSSID = result.slice(8)[0] - 225;
  frame.destinationSSID = (frame.destinationSSID > 0) ? parseInt(frame.destinationSSID / 2) + 1 : 0;

  frame.source = result.slice(9, 15).map(val=>{
    return String.fromCharCode(val/2);
  }).join('').trim();
  frame.sourceSSID = result.slice(15)[0] - 224;
  frame.sourceSSID = (frame.sourceSSID > 0) ? parseInt(frame.sourceSSID / 2) : 0;

  let repeaters = [];
  let hasRepeaters = false;
  if (result.slice(15)[0] / 2 === parseInt(result.slice(15)[0] / 2)) {
    hasRepeaters = true;
  }

  let position = 18;
  if (hasRepeaters) {
    let tail = result.slice(16, result.length - 1);
    let parts = [];
    for (let i = 0; i < tail.length; i += 7) {
        parts.push(tail.slice(i, i + 7));
    }

    for (let j = 0; j < parts.length; j++) {
        if (parts[j].length < 7) {
            break;
        }
        let callsign = parts[j]
            .slice(0, 6)
            .map((val) => {
                return String.fromCharCode((val >> 1) & 0x7F);
            })
            .join("")
            .trim();
        let ssid = (parts[j].slice(6)[0] >> 1) & 0x0F;
        repeaters.push({ callsign, ssid });

        if ((parts[j][6] & 0x01) === 0x01) {
            break;
        }
    }
    position += 7 * repeaters.length;
  }
  frame.repeaters = repeaters;

  frame.message = result.slice(position, -1).map(val=>{
    return String.fromCharCode(val);
  }).join('');
  return frame;
}


  return {readFrame, createFrame};

}

if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = AXEZ;
}
