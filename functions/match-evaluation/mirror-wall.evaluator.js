"use strict";

const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    currentMap.players
      .filter(p => p.status === PlayerStatus.PLAYING)
      .forEach(player => {
        const lastPoint = player.position[player.position.length - 1];

        if (lastPoint.x < 0) {
          player.position = [
            ...player.position.slice(0, player.position.length - 1),
            { x: match.mapSize - 1, y: lastPoint.y }
          ];
        }

        if (lastPoint.x >= match.mapSize) {
          player.position = [
            ...player.position.slice(0, player.position.length - 1),
            { x: 0, y: lastPoint.y }
          ];
        }

        if (lastPoint.y < 0) {
          player.position = [
            ...player.position.slice(0, player.position.length - 1),
            { x: lastPoint.x, y: match.mapSize - 1 }
          ];
        }

        if (lastPoint.y >= match.mapSize) {
          player.position = [
            ...player.position.slice(0, player.position.length - 1),
            { x: lastPoint.x, y: 0 }
          ];
        }
      });

    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};
