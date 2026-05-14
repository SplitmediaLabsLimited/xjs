/* globals describe, require, beforeEach, spyOn, it, expect */

describe('Color interface', () => {
  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var mockPresetConfig =
    '<placement name="Scene 1" id="{219DB767-BE5B-4389-90C2-E712F08EA2CC}" defpos="1"><item name="D:\\Steam\\userdata\\47563014\\760\\remote\\49520\\screenshots\\20160415150211_1.jpg" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="0" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{48F4C8D1-98B1-4D71-B2FE-A282D96A4F48}" srcid="{C68A988D-A7E1-4CFD-9D43-F9B679736143}" globalsrc="0" type="4" item="D:\\Steam\\userdata\\47563014\\760\\remote\\49520\\screenshots\\20160415150211_1.jpg" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item name="HD Webcam C615" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="0.097325" pos_bottom="0.166448" crop_left="0.238860" crop_top="0.067084" crop_right="0.154044" crop_bottom="0.153907" pixalign="0" zorder="1" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{619F411F-DC09-4C5A-9289-60DA7BB37EAD}" srcid="{EECB686A-ED91-4292-837A-14293A56BB3C}" globalsrc="1" type="2" item="@DEVICE:PNP:\\\\?\\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;37C59C5D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\\GLOBAL" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="1" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item name="Window &quot;Jason Mraz - You Can Rely On Me&quot; in &quot;spotify.exe&quot; process" cname="" pos_left="0.630318" pos_top="0.911758" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.004108" crop_top="0.891450" crop_right="0.807230" crop_bottom="0.063354" pixalign="0" zorder="2" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{B9C539BF-7FAD-4F31-831F-436005C4DF83}" srcid="{43C1675E-551F-4BD0-A30A-C664821C34AD}" globalsrc="0" type="5" item="&lt;screen module=&quot;\\device\\harddiskvolume2\\users\\miyb\\appdata\\roaming\\spotify\\spotify.exe&quot; window=&quot;Jason Mraz - You Can Rely On Me&quot; hwnd=&quot;66234&quot; wclient=&quot;1&quot; left=&quot;0&quot; top=&quot;0&quot; width=&quot;0&quot; height=&quot;0&quot;/&gt; " itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="1" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="0" ScrCapShowClicks="0" ScrCapTrackWindowTitle="1" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item name="Game: Auto Detect" cname="" pos_left="0.000000" pos_top="0.837818" pos_right="0.162182" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="3" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{D80D839A-DCCD-428C-B7FE-9E1049752461}" srcid="{8AB8ADF6-6377-4982-AE13-BC3C3AA0AB93}" globalsrc="0" type="7" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot; hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot; height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot; lastframets=&quot;0&quot; fpsRender=&quot;0.000000&quot; fpsCapture=&quot;0.000000&quot; imagename=&quot;&quot;/&gt; " itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="1" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="1" GameCapSurfSharing="1" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item name="RTMP Stream" cname="" pos_left="0.639014" pos_top="0.639014" pos_right="1.000000" pos_bottom="1.000000" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="4" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{E90CDC06-57D5-4AA9-8D1D-8F4EAE66BBAC}" srcid="{AB17F235-B09B-4FE3-B95E-A1553CFFD956}" globalsrc="0" type="6" item="C:\\Users\\MiYb\\AppData\\Local\\SplitMediaLabs\\XSplit\\miyb@splitmedialabs.com\\SwfPlugins2.0\\LiveStream\\LiveStream.swf*&lt;config&gt;&lt;params rtmp=&quot;rtmp://cp9950.edgefcs.net/ondemand/comedystor/_!/com/dailyshow/TDS/season_03/episode_100/ds_03100_08_blm_480.flv&quot; stream=&quot;sample&quot; smoothing=&quot;true&quot; buffer=&quot;1&quot;/&gt;&lt;/config&gt;" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="0" DllGrant="" custom="" /><item name="http://twitch.tv" cname="" pos_left="0.728700" pos_top="0.342676" pos_right="1.000000" pos_bottom="0.613976" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="5" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="0" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{0CE9E506-82BB-4DCB-B3DE-E9E202231E49}" srcid="{F0FCAF91-6E46-4C39-A6A3-02E5646AF014}" globalsrc="0" type="8" item="http://twitch.tv" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="0" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="-1" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /><item name="C:\\Users\\MiYb\\Videos\\2016-03-28-1859-59.flv" cname="" pos_left="0.000000" pos_top="0.000000" pos_right="0.147235" pos_bottom="0.147235" crop_left="0.000000" crop_top="0.000000" crop_right="0.000000" crop_bottom="0.000000" pixalign="0" zorder="6" lockmove="0" keep_ar="1" visible="1" alpha="255" border="0" cc_brightness="0" cc_contrast="0" cc_hue="0" cc_saturation="0" cc_dynamicrange="1" key_antialiasing="2" key_chromakey="0" key_chromakeytype="0" key_chromahue="0" key_chromarang="25" key_chromaranga="0" key_chromabr="25" key_chromasat="25" key_colorrgb="0" key_colorrang="25" key_colorranga="0" key_chromargbkeyprimary="1" key_chromargbkeythresh="50" key_chromargbkeybalance="0" rotate_x="0" rotate_y="0" rotate_z="0" rotate_canvas="0" offset_x="0.000000" offset_y="0.000000" transitionid="" transitiontime="300" edgeeffectid="" edgeeffectcfg="" edgeeffectmask="" edgeeffectmaskmode="0" id="{F507B557-8F72-4CE0-8711-D75AE9846947}" srcid="{72A17CD7-7534-44D8-995B-20D27E8EF7A7}" globalsrc="0" type="1" item="C:\\Users\\MiYb\\Videos\\2016-03-28-1859-59.flv" itemaudio="" volume="100" mute="0" sounddev="0" fdeinterlace="0" mipmaps="0" autoresdet="1" keeploaded="0" cc_pin="0" key_pin="0" key_smartcamenable="0" key_smartcamconfig="" key_rssmartcamconfig="" tobii="0" tobiiconfig="decay:0.970000&amp;str:0.900000&amp;rad:0.070000&amp;color:2155905152" StreamDelay="0" AudioDelay="0" AudioGainEnable="0" AudioGain="5" AudioGainLatency="1000" LiveClockSync="0" InPoint="0" OutPoint="0" CuePoints="" FilePlaylist="" OpWhenFinished="1" StartOnLoad="1" RememberPosition="1" LastPosition="0" LastRunState="0" ShowPosition="0" ScrCapMethod="3" ScrCapLayered="0" ScrCapOptCapture="0" ScrCapOptCapture1="1" ScrCapIntResize="0" ScrCapShowMouse="1" ScrCapShowClicks="1" ScrCapTrackWindowTitle="0" GameCapShowMouse="0" GameCapSurfSharing="0" GameCapAlpha="0" GameCapPlSmooth="0" GameCapTrackActive="0" GameCapTrackActiveFullscreen="1" GameCapHideInactive="0" BrowserJs="" BrowserSizeX="0" BrowserSizeY="0" BrowserTransparent="1" BrowserRightClick="0" BrowserCookiePath="" BrowserCookieFlags="0" Browser60fps="0" SwfWrapper="1" DllGrant="" custom="" /></placement>';

  var local = {};
  var attachedId;
  var enumeratedItems;
  var appVersion = navigator.appVersion;

  var env = new window.Environment(XJS);
  var environments = {
    SOURCE: 'plugin',
    SOURCEPROPS: 'props',
    EXTENSION: 'extension',
  };

  var ctr = 0;

  var parseXml = (xmlStr) => new window.DOMParser().parseFromString(xmlStr, 'text/xml');

  var xCallback = (id, result) => {
    setTimeout(() => {
      window.OnAsyncCallback(id, result);
    }, 10);
  };

  var getLocal = (property) => {
    ctr++;
    var asyncId = 'icolor_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (local[attachedId] !== undefined && Object.prototype.hasOwnProperty.call(local[attachedId], property)) {
      xCallback(asyncId, local[attachedId][property]);
    } else {
      var placement = parseXml(mockPresetConfig).getElementsByTagName('placement')[0];
      var selected = '[id="' + attachedId + '"]';
      var itemSelected = placement.querySelector(selected);
      xCallback(asyncId, itemSelected.getAttribute(property));
    }

    return asyncId;
  };

  var setLocal = (property, value) => {
    ctr++;
    var asyncId = 'icolor_' + ctr;

    if (property.substring(0, 5) === 'prop:') {
      property = property.replace(/^prop:/, '');
    }

    if (local[attachedId] === undefined) {
      local[attachedId] = {};
    }

    local[attachedId][property] = value;
    xCallback(asyncId, '0');
    return asyncId;
  };

  var firstItem;
  var secondItem;

  beforeEach((done) => {
    env.set(environments.EXTENSION); // for maximum flexibility/functionality

    navigator.__defineGetter__('appVersion', () => 'XSplit Broadcaster 2.7.1702.2231 ');

    // reset attached IDs
    var item1 = new XJS.Item({ id: '{ID}' });
    var item2 = new XJS.Item({ id: '{ID2}' });

    local = {};

    spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
      ctr++;
      var asyncId = 'icolor_' + ctr;
      switch (funcName) {
        case 'sceneconfig:0':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'sceneconfig':
          xCallback(asyncId, encodeURIComponent(mockPresetConfig));
          break;

        case 'scene:0':
          xCallback(asyncId, '0');
          break;
      }

      return asyncId;
    });

    spyOn(window.external, 'SearchVideoItem').and.callFake((id) => {
      attachedId = id;
    });

    spyOn(window.external, 'SearchVideoItem2').and.callFake((id) => {
      attachedId = id;
    });

    spyOn(window.external, 'GetLocalPropertyAsync').and.callFake(getLocal);

    spyOn(window.external, 'GetLocalPropertyAsync2').and.callFake(getLocal);

    spyOn(window.external, 'SetLocalPropertyAsync').and.callFake(setLocal);

    spyOn(window.external, 'SetLocalPropertyAsync2').and.callFake(setLocal);

    Scene.getActiveScene()
      .then((newScene) => newScene.getItems())
      .then((items) => {
        enumeratedItems = items;
        firstItem = enumeratedItems[0];
        secondItem = enumeratedItems[1];
        done();
      });
  });

  afterAll(() => {
    navigator.__defineGetter__('appVersion', () => appVersion);
  });

  it('contains all the necessary color methods', () => {
    var methods = [
      'getTransparency',
      'setTransparency',
      'getBrightness',
      'setBrightness',
      'getContrast',
      'setContrast',
      'getHue',
      'setHue',
      'getSaturation',
      'setSaturation',
      'getBorderColor',
      'setBorderColor',
      'isFullDynamicColorRange',
      'setFullDynamicColorRange',
    ].join(',');

    enumeratedItems.forEach((currentItem) => {
      expect(currentItem).hasMethods(methods);
    });
  });

  describe('should be able to get and set transparency', () => {
    it('through a promise', (done) => {
      var promise = firstItem.getTransparency();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a number', (done) => {
      var firstRand = randomInt(0, 255);
      var secondRand = randomInt(0, 255);

      firstItem
        .setTransparency(firstRand)
        .then(() => secondItem.setTransparency(secondRand))
        .then(() => firstItem.getTransparency())
        .then((transparency1) => {
          expect(transparency1).toBeTypeOf('number');
          expect(transparency1).toEqual(firstRand);
          return secondItem.getTransparency();
        })
        .then((transparency2) => {
          expect(transparency2).toBeTypeOf('number');
          expect(transparency2).toEqual(secondRand);
          done();
        });
    });

    it('which rejects for invalid parameters', (done) => {
      var randomString = randomWord(5);
      var randomNumber = randomInt(256, 1000);

      firstItem
        .setTransparency(randomString)
        .then(() => {
          done.fail('Invalid type was accepted (string)');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          return firstItem.setTransparency(randomNumber);
        })
        .then(() => {
          done.fail('Invalid value was accepted');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
    });
  });

  describe('should be able to get and set brightness', () => {
    it('through a promise', (done) => {
      var promise = firstItem.getBrightness();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a number', (done) => {
      var firstRand = randomSignMultiplier() * randomInt(0, 100);
      var secondRand = randomSignMultiplier() * randomInt(0, 100);

      firstItem
        .setBrightness(firstRand)
        .then(() => secondItem.setBrightness(secondRand))
        .then(() => firstItem.getBrightness())
        .then((action1) => {
          expect(action1).toBeTypeOf('number');
          expect(action1).toEqual(firstRand);
          return secondItem.getBrightness();
        })
        .then((action2) => {
          expect(action2).toBeTypeOf('number');
          expect(action2).toEqual(secondRand);
          done();
        });
    });

    it('which rejects for invalid parameters', (done) => {
      var randomString = randomWord(5);
      var randomNumber = randomSignMultiplier() * randomInt(101, 1000);

      firstItem
        .setBrightness(randomString)
        .then(() => {
          done.fail('Invalid type was accepted (string)');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          return firstItem.setBrightness(randomNumber);
        })
        .then(() => {
          done.fail('Invalid value was accepted');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
    });
  });

  describe('should be able to get and set contrast', () => {
    it('through a promise', (done) => {
      var promise = firstItem.getContrast();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a number', (done) => {
      var firstRand = randomSignMultiplier() * randomInt(1, 100);
      var secondRand = randomSignMultiplier() * randomInt(1, 100);

      firstItem
        .setContrast(firstRand)
        .then(() => secondItem.setContrast(secondRand))
        .then(() => firstItem.getContrast())
        .then((contrast1) => {
          expect(contrast1).toBeTypeOf('number');
          expect(contrast1).toEqual(firstRand);
          return secondItem.getContrast();
        })
        .then((contrast2) => {
          expect(contrast2).toBeTypeOf('number');
          expect(contrast2).toEqual(secondRand);
          done();
        });
    });

    it('which rejects for invalid parameters', (done) => {
      var randomString = randomWord(5);
      var randomNumber = randomSignMultiplier() * randomInt(101, 1000);

      firstItem
        .setContrast(randomString)
        .then(() => {
          done.fail('Invalid type was accepted (string)');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          return firstItem.setContrast(randomNumber);
        })
        .then(() => {
          done.fail('Invalid value was accepted');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
    });
  });

  describe('should be able to get and set hue', () => {
    it('through a promise', (done) => {
      var promise = firstItem.getHue();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a number', (done) => {
      var firstRand = randomSignMultiplier() * randomInt(0, 180);
      var secondRand = randomSignMultiplier() * randomInt(0, 180);

      firstItem
        .setHue(firstRand)
        .then(() => secondItem.setHue(secondRand))
        .then(() => firstItem.getHue())
        .then((hue1) => {
          expect(hue1).toBeTypeOf('number');
          expect(hue1).toEqual(firstRand);
          return secondItem.getHue();
        })
        .then((hue2) => {
          expect(hue2).toBeTypeOf('number');
          expect(hue2).toEqual(secondRand);
          done();
        });
    });

    it('which rejects for invalid parameters', (done) => {
      var randomString = randomWord(5);
      var randomNumber = randomSignMultiplier() * randomInt(181, 1000);

      firstItem
        .setHue(randomString)
        .then(() => {
          done.fail('Invalid type was accepted (string)');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          return firstItem.setHue(randomNumber);
        })
        .then(() => {
          done.fail('Invalid value was accepted');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
    });
  });

  describe('should be able to get and set saturation', () => {
    it('through a promise', (done) => {
      var promise = firstItem.getSaturation();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a number', (done) => {
      var firstRand = randomSignMultiplier() * randomInt(1, 100);
      var secondRand = randomSignMultiplier() * randomInt(1, 100);

      firstItem
        .setSaturation(firstRand)
        .then(() => secondItem.setSaturation(secondRand))
        .then(() => firstItem.getSaturation())
        .then((saturation1) => {
          expect(saturation1).toBeTypeOf('number');
          expect(saturation1).toEqual(firstRand);
          return secondItem.getSaturation();
        })
        .then((saturation2) => {
          expect(saturation2).toBeTypeOf('number');
          expect(saturation2).toEqual(secondRand);
          done();
        });
    });

    it('which rejects for invalid parameters', (done) => {
      var randomString = randomWord(5);
      var randomNumber = randomSignMultiplier() * randomInt(101, 1000);

      firstItem
        .setSaturation(randomString)
        .then(() => {
          done.fail('Invalid type was accepted (string)');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          return firstItem.setSaturation(randomNumber);
        })
        .then(() => {
          done.fail('Invalid value was accepted');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
    });
  });

  describe('should be able to get and set border color', () => {
    it('through a promise', (done) => {
      var promise = firstItem.getBorderColor();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a Color object', (done) => {
      var randomColorKey = randomColor();
      var colorObj = XJS.Color.fromRGBString(randomColorKey);

      firstItem
        .setBorderColor(randomColorKey)
        .then(() => {
          done.fail('Invalid type was accepted');
        })
        .catch((err) => {
          expect(err).toEqual(jasmine.any(Error));
          return firstItem.setBorderColor(colorObj);
        })
        .then(() => firstItem.getBorderColor())
        .then((color) => {
          expect(color.getRgb()).toEqual(color.getRgb());
          done();
        });
    });

    it('and accepts transparent', (done) => {
      firstItem
        .setBorderColor(XJS.Color.fromTransparent())
        .then(() => firstItem.getBorderColor())
        .then((color) => {
          expect(color.isTransparent()).toBe(true);
          done();
        });
    });
  });

  describe('should be able to get and set if full dynamic range is enabled', () => {
    it('through a promise', (done) => {
      var promise = firstItem.isFullDynamicColorRange();
      expect(promise).toBeInstanceOf(Promise);
      done();
    });

    it('as a boolean', (done) => {
      var firstBoolean = randomBoolean();
      var secondBoolean = randomBoolean();

      firstItem
        .setFullDynamicColorRange(firstBoolean)
        .then(() => secondItem.setFullDynamicColorRange(secondBoolean))
        .then(() => firstItem.isFullDynamicColorRange())
        .then((enabled1) => {
          expect(enabled1).toBeTypeOf('boolean');
          expect(enabled1).toEqual(firstBoolean);
          return secondItem.isFullDynamicColorRange();
        })
        .then((enabled2) => {
          expect(enabled2).toBeTypeOf('boolean');
          expect(enabled2).toEqual(secondBoolean);
          return firstItem.setFullDynamicColorRange(!firstBoolean);
        })
        .then(() => firstItem.isFullDynamicColorRange())
        .then((enabled3) => {
          expect(enabled3).toEqual(!firstBoolean);
          done();
        });
    });
  });
});
