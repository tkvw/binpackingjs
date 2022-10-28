import type Box from "../Box";
import type { Rect } from "../Box";
import Score from "../Score";

export interface Heuristic {
  findPositionForNewNode(box: Box, freeRects: Rect[]): Score;
  calculateScore(freeRect: Rect, rectWidth: number, rectHeight: number): Score;
}
export default abstract class Base implements Heuristic {
  findPositionForNewNode(box: Box, freeRects: Rect[]) {
    let bestScore = new Score();
    let width = box.width;
    let height = box.height;

    freeRects.forEach((freeRect) => {
      this.tryPlaceRectIn(freeRect, box, width, height, bestScore);
      if (!box.constrainRotation) {
        this.tryPlaceRectIn(freeRect, box, height, width, bestScore);
      }
    });

    return bestScore;
  }

  tryPlaceRectIn(
    freeRect: Rect,
    box: Box,
    rectWidth: number,
    rectHeight: number,
    bestScore
  ) {
    if (freeRect.width >= rectWidth && freeRect.height >= rectHeight) {
      let score = this.calculateScore(freeRect, rectWidth, rectHeight);
      if (score < bestScore) {
        box.x = freeRect.x;
        box.y = freeRect.y;
        box.width = rectWidth;
        box.height = rectHeight;
        box.packed = true;
        bestScore.assign(score);
      }
    }
  }

  abstract calculateScore(
    freeRect: Rect,
    rectWidth: number,
    rectHeight: number
  ): Score;
}
