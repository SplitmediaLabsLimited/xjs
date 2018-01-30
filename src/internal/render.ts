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
  private static _time;
  // GL variables
  private static _isRunning = [false, true]; // Whether we render for this canvas.
  private static modelVertCount = 4; // Number of array indices for the model. staticant across WebGL contexts
  private static canvas; // Global variable for the 2 canvas elements
  private static gl; // A global variable for the WebGL context
  private static sharedTexture; // The texture that we are sharing between contexts
  private static modelVertPosBuf; // Vertex position data for the model
  private static modelVertUVBuf; // Vertex UV data for the model
  private static materialProg; // The shader program for rendering out model
  private static materialPosAttr; // Position attribute location in material program
  private static materialUVAttr; // UV attribute location in material program
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

  // static createView() {
  //   exec('AppSetPropertyAsync', `enableview:${Render._VIEW_RENDER}`, '1')
  // }

  static drawToTexture(canvasIndex, sceneIndex) {
    return new Promise(resolve => {
      Render._time = window.performance.now();
      Render.setCanvasToUseView(canvasIndex, sceneIndex);
      // no need to render for preview yet, so just start rendering ACTIVE canvas.
      Render.startStopRender(true, Render._CANVAS_ACTIVE);
      resolve();
    })
  }

  static initializeCanvas(thisCanvas, fps?) {
    return new Promise(resolve => {
      Render.canvas = thisCanvas;
      Render.gl = Render.initWebGL(thisCanvas);

      Render.gl.viewport(0, 0, thisCanvas.width, thisCanvas.height);
      Render.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      Render.gl.clearDepth(1.0);

      let vShader = Render.gl.createShader(Render.gl.VERTEX_SHADER);
      Render.gl.shaderSource(vShader, Render.vertexShaderCode);
      Render.gl.compileShader(vShader);
      if (!Render.gl.getShaderParameter(vShader, Render.gl.COMPILE_STATUS)) {
        throw 'could not compile shader:' + Render.gl.getShaderInfoLog(vShader);
      }
      let fShader = Render.gl.createShader(Render.gl.FRAGMENT_SHADER);
      Render.gl.shaderSource(fShader, Render.fragmentShaderCode);
      Render.gl.compileShader(fShader);
      if (!Render.gl.getShaderParameter(fShader, Render.gl.COMPILE_STATUS)) {
        throw 'could not compile shader:' + Render.gl.getShaderInfoLog(fShader);
      }

      Render.materialProg = Render.gl.createProgram();
      let thisProg = Render.materialProg;
      Render.gl.attachShader(thisProg, vShader);
      Render.gl.attachShader(thisProg, fShader);
      Render.gl.linkProgram(thisProg);
      if (!Render.gl.getProgramParameter(thisProg, Render.gl.LINK_STATUS)) {
        throw ('program filed to link:' + Render.gl.getProgramInfoLog(thisProg));
      }

      Render.gl.useProgram(thisProg);

      Render.materialPosAttr = Render.gl.getAttribLocation(thisProg, 'aVertexPosition');
      Render.materialUVAttr = Render.gl.getAttribLocation(thisProg, 'aTextureCoord');
      Render.gl.enableVertexAttribArray(Render.materialPosAttr);
      Render.gl.enableVertexAttribArray(Render.materialUVAttr);
      Render.gl.uniform1i(Render.gl.getUniformLocation(thisProg, 'uSampler'), 0);
      Render.updateProjectionMatrix(0);
      Render.setViewMatrix(0, Render.lookAt(0.0, 0.0, thisCanvas.width / 2,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0));

      Render.recreateSharedTexture(0);
      resolve(this)
    })
  }

  // dupscene
  static setCanvasToUseView(canvasIndex, sceneId) {
    let sharedHandle = Render.getSharedTextureSharedHandle(0);
    return exec('NewWindow', `texture_${canvasIndex}`, `dupscene:${sceneId},1,1&d3dhandle:${sharedHandle}`)
  }

  // dupworkspace
  static setCanvasToUseViewWorkspance(canvasIndex, sceneId) {
    let sharedHandle = Render.getSharedTextureSharedHandle(0);
    let upperBits = sharedHandle >> 32;
    let lowerBits = sharedHandle & 0xffffffff;
    console.log('Calling with:: ', `dupworkspace:${sceneId},1,1&d3dhandle:${upperBits},${lowerBits}`)
    return exec('NewWindow', `texture_${canvasIndex}`, `dupworkspace:${sceneId},1,1&d3dhandle:${upperBits},${lowerBits}`)
  }

  // dupvideoitem
  static setCanvasToUseViewVideoItem(canvasIndex, sceneId) {
    let sharedHandle = Render.getSharedTextureSharedHandle(0);
    let upperBits = sharedHandle >> 32;
    let lowerBits = sharedHandle & 0xffffffff;
    console.log('Calling with:: ', `dupvideoitem:${sceneId},1,1&d3dhandle:${upperBits},${lowerBits}`)
    return exec('NewWindow', `texture_${canvasIndex}`, `dupvideoitem:${sceneId},1,1&d3dhandle:${upperBits},${lowerBits}`)
  }

  // source
  static setCanvasToUseViewSource(canvasIndex, sceneId) {
    let sharedHandle = Render.getSharedTextureSharedHandle(0);
    let upperBits = sharedHandle >> 32;
    let lowerBits = sharedHandle & 0xffffffff;
    console.log('Calling with:: ', `dupsource:${sceneId},1,1&d3dhandle:${upperBits},${lowerBits}`)
    return exec('NewWindow', `texture_${canvasIndex}`, `dupsource:${sceneId},1,1&d3dhandle:${upperBits},${lowerBits}`)
  }

  static startStopRender(shouldRender, canvasIndex?) {
    return new Promise(resolve => {
      Render._isRunning = shouldRender;
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
    if (Render._isRunning) {

      requestAnimationFrame(() => {
        Render.maybeRender(canvasIndex);
      });

      let now = window.performance.now();
      let elapsed = now - Render._time;
      if (elapsed > Render.fpsInterval) {
        Render._time = now - (elapsed % Render.fpsInterval);

        Render.render(canvasIndex);
      }
    }
  }

  // Called whenever we need to repaint the scene. Usually called 60 times a second but can be called
  // more or less as required.
  static render(canvasIndex) {
    if (!Render.gl)
      return;

    Render.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    Render.gl.clear(Render.gl.COLOR_BUFFER_BIT | Render.gl.DEPTH_BUFFER_BIT);

    if (Render.sharedTexture == null ||
      Render.modelVertPosBuf == null ||
      Render.modelVertUVBuf == null ||
      Render.materialProg == null) {
      return; // Nothing to render
    }

    // Render model
    Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER, Render.modelVertPosBuf);
    Render.gl.vertexAttribPointer(Render.materialPosAttr, 3, Render.gl.FLOAT, false, 0, 0);
    Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER, Render.modelVertUVBuf);
    Render.gl.vertexAttribPointer(Render.materialUVAttr, 2, Render.gl.FLOAT, false, 0, 0);
    Render.gl.bindTexture(Render.gl.TEXTURE_2D, Render.sharedTexture);
    Render.gl.drawArrays(Render.gl.TRIANGLE_STRIP, 0, Render.modelVertCount);
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
    let canvas = Render.canvas
    let {width, height} = canvas;
    Render.setProjectionMatrix(canvasIndex, Render.ortho(
      width * -0.5, width * 0.5,
      height * -0.5, height * 0.5,
      width / 2, width
    ))
  }

  static setViewMatrix(canvasIndex, mat) {
    if (Render.materialProg == null)
      return;
    let loc = Render.gl.getUniformLocation(Render.materialProg, 'uVMatrix');
    Render.gl.uniformMatrix4fv(loc, false, new Float32Array(mat));
  }

  static setProjectionMatrix(canvasIndex, mat) {
    if (Render.materialProg == null)
      return;
    let loc = Render.gl.getUniformLocation(Render.materialProg, 'uPMatrix');
    Render.gl.uniformMatrix4fv(loc, false, new Float32Array(mat));
  }

  static recreateSharedTexture(canvasIndex) {
    if (!Render.gl)
      return null;

    let { width, height } = Render.canvas;

    if (Render.sharedTexture != null) {
      Render.gl.deleteTexture(Render.sharedTexture);
      Render.sharedTexture = null;
    }
    let dxgiExt = Render.gl.getExtension('SML_dxgi_shared_textures');
    Render.recreateModel(canvasIndex, width, height);

    let thisTexture = Render.gl.createTexture();
    Render.sharedTexture = thisTexture;
    Render.gl.bindTexture(Render.gl.TEXTURE_2D, thisTexture);
    Render.gl.texParameteri(Render.gl.TEXTURE_2D, Render.gl.TEXTURE_WRAP_S, Render.gl.CLAMP_TO_EDGE);
    Render.gl.texParameteri(Render.gl.TEXTURE_2D, Render.gl.TEXTURE_WRAP_T, Render.gl.CLAMP_TO_EDGE);
    Render.gl.texParameteri(Render.gl.TEXTURE_2D, Render.gl.TEXTURE_MIN_FILTER, Render.gl.NEAREST);
    Render.gl.texParameteri(Render.gl.TEXTURE_2D, Render.gl.TEXTURE_MAG_FILTER, Render.gl.NEAREST);

    Render.gl.texImage2D(Render.gl.TEXTURE_2D, 0, Render.gl.RGBA, width, height, 0, Render.gl.RGBA, Render.gl.UNSIGNED_BYTE,
      Render.createTestPattern(width, height));
    dxgiExt.setNewTexturesAreSharedSML(true);
    Render.render(canvasIndex); // Force ANGLE to commit the texture to something that can be bound to a shader
    dxgiExt.setNewTexturesAreSharedSML(false);
  }

  static recreateModel(canvasIndex, width, height) {
    if (!Render.gl)
      return null;

    if (Render.modelVertPosBuf != null) {
      Render.gl.deleteBuffer(Render.modelVertPosBuf);
      Render.modelVertPosBuf = null;
    }
    if (Render.modelVertUVBuf != null) {
      Render.gl.deleteBuffer(Render.modelVertUVBuf);
      Render.modelVertUVBuf = null;
    }

    // Vertex positions in world space. It's a flat XY plane centered on the origin where 1 texel
    // equals 1 world unit.
    Render.modelVertPosBuf = Render.gl.createBuffer();
    Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER, Render.modelVertPosBuf);
    var vertPos = [
      width * -0.5, height * -0.5, 0.0,
      width * 0.5, height * -0.5, 0.0,
      width * -0.5, height * 0.5, 0.0,
      width * 0.5, height * 0.5, 0.0
    ];
    Render.gl.bufferData(Render.gl.ARRAY_BUFFER, new Float32Array(vertPos), Render.gl.STATIC_DRAW);

    // Vertex UV coordinates. Uses the WebGL convention of the texture origin being in the
    // bottom-left corner.
    Render.modelVertUVBuf = Render.gl.createBuffer();
    Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER, Render.modelVertUVBuf);
    // invert Y coordinates because of opposite conventions
    var vertUV = [
      0.0, 1.0,
      1.0, 1.0,
      0.0, 0.0,
      1.0, 0.0
    ]
    Render.gl.bufferData(Render.gl.ARRAY_BUFFER, new Float32Array(vertUV), Render.gl.STATIC_DRAW);
  }

  /**********************************
   * WEBGL SHARED TEXTURE FUNCTIONS *
   **********************************/

  static getSharedTextureSharedHandle(canvasIndex) {
    if (Render.sharedTexture == undefined)
      return 0x0;
    Render.gl.bindTexture(Render.gl.TEXTURE_2D, Render.sharedTexture);
    let dxgiExt = Render.gl.getExtension('SML_dxgi_shared_textures');
    let handle = dxgiExt.getSharedHandleSML();
    return handle
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