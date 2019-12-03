"use strict";

const MatchStatus = require("../model/match-status.enum");
const admin = require("firebase-admin");
const shortid = require("shortid");
const express = require("express");
const { checkSchema, validationResult } = require("express-validator");
const matchValidation = require("../model/match.validation");
const cors = require("cors");
const defaultMatch = require("../model/match.model");
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
  try {
    const collection = admin.firestore().collection("match");

    const validation = validationResult(request);

    if (validation.errors.length > 0) {
      return response.send(validation.errors);
    }

    const newMatchConfig = request.body.data;

    const resultList = await collection
      .where("numberOfPlayers", "==", newMatchConfig.numberOfPlayers)
      .where("status", "==", MatchStatus.WAITING_PLAYERS)
      .limit(1)
      .get();

    let match = null;
    if (!resultList.empty) {
      match = resultList.docs.pop().data();
    } else {
      match = Object.assign({}, defaultMatch);
      match.id = shortid.generate();
      match.numberOfPlayers = newMatchConfig.numberOfPlayers;
    }

    if (!match.players.filter(p => p.id === newMatchConfig.playerId).length) {
      match.players.push({ id: newMatchConfig.playerId });
    }

    if (match.players.length === match.numberOfPlayers) {
      match.status = MatchStatus.RUNNING;
    }

    await collection.doc(match.id).set(match);

    if (match.status === MatchStatus.RUNNING) {
      const pubsub = new PubSub();
      const dataBuffer = Buffer.from(JSON.stringify(match));
      await pubsub.topic("match-evaluation").publish(dataBuffer);
    }

    response.send({ data: match });
  } catch (e) {
    response.status(500).send({ message: "Unknown error" });
  }
});

module.exports = app;
