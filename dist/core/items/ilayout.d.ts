import { Rectangle } from '../../util/rectangle';
export interface IItemLayout {
    /**
     * return: Promise<boolean>
     *
     * Check if Aspect Ratio is set to ON or OFF
     *
     * #### Usage
     *
     * ```javascript
     * item.isKeepAspectRatio().then(function(bool) {
     *   // The rest of your code here
     * });
     * ```
     */
    isKeepAspectRatio(): Promise<boolean>;
    /**
     * param: (value: boolean)
     * ```
     * return: Promise<Item>
     * ```
     *
     * Set Aspect Ratio to ON or OFF
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.setKeepAspectRatio(true).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setKeepAspectRatio(value: boolean): Promise<IItemLayout>;
    /**
     * return: Promise<boolean>
     *
     * Check if Position Locked is set to ON or OFF
     *
     * #### Usage
     *
     * ```javascript
     * item.isPositionLocked().then(function(bool) {
     *   // The rest of your code here
     * });
     * ```
     */
    isPositionLocked(): Promise<boolean>;
    /**
     * param: (value: boolean)
     * ```
     * return: Promise<Item>
     * ```
     *
     * Set Position Lock to ON or OFF
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.setPositionLocked(true).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setPositionLocked(value: boolean): Promise<IItemLayout>;
    /**
     * return: Promise<boolean>
     *
     * Check if Enhance Resize is Enabled or Disabled
     *
     * #### Usage
     *
     * ```javascript
     * item.isEnhancedResizeEnabled().then(function(bool) {
     *   // The rest of your code here
     * });
     * ```
     */
    isEnhancedResizeEnabled(): Promise<boolean>;
    /**
     * param: (value: boolean)
     * ```
     * return: Promise<Item>
     * ```
     *
     * Set Enhance Resize to ON or OFF
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.setEnhancedResizeEnabled(true).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setEnhancedResizeEnabled(value: boolean): Promise<IItemLayout>;
    /**
     * return: Promise<Rectangle>
     *
     * Get the position of the item
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     *
     * #### Usage
     *
     * ```javascript
     * item.getPosition().then(function(pos) {
     *   // The rest of your code here
     * });
     * ```
     */
    getPosition(): Promise<Rectangle>;
    /**
     * param: (value: Rectangle)
     *
     * Set Item Position. Relative coordinates (0-1) are required.
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * var rect = xjs.Rectangle.fromCoordinates(0, 0, 1, 1);
     * item.setPosition(rect).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    setPosition(value: Rectangle): Promise<IItemLayout>;
    /**
     * return: Promise<number>
     *
     * Get Rotate Y value of the item
     *
     * #### Usage
     *
     * ```javascript
     * item.getRotateY().then(function(deg) {
     *   // The rest of your code here
     * });
     * ```
     */
    getRotateY(): Promise<number>;
    /**
     * param: (value: number)
     * ```
     * return: Promise<Item>
     * ```
     *
     * Set Rotate Y value of the item
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.setRotateY(30).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setRotateY(value: number): Promise<IItemLayout>;
    /**
     * return: Promise<number>
     *
     * Get Rotate X value of the item
     *
     * #### Usage
     *
     * ```javascript
     * item.getRotateX().then(function(deg) {
     *   // The rest of your code here
     * });
     * ```
     */
    getRotateX(): Promise<number>;
    /**
     * param: (value: number)
     * ```
     * return: Promise<Item>
     * ```
     *
     * Set Rotate X value of the item
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.setRotateX(30).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setRotateX(value: number): Promise<IItemLayout>;
    /**
     * return: Promise<number>
     *
     * Get Rotate Z value of the item.
     *
     * #### Usage
     *
     * ```javascript
     * item.getRotateX().then(function(deg) {
     *   // The rest of your code here
     * });
     * ```
     */
    getRotateZ(): Promise<number>;
    /**
     * param: (value: number)
     * ```
     * return: Promise<Item>
     * ```
     *
     * Set Rotate Z value of the item.
     *
     * *Chainable.*
     *
     * Please do note that this method will NOT automatically modify/calculate
     * the height and width of the item whenever you modify the rotate Z value,
     * unlike the behavior of XBC when modifying it through the properties window.
     *
     * You will need to manually modify the height and width of the item each time
     * you modify this value to get the best results. If not, it might result to
     * the stretching and/or shrinking of the item.
     *
     * #### Usage
     *
     * ```javascript
     * item.setRotateZ(30).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setRotateZ(value: number): Promise<IItemLayout>;
    /**
     * return: Promise<Object>
     *
     * Get the cropping of the item
     *
     * This returns an object with properties of left, top, right, and bottom
     * whose values are between 0 - 1. This object is not a coordinate system.
     * Top value indicates the portion of the item removed(cropped) from the top,
     * left value indicates the portion of the item removed from the left,
     * and so on.
     *
     * #### Usage
     *
     * ```javascript
     * item.getCropping().then(function(crop) {
     *   // The rest of your code here
     *   var left = crop.left;
     *   var top = crop.top;
     *   var right = crop.right;
     *   var bottom = crop.bottom;
     * });
     * ```
     */
    getCropping(): Promise<Object>;
    /**
     * param: (value: Object)
     *
     * Set Item cropping.
     *
     * This accepts an object with properties left, top, right, and bottom
     * whose values are between 0 - 1. This object is not a coordinate system.
     * Top value indicates the portion of the item removed(cropped) from the top,
     * left value indicates the portion of the item removed from the left,
     * and so on.
     *
     * *Chainable.*
     *
     * Please do note that this method will NOT automatically modify/calculate
     * the height and width of the item whenever you modify cropping,
     * unlike the behavior of XBC when modifying it through the properties window.
     *
     * You will need to manually modify the height and width of the item each time
     * you modify this value to get the best results. If not, it might result to
     * the stretching and/or shrinking of the item.
     * #### Usage
     *
     * ```javascript
     * var obj = {};
     * obj.left = 0.1;
     * obj.top = 0.2;
     * obj.right = 0;
     * obj.bottom = 0.1;
     * item.setCropping(obj).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setCropping(value: Object): Promise<IItemLayout>;
    /**
     * return: Promise<number>
     *
     * Get canvas rotation of the item
     *
     * #### Usage
     *
     * ```javascript
     * item.getCanvasRotate().then(function(deg) {
     *   // The rest of your code here
     * });
     * ```
     */
    getCanvasRotate(): Promise<number>;
    /**
     * param: (value: number)
     * ```
     * return: Promise<Item>
     * ```
     *
     * Set canvas rotation of the item (possible values - 0, 90, 180, 270)
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.setCanvasRotate(90).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setCanvasRotate(value: number): Promise<IItemLayout>;
    /**
     * return: Promise<number>
     *
     * Get the z-rotation value as can be seen in the item properties window.
     * This value takes into account rotateZ along with canvas rotation.
     *
     * #### Usage
     *
     * ```javascript
     * item.getEnhancedRotate().then(function(deg) {
     *   // The rest of your code here
     * });
     * ```
     */
    getEnhancedRotate(): Promise<number>;
    /**
     * param: (value: number)
     * ```
     * return: Promise<Item>
     * ```
     *
     * Set Rotate Z value of the item, also taking into account canvas rotation.
     *
     * *Chainable.*
     *
     * This method automatically modifies/calculates
     * the height and width of the item whenever you modify the z-rotation value,
     * changing its orientation (vertical / horizontal) at certain angles.
     * This behavior is what is exhibited in the item properties window.
     *
     * #### Usage
     *
     * ```javascript
     * item.setEnhancedRotate(30).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setEnhancedRotate(value: number): Promise<IItemLayout>;
    /**
     * param: (value: Object)
     *
     * Set item cropping while automatically calculating
     * and modifying width and height to account for the cropped value.
     *
     * This accepts an object with properties left, top, right, and bottom
     * whose values are between 0 - 1. This object is not a coordinate system.
     * Top value indicates the portion of the item removed(cropped) from the top,
     * left value indicates the portion of the item removed from the left,
     * and so on.
     *
     * *Chainable.*
     *
     * This behaves the same as in the item properties window
     * and is done to prevent item stretching.
     *
     * #### Usage
     *
     * ```javascript
     * var obj = {};
     * obj.left = 0.1;
     * obj.top = 0.2;
     * obj.right = 0;
     * obj.bottom = 0.1;
     * item.setCroppingEnhanced(obj).then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    setCroppingEnhanced(value: Object): Promise<IItemLayout>;
    /**
     * return: Promise<Item>
     *
     * Move item one level up in the z-index (to the front)
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.bringForward().then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    bringForward(): Promise<IItemLayout>;
    /**
     * return: Promise<Item>
     *
     * Move item one level down in the z-index (to the back)
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.sendBackward().then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    sendBackward(): Promise<IItemLayout>;
    /**
     * return: Promise<Item>
     *
     * Move item to highest level in the z-index (to the absolute front)
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.bringToFront().then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    bringToFront(): Promise<IItemLayout>;
    /**
     * return: Promise<Item>
     *
     * Move item to lowest level in the z-index (to the absolute back)
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * item.sendToBack().then(function(item) {
     *   // Promise resolves with same Item instance
     * });
     * ```
     */
    sendToBack(): Promise<IItemLayout>;
}
export declare class ItemLayout implements IItemLayout {
    private _id;
    private position;
    private _getCanvasAndZRotate;
    private _adjustRotation;
    isKeepAspectRatio(): Promise<boolean>;
    setKeepAspectRatio(value: boolean): Promise<ItemLayout>;
    isPositionLocked(): Promise<boolean>;
    setPositionLocked(value: boolean): Promise<ItemLayout>;
    isEnhancedResizeEnabled(): Promise<boolean>;
    setEnhancedResizeEnabled(value: boolean): Promise<ItemLayout>;
    getPosition(): Promise<Rectangle>;
    setPosition(value: Rectangle): Promise<ItemLayout>;
    getRotateY(): Promise<number>;
    setRotateY(value: number): Promise<ItemLayout>;
    getRotateX(): Promise<number>;
    setRotateX(value: number): Promise<ItemLayout>;
    getRotateZ(): Promise<number>;
    setRotateZ(value: number): Promise<ItemLayout>;
    getCropping(): Promise<Object>;
    setCropping(value: Object): Promise<ItemLayout>;
    getCanvasRotate(): Promise<number>;
    setCanvasRotate(value: number): Promise<ItemLayout>;
    getEnhancedRotate(): Promise<number>;
    setEnhancedRotate(value: number): Promise<ItemLayout>;
    setCroppingEnhanced(value: Object): Promise<ItemLayout>;
    bringForward(): Promise<ItemLayout>;
    sendBackward(): Promise<ItemLayout>;
    bringToFront(): Promise<ItemLayout>;
    sendToBack(): Promise<ItemLayout>;
}
