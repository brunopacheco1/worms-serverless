"use strict";

const admin = require("firebase-admin");
const express = require("express");
const { checkSchema, validationResult } = require("express-validator");
const newMatchValidation = require("../model/new-match.validation");
const cors = require("cors");

const app = express();

var corsOption = {
  origin: true,
  methods: "GET,PUT,POST,DELETE",
  credentials: true
};

app.use(cors(corsOption));

app.use(express.json());

app.post("/", checkSchema(newMatchValidation), (request, response) => {
  const validation = validationResult(request);

  if (validation.errors.length > 0) {
    return response.send(validation.errors);
  }

  const newMatch = request.body;

  const match = {
    wall: "SOLID",
    opponentBody: "SOLID",
    difficulty: "HARD",
    playMode: "LONGEST_WORM",
    numberOfPlayers: newMatch.numberOfPlayers,
    mapSize: "30",
    status: "WAITING_PLAYERS",
    players: [newMatch.playerId]
  };

  return admin
    .database()
    .ref("/match")
    .push(match)
    .then(() => response.sendStatus(201));
});

module.exports = app;
