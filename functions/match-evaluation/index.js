"use strict";

const admin = require("firebase-admin");
const MatchStatus = require("../model/match-status.enum");
const Difficulty = require("../model/difficulty.enum");
const evaluatorFactory = require("./match.evaluator-factory");
const { PubSub } = require("@google-cloud/pubsub");

module.exports = async message => {
  try {
    const collection = admin.firestore().collection("match");
    const match = message.json;
    const currentMap = {
      players: match.players.map(p => {
        return { id: p.id };
      })
    };
    const evaluator = evaluatorFactory(match);

    evaluator(match, match.lastMap, currentMap);
    match.lastMap = currentMap;
    match.players = currentMap.players.map(p => {
      return { id: p.id, status: p.status };
    });

    if (currentMap.status === MatchStatus.FINISHED) {
      match.status = currentMap.status;
    }

    await collection.doc(match.id).set(match);

    console.log(JSON.stringify(match));

    if (match.status === MatchStatus.RUNNING) {
      await sleep(Difficulty.getTickRate(match.difficulty));
      const pubsub = new PubSub();
      const dataBuffer = Buffer.from(JSON.stringify(match));

      await pubsub.topic("match-evaluation").publish(dataBuffer);
    }
  } catch (e) {
    console.error("PubSub message was not JSON", e);
  }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
