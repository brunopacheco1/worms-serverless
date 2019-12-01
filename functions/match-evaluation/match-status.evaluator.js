"use strict";

const MatchStatus = require("../model/match-status.enum");
const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    if (
      currentMap.players.filter(p => p.status === PlayerStatus.PLAYING)
        .length === 0
    ) {
      currentMap.status = MatchStatus.FINISHED;
    }

    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};
