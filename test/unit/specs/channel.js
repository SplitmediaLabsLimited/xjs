/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('Channel ===', function() {
  'use strict';

  var XJS = require('xjs');
  var Channel = XJS.Channel;

  describe('should be able to get active stream channels', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'recstat') {
          var randomNumber=Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(randomNumber,
              encodeURIComponent('<stat>' +
                '<channel name="Local Streaming">' +
                '<stat video="21800992" audio="1383326" output="29635585"' +
                  ' frmdropped="0" frmcoded="145267"/>' +
                '<channel serviceName="LocalStreaming" name="Local Streaming"' +
                  ' displayName="Local Streaming" description=""' +
                  ' rtmpUrl="rtmp://nomaster" streamName=""' +
                  ' link="http://demo.splitmedialabs.com/VHJavaMediaSDK3/' +
                  'view.html?id=stream&amp;url=rtmp://192.168.254.99:1935/app' +
                  '&amp;buffer=1&amp;forceObjectEncoding=0" username=""' +
                  ' password="" channel=""' +
                  ' extraConfig="\\rtmp_2ch:1\\rtmp_buf:65536' +
                  '\\rtmp_timeout_media:0\\rtmp_timeout_close:500' +
                  '\\lowLatency:0\\hasSupportedResolutionsOnly:0' +
                  '\\hasSupportedFpsOnly:0\\rtmp_flashver:XSplit/2.4' +
                  '\\origabitrate:96000\\rtmp_timeout_connect:0' +
                  '\\opt_faststart:1\\opt_remuxto:mp4&amp;' +
                  'movflags:frag_keyframe+empty_moov&amp;frag_size:16777216"' +
                  ' recordBroadcast="1" filetype="flv"' +
                  ' file="mp4:C:\\Users\\someUser\\Videos\\' +
                  'XSplit Videos - user\\Local Streaming\\someFolder.mp4"' +
                  ' enableoutwatermark="0">' +
                '<configuration>' +
                '<video codec="libx264ext64&amp;ex:preset:veryfast' +
                  '&amp;ex:crf:27&amp;ex:vbv-bufsize:1000' +
                  '&amp;ex:vbv-maxrate:1000&amp;ex:keyint:60' +
                  '&amp;ex:fps:10000000/333333" framerate="333333"' +
                  ' x264Presets="&amp;veryfast" quality="27"' +
                  ' codecCommands="ex:fps:10000000/333333" cbr="0"' +
                  ' adaptivebr="0" keyint="2" bufferSize="1000k"' +
                  ' maxBitrate="1000k" resizeex="0"' +
                  ' dontUseDefaultMixerResolution="0"' +
                  ' dontUseDefaultMixerFPS="0"/>' +
                '<audio bitrate="96000" codec="libw7aac&amp;b:96000"' +
                ' format="44100/2" format2="44100/2"/>' +
                '</configuration>' +
                '<extra>' +
                '<params/>' +
                '<speex vbr="0" q="10" vmrq="10" vbrmax="42200" abr="42200"' +
                ' complexity="4" vad="0" dtx="0" hp="1"/>' +
                '</extra>' +
                '<meta>' +
                '<value type="2" name="bufferSize" value="1000k"/>' +
                '<value type="2" name="maxBitrate" value="1000k"/>' +
                '<value type="2" name="videodevice"' +
                ' value="XSplitBroadcaster"/>' +
                '<value type="2" name="xsplitBroadcasterVersion"' +
                  ' value="1.3.0.444"/>' +
                '<value type="2" name="xsplitCoreVersion"' +
                  ' value="2.4.1506.2436 Version 2.4"/>' +
                '<value type="2" name="xsplitGameSourceVersion"' +
                  ' value="1.1.1.148"/>' +
                '<value type="2" name="xsplitMediaLibVersion"' +
                  ' value="2.0.0.532"/>' +
                '<value type="0" name="framerate" value="30"/>' +
                '<value type="2" name="pluginName" value="LocalStreaming"/>' +
                '<value type="2" name="pluginVersion" value="2.4.1506.2201"/>' +
                '</meta>' +
                '</channel>' +
                '</channel>' +
                '</stat>'
              ));
          },10);

          return randomNumber;
        }
      });
    });

    it('through a promise', function(done) {
      var promise = Channel.getActiveStreamChannels();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('that returns an array of Channels', function(done) {
      var promise = Channel.getActiveStreamChannels();
      promise.then(function(channels) {
        if (channels.length > 0) {
          expect(channels).eachHasMethods('getStreamDrops, getStreamTime, ' +
            'getName, getStreamRenderedFrames');
        }
        done();
      });
    });
  });

  describe('should be able to get active stream channels', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'recstat') {
          var randomNumber=Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(randomNumber,
              encodeURIComponent('<stat></stat>'));
          },10);

          return randomNumber;
        }
      });
    });

    it('that returns an empty array when nothing is present', function(done) {
      var promise = Channel.getActiveStreamChannels();
      promise.then(function(channels) {
        var emptyArray = [];
        expect(channels).toBeInstanceOf(Array);
        expect(channels).toEqual(emptyArray);
        done();
      });
    });
  });

  describe('where each channel', function() {
    var channelLocal;
    var isEmpty = false;
    beforeEach(function(done) {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        var randomNumber=Math.floor(Math.random()*1000);          
        if (funcName == 'recstat') {

          setTimeout(function() {
            window.OnAsyncCallback(randomNumber,
              encodeURIComponent('<stat>' +
                '<channel name="Local Streaming">' +
                '<stat video="21800992" audio="1383326" output="29635585"' +
                  ' frmdropped="0" frmcoded="145267"/>' +
                '<channel serviceName="LocalStreaming" name="Local Streaming"' +
                  ' displayName="Local Streaming" description=""' +
                  ' rtmpUrl="rtmp://nomaster" streamName=""' +
                  ' link="http://demo.splitmedialabs.com/VHJavaMediaSDK3/' +
                  'view.html?id=stream&amp;url=rtmp://192.168.254.99:1935/app' +
                  '&amp;buffer=1&amp;forceObjectEncoding=0" username=""' +
                  ' password="" channel=""' +
                  ' extraConfig="\\rtmp_2ch:1\\rtmp_buf:65536' +
                  '\\rtmp_timeout_media:0\\rtmp_timeout_close:500' +
                  '\\lowLatency:0\\hasSupportedResolutionsOnly:0' +
                  '\\hasSupportedFpsOnly:0\\rtmp_flashver:XSplit/2.4' +
                  '\\origabitrate:96000\\rtmp_timeout_connect:0' +
                  '\\opt_faststart:1\\opt_remuxto:mp4&amp;' +
                  'movflags:frag_keyframe+empty_moov&amp;frag_size:16777216"' +
                  ' recordBroadcast="1" filetype="flv"' +
                  ' file="mp4:C:\\Users\\someUser\\Videos\\' +
                  'XSplit Videos - user\\Local Streaming\\someFolder.mp4"' +
                  ' enableoutwatermark="0">' +
                '<configuration>' +
                '<video codec="libx264ext64&amp;ex:preset:veryfast' +
                  '&amp;ex:crf:27&amp;ex:vbv-bufsize:1000' +
                  '&amp;ex:vbv-maxrate:1000&amp;ex:keyint:60' +
                  '&amp;ex:fps:10000000/333333" framerate="333333"' +
                  ' x264Presets="&amp;veryfast" quality="27"' +
                  ' codecCommands="ex:fps:10000000/333333" cbr="0"' +
                  ' adaptivebr="0" keyint="2" bufferSize="1000k"' +
                  ' maxBitrate="1000k" resizeex="0"' +
                  ' dontUseDefaultMixerResolution="0"' +
                  ' dontUseDefaultMixerFPS="0"/>' +
                '<audio bitrate="96000" codec="libw7aac&amp;b:96000"' +
                ' format="44100/2" format2="44100/2"/>' +
                '</configuration>' +
                '<extra>' +
                '<params/>' +
                '<speex vbr="0" q="10" vmrq="10" vbrmax="42200" abr="42200"' +
                ' complexity="4" vad="0" dtx="0" hp="1"/>' +
                '</extra>' +
                '<meta>' +
                '<value type="2" name="bufferSize" value="1000k"/>' +
                '<value type="2" name="maxBitrate" value="1000k"/>' +
                '<value type="2" name="videodevice"' +
                ' value="XSplitBroadcaster"/>' +
                '<value type="2" name="xsplitBroadcasterVersion"' +
                  ' value="1.3.0.444"/>' +
                '<value type="2" name="xsplitCoreVersion"' +
                  ' value="2.4.1506.2436 Version 2.4"/>' +
                '<value type="2" name="xsplitGameSourceVersion"' +
                  ' value="1.1.1.148"/>' +
                '<value type="2" name="xsplitMediaLibVersion"' +
                  ' value="2.0.0.532"/>' +
                '<value type="0" name="framerate" value="30"/>' +
                '<value type="2" name="pluginName" value="LocalStreaming"/>' +
                '<value type="2" name="pluginVersion" value="2.4.1506.2201"/>' +
                '</meta>' +
                '</channel>' +
                '</channel>' +
                '</stat>'
              ));
          },10);

          return randomNumber;
        } else if (funcName == 'streamdrops:Local Streaming') {
          setTimeout(function() {
            if (isEmpty)
            {
              window.OnAsyncCallback(randomNumber, '');  
            } else {
              window.OnAsyncCallback(randomNumber, '10, 813');  
            }
          }, 10);
          return randomNumber;
        } else if (funcName == 'streamtime:Local Streaming') {
          setTimeout(function() {
            if (isEmpty)
            {
              window.OnAsyncCallback(randomNumber, '');  
            } else {
              window.OnAsyncCallback(randomNumber, '100000');  
            }
          }, 10);
          return randomNumber;
        }
      });
      Channel.getActiveStreamChannels()
      .then(function(channels) {
        channelLocal = channels[0];
        done();
      });
      
    });

    it('should be able to get its name', function(done) {
      channelLocal.getName()
      .then(function(name) {
        expect(name).toBeTypeOf('string');
        expect(name).toEqual("Local Streaming");
        done();
      });
    });

    it('should be able to get its dropped frames', function(done) {
      isEmpty = false;
      channelLocal.getStreamDrops()
      .then(function(droppedFrames) {
        expect(droppedFrames).toBeTypeOf('number');
        expect(droppedFrames).toEqual(10);
        done();
      });
    });

    it('should be able to get its dropped frames and return as 0 if empty', function(done) {
      isEmpty = true;
      channelLocal.getStreamDrops()
      .then(function(droppedFrames) {
        expect(droppedFrames).toEqual(0);
        done();
      });
    });

    it('should be able to get its frames rendered', function(done) {
      isEmpty = false;
      channelLocal.getStreamRenderedFrames()
      .then(function(droppedFrames) {
        expect(droppedFrames).toBeTypeOf('number');
        expect(droppedFrames).toEqual(813);
        done();
      });
    });

    it('should be able to get its dropped frames and return as 0 if empty', function(done) {
      isEmpty = true;
      channelLocal.getStreamRenderedFrames()
      .then(function(droppedFrames) {
        expect(droppedFrames).toEqual(0);
        done();
      });
    });

    it('should be able to get its stream time', function(done) {
      isEmpty = false;
      channelLocal.getStreamTime()
      .then(function(streamTime) {
        expect(streamTime).toBeTypeOf('number');
        expect(streamTime).toEqual(10000);
        done();
      });
    });

    it('should be able to get its stream time and return as 0 if empty', function(done) {
      isEmpty = true;
      channelLocal.getStreamTime()
      .then(function(streamTime) {
        expect(streamTime).toEqual(0);
        done();
      });
    });

  });  
});
