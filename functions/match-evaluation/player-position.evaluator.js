"use strict";

const Direction = require("../model/direction.enum");
const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    if (lastMap != null) {
      currentMap.players
        .filter(p => p.status == PlayerStatus.PLAYING)
        .forEach(currentState => {
          const lastState = lastMap.players.find(p => p.id === currentState.id);

          const newPoint = getNewLastPoint(
            lastState.position[lastState.position.length - 1],
            currentState.direction
          );

          let startIndex = 1;
          if (newPoint == currentMap.foodPosition) {
            startIndex = 0;
          }

          currentState.position = [
            ...lastState.position.slice(startIndex, lastState.position.size),
            newPoint
          ];

          currentState.wormLength = currentState.position.length;
        });
    }
    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};

const getNewLastPoint = (lastPoint, direction) => {
  switch (direction) {
    case Direction.UP:
      return { x: lastPoint.x, y: lastPoint.y + 1 };
    case Direction.RIGHT:
      return { x: lastPoint.x + 1, y: lastPoint.y };
    case Direction.DOWN:
      return { x: lastPoint.x, y: lastPoint.y - 1 };
    case Direction.LEFT:
      return { x: lastPoint.x - 1, y: lastPoint.y };
  }
};
