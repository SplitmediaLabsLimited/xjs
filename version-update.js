// used for incrementing package.json version
// update the version on LICENSE

(function() {
  'use strict'
  var fs = require('fs')
  var version = ''

  var updateContents = ''

  fs.readFile('./package.json', 'utf8', function(err, data) {
    var json = JSON.parse(data)
    var num = json.version.substr(json.version.indexOf("-alpha-") + 7)
    json.version = '3.0.0-alpha-' + (Number(num)+1)
    version = json.version

    updateContents = JSON.stringify(json, null, 2)
    data = new Buffer(updateContents)
    fs.writeFile('./package.json', data, 'utf8', function(err, ret) {
      fs.readFile('./LICENSE', 'utf8', function(err, data) {
        var newVersion = data.replace(/3.0.0-alpha-.*/g, version);
        fs.writeFile('./LICENSE', newVersion, 'utf8', function(err, ret) {
          console.log('Update Done')
        })
      })
    })
  })

}())