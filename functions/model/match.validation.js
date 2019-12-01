"use strict";

module.exports = {
  "data.playerId": {
    errorMessage: "Player id is a string value and it is mandatory.",
    isString: true,
    isLength: {
      options: { min: 3 }
    }
  },
  "data.numberOfPlayers": {
    errorMessage: "Number of players is a int value and it is mandatory.",
    isInt: true,
    toInt: true
  }
};
