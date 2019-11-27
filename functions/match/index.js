"use strict";

const admin = require("firebase-admin");
const uuid = require("uuid/v1");
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
  const collection = admin.firestore().collection("match");

  const validation = validationResult(request);

  if (validation.errors.length > 0) {
    return response.send(validation.errors);
  }

  const newMatchConfig = request.body;

  const query = collection
    .where("numberOfPlayers", "==", newMatchConfig.numberOfPlayers)
    .where("status", "==", "WAITING_PLAYERS")
    .limit(1);

  const newMatch = {
    wall: "SOLID",
    opponentBody: "SOLID",
    difficulty: "HARD",
    playMode: "LONGEST_WORM",
    mapSize: 30,
    status: "WAITING_PLAYERS",
    players: []
  };

  return query
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        newMatch.id = uuid();
        return newMatch;
      } else {
        let match = newMatch;
        snapshot.forEach(doc => {
          match = doc.data();
        });
        return match;
      }
    })
    .then(match => {
      match.numberOfPlayers = newMatchConfig.numberOfPlayers;

      const newPlayers = new Set(match.players);
      newPlayers.add(newMatchConfig.playerId);
      match.players = Array.from(newPlayers);

      if (match.players.length === match.numberOfPlayers) {
        match.status = "RUNNING";
      }

      return collection
        .doc(match.id)
        .set(match)
        .then(response.send(match));
    });
});

module.exports = app;
