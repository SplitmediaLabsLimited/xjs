/// <reference path="../../defs/es6-promise.d.ts" />

import { App as iApp } from '../internal/app';
import { exec } from '../internal/internal';
import { Scene } from '../core/scene';

export class Render {
  /***************************
  * VARIABLES AND CONSTANTS *
  ***************************/
  private static _time = [];
  private static _type = [];
  // GL variables
  private static _isRunning = []; // Whether we render for this canvas.
  private static modelVertCount = 4; // Number of array indices for the model. staticant across WebGL contexts
  private static canvases = [];
  private static gls = [];
  private static sharedTextures = [];
  private static modelVertPosBufs = [];
  private static modelVertUVBufs = [];
  private static materialProgs = [];
  private static materialPosAttrs = [];
  private static materialUVAttrs =[];
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
  private static fpsInterval = 1000 / 30;

  // Call main function and immediately render
  static drawToTexture(canvasIndex, id, type) {
    return new Promise(resolve => {
      Render._type[canvasIndex] = type;
      Render._time[canvasIndex] = window.performance.now();
      Render.setCanvasToUseView(canvasIndex, id).then(() => {
        Render.startStopRender(canvasIndex, true).then(res => {
          resolve(res);
        })
      })
    })
  }

  // intialize canvas
  // prepare the canvas for rendering
  static initializeCanvas(thisCanvas, fps?) {
    return new Promise(resolve => {
      Render.canvases.push(thisCanvas);
      const thisIndex = Render.canvases.indexOf(thisCanvas);
      Render.initWebGL(thisIndex).then(gl => {
        Render.gls[thisIndex] = gl;

        Render.gls[thisIndex].viewport(0, 0, thisCanvas.width, thisCanvas.height);
        Render.gls[thisIndex].clearColor(0.0, 0.0, 0.0, 1.0);
        Render.gls[thisIndex].clearDepth(1.0);

        let vShader = Render.gls[thisIndex].createShader(Render.gls[thisIndex].VERTEX_SHADER);
        Render.gls[thisIndex].shaderSource(vShader, Render.vertexShaderCode);
        Render.gls[thisIndex].compileShader(vShader);
        if (!Render.gls[thisIndex].getShaderParameter(vShader, Render.gls[thisIndex].COMPILE_STATUS)) {
          throw 'could not compile shader:' + Render.gls[thisIndex].getShaderInfoLog(vShader);
        }

        let fShader = Render.gls[thisIndex].createShader(Render.gls[thisIndex].FRAGMENT_SHADER);
        Render.gls[thisIndex].shaderSource(fShader, Render.fragmentShaderCode);
        Render.gls[thisIndex].compileShader(fShader);
        if (!Render.gls[thisIndex].getShaderParameter(fShader, Render.gls[thisIndex].COMPILE_STATUS)) {
          throw 'could not compile shader:' + Render.gls[thisIndex].getShaderInfoLog(fShader);
        }

        Render.materialProgs[thisIndex] = Render.gls[thisIndex].createProgram();
        let thisProg = Render.materialProgs[thisIndex];
        Render.gls[thisIndex].attachShader(thisProg, vShader);
        Render.gls[thisIndex].attachShader(thisProg, fShader);
        Render.gls[thisIndex].linkProgram(thisProg);
        if (!Render.gls[thisIndex].getProgramParameter(thisProg, Render.gls[thisIndex].LINK_STATUS)) {
          throw ('program filed to link:' + Render.gls[thisIndex].getProgramInfoLog(thisProg));
        }

        Render.gls[thisIndex].useProgram(thisProg);

        Render.materialPosAttrs[thisIndex] = Render.gls[thisIndex].getAttribLocation(thisProg, 'aVertexPosition');
        Render.materialUVAttrs[thisIndex] = Render.gls[thisIndex].getAttribLocation(thisProg, 'aTextureCoord');
        Render.gls[thisIndex].enableVertexAttribArray(Render.materialPosAttrs[thisIndex]);
        Render.gls[thisIndex].enableVertexAttribArray(Render.materialUVAttrs[thisIndex]);
        Render.gls[thisIndex].uniform1i(Render.gls[thisIndex].getUniformLocation(thisProg, 'uSampler'), 0);
        Render.updateProjectionMatrix(thisIndex);
        Render.setViewMatrix(thisIndex, Render.lookAt(0.0, 0.0, thisCanvas.width / 2,
          0.0, 0.0, 0.0,
          0.0, 1.0, 0.0));

        Render.recreateSharedTexture(thisIndex).then(() => {
          resolve(thisIndex)
        })
      })
    })
  }

  // call duplication methods
  static setCanvasToUseView(canvasIndex, id) {
    return new Promise(resolve => {
      Render.getSharedTextureSharedHandle(canvasIndex).then(sharedHandle => {
        exec('NewWindow', `texture_${canvasIndex}`, `${Render._type[canvasIndex]}:${id},1,1&d3dhandle:${sharedHandle}`)
        .then(res => {
          resolve(res)
        })
      })
    })
  }


  // start/stop rendering
  static startStopRender(canvasIndex, shouldRender?) {
    return new Promise((resolve, reject) => {
      if (shouldRender === 'undefined') {
        shouldRender = !Render._isRunning[canvasIndex];
      }
      if (canvasIndex instanceof HTMLCanvasElement) {
        canvasIndex = Render.canvases.indexOf(canvasIndex)
      }
      if (!Render.canvases[canvasIndex]) {
        reject(Error('Provided canvas could not be found.'))
      }
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
      let elapsed = now - Render._time[canvasIndex];
      if (elapsed > Render.fpsInterval) {
        Render._time[canvasIndex] = now - (elapsed % Render.fpsInterval);

        Render.render(canvasIndex);
      }
    }
  }

  // Called whenever we need to repaint the scene. Usually called 60 times a second but can be called
  // more or less as required.
  static render(canvasIndex) {
    if (!Render.gls[canvasIndex])
      return;

    Render.gls[canvasIndex].clearColor(0.0, 0.0, 0.0, 1.0);
    Render.gls[canvasIndex].clear(Render.gls[canvasIndex].COLOR_BUFFER_BIT | Render.gls[canvasIndex].DEPTH_BUFFER_BIT);

    if (Render.sharedTextures[canvasIndex] == null ||
      Render.modelVertPosBufs[canvasIndex] == null ||
      Render.modelVertUVBufs[canvasIndex] == null ||
      Render.materialProgs[canvasIndex] == null) {
      return; // Nothing to render
    }

    // Render model
    Render.gls[canvasIndex].bindBuffer(Render.gls[canvasIndex].ARRAY_BUFFER, Render.modelVertPosBufs[canvasIndex]);
    Render.gls[canvasIndex].vertexAttribPointer(Render.materialPosAttrs[canvasIndex], 3, Render.gls[canvasIndex].FLOAT, false, 0, 0);
    Render.gls[canvasIndex].bindBuffer(Render.gls[canvasIndex].ARRAY_BUFFER, Render.modelVertUVBufs[canvasIndex]);
    Render.gls[canvasIndex].vertexAttribPointer(Render.materialUVAttrs[canvasIndex], 2, Render.gls[canvasIndex].FLOAT, false, 0, 0);
    Render.gls[canvasIndex].bindTexture(Render.gls[canvasIndex].TEXTURE_2D, Render.sharedTextures[canvasIndex]);
    Render.gls[canvasIndex].drawArrays(Render.gls[canvasIndex].TRIANGLE_STRIP, 0, Render.modelVertCount);
  }

  // initialize a web gl context from a canvas
  static initWebGL(canvasIndex) {
    return new Promise(resolve => {
      let gl = null;
      try {
        gl = Render.canvases[canvasIndex].getContext('webgl', { preserveDrawingBuffer: true }) || Render.canvases[canvasIndex].getContext('experimental-webgl', { preserveDrawingBuffer: true });
      } catch (e) { }
      if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        gl = null;
      }
      resolve(gl);
    })
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
    if (Render.materialProgs[canvasIndex] == null)
      return;
    let loc = Render.gls[canvasIndex].getUniformLocation(Render.materialProgs[canvasIndex], 'uVMatrix');
    Render.gls[canvasIndex].uniformMatrix4fv(loc, false, new Float32Array(mat));
  }

  static setProjectionMatrix(canvasIndex, mat) {
    if (Render.materialProgs[canvasIndex] == null)
      return;
    let loc = Render.gls[canvasIndex].getUniformLocation(Render.materialProgs[canvasIndex], 'uPMatrix');
    Render.gls[canvasIndex].uniformMatrix4fv(loc, false, new Float32Array(mat));
  }

  static recreateSharedTexture(canvasIndex) {
    return new Promise(resolve => {
      if (!Render.gls[canvasIndex])
        resolve(null);

      let { width, height } = Render.canvases[canvasIndex];
      Render.recreateModel(canvasIndex, width, height).then(res => {
        if (Render.sharedTextures[canvasIndex] != null) {
          Render.gls[canvasIndex].deleteTexture(Render.sharedTextures[canvasIndex]);
          Render.sharedTextures[canvasIndex] = null;
        }
        let dxgiExt = Render.gls[canvasIndex].getExtension('SML_dxgi_shared_textures');

        let thisTexture = Render.gls[canvasIndex].createTexture();
        Render.sharedTextures[canvasIndex] = thisTexture;
        Render.gls[canvasIndex].bindTexture(Render.gls[canvasIndex].TEXTURE_2D, thisTexture);
        Render.gls[canvasIndex].texParameteri(Render.gls[canvasIndex].TEXTURE_2D, Render.gls[canvasIndex].TEXTURE_WRAP_S, Render.gls[canvasIndex].CLAMP_TO_EDGE);
        Render.gls[canvasIndex].texParameteri(Render.gls[canvasIndex].TEXTURE_2D, Render.gls[canvasIndex].TEXTURE_WRAP_T, Render.gls[canvasIndex].CLAMP_TO_EDGE);
        Render.gls[canvasIndex].texParameteri(Render.gls[canvasIndex].TEXTURE_2D, Render.gls[canvasIndex].TEXTURE_MIN_FILTER, Render.gls[canvasIndex].NEAREST);
        Render.gls[canvasIndex].texParameteri(Render.gls[canvasIndex].TEXTURE_2D, Render.gls[canvasIndex].TEXTURE_MAG_FILTER, Render.gls[canvasIndex].NEAREST);

        Render.gls[canvasIndex].texImage2D(Render.gls[canvasIndex].TEXTURE_2D, 0, Render.gls[canvasIndex].RGBA, width, height, 0, Render.gls[canvasIndex].RGBA, Render.gls[canvasIndex].UNSIGNED_BYTE,
          Render.createTestPattern(width, height));
        dxgiExt.setNewTexturesAreSharedSML(true);
        Render.render(canvasIndex); // Force ANGLE to commit the texture to something that can be bound to a shader
        dxgiExt.setNewTexturesAreSharedSML(false);
        resolve(true);
      })
    })
  }

  static recreateModel(canvasIndex, width, height) {
    return new Promise(resolve => {
      if (!Render.gls[canvasIndex])
        resolve(null);

      if (Render.modelVertPosBufs[canvasIndex] != null) {
        Render.gls[canvasIndex].deleteBuffer(Render.modelVertPosBufs[canvasIndex]);
        Render.modelVertPosBufs[canvasIndex] = null;
      }
      if (Render.modelVertUVBufs[canvasIndex] != null) {
        Render.gls[canvasIndex].deleteBuffer(Render.modelVertUVBufs[canvasIndex]);
        Render.modelVertUVBufs[canvasIndex] = null;
      }

      // Vertex positions in world space. It's a flat XY plane centered on the origin where 1 texel
      // equals 1 world unit.
      Render.modelVertPosBufs[canvasIndex] = Render.gls[canvasIndex].createBuffer();
      Render.gls[canvasIndex].bindBuffer(Render.gls[canvasIndex].ARRAY_BUFFER, Render.modelVertPosBufs[canvasIndex]);
      var vertPos = [
        width * -0.5, height * -0.5, 0.0,
        width * 0.5, height * -0.5, 0.0,
        width * -0.5, height * 0.5, 0.0,
        width * 0.5, height * 0.5, 0.0
      ];
      Render.gls[canvasIndex].bufferData(Render.gls[canvasIndex].ARRAY_BUFFER, new Float32Array(vertPos), Render.gls[canvasIndex].STATIC_DRAW);

      // Vertex UV coordinates. Uses the WebGL convention of the texture origin being in the
      // bottom-left corner.
      Render.modelVertUVBufs[canvasIndex] = Render.gls[canvasIndex].createBuffer();
      Render.gls[canvasIndex].bindBuffer(Render.gls[canvasIndex].ARRAY_BUFFER, Render.modelVertUVBufs[canvasIndex]);
      // invert Y coordinates because of opposite conventions
      var vertUV = [
        0.0, 1.0,
        1.0, 1.0,
        0.0, 0.0,
        1.0, 0.0
      ]
      Render.gls[canvasIndex].bufferData(Render.gls[canvasIndex].ARRAY_BUFFER, new Float32Array(vertUV), Render.gls[canvasIndex].STATIC_DRAW);
      resolve(true)
    })
  }

  /**********************************
   * WEBGL SHARED TEXTURE FUNCTIONS *
   **********************************/

  static getSharedTextureSharedHandle(canvasIndex) {
    return new Promise(resolve => {
      if (Render.sharedTextures[canvasIndex] == undefined)
        return 0x0;
      Render.gls[canvasIndex].bindTexture(Render.gls[canvasIndex].TEXTURE_2D, Render.sharedTextures[canvasIndex]);
      let dxgiExt = Render.gls[canvasIndex].getExtension('SML_dxgi_shared_textures');
      let handle = dxgiExt.getSharedHandleSML();
      resolve(handle)
    })
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