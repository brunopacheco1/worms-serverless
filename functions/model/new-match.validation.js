"use strict";

module.exports = {
  playerId: {
    errorMessage: "Number of players is a string value and it is mandatory.",
    isString: true,
    isLength: {
      options: { min: 3 }
    }
  },
  numberOfPlayers: {
    errorMessage: "Number of players is a int value and it is mandatory.",
    isInt: true
  }
};
