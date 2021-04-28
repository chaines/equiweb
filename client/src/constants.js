export const RANKS = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];
export const MODIFIERS = ["-", "+", "s", "o"];
export const VALS = Array(13 * 13);
for (let row = 0; row < 13; row++) {
  for (let col = 0; col < 13; col++) {
    if (row > col) {
      VALS[row * 13 + col] = RANKS[col] + RANKS[row] + "o";
    } else if (row < col) {
      VALS[row * 13 + col] = RANKS[row] + RANKS[col] + "s";
    } else {
      VALS[row * 13 + col] = RANKS[row] + RANKS[col];
    }
  }
}
