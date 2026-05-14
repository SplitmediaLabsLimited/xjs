import assert from 'node:assert/strict';

const { Color, Rectangle } = await import(new URL('../../dist/xjs.mjs', import.meta.url));

const color = Color.fromRGBString('#112233');
assert.equal(color.getRgb(), '112233');
assert.equal(color.getBgr(), '332211');
assert.equal(color.getIrgb(), 0x112233);
assert.equal(color.getIbgr(), 0x332211);
assert.equal(color.isTransparent(), false);

assert.deepEqual(Color.fromBGRString(color.getBgr()), color);
assert.deepEqual(Color.fromRGBInt(color.getIrgb()), color);
assert.deepEqual(Color.fromBGRInt(color.getIbgr()), color);

const transparent = Color.fromTransparent();
assert.equal(transparent.getRgb(), '0');
assert.equal(transparent.getBgr(), '0');
assert.equal(transparent.getIrgb(), 0);
assert.equal(transparent.getIbgr(), 0);
assert.equal(transparent.isTransparent(), true);
assert.throws(() => new Color({}), /Do not call Color constructor without parameters/);

const dimensions = Rectangle.fromDimensions(640, 480);
assert.equal(dimensions.getWidth(), 640);
assert.equal(dimensions.getHeight(), 480);
assert.equal(dimensions.toDimensionString(), '640,480');
assert.equal(dimensions.toString(), '640,480');
assert.throws(() => Rectangle.fromDimensions(-1, 480), /dimensions cannot be negative/);
assert.throws(() => dimensions.toCoordinateString(), /does not have coordinates/);

const coordinates = Rectangle.fromCoordinates(10, 20, 110, 220);
assert.equal(coordinates.getLeft(), 10);
assert.equal(coordinates.getTop(), 20);
assert.equal(coordinates.getRight(), 110);
assert.equal(coordinates.getBottom(), 220);
assert.equal(coordinates.getWidth(), 100);
assert.equal(coordinates.getHeight(), 200);
assert.equal(coordinates.toCoordinateString(), '10,20,110,220');
assert.equal(
  coordinates.toString('Left=:left Top=:top Right=:right Bottom=:bottom Width=:width Height=:height'),
  'Left=10 Top=20 Right=110 Bottom=220 Width=100 Height=200'
);

coordinates.setLeft(30);
assert.equal(coordinates.getLeft(), 30);
assert.equal(coordinates.getWidth(), 80);
coordinates.setRight(130);
assert.equal(coordinates.getRight(), 130);
assert.equal(coordinates.getWidth(), 100);
coordinates.setTop(50);
assert.equal(coordinates.getTop(), 50);
assert.equal(coordinates.getHeight(), 170);
coordinates.setBottom(250);
assert.equal(coordinates.getBottom(), 250);
assert.equal(coordinates.getHeight(), 200);

assert.throws(() => Rectangle.fromCoordinates(110, 20, 10, 220), /Right coordinate/);
assert.throws(() => Rectangle.fromCoordinates(10, 220, 110, 20), /Top coordinate/);
