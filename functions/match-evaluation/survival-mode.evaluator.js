"use strict";

const MatchStatus = require("../model/match-status.enum");
const PlayerStatus = require("../model/player-status.enum");

module.exports = next => {
  return (match, lastMap, currentMap) => {
    if (lastMap && currentMap.status === MatchStatus.FINISHED) {
      const alivedPlayers = lastMap.players.filter(
        p => p.status === PlayerStatus.PLAYING
      );

      alivedPlayers.forEach(lastState => {
        const currentState = lastMap.players.find(p => p.id === lastState.id);
        currentState.status = PlayerStatus.WINNER;
      });
    }

    if (next) {
      next(match, lastMap, currentMap);
    }
  };
};
