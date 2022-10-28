import type { Rect } from "../Box";
import Score from "../Score";
import Base from "./Base";

export default class BestShortSideFit extends Base {
  calculateScore(freeRect: Rect, rectWidth: number, rectHeight: number) {
    let leftOverHoriz = Math.abs(freeRect.width - rectWidth);
    let leftOverVert = Math.abs(freeRect.height - rectHeight);
    let args = [leftOverHoriz, leftOverVert].sort((a, b) => a - b);
    let score = new Score(args[0], args[1]);
    return score;
  }
}
