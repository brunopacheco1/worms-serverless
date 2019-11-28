"use strict";

const admin = require("firebase-admin");
const uuid = require("uuid/v1");
const express = require("express");
const { checkSchema, validationResult } = require("express-validator");
const matchValidation = require("./match.validation");
const cors = require("cors");
const defaultMatch = require("./match.model");
const { PubSub } = require("@google-cloud/pubsub");

const app = express();

var corsOption = {
  origin: true,
  methods: "POST",
  credentials: true
};

app.use(cors(corsOption));

app.use(express.json());

app.post("/", checkSchema(matchValidation), async (request, response) => {
  const collection = admin.firestore().collection("match");

  const validation = validationResult(request);

  if (validation.errors.length > 0) {
    return response.send(validation.errors);
  }

  const newMatchConfig = request.body;

  const resultList = await collection
    .where("numberOfPlayers", "==", newMatchConfig.numberOfPlayers)
    .where("status", "==", "WAITING_PLAYERS")
    .limit(1)
    .get();

  let match = {
    ...defaultMatch,
    id: uuid(),
    numberOfPlayers: newMatchConfig.numberOfPlayers
  };

  if (!resultList.empty) {
    match = resultList.docs.pop().data();
  }

  const newPlayers = new Set(match.players);
  newPlayers.add(newMatchConfig.playerId);
  match.players = Array.from(newPlayers);

  if (match.players.length === match.numberOfPlayers) {
    match.status = "RUNNING";
  }

  await collection.doc(match.id).set(match);

  if (match.status === "RUNNING") {
    const pubsub = new PubSub();
    const dataBuffer = Buffer.from(JSON.stringify(match));
    await pubsub.topic("match-evaluator").publish(dataBuffer);
  }

  response.send(match);
});

module.exports = app;
