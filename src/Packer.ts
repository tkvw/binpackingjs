import type Bin from "./Bin";
import type Box from "./Box";
import Score from "./Score";
import ScoreBoard from "./ScoreBoard";

export default class Packer {
  pack(
    bins: Bin[] = [],
    boxes: Box[],
    { limit = Score.MAX_INT }: { limit?: number } = {}
  ) {
    let packedBoxes: Box[] = [];

    boxes = boxes.filter((box) => !box.packed);

    const boxesPossibleToFit = boxes.filter((box) =>
      bins.some((bin) => bin.isLargerThan(box))
    );

    let solutionBins = [...bins];

    let board = new ScoreBoard(bins, boxesPossibleToFit);
    while (board.entries.length) {
      const bestFit = board.bestFit();
      if (!bestFit) {
        const instock_bins = bins.filter((bin) => bin.isInStock);
        if (!instock_bins.length) break;

        const largestNotFitingBox = board.largestNotFitingBox();
        if (!largestNotFitingBox) break;

        const greedy_bin_candidates = instock_bins.filter((bin) =>
          bin.isLargerThan(largestNotFitingBox.box)
        );

        const greedy_bin = greedy_bin_candidates.reduce((a, b) => {
          if (a.greedyPriority < b.greedyPriority) return b;
          if (b.greedyPriority < a.greedyPriority) return a;
          return a.area <= b.area ? a : b;
        });
        const next_bin = greedy_bin.next();

        solutionBins.push(next_bin);
        board.addBin(next_bin);
      } else {
        bestFit.bin.insert(bestFit.box);
        board.removeBox(bestFit.box);
        board.recalculateBin(bestFit.bin);
        packedBoxes.push(bestFit.box);
        if (packedBoxes.length >= limit) {
          break;
        }
      }
    }
    return {
      bins: solutionBins,
      packedBoxes,
      unpackedBoxes: boxes.filter((box) => {
        return !box.packed;
      }),
    };
  }
}
