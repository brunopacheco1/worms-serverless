const Direction = require("../model/direction.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    if (lastMap == null) {
      currentMap.foodPosition = [
        Math.round(match.mapSize / 2),
        Math.round(match.mapSize / 2)
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
        [0, 0],
        [0, 1]
      ];
    case Direction.RIGHT:
      return [
        [0, size - 1],
        [1, size - 1]
      ];
    case Direction.DOWN:
      return [
        [size - 1, size - 1],
        [size - 1, size - 2]
      ];
    case Direction.LEFT:
      return [
        [size - 1, 0],
        [size - 2, 0]
      ];
  }
};
