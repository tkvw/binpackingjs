import type Bin from "./Bin";
import type Box from "./Box";
import Score from "./Score";
import ScoreBoard from "./ScoreBoard";
import type ScoreBoardEntry from "./ScoreBoardEntry";

export default class Packer {
  bins: Bin[];
  unpackedBoxes: Box[] = [];

  constructor(bins: Bin[] = []) {
    this.bins = bins;
  }

  pack(boxes: Box[], { limit = Score.MAX_INT }: { limit?: number } = {}) {
    let packedBoxes: Box[] = [];
    let entry: ScoreBoardEntry | undefined;

    boxes = boxes.filter((box) => !box.packed);
    if (boxes.length === 0) return packedBoxes;

    let board = new ScoreBoard(this.bins, boxes);
    while ((entry = board.bestFit())) {
      if (!entry) continue;

      entry.bin.insert(entry.box);
      board.removeBox(entry.box);
      board.recalculateBin(entry.bin);
      packedBoxes.push(entry.box);
      if (packedBoxes.length >= limit) {
        break;
      }
    }

    this.unpackedBoxes = boxes.filter((box) => {
      return !box.packed;
    });

    return packedBoxes;
  }
}
