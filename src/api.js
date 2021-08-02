const express = require("express");
const serverless = require("serverless-http");
const Chess = require("chess.js");

const app = express();
app.use(express.json());

const router = express.Router();

formatFen = (fen) => {
  f1 = fen.slice(0,26);
  f2 = fen.slice(27,51);
  f3 = fen.slice(52);
  return [f1,f2,f3];
}

const validate = (prevFEN,move) => {
  let chess = new Chess(prevFEN);
  if (chess.move(move)) {
    if (chess.game_over()) {
      if (chess.in_checkmate()) return [1, true, "", "", "" ];
      return [2, true, "", "", ""];
    }
    const [f1,f2,f3] = formatFen(chess.fen());
    return [0, true, f1, f2, f3];
  }
  return [0, false, "", "", ""];
};

router.get('/', (req,res) => {

  const{fen,move} = req.query
  const [result,valid,f1,f2,f3] = validate(fen,move)
  res.json({
    "result" : result,
    "valid" : valid,
    "f1" : f1,
    "f2" : f2,
    "f3" : f3
  });
});

app.use('/.netlify/functions/api',router);

module.exports.handler = serverless(app);
