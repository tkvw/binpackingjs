// #       box_1 box_2 box_3 ...
// # bin_1  100   200    0
// # bin_2   0     5     0
// # bin_3   9    100    0
// # ...
import type Bin from "./Bin";
import type Box from "./Box";
import ScoreBoardEntry from "./ScoreBoardEntry";

export default class ScoreBoard {
  entries: ScoreBoardEntry[] = [];

  constructor(bins: Bin[], public boxes: Box[]) {
    bins.forEach((bin) => {
      this.addBinEntries(bin, boxes);
    });
  }

  addBinEntries(bin: Bin, boxes: Box[]) {
    for (const box of boxes) {
      this.entries.push(new ScoreBoardEntry(bin, box));
    }
  }

  any() {
    return this.boxes.some((box) => box);
  }

  largestNotFitingBox() {
    let unfit: ScoreBoardEntry | undefined;
    const fittingBoxes = this.entries
      .filter((entry) => entry.fit)
      .map((entry) => entry.box);

    for (const entry of this.entries) {
      if (!fittingBoxes.includes(entry.box)) {
        continue;
      }
      if (!unfit || unfit.box.area < entry.box.area) {
        unfit = entry;
      }
    }

    return unfit?.box ? unfit : false;
  }

  bestFit() {
    let best: ScoreBoardEntry | undefined;
    for (let i = 0; i < this.entries.length; i++) {
      let entry = this.entries[i];
      if (!entry.fit()) {
        continue;
      }
      if (!best || entry.score < best.score) {
        best = entry;
      }
    }
    return best;
  }

  removeBox(box: Box) {
    this.entries = this.entries.filter((entry) => {
      return entry.box !== box;
    });
  }

  addBin(bin: Bin) {
    this.addBinEntries(bin, this.currentBoxes());
  }

  recalculateBin(bin: Bin) {
    this.entries
      .filter((entry) => entry.bin === bin)
      .forEach((entry) => entry.calculate());
  }

  currentBoxes() {
    return [...new Set(this.entries.map((entry) => entry.box))];
  }
}
