"use strict";

const MatchStatus = require("../model/match-status.enum");
const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    if (currentMap.status === MatchStatus.FINISHED) {
      const player = maxByLength(currentMap.players);
      if (player) {
        player.status = PlayerStatus.WINNER;
      }
    }

    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};

const maxByLength = players => {
  let longestWorm = null;
  let maxValue = Number.MIN_VALUE;
  players.forEach(player => {
    if (maxValue < player.wormLength) {
      longestWorm = player;
      maxValue = player.wormLength;
    }
  });
  return longestWorm;
};
