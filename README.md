# XSplit JS Framework

[![Build Status](https://travis-ci.org/xjsframework/xjs.svg?branch=master)](https://travis-ci.org/xjsframework/xjs)
[![npm version](https://badge.fury.io/js/xjs-framework.svg)](https://badge.fury.io/js/xjs-framework)

The XSplit JS Framework allows developers to create plugins for XSplit Broadcaster.

Please visit the [official website](https://xjsframework.github.io/) for documentation and more information.

If you wish to contribute, check the [issue list](https://github.com/SplitmediaLabsLimited/xjs/issues)! Drop a comment if you need more information before you start working on a pull request. Information on our deliverable roadmap is posted on [the wiki](https://github.com/SplitmediaLabsLimited/xjs/wiki).

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Overview](#api-overview)
- [Examples](#examples)
- [Building from Source](#building-from-source)
- [Testing](#testing)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

### NPM
```bash
npm install xjs-framework
```

### Bower
```bash
bower install xjs-framework
```

### CDN
```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/xjs-framework@latest/dist/xjs.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/xjs-framework@2.10.2/dist/xjs.min.js"></script>
```

### Direct Download
Download the latest version from the [releases page](https://github.com/xjsframework/xjs/releases) and include it in your project:

```html
<script src="path/to/xjs.min.js"></script>
```

## Quick Start

### Basic Setup

```javascript
// ES6/TypeScript
import * as XJS from 'xjs-framework';

// CommonJS
const XJS = require('xjs-framework');

// Browser global
// XJS is available as a global variable when included via script tag

// Initialize the framework
XJS.ready().then(() => {
    console.log('XJS Framework is ready!');
    
    // Your plugin code here
    const app = new XJS.App();
    app.getFrameTime().then(frameTime => {
        console.log('Current frame time:', frameTime);
    });
});
```

### Creating Your First Plugin

```javascript
XJS.ready().then(() => {
    // Get the current scene
    XJS.Scene.getActiveScene().then(scene => {
        console.log('Active scene:', scene.getName());
        
        // Get all items in the scene
        return scene.getItems();
    }).then(items => {
        console.log('Scene has', items.length, 'items');
        
        items.forEach((item, index) => {
            console.log(`Item ${index}:`, item.getName());
        });
    });
});
```

## Core Concepts

### Scenes
Scenes are containers for sources and items. XSplit allows multiple scenes that can be switched between during broadcasting.

### Sources vs Items
- **Sources**: Available media sources that can be added to scenes (cameras, games, files, etc.)
- **Items**: Instances of sources that have been added to a specific scene with their own properties

### Framework Initialization
Always wrap your code in `XJS.ready()` to ensure the framework is properly initialized before use.

## API Overview

### Core Classes

#### App
Provides application-level functionality and settings.

```javascript
const app = new XJS.App();

// Get frame rate
app.getFrameTime().then(frameTime => {
    console.log('Frame time:', frameTime, 'ms');
});

// Get application version
app.getVersion().then(version => {
    console.log('XSplit version:', version);
});
```

#### Scene
Manage scenes and their contents.

```javascript
// Get active scene
XJS.Scene.getActiveScene().then(scene => {
    // Get scene name
    console.log('Scene name:', scene.getName());
    
    // Get all items in scene
    return scene.getItems();
}).then(items => {
    console.log('Items in scene:', items.length);
});

// Get all scenes
XJS.Scene.getSceneList().then(scenes => {
    scenes.forEach(scene => {
        console.log('Scene:', scene.getName());
    });
});
```

#### Sources
Access available sources that can be added to scenes.

```javascript
// Get available camera sources
XJS.Camera.getAvailableDevices().then(cameras => {
    cameras.forEach(camera => {
        console.log('Camera:', camera.getName());
    });
});

// Get available audio devices
XJS.AudioDevice.getAvailableDevices().then(devices => {
    devices.forEach(device => {
        console.log('Audio device:', device.getName());
    });
});
```

#### Items
Manipulate items within scenes.

```javascript
XJS.Scene.getActiveScene().then(scene => {
    return scene.getItems();
}).then(items => {
    if (items.length > 0) {
        const item = items[0];
        
        // Get item properties
        console.log('Item name:', item.getName());
        console.log('Item position:', item.getPosition());
        
        // Modify item
        item.setName('My Renamed Item');
        item.setPosition({x: 100, y: 100});
    }
});
```

### System Classes

#### Environment
Detect the current environment and XSplit version.

```javascript
const env = XJS.Environment;
console.log('Is extension:', env.isExtension());
console.log('Is plugin:', env.isPlugin());
console.log('XSplit version:', env.getVersion());
```

## Examples

### Example 1: Scene Switcher Plugin

```javascript
XJS.ready().then(() => {
    let currentSceneIndex = 0;
    
    // Get all scenes
    XJS.Scene.getSceneList().then(scenes => {
        console.log('Available scenes:', scenes.length);
        
        // Create a simple scene switcher
        document.getElementById('nextScene').addEventListener('click', () => {
            currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
            const nextScene = scenes[currentSceneIndex];
            
            nextScene.activate().then(() => {
                console.log('Switched to scene:', nextScene.getName());
            });
        });
    });
});
```

### Example 2: Source Monitor

```javascript
XJS.ready().then(() => {
    // Monitor active scene items
    function monitorScene() {
        XJS.Scene.getActiveScene().then(scene => {
            return scene.getItems();
        }).then(items => {
            const itemInfo = items.map(item => ({
                name: item.getName(),
                type: item.getType(),
                visible: item.isVisible()
            }));
            
            console.log('Current scene items:', itemInfo);
            
            // Update UI with item information
            updateItemList(itemInfo);
        });
    }
    
    // Monitor every 5 seconds
    setInterval(monitorScene, 5000);
    monitorScene(); // Initial call
});
```

### Example 3: Custom Source Controller

```javascript
XJS.ready().then(() => {
    // Control a specific webcam item
    XJS.Scene.getActiveScene().then(scene => {
        return scene.getItems();
    }).then(items => {
        // Find the first camera item
        const cameraItem = items.find(item => 
            item.getType() === XJS.ItemTypes.LIVE
        );
        
        if (cameraItem) {
            // Add controls for the camera
            document.getElementById('toggleCamera').addEventListener('click', () => {
                cameraItem.isVisible().then(visible => {
                    return cameraItem.setVisible(!visible);
                }).then(() => {
                    console.log('Camera visibility toggled');
                });
            });
            
            document.getElementById('moveCamera').addEventListener('click', () => {
                const newPosition = XJS.Rectangle.fromCoordinates(
                    Math.random() * 500,
                    Math.random() * 300,
                    Math.random() * 500 + 200,
                    Math.random() * 300 + 150
                );
                
                cameraItem.setPosition(newPosition).then(() => {
                    console.log('Camera moved to:', newPosition);
                });
            });
        }
    });
});
```

### Example 4: Audio Device Management

```javascript
XJS.ready().then(() => {
    // Get all audio devices
    XJS.System.getAudioDevices(
        XJS.AudioDeviceDataflow.ALL,
        XJS.AudioDeviceState.ACTIVE
    ).then(devices => {
        console.log('Available audio devices:', devices.length);
        
        devices.forEach(device => {
            console.log(`Device: ${device.getName()}`);
            console.log(`ID: ${device.getId()}`);
            
            // Set audio level to 80%
            if (device.getName().includes('Microphone')) {
                device.setLevel(0.8).then(() => {
                    console.log('Microphone level set to 80%');
                });
            }
        });
    });
});
```

### Example 5: Game Capture Setup

```javascript
XJS.ready().then(() => {
    // Get running games and add to scene
    XJS.System.getGames().then(games => {
        if (games.length > 0) {
            const game = games[0];
            console.log(`Found game: ${game.getName()}`);
            
            // Add game to current scene
            game.addToScene().then(() => {
                console.log('Game added to scene');
                
                // Get the newly added game item
                return XJS.Scene.getActiveScene();
            }).then(scene => {
                return scene.getItems();
            }).then(items => {
                const gameItem = items.find(item => 
                    item.getType() === XJS.ItemTypes.GAMESOURCE
                );
                
                if (gameItem) {
                    // Position the game capture
                    const position = XJS.Rectangle.fromCoordinates(0, 0, 1920, 1080);
                    return gameItem.setPosition(position);
                }
            }).then(() => {
                console.log('Game capture positioned');
            });
        }
    });
});
```

### Example 6: Extension Window Events

```javascript
XJS.ready().then(() => {
    const extensionWindow = XJS.ExtensionWindow.getInstance();
    
    // Listen for scene changes
    extensionWindow.on('scene-load', (sceneIndex) => {
        console.log(`Scene changed to: ${sceneIndex}`);
        updateUIForScene(sceneIndex);
    });
    
    // Listen for source selection
    extensionWindow.on('sources-list-select', (sourceId) => {
        console.log(`Source selected: ${sourceId}`);
        showSourceProperties(sourceId);
    });
    
    // Listen for source list updates
    extensionWindow.on('sources-list-update', (sourceIds) => {
        console.log('Sources updated:', sourceIds);
        refreshSourceList();
    });
    
    // Resize extension window
    extensionWindow.resize(400, 600);
});
```

### Example 7: Stream Control and Monitoring

```javascript
XJS.ready().then(() => {
    // Get available outputs
    XJS.Output.getOutputList().then(outputs => {
        outputs.forEach(output => {
            output.getName().then(name => {
                if (name.includes('Twitch')) {
                    // Start Twitch stream
                    output.startBroadcast().then(() => {
                        console.log('Twitch stream started');
                        monitorStream(name);
                    });
                }
            });
        });
    });
    
    function monitorStream(streamName) {
        setInterval(() => {
            XJS.StreamInfo.getActiveStreamChannels().then(channels => {
                const stream = channels.find(channel => 
                    channel.getName() === streamName
                );
                
                if (stream) {
                    Promise.all([
                        stream.getStreamRenderedFrames(),
                        stream.getStreamDroppedFrames(),
                        stream.getBroadcastTime()
                    ]).then(([rendered, dropped, duration]) => {
                        console.log(`Stream stats - Rendered: ${rendered}, Dropped: ${dropped}, Duration: ${duration}`);
                    });
                }
            });
        }, 5000);
    }
});
```

### Example 8: Dynamic Scene Management

```javascript
XJS.ready().then(() => {
    let scenes = [];
    let currentSceneIndex = 0;
    
    // Initialize scenes
    XJS.Scene.getSceneList().then(sceneList => {
        scenes = sceneList;
        console.log(`Loaded ${scenes.length} scenes`);
        
        // Set up scene rotation
        setupSceneRotation();
    });
    
    function setupSceneRotation() {
        document.getElementById('nextScene').addEventListener('click', () => {
            currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
            const nextScene = scenes[currentSceneIndex];
            
            nextScene.activate().then(() => {
                return nextScene.getName();
            }).then(name => {
                console.log(`Switched to scene: ${name}`);
                updateSceneDisplay(name);
            });
        });
        
        document.getElementById('prevScene').addEventListener('click', () => {
            currentSceneIndex = currentSceneIndex === 0 ? 
                scenes.length - 1 : currentSceneIndex - 1;
            const prevScene = scenes[currentSceneIndex];
            
            prevScene.activate().then(() => {
                return prevScene.getName();
            }).then(name => {
                console.log(`Switched to scene: ${name}`);
                updateSceneDisplay(name);
            });
        });
    }
    
    function updateSceneDisplay(sceneName) {
        document.getElementById('currentScene').textContent = sceneName;
    }
});
```

## Building from Source

### Prerequisites
- Node.js (v12 or higher)
- npm or yarn

### Build Steps

```bash
# Clone the repository
git clone https://github.com/xjsframework/xjs.git
cd xjs

# Install dependencies
npm install

# Build the project
gulp browserify

# Build minified version
gulp uglify

# Build ES2015 version
gulp es2015

# Build all versions
gulp build
```

### Development

```bash
# Run tests
npm test

# Run tests in specific browser
npm test -- --browsers Chrome

# Generate documentation
gulp docs

# Start development server with live reload
gulp serve
```

## Testing

The framework includes comprehensive unit and functional tests:

```bash
# Run all tests
npm test

# Run unit tests only
gulp test/unit

# Run functional tests
gulp test/functional

# Run tests with coverage
gulp test/coverage
```

## Documentation

- **API Documentation**: [http://xjsframework.github.io/](http://xjsframework.github.io/)
- **Wiki**: [https://github.com/xjsframework/xjs/wiki](https://github.com/xjsframework/xjs/wiki)
- **Tutorials**: Available on the official website
- **TypeScript Definitions**: Included in the package

## Complete API Reference

### Core Classes

#### App Class
Application-level functionality and settings.

**Key Methods:**
- `getFrameTime()` - Get application frame time in 100ns units
- `getResolution()` - Get default output resolution as Rectangle
- `getViewport()` - Get viewport display resolution
- `getVersion()` - Get XSplit Broadcaster version
- `getFramesRendered()` - Get total frames rendered
- `getPrimaryMic()` - Get primary microphone device
- `getPrimarySpeaker()` - Get primary speaker device
- `getTransition()` - Get scene transition settings
- `setTransition()` - Set scene transition

#### Scene Class
Scene management and manipulation.

**Static Methods:**
- `Scene.getActiveScene()` - Get currently active scene
- `Scene.getSceneList()` - Get all available scenes
- `Scene.getById(id)` - Get scene by ID
- `Scene.initializeScenes()` - Initialize scene pool
- `Scene.liveScene()` - Get special live scene object

**Instance Methods:**
- `getName()` - Get scene name
- `setName(name)` - Set scene name
- `getItems()` - Get all items in scene
- `getSources()` - Get all sources in scene
- `activate()` - Make this scene active
- `getSceneNumber()` - Get scene number
- `isEmpty()` - Check if scene has no items

#### Source Classes

**Source (Base Class)**
- `getName()` - Get source name
- `setName(name)` - Set source name
- `getType()` - Get source type (ItemTypes enum)
- `getValue()` - Get source file path or value
- `getKeepLoaded()` - Check if source stays loaded
- `setKeepLoaded(keep)` - Set keep loaded state
- `getItemList()` - Get linked items
- `refresh()` - Refresh source

**Specialized Sources:**
- `CameraSource` - Camera device sources
- `GameSource` - Game capture sources  
- `AudioSource` - Audio sources
- `HtmlSource` - HTML/web page sources
- `ImageSource` - Image file sources
- `MediaSource` - Video/media file sources
- `ScreenSource` - Screen capture sources
- `FlashSource` - Flash file sources
- `SceneSource` - Scene-as-source

#### Item Classes

**Item (Base Class)**
Scene items with layout and positioning.

**Layout Methods:**
- `getPosition()` - Get item position as Rectangle
- `setPosition(rect)` - Set item position
- `isVisible()` - Check if item is visible
- `setVisible(visible)` - Show/hide item
- `bringToFront()` - Bring to front layer
- `sendToBack()` - Send to back layer
- `isKeepAspectRatio()` - Check aspect ratio lock
- `setKeepAspectRatio(keep)` - Set aspect ratio lock
- `getCropping()` - Get crop settings
- `setCropping(crop)` - Set crop settings

**Specialized Items:**
- `CameraItem` - Camera items with device controls
- `GameItem` - Game capture items
- `AudioItem` - Audio items with volume/mute
- `HtmlItem` - HTML items with browser controls
- `ImageItem` - Image items
- `MediaItem` - Video/media items with playback
- `ScreenItem` - Screen capture items
- `SceneItem` - Scene items (scenes as sources)

### System Classes

#### System Class
Hardware device access and management.

**Static Methods:**
- `System.getAudioDevices(dataflow, state)` - Get audio devices
- `System.getCameraDevices()` - Get camera devices  
- `System.getGames()` - Get running games
- `System.getMicrophones()` - Get microphone devices
- `System.getAvailableScreens()` - Get available screens/windows
- `System.getCursorPosition()` - Get cursor position
- `System.setCursorPosition(pos)` - Set cursor position
- `System.getFonts()` - Get available system fonts

**Enums:**
- `AudioDeviceDataflow` - RENDER (1), CAPTURE (2), ALL (3)
- `AudioDeviceState` - ACTIVE (1), DISABLED (2), UNPLUGGED (4), NOTPRESENT (8), ALL (15)

#### AudioDevice Class
Audio device representation and control.

**Methods:**
- `getId()` - Get device ID
- `getName()` - Get device name  
- `getLevel()` - Get audio level
- `setLevel(level)` - Set audio level
- `isEnabled()` - Check if enabled
- `setEnabled(enabled)` - Enable/disable device
- `getDelay()` - Get audio delay
- `setDelay(delay)` - Set audio delay

#### CameraDevice Class
Camera device representation.

**Methods:**
- `getId()` - Get camera ID
- `getName()` - Get camera name
- `addToScene()` - Add camera to current scene
- `toXML()` - Convert to XML representation

#### Game Class
Running game representation.

**Methods:**
- `getId()` - Get game process ID
- `getName()` - Get game name
- `getImage()` - Get game icon
- `addToScene()` - Add game capture to scene
- `isFullscreen()` - Check if game is fullscreen

### Window Classes

#### ExtensionWindow Class
Extension window management and events.

**Events:**
- `scene-load` - Scene change notification
- `sources-list-highlight` - Source hover events
- `sources-list-select` - Source selection events  
- `sources-list-update` - Source list changes
- `scene-delete` - Scene deletion events
- `scene-add` - Scene addition events

**Methods:**
- `ExtensionWindow.getInstance()` - Get singleton instance
- `resize(width, height)` - Resize extension window
- `on(event, handler)` - Listen to events
- `emit(event, ...args)` - Emit events

#### SourcePropsWindow Class
Source properties window management.

**Methods:**
- `SourcePropsWindow.getInstance()` - Get singleton instance
- `useFullWindow()` - Use full window mode
- `useTabbedWindow(tabs)` - Use tabbed mode
- `on(event, handler)` - Listen to events

#### Dialog Class
Dialog and message box utilities.

**Static Methods:**
- `Dialog.createDialog(url)` - Create custom dialog
- `Dialog.showMessageBox(config)` - Show message box
- `Dialog.showOpenFileDialog(config)` - Show file picker
- `Dialog.showSaveFileDialog(config)` - Show save dialog

### Utility Classes

#### Environment Class
Environment detection and version checking.

**Static Methods:**
- `Environment.isExtension()` - Check if running as extension
- `Environment.isPlugin()` - Check if running as plugin  
- `Environment.isSourceProps()` - Check if in source properties
- `Environment.getVersion()` - Get XSplit version
- `Environment.initialize()` - Initialize environment

#### Rectangle Class
Position and dimension representation.

**Methods:**
- `getLeft()`, `getTop()`, `getRight()`, `getBottom()` - Get coordinates
- `getWidth()`, `getHeight()` - Get dimensions
- `setLeft()`, `setTop()`, `setRight()`, `setBottom()` - Set coordinates
- `setWidth()`, `setHeight()` - Set dimensions

**Static Methods:**
- `Rectangle.fromDimensions(width, height)` - Create from dimensions
- `Rectangle.fromCoordinates(left, top, right, bottom)` - Create from coordinates

#### Color Class
Color representation and manipulation.

**Methods:**
- `getRed()`, `getGreen()`, `getBlue()` - Get RGB components
- `getAlpha()` - Get alpha channel
- `toRGBString()` - Convert to RGB string
- `toHexString()` - Convert to hex string

**Static Methods:**
- `Color.fromRGBString(rgb)` - Parse RGB string
- `Color.fromHexString(hex)` - Parse hex string

### Output and Streaming

#### Output Class
Stream and recording control.

**Static Methods:**
- `Output.getOutputList()` - Get available outputs
- `Output.startBroadcast()` - Start streaming
- `Output.stopBroadcast()` - Stop streaming
- `Output.startRecording()` - Start recording
- `Output.stopRecording()` - Stop recording

#### StreamInfo Class
Stream status and statistics.

**Static Methods:**
- `StreamInfo.getActiveStreamChannels()` - Get active streams
- `StreamInfo.getBroadcastTime()` - Get broadcast duration
- `StreamInfo.getStreamRenderedFrames()` - Get rendered frames

### Events and Remote

#### EventEmitter Class
Base event handling functionality.

**Methods:**
- `on(event, handler)` - Add event listener
- `off(event, handler)` - Remove event listener  
- `emit(event, ...args)` - Emit event

#### Remote Class
Remote XJS instance communication.

**Static Properties:**
- `Remote.sendMessage` - Message sending function
- `Remote.remoteType` - Connection type (local/remote/proxy)

**Static Methods:**
- `Remote.receiveMessage(message)` - Handle received messages

### Advanced Features

#### Dll Class
Dynamic library integration.

**Static Methods:**
- `Dll.load(paths)` - Load DLL files
- `Dll.call(functionName, ...args)` - Call safe DLL function (Xjs.dll)
- `Dll.callEx(functionName, ...args)` - Call unsafe DLL function
- `Dll.isAccessGranted()` - Check if DLL access is granted

**Events:**
- `access-granted` - DLL access granted
- `access-revoked` - DLL access revoked

#### Transition Class
Scene transition effects.

**Methods:**
- `getName()` - Get transition name
- `getDuration()` - Get transition duration
- `setDuration(ms)` - Set transition duration

#### Filter Class  
Audio/video filter management.

**Methods:**
- `getName()` - Get filter name
- `isEnabled()` - Check if filter enabled
- `setEnabled(enabled)` - Enable/disable filter

### Constants and Enums

#### ItemTypes Enum
Source/item type identification:
```javascript
ItemTypes.UNDEFINED     // 0
ItemTypes.FILE          // 1 - Media files
ItemTypes.LIVE          // 2 - Camera/capture devices  
ItemTypes.TEXT          // 3 - Text sources
ItemTypes.BITMAP        // 4 - Image files
ItemTypes.SCREEN        // 5 - Screen capture
ItemTypes.FLASHFILE     // 6 - Flash files
ItemTypes.GAMESOURCE    // 7 - Game capture
ItemTypes.HTML          // 8 - Web pages
ItemTypes.THREEDS       // 9 - 3D sources
ItemTypes.PPTFILE       // 10 - PowerPoint files
ItemTypes.SCENE         // 11 - Scene sources
ItemTypes.GROUP         // 12 - Group items
ItemTypes.REPLAY        // 13 - Replay sources
ItemTypes.VIEW          // 14 - View sources
```

#### ViewTypes Enum
Item view context:
```javascript
ViewTypes.MAIN          // 0 - Main output
ViewTypes.PREVIEW       // 1 - Preview window  
ViewTypes.THUMBNAIL     // 2 - Thumbnail view
```

## Advanced Features

### Remote XJS Usage

XJS supports remote communication for distributed plugin architectures:

```javascript
// Remote XJS setup
XJS.ready({
    remote: {
        type: 'remote', // 'remote' or 'proxy'
        sendMessage: function(message) {
            // Your WebSocket/communication method
            websocket.send(message);
        }
    }
}).then(() => {
    // XJS is ready for remote operation
});

// Handle incoming messages
websocket.onmessage = function(event) {
    XJS.Remote.receiveMessage(event.data);
};
```

### DLL Integration

Access custom DLL functionality:

```javascript
XJS.ready().then(() => {
    // Load custom DLLs
    XJS.Dll.load(['Scriptdlls\\MyCustom.dll']).then(() => {
        console.log('DLL loaded successfully');
        
        // Call DLL functions (unsafe DLL)
        return XJS.Dll.callEx('MyFunction', 'param1', 'param2');
    }).then(result => {
        console.log('DLL function result:', result);
    });
    
    // Listen for DLL permission events
    XJS.Dll.on('access-granted', () => {
        console.log('DLL access granted by user');
    });
    
    XJS.Dll.on('access-revoked', () => {
        console.log('DLL access revoked by user');
    });
});
```

### Color and Chroma Key Control

Advanced color manipulation:

```javascript
XJS.ready().then(() => {
    XJS.Scene.getActiveScene().then(scene => {
        return scene.getItems();
    }).then(items => {
        const item = items[0];
        
        // Set chroma key (green screen)
        item.setKeyingType(XJS.KeyingType.COLORKEY).then(() => {
            // Set chroma key color to green
            const green = XJS.Color.fromRGBString('rgb(0, 255, 0)');
            return item.setChromaKeyColor(green);
        }).then(() => {
            // Set chroma key similarity
            return item.setChromaKeySimilarity(60);
        }).then(() => {
            console.log('Chroma key configured');
        });
        
        // Set color correction
        item.setColorBrightness(120).then(() => {
            return item.setColorContrast(110);
        }).then(() => {
            return item.setColorSaturation(105);
        }).then(() => {
            console.log('Color correction applied');
        });
    });
});
```

### Transition Effects

Custom scene transitions:

```javascript
XJS.ready().then(() => {
    const app = new XJS.App();
    
    // Get current transition
    app.getTransition().then(transition => {
        console.log('Current transition:', transition.getName());
        console.log('Duration:', transition.getDuration());
        
        // Set custom transition
        transition.setDuration(2000); // 2 seconds
        return app.setTransition(transition);
    }).then(() => {
        console.log('Transition updated');
    });
});
```

## Plugin Development

### Plugin Structure
```
my-xsplit-plugin/
├── index.html          # Main plugin UI
├── plugin.js           # Plugin logic
├── style.css           # Plugin styles
├── package.json        # Plugin metadata
└── config/
    ├── settings.json   # Plugin settings
    └── presets.json    # User presets
```

### Plugin Template
```javascript
// plugin.js
class MyXSplitPlugin {
    constructor() {
        this.initialized = false;
        this.settings = {};
    }
    
    async init() {
        try {
            await XJS.ready();
            console.log('XJS Framework ready');
            
            await this.loadSettings();
            this.setupUI();
            this.bindEvents();
            this.startMonitoring();
            
            this.initialized = true;
            console.log('Plugin initialized successfully');
        } catch (error) {
            console.error('Plugin initialization failed:', error);
        }
    }
    
    async loadSettings() {
        // Load plugin settings
        this.settings = await this.getStoredSettings();
    }
    
    setupUI() {
        // Initialize user interface
        this.createControlPanel();
        this.updateUI();
    }
    
    bindEvents() {
        // Bind UI events
        document.getElementById('toggleBtn').addEventListener('click', 
            () => this.toggle());
        
        // Bind XJS events
        if (XJS.Environment.isExtension()) {
            const extensionWindow = XJS.ExtensionWindow.getInstance();
            extensionWindow.on('scene-load', (sceneIndex) => {
                this.onSceneChange(sceneIndex);
            });
        }
    }
    
    startMonitoring() {
        // Start periodic tasks
        setInterval(() => this.updateStats(), 1000);
    }
    
    async toggle() {
        // Plugin-specific toggle functionality
        this.settings.enabled = !this.settings.enabled;
        await this.saveSettings();
        this.updateUI();
    }
    
    onSceneChange(sceneIndex) {
        console.log('Scene changed to:', sceneIndex);
        // Handle scene change
    }
    
    updateStats() {
        // Update plugin statistics
    }
    
    createControlPanel() {
        // Create plugin UI elements
    }
    
    updateUI() {
        // Update UI based on current state
    }
    
    async getStoredSettings() {
        // Retrieve settings from storage
        return JSON.parse(localStorage.getItem('myPlugin_settings') || '{}');
    }
    
    async saveSettings() {
        // Save settings to storage
        localStorage.setItem('myPlugin_settings', JSON.stringify(this.settings));
    }
}

// Initialize plugin
const plugin = new MyXSplitPlugin();
plugin.init();
```

### Best Practices

#### Error Handling
```javascript
XJS.ready().then(() => {
    // Always wrap XJS calls in try-catch for async/await
    async function safeOperation() {
        try {
            const scene = await XJS.Scene.getActiveScene();
            const items = await scene.getItems();
            // Process items
        } catch (error) {
            console.error('Operation failed:', error);
            // Handle error gracefully
        }
    }
    
    // Or use .catch() for promises
    XJS.Scene.getActiveScene()
        .then(scene => scene.getItems())
        .then(items => {
            // Process items
        })
        .catch(error => {
            console.error('Operation failed:', error);
        });
});
```

#### Performance Optimization
```javascript
// Cache frequently accessed objects
let cachedScene = null;
let cachedItems = [];

async function getCachedItems() {
    const currentScene = await XJS.Scene.getActiveScene();
    
    // Only refresh cache if scene changed
    if (!cachedScene || cachedScene !== currentScene) {
        cachedScene = currentScene;
        cachedItems = await currentScene.getItems();
    }
    
    return cachedItems;
}

// Debounce frequent operations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedUpdate = debounce(updateUI, 100);
```

#### Memory Management
```javascript
class PluginManager {
    constructor() {
        this.eventHandlers = [];
        this.intervals = [];
    }
    
    addEventHandler(emitter, event, handler) {
        emitter.on(event, handler);
        this.eventHandlers.push({ emitter, event, handler });
    }
    
    addInterval(callback, interval) {
        const id = setInterval(callback, interval);
        this.intervals.push(id);
        return id;
    }
    
    cleanup() {
        // Remove all event handlers
        this.eventHandlers.forEach(({ emitter, event, handler }) => {
            emitter.off(event, handler);
        });
        
        // Clear all intervals
        this.intervals.forEach(id => clearInterval(id));
        
        // Clear references
        this.eventHandlers = [];
        this.intervals = [];
    }
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/xjsframework/xjs/wiki/Contributing) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -am 'Add my feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

### Reporting Issues

Please use the [GitHub issue tracker](https://github.com/xjsframework/xjs/issues) to report bugs or request features.

## Browser Support

- Chrome 45+
- Firefox 40+
- Edge 12+
- Safari 9+

## Versioning

This project follows [Semantic Versioning](https://semver.org/). See [RELEASE.md](RELEASE.md) for release process details.

## License

This project is licensed under the XSplit Extensibility Framework and Plugin License. See the [LICENSE](LICENSE) file for details.

**Important**: This software may only be used to extend XSplit products and cannot be used with other streaming software.

## Troubleshooting

### Common Issues

#### Framework Not Loading
```javascript
// Check if XJS is available
if (typeof XJS === 'undefined') {
    console.error('XJS Framework not loaded');
    // Check script inclusion and paths
}

// Verify environment
XJS.ready().then(() => {
    console.log('Environment:', {
        isExtension: XJS.Environment.isExtension(),
        isPlugin: XJS.Environment.isPlugin(),
        isSourceProps: XJS.Environment.isSourceProps(),
        version: XJS.Environment.getVersion()
    });
}).catch(error => {
    console.error('XJS initialization failed:', error);
});
```

#### Permission Issues
```javascript
// Check for DLL access
XJS.Dll.on('access-revoked', () => {
    console.warn('DLL access denied by user');
    // Disable DLL-dependent features
});

// Handle API restrictions
try {
    await XJS.Scene.getActiveScene();
} catch (error) {
    if (error.message.includes('not available')) {
        console.warn('API not available in current context');
    }
}
```

#### Version Compatibility
```javascript
XJS.ready().then(async () => {
    const version = await new XJS.App().getVersion();
    const [major, minor, build] = version.split('.').map(Number);
    
    if (major < 2 || (major === 2 && minor < 8)) {
        console.warn('XSplit version too old, some features may not work');
    }
    
    // Feature detection instead of version checking
    if (typeof XJS.Scene.liveScene === 'function') {
        // Live scene feature available
    }
});
```

### Debug Mode

Enable debug logging:

```javascript
// Enable verbose logging (if available in your environment)
if (window.console && console.debug) {
    XJS.debug = true;
}

// Log all XJS calls
const originalReady = XJS.ready;
XJS.ready = function(...args) {
    console.log('XJS.ready called with:', args);
    return originalReady.apply(this, args);
};
```

### Performance Monitoring

```javascript
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
    }
    
    startTimer(name) {
        this.metrics[name] = performance.now();
    }
    
    endTimer(name) {
        if (this.metrics[name]) {
            const duration = performance.now() - this.metrics[name];
            console.log(`${name} took ${duration.toFixed(2)}ms`);
            delete this.metrics[name];
        }
    }
    
    async measureAsync(name, asyncFunction) {
        this.startTimer(name);
        try {
            const result = await asyncFunction();
            this.endTimer(name);
            return result;
        } catch (error) {
            this.endTimer(name);
            throw error;
        }
    }
}

const monitor = new PerformanceMonitor();

// Usage
monitor.measureAsync('getSceneItems', async () => {
    const scene = await XJS.Scene.getActiveScene();
    return await scene.getItems();
});
```

## Migration Guide

### From XJS 1.x to 2.x

Key changes and migration steps:

```javascript
// Old (1.x)
xjs.Scene.getActiveScene().then(function(scene) {
    scene.getItems().then(function(items) {
        // Process items
    });
});

// New (2.x) - Same API, but with modern JavaScript support
const scene = await XJS.Scene.getActiveScene();
const items = await scene.getItems();
// Process items
```

### API Changes by Version

- **2.8+**: Scene UID support, enhanced event system
- **2.9+**: Unified naming across linked items  
- **2.10+**: Remote XJS support, improved TypeScript definitions

## Support

- **Official Documentation**: [https://xjsframework.github.io/](https://xjsframework.github.io/)
- **API Reference**: Based on the comprehensive documentation above
- **Email**: xjs@splitmedialabs.com
- **Issues**: [GitHub Issues](https://github.com/xjsframework/xjs/issues)
- **Community**: [XSplit Developer Community](https://community.xsplit.com/developers)
- **Stack Overflow**: Use tag `xjs-framework` for questions

### Getting Help

1. **Check the Documentation**: Start with this README and the official API docs
2. **Search Issues**: Look through existing GitHub issues for similar problems
3. **Provide Details**: When reporting issues, include:
   - XSplit Broadcaster version
   - XJS Framework version
   - Plugin/Extension type
   - Code snippets and error messages
   - Steps to reproduce

### Contributing to Documentation

Found an error or want to improve the documentation? Please:
1. Check the [API reference website](https://xjsframework.github.io/api.html) for the latest information
2. Submit issues or pull requests to improve this README
3. Share examples and use cases with the community

---

**Made with ❤️ by SplitmediaLabs**

*This comprehensive README is based on the XJS Framework codebase and [official API documentation](https://xjsframework.github.io/api.html). For the most up-to-date information, always refer to the official documentation.*
