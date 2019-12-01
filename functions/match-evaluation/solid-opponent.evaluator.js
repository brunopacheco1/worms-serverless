"use strict";

const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    const stillPlaying = currentMap.players.filter(
      p => p.status === PlayerStatus.PLAYING
    );

    stillPlaying.forEach(player => {
      const lastPoint = player.position[player.position.length - 1];

      const allOtherPoints = stillPlaying
        .map(p => {
          if (p.id === player.id) {
            return p.position.slice(0, p.position.length - 1);
          } else {
            return p.position;
          }
        })
        .reduce((x, y) => x.concat(y), []);

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
