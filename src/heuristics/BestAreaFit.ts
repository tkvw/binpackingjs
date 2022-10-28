import { Rect } from "../Box";
import Score from "../Score";
import Base from "./Base";

export default class BestAreaFit extends Base {
  calculateScore(freeRect: Rect, rectWidth: number, rectHeight: number) {
    let areaFit = freeRect.width * freeRect.height - rectWidth * rectHeight;
    let leftOverHoriz = Math.abs(freeRect.width - rectWidth);
    let leftOverVert = Math.abs(freeRect.height - rectHeight);
    let shortSideFit = Math.min(leftOverHoriz, leftOverVert);
    return new Score(areaFit, shortSideFit);
  }
}
