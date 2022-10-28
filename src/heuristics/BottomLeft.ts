import type { Rect } from "../Box";
import Score from "../Score";
import Base from "./Base";

export default class BottomLeft extends Base {
  calculateScore(freeRect: Rect, rectWidth: number, rectHeight: number) {
    let topSideY = freeRect.y + rectHeight;
    return new Score(topSideY, freeRect.x);
  }
}
