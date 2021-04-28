import React, { Component } from "react";
import "./HandGrid.css";
import { VALS } from "./constants.js";

const HandButton = (props) => {
  let classes = "Table__Button Button";
  classes += props.state ? " Table__Button--selected" : "";
  return (
    <button className={classes} onClick={props.onChange}>
      {props.value}
    </button>
  );
};

export default class HandGrid extends Component {
  renderTableRows() {
    return [...Array(13)].map((row, i) => {
      return (
        <tr className="Table__row" key={"row" + i}>
          {[...Array(13)].map((col, j) => {
            return (
              <td className="Table__col" key={i + "" + j}>
                <HandButton
                  row={i}
                  state={this.props.grid[i * 13 + j]}
                  col={j}
                  onChange={() => this.props.onUpdate(i, j)}
                  value={VALS[i * 13 + j]}
                />
              </td>
            );
          })}
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="HandGrid">
        <table className="HandGrid__Table Table">
          <tbody>{this.renderTableRows()}</tbody>
        </table>
      </div>
    );
  }
}
