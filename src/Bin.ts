import Box, { Rect } from "./Box";
import type { Heuristic } from "./heuristics/Base";
import BestShortSideFit from "./heuristics/BestShortSideFit";

export default class Bin {
  width: number;
  height: number;
  boxes: Box[] = [];
  heuristic: Heuristic;
  freeRectangles: Rect[] = [];
  private used: number = 1;
  stock: number = 1;
  greedyPriority: number = 1;

  constructor(width: number, height: number, heuristic?: Heuristic) {
    this.width = width;
    this.height = height;
    this.freeRectangles = [{ width, height, x: 0, y: 0 }];
    this.heuristic = heuristic || new BestShortSideFit();
  }
  setStock(stock: number) {
    this.stock = stock;
    return this;
  }

  next() {
    this.used++;
    return new Bin(this.width, this.height, this.heuristic);
  }
  get isInStock(): boolean {
    return this.used < this.stock;
  }

  get area(): number {
    return this.width * this.height;
  }

  get efficiency() {
    let boxesArea = 0;
    this.boxes.forEach((box) => {
      boxesArea += box.area;
    });
    return (boxesArea * 100) / this.area;
  }

  get label() {
    return `${this.width}x${this.height} ${this.efficiency}%`;
  }

  insert(box: Box) {
    if (box.packed) return false;

    this.heuristic.findPositionForNewNode(box, this.freeRectangles);
    if (!box.packed) return false;

    let numRectanglesToProcess = this.freeRectangles.length;
    let i = 0;

    while (i < numRectanglesToProcess) {
      if (this.splitFreeNode(this.freeRectangles[i], box)) {
        this.freeRectangles.splice(i, 1);
        numRectanglesToProcess--;
      } else {
        i++;
      }
    }

    this.pruneFreeList();
    this.boxes.push(box);

    return true;
  }

  scoreFor(box: Box) {
    let copyBox = new Box(box.width, box.height, box.constrainRotation);
    let score = this.heuristic.findPositionForNewNode(
      copyBox,
      this.freeRectangles
    );
    return score;
  }

  isLargerThan(box: Box) {
    return (
      (this.width >= box.width && this.height >= box.height) ||
      (this.height >= box.width && this.width >= box.height)
    );
  }

  splitFreeNode(freeNode: Rect, usedNode: Box) {
    // Test with SAT if the rectangles even intersect.
    if (
      usedNode.x >= freeNode.x + freeNode.width ||
      usedNode.x + usedNode.width <= freeNode.x ||
      usedNode.y >= freeNode.y + freeNode.height ||
      usedNode.y + usedNode.height <= freeNode.y
    ) {
      return false;
    }

    this.trySplitFreeNodeVertically(freeNode, usedNode);
    this.trySplitFreeNodeHorizontally(freeNode, usedNode);

    return true;
  }

  trySplitFreeNodeVertically(freeNode: Rect, usedNode: Box) {
    if (
      usedNode.x < freeNode.x + freeNode.width &&
      usedNode.x + usedNode.width > freeNode.x
    ) {
      this.tryLeaveFreeSpaceAtTop(freeNode, usedNode);
      this.tryLeaveFreeSpaceAtBottom(freeNode, usedNode);
    }
  }

  tryLeaveFreeSpaceAtTop(freeNode: Rect, usedNode: Box) {
    if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height) {
      let newNode = { ...freeNode };
      newNode.height = usedNode.y - newNode.y;
      this.freeRectangles.push(newNode);
    }
  }

  tryLeaveFreeSpaceAtBottom(freeNode: Rect, usedNode: Box) {
    if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
      let newNode = { ...freeNode };
      newNode.y = usedNode.y + usedNode.height;
      newNode.height =
        freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
      this.freeRectangles.push(newNode);
    }
  }

  trySplitFreeNodeHorizontally(freeNode: Rect, usedNode: Box) {
    if (
      usedNode.y < freeNode.y + freeNode.height &&
      usedNode.y + usedNode.height > freeNode.y
    ) {
      this.tryLeaveFreeSpaceOnLeft(freeNode, usedNode);
      this.tryLeaveFreeSpaceOnRight(freeNode, usedNode);
    }
  }

  tryLeaveFreeSpaceOnLeft(freeNode: Rect, usedNode: Box) {
    if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
      let newNode = { ...freeNode };
      newNode.width = usedNode.x - newNode.x;
      this.freeRectangles.push(newNode);
    }
  }

  tryLeaveFreeSpaceOnRight(freeNode: Rect, usedNode: Box) {
    if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
      let newNode = { ...freeNode };
      newNode.x = usedNode.x + usedNode.width;
      newNode.width =
        freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
      this.freeRectangles.push(newNode);
    }
  }

  /**
   * Goes through the free rectangle list and removes any redundant entries.
   */
  pruneFreeList() {
    let i = 0;
    while (i < this.freeRectangles.length) {
      let j = i + 1;
      if (j === this.freeRectangles.length) {
        break;
      }
      while (j < this.freeRectangles.length) {
        if (
          this.isContainedIn(this.freeRectangles[i], this.freeRectangles[j])
        ) {
          this.freeRectangles.splice(i, 1);
          i--;
          break;
        }
        if (
          this.isContainedIn(this.freeRectangles[j], this.freeRectangles[i])
        ) {
          this.freeRectangles.splice(j, 1);
        } else {
          j++;
        }
      }
      i++;
    }
  }

  isContainedIn(rectA, rectB) {
    return (
      rectA &&
      rectB &&
      rectA.x >= rectB.x &&
      rectA.y >= rectB.y &&
      rectA.x + rectA.width <= rectB.x + rectB.width &&
      rectA.y + rectA.height <= rectB.y + rectB.height
    );
  }
}
