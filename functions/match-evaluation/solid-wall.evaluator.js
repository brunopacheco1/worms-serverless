"use strict";

const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    currentMap.players
      .filter(p => p.status === PlayerStatus.PLAYING)
      .forEach(player => {
        const lastPoint = player.position[player.position.length - 1];

        const xIsOutOfMap = lastPoint.x < 0 || lastPoint.x >= match.mapSize;

        const yIsOutOfMap = lastPoint.y < 0 || lastPoint.y >= match.mapSize;

        if (xIsOutOfMap || yIsOutOfMap) {
          player.status = PlayerStatus.DEAD;
        }
      });

    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};
