"use strict";

const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    const stillPlaying = currentMap.players.filter(p => {
      p.status === PlayerStatus.PLAYING;
    });

    const food = currentMap.foodPosition;

    const playersLastPointIsEqualFoodPoint =
      stillPlaying
        .map(p => p.position[p.position.length - 1])
        .filter(lastPoint => lastPoint.x === food.x && lastPoint.y === food.y)
        .length > 0;

    if (playersLastPointIsEqualFoodPoint) {
      currentMap.foodPosition = getFoodPosition(runningMatch, stillPlaying);
    }

    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};

const getFoodPosition = (match, players) => {
  const allOccupiedPoints = players
    .map(p => p.position)
    .reduce((x, y) => x.concat(y), []);

  let newFood = null;
  let notFound = true;
  while (notFound) {
    newFood = {
      x: Math.floor(Math.random() * match.mapSize),
      y: Math.floor(Math.random() * match.mapSize)
    };

    if (
      allOccupiedPoints.filter(
        point => point.x === newFood.x && point.y === newFood.y
      ).length === 0
    ) {
      notFound = false;
    }
  }

  return newFood;
};
