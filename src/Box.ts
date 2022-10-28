export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export default class Box implements Rect {
  constrainRotation = false;
  packed = false;
  x = 0;
  y = 0;
  width: number;
  height: number;

  constructor(width: number, height: number, constrainRotation = false) {
    // Avoid the packer to try the rotated dimensions
    this.constrainRotation = constrainRotation;
    this.width = width;
    this.height = height;
  }
  get area() {
    return this.width * this.height;
  }

  get label() {
    return `${this.width}x${this.height} at [${this.x},${this.y}]`;
  }
}
