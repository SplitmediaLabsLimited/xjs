/* globals Rose, require */

(() => {
  var XJS = require('xjs');
  var System = XJS.System;

  var cameraDevice;
  var promise = System.getCameraDevices();
  promise.then((devices) => {
    cameraDevice = devices[0];
    console.log(cameraDevice);
  });

  Rose.createTab({
    name: 'CameraDevice',
    buttons: [
      {
        name: 'getId',
        onClick: () => {
          var camID = cameraDevice.getId();
          console.trace(camID);
          Rose.output(camID);
        },
      },

      {
        name: 'getName',
        onClick: () => {
          var camName = cameraDevice.getName();
          console.trace(camName);
          Rose.output(camName);
        },
      },

      {
        name: 'getViewport',
        onClick: () => {
          var camXML = cameraDevice.toXML();
          console.trace(camXML);
          Rose.output(camXML);
        },
      },
    ],
  });
})();
