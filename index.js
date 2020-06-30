import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import pino from "express-pino-logger";

const app = express();
mongoose.connect(
  process.env.MONGODB_URI || `mongodb://localhost:27017/equiweb`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", (e) => console.log(e));
db.once("open", () => {
  console.log("We did it boys");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
