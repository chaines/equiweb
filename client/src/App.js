import React from "react";

import { Navbar } from "./components/Navbar";
import EquityCalcPage from "./pages/EquityCalcPage";
import "./App.css";
import RangeInput from "./RangeInput.js";
import eqService from "./services/equityCalculatorService.js";
import { parseRange, getRangeFromGrid } from "./tools/rangeparser.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    const hands = [...Array(3)].map((x) => {
      return { valid: true, range: "" };
    });
    this.validateRange = this.validateRange.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.fetchEquities = this.fetchEquities.bind(this);
    this.state = {
      grid: Array(13 * 13).fill(0),
      hands: hands,
      activeHand: 0,
    };
  }

  async fetchEquities(e) {
    console.log("getting equities");
    const handRanges = [];
    const enumerate = true;
    this.state.hands[this.state.activeHand].range = getRangeFromGrid(
      this.state.grid
    );
    for (const hand of this.state.hands) {
      if (hand.range) handRanges.push(hand.range);
    }
    console.log(handRanges);
    const output = await eqService.getEquities({
      handRanges: handRanges,
      enumerate: enumerate,
    });
    console.log(output);
    const newHands = this.state.hands;
    for (let i = 0; i < newHands.length; i++) {
      newHands[i].equity =
        Math.round(
          output.results.equities[output.hands.indexOf(newHands[i].range)] *
            10000
        ) / 100;
    }
    this.setState({
      hands: newHands,
    });
  }

  updateGrid(i, j) {
    const newGrid = this.state.grid.slice().map((val, index) => {
      if (index === i * 13 + j) return val ^ 1;
      return val;
    });
    console.log(newGrid);
    const range = getRangeFromGrid(newGrid);

    this.setState({
      grid: newGrid,
      hands: this.state.hands.map((val, index) => {
        if (index === this.state.activeHand)
          return {
            valid: true,
            range: range,
          };
        return val;
      }),
    });
  }

  validateRange(e) {
    let range = e.target.value;
    const hand = this.state.activeHand;
    let valid = true;
    const newState = this.state;
    const lastChar = range[range.length - 1];
    if (["a", "k", "q", "j", "t"].indexOf(lastChar) !== -1)
      range = range.slice(0, -1) + lastChar.toUpperCase();
    if (range.toLowerCase() === "random") {
      newState.hands[hand] = {
        valid: true,
        range: "random",
      };
      newState.grid = Array(13 * 13).fill(1);
      this.setState(newState);
      return;
    }
    if (range.length < 2) {
      newState.hands[hand] = {
        valid: true,
        range: range,
      };
      this.setState(newState);
      return;
    }
    const parsed = parseRange(range);
    for (const [key, val] of Object.entries(parsed.badFormat)) {
      if (!val) valid = false;
    }
    if (valid) {
      newState.grid = parsed.grid;
    }
    newState.hands[hand] = {
      valid: valid,
      range: range,
    };
    this.setState(newState);
  }

  activate(handId) {
    const hands = this.state.hands;
    hands[this.state.activeHand].range = getRangeFromGrid(this.state.grid);
    this.setState({
      hands: hands,
      activeHand: handId,
      grid: parseRange(hands[handId].range).grid,
    });
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <EquityCalcPage />
        {this.state.hands.map((hand, i) => {
          return (
            <RangeInput
              active={this.state.activeHand === i}
              onActive={() => this.activate(i)}
              hand={hand}
              handId={i + 1}
              key={i}
              onRangeUpdate={this.validateRange}
            />
          );
        })}
        <input type="button" value="Calculate" onClick={this.fetchEquities} />
      </div>
    );
  }
}

export default App;
