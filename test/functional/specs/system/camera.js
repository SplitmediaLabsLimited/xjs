/* globals Rose, require */

(function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;

  var cameraDevice;
  var promise = System.getCameraDevices();
  promise.then(function(devices) {
    cameraDevice = devices[0];
    console.log(cameraDevice);
  });

  Rose.createTab({
    name: 'CameraDevice',
    buttons: [
      {
        name: 'getID',
        onClick: function() {
          var camID = cameraDevice.getId();
          console.trace(camID);
          Rose.output(camID);
        }
      },

      {
        name: 'getName',
        onClick: function() {
          var camName = cameraDevice.getName();
          console.trace(camName);
          Rose.output(camName);
        }
      },

      {
        name: 'getViewport',
        onClick: function() {
          var camXML = cameraDevice.toXML();
          console.trace(camXML);
          Rose.output(camXML);
        }
      }
    ]
  });
})();
