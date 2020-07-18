import express from "express";
import mongoose from "mongoose";
import redis from "redis";
import bodyParser from "body-parser";
import pino from "express-pino-logger";
import productRoutes from "./routes/productRoutes.js";
import evaluateRoutes from "./routes/evaluateRoutes.js";
import productModel from "./models/Product.js";
import evalSchema from "./models/Evals.js";
import util from "util";
import omp from "omp_wrap";

const app = express();

//Connect to mongoose
mongoose.connect(
  process.env.MONGODB_URI || `mongodb://localhost:27017/equiweb`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", (e) => console.log(e));
db.once("open", () => {
  console.log(`Connected to MongoDB at: ${process.env.MONGODB_URI}`);
});

//Connect to redis
const client = redis.createClient({
  host: process.env.REDIS_HOST || "http://localhost",
  port: process.env.REDIS_PORT || 6379,
  retry_strategy: () => 1000,
});

//mongoose -> redis magic
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  if (this.getQuery().hash) {
    const key = this.getQuery().hash;
    const cacheValue = await client.get(key);
    if (cacheValue) {
      const doc = JSON.parse(cacheValue);
      console.log("Returning data from redis");
      return Array.isArray(doc)
        ? doc.map((d) => new this.model(d))
        : new this.model(doc);
    }
    const dbValue = await exec.apply(this, arguments);
    if (dbValue) {
      console.log("got value from mongo");
      client.set(key, JSON.stringify(dbValue));
    }
    return dbValue;
  } else {
    return await exec.apply(this, arguments);
  }
};

//Setup models
mongoose.model("products", productModel);
mongoose.model("evals", evalSchema);

app.use(bodyParser.json());
app.use(pino());

//Setup routes
productRoutes(app);
evaluateRoutes(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
