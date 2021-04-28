import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { VALS } from "../constants.js";
import { buttonPressed, gridSelector } from "../slices/grid";

import "../HandGrid.css";

const HandButton = (props) => {
  let classes = "Table__Button Button";
  classes += props.set ? " Table__Button--selected" : "";
  return (
    <button className={classes} onClick={props.onChange}>
      {props.value}
    </button>
  );
};

const Grid = () => {
  const dispatch = useDispatch();
  console.log(useSelector(gridSelector));
  const { grid } = useSelector(gridSelector);

  return (
    <div className="HandGrid">
      <table className="HandGrid__Table Table">
        <tbody>
          {[...Array(13)].map((row, i) => {
            return (
              <tr className="Table__Row" key={"row" + i}>
                {[...Array(13)].map((col, j) => {
                  return (
                    <td className="Table__col" key={i + "" + j}>
                      <HandButton
                        row={i}
                        set={grid[i * 13 + j]}
                        col={j}
                        onChange={() => {
                          dispatch(buttonPressed({ i: i, j: j }));
                        }}
                        value={VALS[i * 13 + j]}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
