"use strict";

const Wall = require("../model/wall.enum");

const initializerEvaluator = require("./initializer.evaluator");
const directionEvaluator = require("./direction.evaluator");
const playerPositionEvaluator = require("./player-position.evaluator");
const solidWallEvaluator = require("./solid-wall.evaluator");
const mirrorWallEvaluator = require("./mirror-wall.evaluator");

const wallEvaluator = (wall, next) => {
  switch (wall) {
    case Wall.SOLID:
      return solidWallEvaluator(next);
    case Wall.MIRROR:
      return mirrorWallEvaluator(next);
  }
};

module.exports = match => {
  const evaluator = initializerEvaluator(
    directionEvaluator(playerPositionEvaluator(wallEvaluator(match.wall)))
  );
  return evaluator;
};
