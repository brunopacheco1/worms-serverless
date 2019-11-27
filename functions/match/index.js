"use strict";

const admin = require("firebase-admin");
const express = require("express");
const { checkSchema, validationResult } = require("express-validator");
const matchValidation = require("./match.validation");
const cors = require("cors");

const app = express();

var corsOption = {
  origin: true,
  methods: "POST",
  credentials: true
};

app.use(cors(corsOption));

app.use(express.json());

app.post("/", checkSchema(matchValidation), (request, response) => {
  const validation = validationResult(request);

  if (validation.errors.length > 0) {
    return response.send(validation.errors);
  }

  const newMatchConfig = request.body;

  const match = {
    wall: "SOLID",
    opponentBody: "SOLID",
    difficulty: "HARD",
    playMode: "LONGEST_WORM",
    numberOfPlayers: newMatchConfig.numberOfPlayers,
    mapSize: 30,
    status: "WAITING_PLAYERS",
    players: [newMatch.playerId]
  };

  return admin
    .firestore()
    .collection("match")
    .add(match)
    .then(doc =>
      response.send({
        ...match,
        id: doc.id
      })
    );
});

module.exports = app;
