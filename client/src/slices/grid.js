import { createSlice } from "@reduxjs/toolkit";
import { updateActiveRange } from "./hands";
import { RANKS, MODIFIERS } from "../constants";

export const initialState = {
  grid: Array(13 * 13).fill(false),
};

const setGridFromRange = (state, { payload }) => {
  const range = payload.range || "";
  const grid = Array(13 * 13).fill(false);
  const newRange = range.split(",").map((x) => x.replace(/\s+/g, ""));
  for (let hand of newRange) {
    if (hand.length === 2) {
      // Valid formats: XX, XY
      // YX will also be processed
      let card1 = hand[0];
      let card2 = hand[1];
      let c1 = RANKS.indexOf(card1);
      let c2 = RANKS.indexOf(card2);

      // XX, XY
      grid[c1 * 13 + c2] = true;
      grid[c2 * 13 + c1] = true;
    } else if (hand.length === 3) {
      // Valid formats: XX+, XY+, XYs, XYo
      // XXs, XXo, YXs, and YXo are also processed
      let card1 = hand[0];
      let card2 = hand[1];
      const mod = hand[2];
      const m = MODIFIERS.indexOf(mod);
      let c1 = RANKS.indexOf(card1);
      let c2 = RANKS.indexOf(card2);

      if (m === 1 && c1 === c2) {
        // XX+
        for (let k = 0; k <= c1; k++) {
          grid[k * 14] = true;
        }
      } else if (m === 1 && card1 !== card2) {
        // XY+
        for (let i = c2; i > c1; i--) {
          grid[i * 13 + c1] = true;
          grid[c1 * 13 + i] = true;
        }
      } else if (m === 2) {
        // XYs
        grid[c1 * 13 + c2] = true;
      } else if (m === 3) {
        // XYo
        grid[c2 * 13 + c1] = true;
      }
    } else if (hand.length === 4) {
      // Valid formats: XYs+, XYo+
      // also processes XXs+ XXo+
      const card1 = hand[0];
      const card2 = hand[1];
      const mod1 = hand[2];
      const c1 = RANKS.indexOf(card1);
      const c2 = RANKS.indexOf(card2);
      const m1 = MODIFIERS.indexOf(mod1);
      if (m1 === 2) {
        //XYs+
        for (let i = c2; i > c1; i--) {
          grid[c1 * 13 + i] = true;
        }
      } else if (m1 === 3) {
        //XYo+
        for (let i = c2; i > c1; i--) {
          grid[i * 13 + c1] = true;
        }
      }
    } else if (hand.length === 5) {
      // Valid Formats: XX-YY, XY-XZ
      let hand1card1 = hand[0];
      let hand1card2 = hand[1];
      let hand2card1 = hand[3];
      let hand2card2 = hand[4];
      let h1c1 = RANKS.indexOf(hand1card1);
      let h1c2 = RANKS.indexOf(hand1card2);
      let h2c1 = RANKS.indexOf(hand2card1);
      let h2c2 = RANKS.indexOf(hand2card2);
      if (h1c1 === h1c2) {
        // XX-YY
        for (let i = h2c1; i >= h1c1; i--) {
          grid[i * 14] = true;
        }
      } else if (h1c1 === h2c1) {
        // XY-XZ
        for (let i = h2c2; i >= h1c2; i--) {
          grid[h1c1 * 13 + i] = true;
          grid[i * 13 + h1c1] = true;
        }
      }
    } else if (hand.length === 7) {
      //Valid formats: XYs-XZs, XYo-XZo
      let hand1card1 = hand[0];
      let hand1card2 = hand[1];
      let hand2card2 = hand[5];
      const modh1 = hand[2];
      let h1c1 = RANKS.indexOf(hand1card1);
      let h1c2 = RANKS.indexOf(hand1card2);
      let h2c2 = RANKS.indexOf(hand2card2);

      for (let i = h2c2; i >= h1c2; i--) {
        if (modh1 === "o") grid[i * 13 + h1c1] = true;
        if (modh1 === "s") grid[h1c1 * 13 + i] = true;
      }
    }
  }

  state.grid = grid;
};

const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    buttonPressed: (state, { payload }) => {
      console.log(payload.i + ", " + payload.j);
      state.grid[payload.i * 13 + payload.j] = !state.grid[
        payload.i * 13 + payload.j
      ];
    },
    setFromRange: setGridFromRange,
  },
});

console.log("Grid reducer " + gridSlice.reducer);

export const buttonPressed = gridSlice.actions.buttonPressed;
export const gridSelector = (state) => state.grid;
export default gridSlice.reducer;
