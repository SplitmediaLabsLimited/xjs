import { Scene } from '../scene';
export interface ISourceScene {
    /**
     * return: Promise<Scene>
     *
     * Gets the scene that is being displayed by the source
     */
    getScene(): Promise<Scene>;
    /**
     * param: (value?: number | Scene)
     * ```
     * return: Promise<SourceScene>
     * ```
     *
     * Sets the scene to be displayed displayed by the source
     */
    setScene(scene?: number | Scene): Promise<SourceScene>;
}
export declare class SourceScene implements ISourceScene {
    private _id;
    private _srcId;
    private _isItemCall;
    private _sceneId;
    protected _checkPromise: any;
    private _updateId;
    protected _setScene(itemType: string, uid: string, name: string, resolve: Function, reject: Function): void;
    getScene(): Promise<Scene>;
    setScene(scene?: number | Scene): Promise<SourceScene>;
}
