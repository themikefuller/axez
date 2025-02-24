'use strict';

const AXEZ = require('./index');

const axez = AXEZ();

let simpleTest = {
  "source": "NOCALL",
  "destination" :"NOCALL",
  "sourceSSID" : 0,
  "destinationSSID" : 1,
  "message" : "Hello World",
  "repeaters" : [],
  "aprs" : false
};

let repeaterTest = {
  "source": "NOCALL",
  "destination" :"NOCALL",
  "sourceSSID" : 1,
  "destinationSSID" : 2,
  "message" : "Hello World",
  "repeaters" : [
    {"callsign":"NOCALL","ssid":0},
    {"callsign":"NOCALL", "ssid":3},
    {"callsign":"NOCALL", "ssid":4},
    {"callsign":"NOCALL", "ssid":15}
  ],
  "aprs" : false
};

let aprsTest = {
  "source": "NOCALL",
  "destination" :"APRS",
  "sourceSSID" : 15,
  "destinationSSID" : 1,
  "message" : "::NOCALL-10:Hello, Old Friend",
  "repeaters" : [
    {"callsign":"WIDE1","ssid":1},
    {"callsign":"WIDE2","ssid":1}
  ],
  "aprs" : true
};

/*
Un-comment the test to conduct and comment out the other test.
*/

//let test = simpleTest;
//let test = repeaterTest;
let test = aprsTest;

console.log(test);
let frame = axez.createFrame(test);
console.log(frame);
console.log(axez.readFrame(frame));
