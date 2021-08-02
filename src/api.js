const express = require("express");
const serverless = require("serverless-http");
const Chess = require("chess.js");

const app = express();
app.use(express.json());

const router = express.Router();

const validate = (prevFEN,move) => {
  let chess = new Chess(prevFEN);
  if (chess.move(move)) {
    if (chess.game_over()) {
      if (chess.in_checkmate()) return [1, true, ""];
      else if (chess.in_stalemate()) return [2, true, ""]; 
      else if (chess.insufficient_material()) return [3, true, ""];
    }
    return [0, true, chess.fen() ];
  }
  return [4, false, "",];
};

router.get('/', (req,res) => {

  const{fen,move} = req.query
  const [result,valid,finalFEN] = validate(fen,move)
  res.json({
    "result" : result,
    "valid" : valid,
    "fen" : finalFEN,
    
  });
});

app.use('/.netlify/functions/api',router);

module.exports.handler = serverless(app);
