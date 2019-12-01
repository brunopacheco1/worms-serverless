"use strict";

const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    currentMap.players
      .filter(p => p.status === PlayerStatus.PLAYING)
      .forEach(player => {
        const lastPoint = player.position[player.position.length - 1];
        const allOtherPoints = player.position.slice(
          0,
          player.position.length - 1
        );

        if (findSamePointInArray(lastPoint, allOtherPoints)) {
          player.status = MatchPlayerStatus.DEAD;
        }
      });

    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};

const findSamePointInArray = (otherPoint, array) => {
  return (
    array.filter(point => point.x === otherPoint.x && point.y === otherPoint.y)
      .length > 0
  );
};
