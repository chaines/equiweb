import { combineReducers } from "redux";
import gridReducer from "./grid";
import handsReducer from "./hands";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  grid: gridReducer,
  hands: handsReducer,
});
export const store = configureStore({
  reducer: rootReducer,
});

export default rootReducer;
