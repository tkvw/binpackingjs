import type Bin from "./Bin";
import type Box from "./Box";
import type Score from "./Score";

export default class ScoreBoardEntry {
  score: Score;

  constructor(public bin: Bin, public box: Box) {
    this.calculate();
  }

  calculate() {
    this.score = this.bin.scoreFor(this.box);
    return this.score;
  }

  fit() {
    return !this.score?.isBlank();
  }
}
