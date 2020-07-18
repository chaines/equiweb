import mongoose from "mongoose";
const { Schema } = mongoose;

const evalSchema = new Schema({
  hash: Number,
  hands: [String],
  boardCards: String,
  deadCards: String,
  results: {
    wins: [Number],
    equities: [Number],
    ties: Number,
    exhaustive: Boolean,
    count: Number,
    time: Number,
  },
});

export default evalSchema;
