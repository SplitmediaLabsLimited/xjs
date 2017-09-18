/// <reference path="../../defs/es6-promise.d.ts" />

import { App as iApp } from '../internal/app';
import { exec } from '../internal/internal';
import { Scene } from '../core/scene';

export class Render {
  /***************************
  * VARIABLES AND CONSTANTS *
  ***************************/
   private static _CANVAS_ACTIVE = 0;
  // Two views. Sometimes, CANVAS_PREVIEW will use _VIEW_RENDER because two views cannot look at the same scene.
  private static _VIEW_RENDER = 3;
  private static _VIEW_MAIN = 0;
  // GL variables
  private static _isRunning = [false, true]; // Whether we render for this canvas.
  private static modelVertCount = 4; // Number of array indices for the model. staticant across WebGL contexts
  private static canvases = [null]; // Global variable for the 2 canvas elements
  private static gl = [null]; // A global variable for the WebGL context
  private static sharedTexture = [null]; // The texture that we are sharing between contexts
  private static modelVertPosBuf = [null]; // Vertex position data for the model
  private static modelVertUVBuf = [null]; // Vertex UV data for the model
  private static materialProg = [null]; // The shader program for rendering out model
  private static materialPosAttr = [null]; // Position attribute location in material program
  private static materialUVAttr = [null]; // UV attribute location in material program
  private static vertexShaderCode = `
     attribute vec3 aVertexPosition;
     attribute vec2 aTextureCoord;

     uniform mat4 uVMatrix; // View matrix
     uniform mat4 uPMatrix; // Projection matrix

     varying highp vec2 vTextureCoord;

     void main(void) {
         gl_Position = uPMatrix * uVMatrix * vec4(aVertexPosition, 1.0);

         vTextureCoord = aTextureCoord;
     }
 `;
 private static fragmentShaderCode = `
     varying highp vec2 vTextureCoord;

     uniform sampler2D uSampler;

     void main(void) {
         gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
     }
 `;
  // core-related variables
  private static FPS = 30;
  private static fpsInterval = 1000 / 30;
  static then = [null, null]; // elapsed is now-then. then signifies last frame render. We keep separate then's for each canvas for sanity

  // static createView() {
  //   exec('AppSetPropertyAsync', `enableview:${Render._VIEW_RENDER}`, '1')
  // }

  static setCanvas(canvas, fps?) {
    return new Promise((resolve) => {
      Render.canvases[Render._CANVAS_ACTIVE] = canvas;
      Render.FPS = fps;
      for (let i in Render.canvases) {
        let canvasIndex = Number(i);
        // initialize GL context with proper programs
        Render.initializeCanvas(canvasIndex);
      }
      // Render.createView()
      resolve();
    })
  }

  static drawToTexture(scene) {
    return new Promise(resolve => {
      Scene.getActiveScene().then(scene => {
        return scene.getSceneNumber()
      }).then(num => {
        Render.then[Render._CANVAS_ACTIVE] = window.performance.now();
        if (String(num) === String(scene+1)) {
          console.log('Are we always here?', num, scene+1)
          Render.setCanvasToUseView(Render._CANVAS_ACTIVE, Render._VIEW_MAIN);
          // no need to render for preview yet, so just start rendering ACTIVE canvas.
          Render.startStopRender(true, Render._CANVAS_ACTIVE);
          resolve();
        } else {
          iApp.set(`preset:${Render._VIEW_RENDER}`, String(scene)).then(() => {
            Render.setCanvasToUseView(Render._CANVAS_ACTIVE, Render._VIEW_RENDER);
            Render.startStopRender(true, Render._CANVAS_ACTIVE);
            resolve();
          })
        }
      })
    })
  }

  static initializeCanvas(canvasIndex) {
    let thisCanvas = Render.canvases[canvasIndex];
    let thisGl = Render.initWebGL(thisCanvas);
    Render.gl[canvasIndex] = thisGl;

    thisGl.viewport(0, 0, thisCanvas.width, thisCanvas.height);
    thisGl.clearColor(0.0, 0.0, 0.0, 1.0);
    thisGl.clearDepth(1.0);

    let vShader = thisGl.createShader(thisGl.VERTEX_SHADER);
    thisGl.shaderSource(vShader, Render.vertexShaderCode);
    thisGl.compileShader(vShader);
    if (!thisGl.getShaderParameter(vShader, thisGl.COMPILE_STATUS)) {
      throw 'could not compile shader:' + thisGl.getShaderInfoLog(vShader);
    }
    let fShader = thisGl.createShader(thisGl.FRAGMENT_SHADER);
    thisGl.shaderSource(fShader, Render.fragmentShaderCode);
    thisGl.compileShader(fShader);
    if (!thisGl.getShaderParameter(fShader, thisGl.COMPILE_STATUS)) {
      throw 'could not compile shader:' + thisGl.getShaderInfoLog(fShader);
    }

    Render.materialProg[canvasIndex] = thisGl.createProgram();
    let thisProg = Render.materialProg[canvasIndex];
    thisGl.attachShader(thisProg, vShader);
    thisGl.attachShader(thisProg, fShader);
    thisGl.linkProgram(thisProg);
    if (!thisGl.getProgramParameter(thisProg, thisGl.LINK_STATUS)) {
      throw ('program filed to link:' + thisGl.getProgramInfoLog(thisProg));
    }

    thisGl.useProgram(thisProg);

    Render.materialPosAttr[canvasIndex] = thisGl.getAttribLocation(thisProg, 'aVertexPosition');
    Render.materialUVAttr[canvasIndex] = thisGl.getAttribLocation(thisProg, 'aTextureCoord');
    thisGl.enableVertexAttribArray(Render.materialPosAttr[canvasIndex]);
    thisGl.enableVertexAttribArray(Render.materialUVAttr[canvasIndex]);
    thisGl.uniform1i(thisGl.getUniformLocation(thisProg, 'uSampler'), 0);
    Render.updateProjectionMatrix(canvasIndex);
    Render.setViewMatrix(canvasIndex, Render.lookAt(0.0, 0.0, thisCanvas.width / 2,
      0.0, 0.0, 0.0,
      0.0, 1.0, 0.0));

    Render.recreateSharedTexture(canvasIndex);
  }

  static setCanvasToUseView(canvasIndex, view) {
    let sharedHandleWords = Render.getSharedTextureSharedHandle(canvasIndex);
    return exec('NewWindow', `texture_${canvasIndex}`, `dupworkspace:${view},1,1&d3dhandle:${sharedHandleWords[0]},${sharedHandleWords[1]}`)
  }

  static startStopRender(shouldRender, canvasIndex?) {
    return new Promise(resolve => {
      Render._isRunning[canvasIndex] = shouldRender;
      if (shouldRender) {
        requestAnimationFrame(() => {
          Render.maybeRender(canvasIndex);
        });
      }
      resolve(shouldRender)
    })
  }

  // we only directly call render() once, for initializing texture in memory.
  // afterwards, we always check if we should render
  static maybeRender(canvasIndex) {
    if (Render._isRunning[canvasIndex]) {

      requestAnimationFrame(() => {
        Render.maybeRender(canvasIndex);
      });

      let now = window.performance.now();
      let elapsed = now - Render.then[canvasIndex];
      if (elapsed > Render.fpsInterval) {
        Render.then[canvasIndex] = now - (elapsed % Render.fpsInterval);

        Render.render(canvasIndex);
      }
    }
  }

  // Called whenever we need to repaint the scene. Usually called 60 times a second but can be called
  // more or less as required.
  static render(canvasIndex) {
    if (!Render.gl[canvasIndex])
      return;

    let thisGl = Render.gl[canvasIndex];
    thisGl.clearColor(0.0, 0.0, 0.0, 1.0);
    thisGl.clear(thisGl.COLOR_BUFFER_BIT | thisGl.DEPTH_BUFFER_BIT);

    if (Render.sharedTexture[canvasIndex] == null ||
      Render.modelVertPosBuf[canvasIndex] == null ||
      Render.modelVertUVBuf[canvasIndex] == null ||
      Render.materialProg[canvasIndex] == null) {
      return; // Nothing to render
    }

    // Render model
    thisGl.bindBuffer(thisGl.ARRAY_BUFFER, Render.modelVertPosBuf[canvasIndex]);
    thisGl.vertexAttribPointer(Render.materialPosAttr[canvasIndex], 3, thisGl.FLOAT, false, 0, 0);
    thisGl.bindBuffer(thisGl.ARRAY_BUFFER, Render.modelVertUVBuf[canvasIndex]);
    thisGl.vertexAttribPointer(Render.materialUVAttr[canvasIndex], 2, thisGl.FLOAT, false, 0, 0);
    thisGl.bindTexture(thisGl.TEXTURE_2D, Render.sharedTexture[canvasIndex]);
    thisGl.drawArrays(thisGl.TRIANGLE_STRIP, 0, Render.modelVertCount);
  }

  static initWebGL(canvas) {
    let gl = null;
    try {
      gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }) || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    } catch (e) { }
    if (!gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
      gl = null;
    }
    return gl;
  }

  static updateProjectionMatrix(canvasIndex) {
    let canvas = Render.canvases[canvasIndex]
    let {width, height} = canvas;
    Render.setProjectionMatrix(canvasIndex, Render.ortho(
      width * -0.5, width * 0.5,
      height * -0.5, height * 0.5,
      width / 2, width
    ))
  }

  static setViewMatrix(canvasIndex, mat) {
    if (Render.materialProg[canvasIndex] == null)
      return;
    let thisGl = Render.gl[canvasIndex];
    let loc = thisGl.getUniformLocation(Render.materialProg[canvasIndex], 'uVMatrix');
    thisGl.uniformMatrix4fv(loc, false, new Float32Array(mat));
  }

  static setProjectionMatrix(canvasIndex, mat) {
    if (Render.materialProg[canvasIndex] == null)
      return;
    let thisGl = Render.gl[canvasIndex];
    let loc = thisGl.getUniformLocation(Render.materialProg[canvasIndex], 'uPMatrix');
    thisGl.uniformMatrix4fv(loc, false, new Float32Array(mat));
  }

  static recreateSharedTexture(canvasIndex) {
    if (!Render.gl[canvasIndex])
      return null;

    let thisGl = Render.gl[canvasIndex];
    let { width, height } = Render.canvases[canvasIndex];

    if (Render.sharedTexture[canvasIndex] != null) {
      thisGl.deleteTexture(Render.sharedTexture[canvasIndex]);
      Render.sharedTexture[canvasIndex] = null;
    }

    Render.recreateModel(canvasIndex, width, height);

    let thisTexture = thisGl.createTexture();
    Render.sharedTexture[canvasIndex] = thisTexture;
    thisGl.bindTexture(thisGl.TEXTURE_2D, thisTexture);
    thisGl.texParameteri(thisGl.TEXTURE_2D, thisGl.TEXTURE_WRAP_S, thisGl.CLAMP_TO_EDGE);
    thisGl.texParameteri(thisGl.TEXTURE_2D, thisGl.TEXTURE_WRAP_T, thisGl.CLAMP_TO_EDGE);
    thisGl.texParameteri(thisGl.TEXTURE_2D, thisGl.TEXTURE_MIN_FILTER, thisGl.NEAREST);
    thisGl.texParameteri(thisGl.TEXTURE_2D, thisGl.TEXTURE_MAG_FILTER, thisGl.NEAREST);

    thisGl.texImage2D(thisGl.TEXTURE_2D, 0, thisGl.RGBA, width, height, 0, thisGl.RGBA, thisGl.UNSIGNED_BYTE,
      Render.createTestPattern(width, height));
    thisGl.enable(thisGl.DXGI_SHARED_TEXTURE_FLAG_SPLITMEDIA);
    Render.render(canvasIndex); // Force ANGLE to commit the texture to something that can be bound to a shader
    thisGl.disable(thisGl.DXGI_SHARED_TEXTURE_FLAG_SPLITMEDIA);
  }

  static recreateModel(canvasIndex, width, height) {
    if (!Render.gl[canvasIndex])
      return null;

    let thisGl = Render.gl[canvasIndex];

    if (Render.modelVertPosBuf[canvasIndex] != null) {
      thisGl.deleteBuffer(Render.modelVertPosBuf[canvasIndex]);
      Render.modelVertPosBuf[canvasIndex] = null;
    }
    if (Render.modelVertUVBuf[canvasIndex] != null) {
      thisGl.deleteBuffer(Render.modelVertUVBuf[canvasIndex]);
      Render.modelVertUVBuf[canvasIndex] = null;
    }

    // Vertex positions in world space. It's a flat XY plane centered on the origin where 1 texel
    // equals 1 world unit.
    Render.modelVertPosBuf[canvasIndex] = thisGl.createBuffer();
    thisGl.bindBuffer(thisGl.ARRAY_BUFFER, Render.modelVertPosBuf[canvasIndex]);
    var vertPos = [
      width * -0.5, height * -0.5, 0.0,
      width * 0.5, height * -0.5, 0.0,
      width * -0.5, height * 0.5, 0.0,
      width * 0.5, height * 0.5, 0.0
    ];
    thisGl.bufferData(thisGl.ARRAY_BUFFER, new Float32Array(vertPos), thisGl.STATIC_DRAW);

    // Vertex UV coordinates. Uses the WebGL convention of the texture origin being in the
    // bottom-left corner.
    Render.modelVertUVBuf[canvasIndex] = thisGl.createBuffer();
    thisGl.bindBuffer(thisGl.ARRAY_BUFFER, Render.modelVertUVBuf[canvasIndex]);
    // invert Y coordinates because of opposite conventions
    var vertUV = [
      0.0, 1.0,
      1.0, 1.0,
      0.0, 0.0,
      1.0, 0.0
    ]
    thisGl.bufferData(thisGl.ARRAY_BUFFER, new Float32Array(vertUV), thisGl.STATIC_DRAW);
  }

  /**********************************
   * WEBGL SHARED TEXTURE FUNCTIONS *
   **********************************/

  static getSharedTextureSharedHandle(canvasIndex) {
    if (Render.sharedTexture[canvasIndex] == null)
      return [0, 0];
    let thisGl = Render.gl[canvasIndex];
    thisGl.bindTexture(thisGl.TEXTURE_2D, Render.sharedTexture[canvasIndex]);
    return thisGl.getParameter(thisGl.DXGI_SHARED_HANDLE_SPLITMEDIA);
  }

  /*
  * necessary to create a test pattern for texImage2D; if we don't call that,
  * then shared texture isn't allocated any space in memory, and will not
  * get a shared handle.
  */
  static createTestPattern(width, height) {
    var pattern = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        var i = (y * width + x) * 4;
        pattern[i + 0] = 0; // R
        pattern[i + 1] = 0; // G
        pattern[i + 2] = 0; // B
        pattern[i + 3] = 255; // A
      }
    }
    return pattern;
  }

  // MVP functions
  static lookAt(ex, ey, ez,
    cx, cy, cz,
    ux, uy, uz) {
    var z = Render.vectorUnit([ex - cx, ey - cy, ez - cz]);
    var x = Render.vectorUnit(Render.vectorCross([ux, uy, uz], z));
    var y = Render.vectorUnit(Render.vectorCross(z, x));

    // already flattened
    var m = [
      x[0], x[1], x[2], 0,
      y[0], y[1], y[2], 0,
      z[0], z[1], z[2], 0,
      0, 0, 0, 1];

    var t = [
      1, 0, 0, -ex,
      0, 1, 0, -ey,
      0, 0, 1, -ez,
      0, 0, 0, 1];

    return Render.columnMajor(Render.matrixMult(m, t));
  }

  static ortho(left, right,
    bottom, top,
    znear, zfar) {
    var tx = -(right + left) / (right - left);
    var ty = -(top + bottom) / (top - bottom);
    var tz = -(zfar + znear) / (zfar - znear);

    return Render.columnMajor([
      2 / (right - left), 0, 0, tx,
      0, 2 / (top - bottom), 0, ty,
      0, 0, -2 / (zfar - znear), tz,
      0, 0, 0, 1
    ]);
  }

  /*************************
   * HELPER MATH FUNCTIONS *
   *************************/

  // Vector functions

  // vectors of size 3 only
  static vectorCross([u1, u2, u3], [v1, v2, v3]) {
    return [u2 * v3 - u3 * v2, u3 * v1 - u1 * v3, u1 * v2 - u2 * v1];
  }

  static vectorUnit(v) {
    // modulus
    let mod = Math.sqrt(v.reduce((product, e) => {
      // dot product
      return product + e * e;
    }));
    if (mod === 0) {
      return v;
    } else {
      return v.map(el => {
        return el / mod;
      });
    }
  }

  // Matrix functions

  // 4x4 only
  static matrixMult(a, b) {
    let mult = new Array(16);
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        // calc 4*i + j
        mult[4 * i + j] = 0;
        for (let k = 0; k < 4; ++k) {
          mult[4 * i + j] += a[4 * i + k] * b[4 * k + j];
        }
      }
    }
    return mult;
  }

  // 4x4 only
  static columnMajor(mat) {
    let maj = new Array(16);
    for (let j = 0; j < 4; ++j) {
      for (let i = 0; i < 4; ++i) {
        maj[4 * j + i] = mat[4 * i + j];
      }
    }
    return maj;
  }

}// end of code







// export class Render {
//   static gl = [null]
//   static canvases = [null]
//   static sharedTexture = [null]; // The texture that we are sharing between contexts
//   static modelVertPosBuf = [null]; // Vertex position data for the model
//   static modelVertUVBuf = [null]; // Vertex UV data for the model
//   static materialProg = [null]; // The shader program for rendering out model
//   static materialPosAttr = [null]; // Position attribute location in material program
//   static materialUVAttr = [null]; // UV attribute location in material program
//   static then = [null]
//   static vertexShaderCode = `
//     attribute vec3 aVertexPosition;
//     attribute vec2 aTextureCoord;

//     uniform mat4 uVMatrix; // View matrix
//     uniform mat4 uPMatrix; // Projection matrix

//     varying highp vec2 vTextureCoord;

//     void main(void) {
//         gl_Position = uPMatrix * uVMatrix * vec4(aVertexPosition, 1.0);

//         vTextureCoord = aTextureCoord;
//     }
//   `;
//   static fragmentShaderCode = `
//     varying highp vec2 vTextureCoord;

//     uniform sampler2D uSampler;

//     void main(void) {
//         gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
//     }
//   `;

//   static modelVertCount = 4; // Number of array indices for the model. Constant across WebGL contexts
//   static fps = 30;
//   static fpsInterval = 1000/Render.fps
//   static isRendering = []

//   static toggleRender(shouldRender) {
//     return new Promise(resolve => {
//       Render.startStopRender(0, shouldRender)
//       resolve(shouldRender)
//     })
//   }

//   static setCanvasToUseView() {
//     let sharedHandleWords = Render.getSharedTextureSharedHandle(0);
//     return new Promise(resolve => {
//       exec('NewWindow', `texture_${0}`, `dupworkspace:${0},1,1&d3dhandle:${sharedHandleWords[0]},${sharedHandleWords[1]}`);
//     })
//   }

//   private static getSharedTextureSharedHandle(canvasIndex) {
//     if (Render.sharedTexture[canvasIndex] == null)
//         return [0, 0];
//     let thisGl = Render.gl[canvasIndex];
//     thisGl.bindTexture(thisGl.TEXTURE_2D, Render.sharedTexture[canvasIndex]);
//     return thisGl.getParameter(thisGl.DXGI_SHARED_HANDLE_SPLITMEDIA);
//   }

//   // initializeCanvas -> getContext -> initializeCanvas ->
//   // createShaders -> initializeCanvas -> render
//   static initializeCanvas(canvas, fps): any {
//     Render.fps = fps;
//     const canvasIndex = 0;
//     Render.canvases[canvasIndex] = canvas;
//     Render.then[canvasIndex] = window.performance.now();
//     return new Promise(resolve => {
//       let webGL = Render.getContext(canvas)

//       webGL.then(thisGL => {
//         Render.gl[canvasIndex] = thisGL;
//         let createShaders = Render.createShaders(canvasIndex)
//         createShaders.then(index => {
//           return Render.setCanvasToUseView()
//         }).then(() => {
//           Render.startStopRender(0, true)
//         })
//       })
//     })
//   }

//   static setFPS(fps: number) {
//     return new Promise(resolve => {
//       Render.fps = fps
//       resolve(true)
//     })
//   }

//     // Called whenever we need to repaint the scene. Usually called 60 times a second but can be called
//   // more or less as required.
//   static render(canvasIndex) {
//     return new Promise(resolve => {
//       if (!Render.gl[canvasIndex])
//           return;

//       let thisGl = Render.gl[canvasIndex];
//       console.log('render got this >>>>>>', thisGl)
//       thisGl.clearColor(0.0, 0.0, 0.0, 1.0);
//       thisGl.clear(thisGl.COLOR_BUFFER_BIT | thisGl.DEPTH_BUFFER_BIT);

//       if (Render.sharedTexture[canvasIndex] == null ||
//           Render.modelVertPosBuf[canvasIndex] == null ||
//           Render.modelVertUVBuf[canvasIndex] == null ||
//           Render.materialProg[canvasIndex] == null) {
//               return; // Nothing to render
//       }

//       // Render model
//       thisGl.bindBuffer(thisGl.ARRAY_BUFFER, Render.modelVertPosBuf[canvasIndex]);
//       thisGl.vertexAttribPointer(Render.materialPosAttr[canvasIndex], 3, thisGl.FLOAT, false, 0, 0);
//       thisGl.bindBuffer(thisGl.ARRAY_BUFFER, Render.modelVertUVBuf[canvasIndex]);
//       thisGl.vertexAttribPointer(Render.materialUVAttr[canvasIndex], 2, thisGl.FLOAT, false, 0, 0);
//       thisGl.bindTexture(thisGl.TEXTURE_2D, Render.sharedTexture[canvasIndex]);
//       thisGl.drawArrays(thisGl.TRIANGLE_STRIP, 0, Render.modelVertCount);
//     })
//   }

//   /**********************************************************
//    * All supporting calls needed for creating all necessary *
//    * objects and other supporting calls for calculations.   *
//    **********************************************************/

//   // To stop rendering, just set to false
//   private static startStopRender(canvasIndex, shouldRender) {
//     Render.isRendering[canvasIndex] = shouldRender;
//     if (shouldRender) {
//         requestAnimationFrame(() => {
//           Render.maybeRender(canvasIndex);
//         });
//     }
//   }

//   // we only directly call render() once, for initializing texture in memory.
//   // afterwards, we always check if we should render
//   static maybeRender(canvasIndex) {
//     if (Render.isRendering[canvasIndex]) {
//       requestAnimationFrame(() => {
//           Render.maybeRender(canvasIndex);
//       });

//       let now = window.performance.now();
//       let elapsed = now - Render.then[canvasIndex];
//       if (elapsed > Render.fpsInterval) {
//         Render.then[canvasIndex] = now - (elapsed % Render.fpsInterval);

//         Render.render(canvasIndex);
//       }
//     }
//   }



//   private static getContext(canvas: any): any {
//     return new Promise(resolve => {
//       let gl = null;
//       try {
//         gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }) || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
//       }
//       catch (e) { }
//       if (!gl) {
//         alert('Unable to initialize WebGL. Your browser may not support it.');
//         gl = null;
//       }
//       resolve(gl);
//     });
//   }
//   // createShaders -> shaderHelper -> recreateSharedTexture
//   private static createShaders(canvasIndex: number): any {
//     let thisGl = Render.gl[canvasIndex]
//     let thisCanvas = Render.canvases[canvasIndex]
//     return new Promise(resolve => {
//         Render.shaderHelper(thisGl, thisCanvas, canvasIndex)
//         .then(() => {
//           Render.recreateSharedTexture(canvasIndex).then(ret => {
//             resolve(ret)
//           })
//         })
//     })
//   }

//   private static recreateModel(canvasIndex, width, height) {
//     if (!Render.gl[canvasIndex])
//         return null;

//     let thisGl = Render.gl[canvasIndex];

//     if (Render.modelVertPosBuf[canvasIndex] != null) {
//         thisGl.deleteBuffer(Render.modelVertPosBuf[canvasIndex]);
//         Render.modelVertPosBuf[canvasIndex] = null;
//     }
//     if (Render.modelVertUVBuf[canvasIndex] != null) {
//         thisGl.deleteBuffer(Render.modelVertUVBuf[canvasIndex]);
//         Render.modelVertUVBuf[canvasIndex] = null;
//     }

//     // Vertex positions in world space. It's a flat XY plane centered on the origin where 1 texel
//     // equals 1 world unit.
//     Render.modelVertPosBuf[canvasIndex] = thisGl.createBuffer();
//     thisGl.bindBuffer(thisGl.ARRAY_BUFFER, Render.modelVertPosBuf[canvasIndex]);
//     var vertPos = [
//         width * -0.5, height * -0.5, 0.0,
//         width *  0.5, height * -0.5, 0.0,
//         width * -0.5, height *  0.5, 0.0,
//         width *  0.5, height *  0.5, 0.0
//     ];
//     thisGl.bufferData(thisGl.ARRAY_BUFFER, new Float32Array(vertPos), thisGl.STATIC_DRAW);

//     // Vertex UV coordinates. Uses the WebGL convention of the texture origin being in the
//     // bottom-left corner.
//     Render.modelVertUVBuf[canvasIndex] = thisGl.createBuffer();
//     thisGl.bindBuffer(thisGl.ARRAY_BUFFER, Render.modelVertUVBuf[canvasIndex]);
//     // invert Y coordinates because of opposite conventions
//     var vertUV = [
//         0.0, 1.0,
//         1.0, 1.0,
//         0.0, 0.0,
//         1.0, 0.0
//     ]
//     thisGl.bufferData(thisGl.ARRAY_BUFFER, new Float32Array(vertUV), thisGl.STATIC_DRAW);
//   }

//   /*********************************
//    * WEBGL MATRIX INITIALIZERS     *
//    * These are one-time use for    *
//    * initialization, do not touch! *
//    *********************************/

//   private static setViewMatrix(canvasIndex, mat) {
//     if (Render.materialProg[canvasIndex] == null)
//         return;
//     let thisGl = Render.gl[canvasIndex];
//     let loc = thisGl.getUniformLocation(Render.materialProg[canvasIndex], 'uVMatrix');
//     thisGl.uniformMatrix4fv(loc, false, new Float32Array(mat));
//   }

//   private static setProjectionMatrix(canvasIndex, mat) {
//     if (Render.materialProg[canvasIndex] == null)
//         return;
//     let thisGl = Render.gl[canvasIndex];
//     let loc = thisGl.getUniformLocation(Render.materialProg[canvasIndex], 'uPMatrix');
//     thisGl.uniformMatrix4fv(loc, false, new Float32Array(mat));
//   }

//   private static updateProjectionMatrix(canvasIndex) {
//     let canvas = Render.canvases[canvasIndex]
//     let {width, height} = canvas;
//     Render.setProjectionMatrix(canvasIndex, Render.ortho(
//         width * -0.5, width * 0.5,
//         height * -0.5, height * 0.5,
//         width/2, width
//     ))
//   }

//   /*************************
//    * HELPER MATH FUNCTIONS *
//    *************************/

//   // Vector functions

//   // vectors of size 3 only
//   private static vectorCross([u1, u2, u3], [v1,v2,v3]) {
//     return [u2*v3 - u3*v2, u3*v1 - u1*v3, u1*v2 - u2*v1];
//   }

//   private static vectorUnit(v) {
//     // modulus
//     let mod = Math.sqrt(v.reduce((product, e) => {
//         // dot product
//         return product + e*e;
//     }));
//     if (mod === 0) {
//         return v;
//     } else {
//         return v.map(el => {
//             return el/mod;
//         });
//     }
//   }

//   // Matrix functions

//   // 4x4 only
//   private static matrixMult(a, b) {
//     let mult = new Array(16);
//     for (let i = 0; i < 4; ++i) {
//         for (let j = 0; j < 4; ++j) {
//             // calc 4*i + j
//             mult[4*i + j] = 0;
//             for (let k = 0; k < 4; ++k) {
//                 mult[4*i + j] += a[4*i+k] * b[4*k+j];
//             }
//         }
//     }
//     return mult;
//   }

//   // 4x4 only
//   private static columnMajor(mat) {
//     let maj = new Array(16);
//     for (let j = 0; j < 4; ++j) {
//         for (let i = 0; i < 4; ++i) {
//             maj[4*j+i] = mat[4*i+j];
//         }
//     }
//     return maj;
//   }

//   // MVP functions
//   private static lookAt(ex, ey, ez,
//                 cx, cy, cz,
//                 ux, uy, uz) {
//     var z = Render.vectorUnit([ex - cx, ey - cy, ez - cz]);
//     var x = Render.vectorUnit(Render.vectorCross([ux, uy, uz], z));
//     var y = Render.vectorUnit(Render.vectorCross(z, x));

//     // already flattened
//     var m = [
//         x[0], x[1], x[2], 0,
//         y[0], y[1], y[2], 0,
//         z[0], z[1], z[2], 0,
//         0, 0, 0, 1];

//     var t = [
//         1, 0, 0, -ex,
//         0, 1, 0, -ey,
//         0, 0, 1, -ez,
//         0, 0, 0, 1];

//     return Render.columnMajor(Render.matrixMult(m, t));
//   }

//   private static ortho(left, right,
//               bottom, top,
//               znear, zfar) {
//     var tx = -(right + left) / (right - left);
//     var ty = -(top + bottom) / (top - bottom);
//     var tz = -(zfar + znear) / (zfar - znear);

//     return Render.columnMajor([
//         2 / (right - left), 0, 0, tx,
//         0, 2 / (top - bottom), 0, ty,
//         0, 0, -2 / (zfar - znear), tz,
//         0, 0, 0, 1
//     ]);
//   }

//   private static shaderHelper(thisGl: any, thisCanvas: any, canvasIndex: number) {
//     return new Promise(resolve => {
//       thisGl.viewport(0, 0, thisCanvas.width, thisCanvas.height);
//       thisGl.clearColor(0.0, 0.0, 0.0, 1.0);
//       thisGl.clearDepth(1.0);
//       let vShader = thisGl.createShader(thisGl.VERTEX_SHADER);
//       thisGl.shaderSource(vShader, Render.vertexShaderCode);
//       thisGl.compileShader(vShader);
//       if(!thisGl.getShaderParameter(vShader, thisGl.COMPILE_STATUS)) {
//         throw 'could not compile shader:' + thisGl.getShaderInfoLog(vShader);
//       }
//       let fShader = thisGl.createShader(thisGl.FRAGMENT_SHADER);
//       thisGl.shaderSource(fShader, Render.fragmentShaderCode);
//       thisGl.compileShader(fShader);
//       if(!thisGl.getShaderParameter(fShader, thisGl.COMPILE_STATUS)) {
//         throw 'could not compile shader:' + thisGl.getShaderInfoLog(fShader);
//       }
//       Render.materialProg[canvasIndex] = thisGl.createProgram();
//       let thisProg = Render.materialProg[canvasIndex];
//       thisGl.attachShader(thisProg, vShader);
//       thisGl.attachShader(thisProg, fShader);
//       thisGl.linkProgram(thisProg);
//       if(!thisGl.getProgramParameter(thisProg, thisGl.LINK_STATUS)) {
//         throw ('program filed to link:' + thisGl.getProgramInfoLog(thisProg));
//       }
//       thisGl.useProgram(thisProg);
//       Render.materialPosAttr[canvasIndex] = thisGl.getAttribLocation(thisProg, 'aVertexPosition');
//       Render.materialUVAttr[canvasIndex] = thisGl.getAttribLocation(thisProg, 'aTextureCoord');
//       thisGl.enableVertexAttribArray(Render.materialPosAttr[canvasIndex]);
//       thisGl.enableVertexAttribArray(Render.materialUVAttr[canvasIndex]);
//       thisGl.uniform1i(thisGl.getUniformLocation(thisProg, 'uSampler'), 0);
//       Render.updateProjectionMatrix(canvasIndex);
//       Render.setViewMatrix(canvasIndex, Render.lookAt(0.0, 0.0, thisCanvas.width / 2, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0));
//       resolve()
//     })
//   }

//   private static recreateSharedTexture(canvasIndex) {
//     return new Promise(resolve => {
//       if (!Render.gl[canvasIndex])
//       return null;

//       let thisGl = Render.gl[canvasIndex];
//       let { width, height } = Render.canvases[canvasIndex];

//       if (Render.sharedTexture[canvasIndex] != null) {
//           thisGl.deleteTexture(Render.sharedTexture[canvasIndex]);
//           Render.sharedTexture[canvasIndex] = null;
//       }

//       Render.recreateModel(canvasIndex, width, height);

//       let thisTexture = thisGl.createTexture();
//       Render.sharedTexture[canvasIndex] = thisTexture;
//       thisGl.bindTexture(thisGl.TEXTURE_2D, thisTexture);
//       thisGl.texParameteri(thisGl.TEXTURE_2D, thisGl.TEXTURE_WRAP_S, thisGl.CLAMP_TO_EDGE);
//       thisGl.texParameteri(thisGl.TEXTURE_2D, thisGl.TEXTURE_WRAP_T, thisGl.CLAMP_TO_EDGE);
//       thisGl.texParameteri(thisGl.TEXTURE_2D, thisGl.TEXTURE_MIN_FILTER, thisGl.NEAREST);
//       thisGl.texParameteri(thisGl.TEXTURE_2D, thisGl.TEXTURE_MAG_FILTER, thisGl.NEAREST);

//       thisGl.texImage2D(thisGl.TEXTURE_2D, 0, thisGl.RGBA, width, height, 0, thisGl.RGBA, thisGl.UNSIGNED_BYTE,
//         Render.createTestPattern(width, height));
//       thisGl.enable(thisGl.DXGI_SHARED_TEXTURE_FLAG_SPLITMEDIA);
//       Render.render(canvasIndex)
//       thisGl.disable(thisGl.DXGI_SHARED_TEXTURE_FLAG_SPLITMEDIA);
//       resolve(canvasIndex);
//     })
//   }

//   /*
//   * necessary to create a test pattern for texImage2D; if we don't call that,
//   * then shared texture isn't allocated any space in memory, and will not
//   * get a shared handle.
//   */
//   private static createTestPattern(width, height) {
//     var pattern = new Uint8Array(width * height * 4);
//     for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//             var i = (y * width + x) * 4;
//             pattern[i + 0] = 0; // R
//             pattern[i + 1] = 0; // G
//             pattern[i + 2] = 0; // B
//             pattern[i + 3] = 255; // A
//         }
//     }
//     return pattern;
//   }
// }
