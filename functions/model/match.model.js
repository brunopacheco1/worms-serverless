"use strict";

const Difficulty = require("./difficulty.enum");
const Wall = require("./wall.enum");
const OpponentBody = require("./opponent-body.enum");
const PlayMode = require("./play-mode.enum");
const MatchStatus = require("./match-status.enum");

module.exports = {
  wall: Wall.SOLID,
  opponentBody: OpponentBody.SOLID,
  difficulty: Difficulty.HARD,
  playMode: PlayMode.LONGEST_WORM,
  mapSize: 30,
  status: MatchStatus.WAITING_PLAYERS,
  players: [],
  lastMap: null
};
