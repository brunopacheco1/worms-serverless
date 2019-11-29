"use strict";

const Direction = require("../model/direction.enum");
const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    if (lastMap == null) {
      currentMap.foodPosition = [
        { x: Math.round(match.mapSize / 2), y: Math.round(match.mapSize / 2) }
      ];
      currentMap.roundCounter = 1;
      currentMap.players.forEach((player, index) => {
        player.direction = calculateInitialDirection(
          index,
          currentMap.players.length
        );

        player.position = calculateInitialPosition(
          player.direction,
          match.mapSize
        );
        player.wormLength = 2;
        player.status = PlayerStatus.PLAYING;
      });
    } else {
      currentMap.foodPosition = lastMap.foodPosition;
      currentMap.roundCounter = lastMap.roundCounter + 1;
      lastMap.players.forEach((player, index) => {
        const currentPlayer = currentMap.players[index];
        currentPlayer.status = player.status;
        currentPlayer.position = player.position;
        currentPlayer.wormLength = player.wormLength;
        currentPlayer.direction = player.direction;
      });
    }
    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};

const calculateInitialDirection = (index, size) => {
  return Object.keys(Direction)[index % size];
};

const calculateInitialPosition = (direction, size) => {
  switch (direction) {
    case Direction.UP:
      return [
        { x: 0, y: 0 },
        { x: 0, y: 1 }
      ];
    case Direction.RIGHT:
      return [
        { x: 0, y: size - 1 },
        { x: 1, y: size - 1 }
      ];
    case Direction.DOWN:
      return [
        { x: size - 1, y: size - 1 },
        { x: size - 1, y: size - 2 }
      ];
    case Direction.LEFT:
      return [
        { x: size - 1, y: 0 },
        { x: size - 2, y: 0 }
      ];
  }
};
