import { createSlice } from "@reduxjs/toolkit";
import { RANKS, MODIFIERS } from "../constants";

const initialState = {
  size: 3,
  MAX_SIZE: 6,
  active: 0,
  hands: Array(3).map((x) => {
    return { valid: true, val: "" };
  }),
};
const handsSlice = createSlice({
  name: "hands",
  initialState,
  reducers: {
    updateActiveRange: (state, { payload }) => {
      const range = payload.range || "";
      const newRange = range.split(",").map((x) => x.replace(/\s+/g, ""));
      const finalRange = [];
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
          }
          if (c1 !== -1 && c2 !== -1) {
            // XX, XY
            finalRange.push(card1 + card2);
            continue;
          }
        } else if (hand.length === 3) {
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
              continue;
            } else {
              let tmp = c2;
              c2 = c1;
              c1 = tmp;
              tmp = card2;
              card2 = card1;
              card1 = tmp;
            }
          }

          if (c1 === -1 || c1 === -1 || m < 1) {
            continue;
          }

          if (m === 1 && c1 === c2) {
            // XX+
            finalRange.push(hand);
          } else if (card1 === card2) {
            // XXs or XXo
            // Processed as XX
            finalRange.push(card1 + card2);
          } else if (m === 1 && card1 !== card2) {
            // XY+
            finalRange.push(card1 + card2 + mod);
          } else if (m === 2) {
            // XYs
            finalRange.push(hand);
          } else if (m === 3) {
            // XYo
            finalRange.push(hand);
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
            continue;
          }
          if (c1 === c2) {
            //XXs+ or XXo+
            // Processed as XX+
            newRange.push(card1 + card2 + mod2);
          } else if (m1 === 2) {
            //XYs+
            finalRange.push(hand);
          } else if (m1 === 3) {
            //XYo+
            finalRange.push(hand);
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
          if (
            h1c1 === -1 ||
            h1c2 === -1 ||
            h2c1 === -1 ||
            h2c2 === -1 ||
            m !== 0
          ) {
            continue;
          }
          if (h1c1 !== h1c2 && h1c1 !== h2c1) {
            continue;
          }
          if (
            (h1c1 === h1c2 && h2c1 !== h2c2) ||
            (h2c1 === h2c2 && h1c1 !== h1c2)
          ) {
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
            hand = hand1card1 + hand1card2 + mod + hand2card1 + hand2card2;
          }
          if (h1c1 === h1c2 && h1c1 > h2c1) {
            //Format is YY-XX, swap hands.
            let tmp = h1c1;
            h1c1 = h1c2 = h2c1;
            h2c1 = h2c2 = tmp;
            tmp = hand1card1;
            hand1card1 = hand1card2 = hand2card1;
            hand2card1 = hand2card2 = tmp;
            hand = hand1card1 + hand1card2 + mod + hand2card1 + hand2card2;
          }
          if (h1c1 === h1c2) {
            // XX-YY
            finalRange.push(hand);
          } else if (h1c1 === h2c1) {
            // XY-XZ
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
            hand =
              hand1card1 +
              hand1card2 +
              modh1 +
              mod +
              hand2card1 +
              hand2card2 +
              modh2;
          }
          finalRange.push(hand);
        }
        state.hands[state.active] = finalRange.join(", ");
      }
    },
  },
});

export const updateActiveRange = handsSlice.actions.updateActiveRange;
export default handsSlice.reducer;
