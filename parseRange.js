const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const VALS = Array(13 * 13);
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

printGrid(VALS);

/**
 * Processes a comma seperated list of hand ranges into the grid. Attempts to coerce poorly
 * formated hands into proper syntax where it makes sense to do so.
 * Valid formats: XX, XY, XX+, XYs, XYo, XY+, XYs+ XYo+, XX-YY, XY-XZ, XYo-XZo, and XYs-XZs
 *   Where X, Y, and Z are all valid card ranks and X > Y > Z
 *   s denotes suited combinations, o denotes offsuit combinations,
 *   - XY-XZ denotes all combinations of XK where K is [Z,Y]
 *
 * @param {string} range
 */
function parseRange(range) {
  range = range || "";

  const grid = Array(13 * 13).fill(0);
  const MODIFIERS = ["-", "+", "s", "o"];
  const newRange = range.split(",").map((x) => x.replace(/\s+/g, ""));
  console.log(newRange);
  const finalRange = [];
  const badFormat = {};
  for (let hand of newRange) {
    if (hand.length === 2) {
      // Valid formats: XX, XY
      // YX will also be processed
      let card1 = hand[0];
      let card2 = hand[1];
      let c1 = RANKS.indexOf(card1);
      let c2 = RANKS.indexOf(card2);
      if (c1 > c2) {
        let tmp = c2;
        c2 = c1;
        c1 = tmp;
        tmp = card2;
        card2 = card1;
        card1 = tmp;
        badFormat[hand] = card1 + card2;
      }
      if (c1 === -1 || c2 === -1) {
        badFormat[hand] = false;
      } else {
        // XX, XY
        grid[c1 * 13 + c2] = 1;
        grid[c2 * 13 + c1] = 1;
        finalRange.push(card1 + card2);
        continue;
      }
    }
    if (hand.length === 3) {
      // Valid formats: XX+, XY+, XYs, XYo
      // XXs, XXo, YXs, and YXo are also processed
      let card1 = hand[0];
      let card2 = hand[1];
      const mod = hand[2];
      const m = MODIFIERS.indexOf(mod);
      let c1 = RANKS.indexOf(card1);
      let c2 = RANKS.indexOf(card2);

      if (c1 > c2) {
        if (m === 1) {
          badFormat[hand] = false;
          continue;
        } else {
          let tmp = c2;
          c2 = c1;
          c1 = tmp;
          tmp = card2;
          card2 = card1;
          card1 = tmp;
          badFormat[hand] = card1 + card2 + mod;
        }
      }

      if (c1 === -1 || c1 === -1 || m < 1) {
        badFormat[hand] = false;
        continue;
      }

      if (m === 1 && c1 === c2) {
        // XX+
        for (let k = 0; k <= c1; k++) {
          grid[k * 14] = 1;
        }
        finalRange.push(hand);
      } else if (card1 === card2) {
        // XXs or XXo
        // Processed as XX
        grid[c1 * 14] = 1;
        badFormat[hand] = card1 + card2;
        finalRange.push(card1 + card2);
      } else if (m === 1 && card1 !== card2) {
        // XY+
        for (let i = c2; i > c1; i--) {
          grid[i * 13 + c1] = 1;
          grid[c1 * 13 + i] = 1;
        }
        finalRange.push(card1 + card2 + mod);
      } else if (m === 2) {
        // XYs
        grid[c1 * 13 + c2] = 1;
        finalRange.push(hand);
      } else if (m === 3) {
        // XYo
        grid[c2 * 13 + c1] = 1;
        finalRange.push(hand);
      } else {
        badFormat[hand] = false;
      }
    } else if (hand.length === 4) {
      // Valid formats: XYs+, XYo+
      // also processes XXs+ XXo+
      const card1 = hand[0];
      const card2 = hand[1];
      const mod1 = hand[2];
      const mod2 = hand[3];
      const c1 = RANKS.indexOf(card1);
      const c2 = RANKS.indexOf(card2);
      const m1 = MODIFIERS.indexOf(mod1);
      const m2 = MODIFIERS.indexOf(mod2);
      if (
        c1 > c2 ||
        c1 === -1 ||
        c2 === -1 ||
        m1 === -1 ||
        m1 < 1 ||
        m2 !== 1
      ) {
        badFormat[hand] = false;
        continue;
      }
      if (c1 === c2) {
        //XXs+ or XXo+
        // Processed as XX+
        badFormat[hand] = card1 + card2 + mod2;
        newRange.push(card1 + card2 + mod2);
      } else if (m1 === 2) {
        //XYs+
        for (let i = c2; i > c1; i--) {
          grid[c1 * 13 + i] = 1;
        }
        finalRange.push(hand);
      } else if (m1 === 3) {
        for (let i = c2; i > c1; i--) {
          grid[i * 13 + c1] = 1;
        }
        finalRange.push(hand);
      } else {
        badFormat[hand] = false;
      }
    } else if (hand.length === 5) {
      // Valid Formats: XX-YY, XY-XZ
      let hand1card1 = hand[0];
      let hand1card2 = hand[1];
      let hand2card1 = hand[3];
      let hand2card2 = hand[4];
      const mod = hand[2];
      let h1c1 = RANKS.indexOf(hand1card1);
      let h1c2 = RANKS.indexOf(hand1card2);
      let h2c1 = RANKS.indexOf(hand2card1);
      let h2c2 = RANKS.indexOf(hand2card2);
      const m = MODIFIERS.indexOf(mod);
      if (h1c1 === -1 || h1c2 === -1 || h2c1 === -1 || h2c2 === -1 || m !== 0) {
        badFormat[hand] = false;
        continue;
      }
      if (h1c1 !== h1c2 && h1c1 !== h2c1) {
        badFormat[hand] = false;
        continue;
      }
      if (
        (h1c1 === h1c2 && h2c1 !== h2c2) ||
        (h2c1 === h2c2 && h1c1 !== h1c2)
      ) {
        badFormat[hand] = false;
        continue;
      }
      if (h1c1 === h2c1 && h1c2 > h2c2) {
        //Format is XZ-XY, swap hands
        let tmp = h1c2;
        h1c2 = h2c2;
        h2c2 = tmp;
        tmp = hand1card2;
        hand1card2 = hand2card2;
        hand2card2 = tmp;
        hand = badFormat[hand] =
          hand1card1 + hand1card2 + mod + hand2card1 + hand2card2;
      }
      if (h1c1 === h1c2 && h1c1 > h2c1) {
        //Format is YY-XX, swap hands.
        let tmp = h1c1;
        h1c1 = h1c2 = h2c1;
        h2c1 = h2c2 = tmp;
        tmp = hand1card1;
        hand1card1 = hand1card2 = hand2card1;
        hand2card1 = hand2card2 = tmp;
        hand = badFormat[hand] =
          hand1card1 + hand1card2 + mod + hand2card1 + hand2card2;
      }
      if (h1c1 === h1c2) {
        // XX-YY
        for (let i = h2c1; i >= h1c1; i--) {
          grid[i * 14] = 1;
        }
        finalRange.push(hand);
      } else if (h1c1 === h2c1) {
        // XY-XZ
        for (let i = h2c2; i >= h1c2; i--) {
          grid[h1c1 * 13 + i] = 1;
          grid[i * 13 + h1c1] = 1;
        }
        finalRange.push(hand);
      }
    } else if (hand.length === 7) {
      //Valid formats: XYs-XZs, XYo-XZo
      let hand1card1 = hand[0];
      let hand1card2 = hand[1];
      let hand2card1 = hand[4];
      let hand2card2 = hand[5];
      const modh1 = hand[2];
      const mod = hand[3];
      const modh2 = hand[6];
      let h1c1 = RANKS.indexOf(hand1card1);
      let h1c2 = RANKS.indexOf(hand1card2);
      let h2c1 = RANKS.indexOf(hand2card1);
      let h2c2 = RANKS.indexOf(hand2card2);
      const m = MODIFIERS.indexOf(mod);
      const mh1 = MODIFIERS.indexOf(modh1);
      const mh2 = MODIFIERS.indexOf(modh2);

      if (
        mh1 !== mh2 ||
        h1c1 === -1 ||
        h1c2 === -1 ||
        h2c1 === -1 ||
        h2c2 === -1 ||
        m !== 0 ||
        mh1 < 2 ||
        h1c1 !== h2c1 ||
        h1c2 === h2c2
      ) {
        badFormat[hand] = false;
        continue;
      }

      if (h1c1 === h2c1 && h1c2 > h2c2) {
        //Format is XZ-XY, swap hands
        let tmp = h1c2;
        h1c2 = h2c2;
        h2c2 = tmp;
        tmp = hand1card2;
        hand1card2 = hand2card2;
        hand2card2 = tmp;
        hand = badFormat[hand] =
          hand1card1 +
          hand1card2 +
          modh1 +
          mod +
          hand2card1 +
          hand2card2 +
          modh2;
      }
      for (let i = h2c2; i >= h1c2; i--) {
        if (modh1 === "o") grid[i * 13 + h1c1] = 1;
        if (modh1 === "s") grid[h1c1 * 13 + i] = 1;
      }
      finalRange.push(hand);
    }
  }

  return {
    grid: grid,
    range: finalRange.join(", "),
    badFormat: badFormat,
  };
}

const results = parseRange("");
printGrid(results.grid);
console.log(results.range);
console.log(results.badFormat);

function printGrid(grid) {
  for (let i = 0; i < 13; i++) {
    const rowStart = i * 13;
    console.log(grid.slice(rowStart, rowStart + 13).join(", "));
  }
}
