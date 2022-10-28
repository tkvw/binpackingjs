export default class Score {
  static MAX_INT = Number.MAX_SAFE_INTEGER;

  constructor(
    private score_1 = Score.MAX_INT,
    private score_2 = Score.MAX_INT
  ) {}

  /**
   * Lower is better
   */
  valueOf() {
    return this.score_1 + this.score_2;
  }

  assign(other: Score) {
    this.score_1 = other.score_1;
    this.score_2 = other.score_2;
  }

  isBlank() {
    return this.score_1 === Score.MAX_INT;
  }

  decreaseBy(delta: number) {
    this.score_1 += delta;
    this.score_2 += delta;
  }
}
