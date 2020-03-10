/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('StreamInfo ===', function() {
  'use strict';

  var XJS = require('xjs');
  var StreamInfo = XJS.StreamInfo;

  describe('should be able to get active stream channels', function() {
    beforeEach(function() {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName == 'recstat') {
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
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

          return asyncId;
        }
      });
    });

    it('through a promise', function(done) {
      var promise = StreamInfo.getActiveStreamChannels();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('that returns an array of StreamInfo', function(done) {
      var promise = StreamInfo.getActiveStreamChannels();
      promise.then(function(streaminfo) {
        if (streaminfo.length > 0) {
          expect(streaminfo).eachHasMethods('getStreamDrops, getStreamTime, ' +
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
          var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
              encodeURIComponent('<stat></stat>'));
          },10);

          return asyncId;
        }
      });
    });

    it('that returns an empty array when nothing is present', function(done) {
      var promise = StreamInfo.getActiveStreamChannels();
      promise.then(function(streaminfo) {
        var emptyArray = [];
        expect(streaminfo).toBeInstanceOf(Array);
        expect(streaminfo).toEqual(emptyArray);
        done();
      });
    });
  });

  describe('where each stream info', function() {
    var channelLocal;
    var isEmpty = false;
    beforeEach(function(done) {
      spyOn(window.external, 'GetGlobalProperty')
        .and.callFake(function(funcName) {
          if (funcName === 'bandwidthusage-all') {
            return '[{"ChannelName":"Local Streaming","AvgBitrate":536.0,"Dropped":10,"NotDropped":946},{"ChannelName":"Local Recording","AvgBitrate":0.0}]';
          }
        })
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);          
        if (funcName == 'recstat') {

          setTimeout(function() {
            window.OnAsyncCallback(asyncId,
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

          return asyncId;
        } else if (funcName == 'streamdrops:Local Streaming') {
          setTimeout(function() {
            if (isEmpty)
            {
              window.OnAsyncCallback(asyncId, '');  
            } else {
              window.OnAsyncCallback(asyncId, '10, 813');  
            }
          }, 10);
          return asyncId;
        } else if (funcName == 'streamtime:Local Streaming') {
          setTimeout(function() {
            if (isEmpty)
            {
              window.OnAsyncCallback(asyncId, '');  
            } else {
              window.OnAsyncCallback(asyncId, '100000');  
            }
          }, 10);
          return asyncId;
        }
      });
      StreamInfo.getActiveStreamChannels()
      .then(function(streaminfo) {
        channelLocal = streaminfo[0];
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

    it('should be able to get GOP dropped frames', function(done) {
      channelLocal.getGOPDrops()
      .then(function(droppedFrames) {
        expect(droppedFrames).toBeTypeOf('number');
        expect(droppedFrames).toEqual(10);
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

    it('should be able to get its bandwidth usage', function(done) {
      isEmpty = false;
      channelLocal.getBandwidthUsage()
      .then(function(usage) {
        expect(usage).toBeTypeOf('number');
        expect(usage).toEqual(536);
        done();
      });
    });

  });  
});
