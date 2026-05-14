export declare class Render {
    /***************************
    * VARIABLES AND CONSTANTS *
    ***************************/
    private static _CANVAS_ACTIVE;
    private static _VIEW_RENDER;
    private static _VIEW_MAIN;
    private static _isRunning;
    private static modelVertCount;
    private static canvases;
    private static gl;
    private static sharedTexture;
    private static modelVertPosBuf;
    private static modelVertUVBuf;
    private static materialProg;
    private static materialPosAttr;
    private static materialUVAttr;
    private static vertexShaderCode;
    private static fragmentShaderCode;
    private static FPS;
    private static fpsInterval;
    static then: any[];
    static setCanvas(canvas: any, fps?: any): Promise<unknown>;
    static drawToTexture(canvasIndex: any, sceneIndex: any): Promise<unknown>;
    static initializeCanvas(canvasIndex: any): void;
    static setCanvasToUseView(canvasIndex: any, sceneId: any): Promise<any>;
    static startStopRender(shouldRender: any, canvasIndex?: any): Promise<unknown>;
    static maybeRender(canvasIndex: any): void;
    static render(canvasIndex: any): void;
    static initWebGL(canvas: any): any;
    static updateProjectionMatrix(canvasIndex: any): void;
    static setViewMatrix(canvasIndex: any, mat: any): void;
    static setProjectionMatrix(canvasIndex: any, mat: any): void;
    static recreateSharedTexture(canvasIndex: any): any;
    static recreateModel(canvasIndex: any, width: any, height: any): any;
    /**********************************
     * WEBGL SHARED TEXTURE FUNCTIONS *
     **********************************/
    static getSharedTextureSharedHandle(canvasIndex: any): any;
    static createTestPattern(width: any, height: any): Uint8Array<ArrayBuffer>;
    static lookAt(ex: any, ey: any, ez: any, cx: any, cy: any, cz: any, ux: any, uy: any, uz: any): any[];
    static ortho(left: any, right: any, bottom: any, top: any, znear: any, zfar: any): any[];
    /*************************
     * HELPER MATH FUNCTIONS *
     *************************/
    static vectorCross([u1, u2, u3]: [any, any, any], [v1, v2, v3]: [any, any, any]): number[];
    static vectorUnit(v: any): any;
    static matrixMult(a: any, b: any): any[];
    static columnMajor(mat: any): any[];
}
