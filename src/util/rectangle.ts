export class Rectangle {
  private top: number;
  private left: number;
  private width: number;
  private height: number;
  private right: number;
  private bottom: number;

  /** Gets the top value */
  getTop(): number {
    return this.top;
  }

  /** Sets the top value */
  setTop(top: number) {
    this.top = top;

    if (this.bottom !== undefined &&
      this.height !== (this.top - this.bottom)) {
      this.setHeight(Math.abs(this.top - this.bottom));
    }
    else if (this.height !== undefined &&
      this.bottom !== (this.top + this.height)) {
      this.setBottom(this.top + this.height);
    }
  }

  /** Gets the left value */
  getLeft(): number {
    return this.left;
  }

  /** Sets the left value */
  setLeft(left: number) {
    this.left = left;

    if (this.right !== undefined &&
      this.width !== Math.abs(this.right - this.left)) {
      this.setWidth(Math.abs(this.right - this.left));
    }
    else if (this.width !== undefined &&
      this.height !== (this.left + this.width)) {
      this.setRight(this.left + this.width);
    }
  }

  /** Gets the right value */
  getRight(): number {
    return this.right;
  }

  /** Sets the right value */
  setRight(right: number) {
    this.right = right;

    if (this.left !== undefined &&
      this.width !== Math.abs(this.right - this.left)) {
      this.setWidth(Math.abs(this.right - this.left));
    }
    else if (this.width !== undefined &&
      this.left !== (this.right - this.width)) {
      this.setLeft(this.right - this.width);
    }
  }

  /** Gets the bottom value */
  getBottom(): number {
    return this.bottom;
  }

  /** Sets the bottom value */
  setBottom(bottom: number) {
    this.bottom = bottom;

    if (this.top !== undefined &&
      this.height !== Math.abs(this.top - this.bottom)) {
      this.setHeight(Math.abs(this.top - this.bottom));
    }
    else if (this.height !== undefined &&
      this.top !== (this.bottom - this.height)) {
      this.setTop(this.bottom - this.height);
    }
  }

  /** Gets the width value */
  getWidth(): number {
    return this.width;
  }

  /** Sets the width value */
  setWidth(width: number) {
    this.width = width;

    if (this.right !== undefined &&
      this.left !== (this.right - this.width)) {
      this.setLeft(this.right - this.width);
    }
    else if (this.left !== undefined &&
      this.right !== (this.left + this.width)) {
      this.setRight(this.left + this.width);
    }
  }

  /** Gets the height value */
  getHeight(): number {
    return this.height;
  }

  /** Sets the height value */
  setHeight(height: number) {
    this.height = height;

    if (this.top !== undefined &&
      this.bottom !== (this.top + this.height)) {
      this.setBottom(this.top + this.height);
    }
    else if (this.bottom !== undefined &&
      this.top !== (this.bottom - this.height)) {
      this.setTop(this.bottom - this.height);
    }
  }

  static fromDimensions(width: number, height: number): Rectangle {
    if (width < 0 || height < 0) {
      throw new Error('Rectangle dimensions cannot be negative.');
    }

    let rect = new Rectangle();
    rect.width = width;
    rect.height = height;
    return rect;
  }

  static fromCoordinates(top: number, left: number,
    right: number, bottom: number): Rectangle {
    if (top > bottom) {
      throw new Error('Top coordinate must be smaller than bottom.');
    } else if (left > right) {
      throw new Error('Right coordinate must be smaller than left.');
    }

    let rect = new Rectangle();
    rect.top = top;
    rect.left = left;
    rect.setRight(right); // calculates width
    rect.setBottom(bottom); // calculates height
    return rect;
  }

  toDimensionString(): string {
    return this.width + ',' + this.height;
  }

  toCoordinateString(): string {
    if (this.left === undefined) {
      throw new Error('This Rectangle instance does not have coordinates.');
    } else {
      return this.left + ',' + this.top + ',' + this.right + ',' + this.bottom;
    }
  }

  toString(value ?: string): string {
    if (value === undefined) {
      return this.toDimensionString(); // all rectangles have dimensions
    } else {
      let format: string = value;

      format = format.replace(':left', String(this.left));
      format = format.replace(':top', String(this.top));
      format = format.replace(':right', String(this.right));
      format = format.replace(':bottom', String(this.bottom));
      format = format.replace(':width', String(this.width));
      format = format.replace(':height', String(this.height));

      return format;
    }
  }
}
