import React from "react";
import "./RangeInput.css";

export default function RangeInput(props) {
  return (
    <div className="RangeInput">
      <fieldset
        className={
          props.active ? "RangeInput RangeInput--active" : "RangeInput"
        }
      >
        <legend>Hand {props.handId}</legend>
        <input
          value={props.hand.range}
          onFocus={props.onActive}
          onChange={props.onRangeUpdate}
          className={props.hand.valid ? "" : "err"}
        />
        <br />
        {props.hand.equity}
      </fieldset>
    </div>
  );
}
