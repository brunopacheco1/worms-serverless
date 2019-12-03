"use strict";

const admin = require("firebase-admin");
const MatchStatus = require("../model/match-status.enum");
const Difficulty = require("../model/difficulty.enum");
const evaluatorFactory = require("./match.evaluator-factory");
const { PubSub } = require("@google-cloud/pubsub");

module.exports = async message => {
  try {
    let start = new Date();
    const collection = admin.firestore().collection("match");
    const matchConfig = message.json;
    const matchRef = await collection.doc(matchConfig.id).get();
    const match = matchRef.data();

    const currentMap = {
      players: match.players.map(p => {
        return { id: p.id, direction: p.direction };
      })
    };
    const evaluator = evaluatorFactory(match);

    evaluator(match, match.lastMap, currentMap);
    match.lastMap = currentMap;
    match.players = currentMap.players.map(p => {
      return { id: p.id, status: p.status, direction: p.direction };
    });

    if (currentMap.status === MatchStatus.FINISHED) {
      match.status = currentMap.status;
    }

    await collection.doc(match.id).set(match);

    if (match.status === MatchStatus.RUNNING) {
      let end = new Date() - start;
      await sleep(Difficulty.getTickRate(match.difficulty) - end);
      const pubsub = new PubSub();
      const dataBuffer = Buffer.from(JSON.stringify({ id: match.id }));

      await pubsub.topic("match-evaluation").publish(dataBuffer);
    }
  } catch (e) {
    console.error("PubSub message was not JSON", e);
  }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
