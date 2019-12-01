"use strict";

const Direction = require("../model/direction.enum");
const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    currentMap.players
      .filter(p => p.status === PlayerStatus.PLAYING)
      .forEach(mapPlayer => {
        const matchPlayer = match.players.find(p => p.id === mapPlayer.id);
        const newDirection = getDirection(matchPlayer, mapPlayer);
        if (!Direction.areOpposite(newDirection, mapPlayer.direction)) {
          mapPlayer.direction = newDirection;
        }
      });

    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};

const getDirection = (matchPlayer, mapPlayer) => {
  return matchPlayer.currentDirection
    ? matchPlayer.currentDirection
    : mapPlayer.direction;
};
