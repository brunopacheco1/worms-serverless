"use strict";

const initializerEvaluator = require("./initializer.evaluator");
const directionEvaluator = require("./direction.evaluator");
const playerStatusEvaluator = require("./player-position.evaluator");

const evaluator = initializerEvaluator(
  directionEvaluator(playerStatusEvaluator())
);

module.exports = evaluator;
