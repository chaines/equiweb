import mongoose from "mongoose";
import evaluate from "../lib/evaluate.js";

export default function (app) {
  const Eval = mongoose.model("evals");
  app.post("/api/evaluate", async (req, res) => {
    const params = req.body;
    const hash = evaluate.hash(
      params.handRanges.join("") +
        params.boardCards +
        params.deadCards +
        params.enumerate
    );
    const revHash = evaluate.hash(
      params.handRanges.reverse().join("") +
        params.boardCards +
        params.deadCards +
        params.enumerate
    );

    let dbResults = await Eval.findOne({ hash: hash }).exec();
    if (!dbResults) {
      dbResults = await Eval.findOne({ hash: revHash }).exec();
      if (dbResults) {
        console.log("Found reversed hand: adding reverse entry in mongo");
        let record = await Eval.create({
          hash: hash,
          hands: req.body.handRanges.reverse(),
          boardCards: req.body.boardCards,
          deadCards: req.body.boardCards,
          results: {
            wins: dbResults.results.wins.reverse(),
            equities: dbResults.results.equities.reverse(),
            ties: dbResults.results.ties,
            exhaustive: dbResults.results.exhaustive,
            count: dbResults.results.count,
            time: dbResults.results.time,
          },
        });
      }
    }
    if (!dbResults) {
      let calcResults = await evaluate.evaluateNoCb(req.body);
      let record = await Eval.create({
        hash: hash,
        hands: req.body.handRanges,
        boardCards: req.body.boardCards,
        deadCards: req.body.deadCards,
        results: calcResults,
      });
      console.log(record);
      console.log(
        calcResults.count / calcResults.time / 1000000 + " M Hands/sec"
      );
      res.status(200).json(record);
    } else {
      res.status(200).json(dbResults);
    }
  });
}
