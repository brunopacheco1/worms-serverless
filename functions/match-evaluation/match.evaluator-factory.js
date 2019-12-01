"use strict";

const Wall = require("../model/wall.enum");
const PlayMode = require("../model/play-mode.enum");
const OpponentBody = require("../model/opponent-body.enum");

const initializerEvaluator = require("./initializer.evaluator");
const directionEvaluator = require("./direction.evaluator");
const playerPositionEvaluator = require("./player-position.evaluator");
const solidWallEvaluator = require("./solid-wall.evaluator");
const mirrorWallEvaluator = require("./mirror-wall.evaluator");
const survivalModeEvaluator = require("./survival-mode.evaluator");
const longestWormModeEvaluator = require("./longest-worm-mode.evaluator");
const ghostOpponentEvaluator = require("./ghost-opponent.evaluator");
const solidOpponentEvaluator = require("./solid-opponent.evaluator");
const newFoodLocationEvaluator = require("./new-food-location.evaluator");
const matchStatusEvaluator = require("./match-status.evaluator");

module.exports = match => {
  const playMode = playModeEvaluator(match.playMode);
  const newFoodLocation = newFoodLocationEvaluator(playMode);
  const matchStatus = matchStatusEvaluator(newFoodLocation);
  const opponentBody = opponentBodyEvaluator(match.opponentBody, matchStatus);
  const wall = wallEvaluator(match.wall, opponentBody);
  const playerPosition = playerPositionEvaluator(wall);
  const direction = directionEvaluator(playerPosition);
  return initializerEvaluator(direction);
};

const wallEvaluator = (wall, next) => {
  switch (wall) {
    case Wall.MIRROR:
      return mirrorWallEvaluator(next);
    case Wall.SOLID:
    default:
      return solidWallEvaluator(next);
  }
};

const playModeEvaluator = (playMode, next) => {
  switch (playMode) {
    case PlayMode.SURVIVAL:
      return survivalModeEvaluator(next);
    case PlayMode.LONGEST_WORM:
    default:
      return longestWormModeEvaluator(next);
  }
};

const opponentBodyEvaluator = (opponentBody, next) => {
  switch (opponentBody) {
    case OpponentBody.GHOST:
      return ghostOpponentEvaluator(next);
    case OpponentBody.SOLID:
    default:
      return solidOpponentEvaluator(next);
  }
};
