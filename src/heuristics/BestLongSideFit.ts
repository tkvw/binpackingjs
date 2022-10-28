import { Rect } from "../Box";
import Score from "../Score";
import Base from "./Base";

export default class BestLongSideFit extends Base {
  calculateScore(freeRect: Rect, rectWidth: number, rectHeight: number) {
    let leftOverHoriz = Math.abs(freeRect.width - rectWidth);
    let leftOverVert = Math.abs(freeRect.height - rectHeight);
    let args = [leftOverHoriz, leftOverVert].sort((a, b) => a - b).reverse();
    return new Score(args[0], args[1]);
  }
}
