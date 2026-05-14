export declare class Render {
    static setTargetCanvas(canvas: HTMLCanvasElement, fps?: number): Promise<any>;
    static toggleRender(state?: boolean): Promise<unknown>;
    static testCanvasToUse(canvasIndex: any, sceneId: any): Promise<unknown>;
}
