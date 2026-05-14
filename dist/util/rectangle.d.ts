/**
 *  The Rectangle class is a utility class used in many different parts of the
 *  framework. Please note that there are cases where the framework uses
 *  absolute (pixel) measurements, and cases where relative measurements are
 *  required (0 being the left/top edges and 1 being the right/bottom edges.)
 *
 *  Please check the documentation of each function to determine the necessary
 *  parameters for the Rectangle to be created.
 */
export declare class Rectangle {
    private _top;
    private _left;
    private _width;
    private _height;
    private _right;
    private _bottom;
    /** Gets the top value */
    getTop(): number;
    /** Sets the top value */
    setTop(top: number): Rectangle;
    /** Gets the left value */
    getLeft(): number;
    /** Sets the left value */
    setLeft(left: number): Rectangle;
    /** Gets the right value */
    getRight(): number;
    /** Sets the right value */
    setRight(right: number): Rectangle;
    /** Gets the bottom value */
    getBottom(): number;
    /** Sets the bottom value */
    setBottom(bottom: number): Rectangle;
    /** Gets the width value */
    getWidth(): number;
    /** Sets the width value */
    setWidth(width: number): Rectangle;
    /** Gets the height value */
    getHeight(): number;
    /** Sets the height value */
    setHeight(height: number): Rectangle;
    /**
     *  param: (width: number, height: number)
     *  ```
     *  return: Rectangle
     *  ```
     *  Creates a rectangle from width and height dimensions. Absolute (pixels)
     *  and relative (0-1) dimensions are accepted. Refer to the documentation
     *  of each individual function to see which one is necessary.
     */
    static fromDimensions(width: number, height: number): Rectangle;
    /**
     *  param: (left: number, top: number, right: number, bottom: number)
     *  ```
     *  return: Rectangle
     *  ```
     *  Creates a rectangle from coordinates. Absolute (pixels)
     *  and relative (0-1) dimensions are accepted. Refer to the documentation
     *  of each individual function to see which one is necessary.
     */
    static fromCoordinates(left: number, top: number, right: number, bottom: number): Rectangle;
    /**
     *  return: string
     *
     *  Returns a comma-separated string containing the width and height values.
     */
    toDimensionString(): string;
    /**
     *  return: string
     *
     *  Returns a comma-separated string containing the coordinates in the order:
     *  left, top, right, bottom.
     */
    toCoordinateString(): string;
    /**
     *  return: string
     *  ```
     *  param: (format ?: string)
     *  ```
     *  Returns a string representation of the Rectangle object. If the format
     *  optional parameter is omitted, then this is simply the string from
     *  `toDimensionString()`. Sample usage:
     *
     *  ```javascript
     *  console.log(rect.toString('Origin is at (:left, :top)'));```
     *
     *  You can format the output string by specifying the following markers in
     *  the parameter:
     *  - :left
     *  - :top
     *  - :right
     *  - :bottom
     *  - :width
     *  - :height
     */
    toString(value?: string): string;
}
