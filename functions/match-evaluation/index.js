"use strict";

const admin = require("firebase-admin");
const MatchStatus = require("../model/match-status.enum");
const Difficulty = require("../model/difficulty.enum");
const evaluator = require("./match.evaluator");
const { PubSub } = require("@google-cloud/pubsub");

module.exports = async message => {
  try {
    const collection = admin.firestore().collection("match");
    const match = message.json;
    const currentMap = {
      players: match.players.map(player => {
        return { ...player };
      })
    };
    evaluator(match, match.lastMap, currentMap);
    match.lastMap = currentMap;
    const matchStr = JSON.stringify(match);
    console.log(matchStr);
    await collection.doc(match.id).set(match);

    if (match.status === MatchStatus.RUNNING) {
      await sleep(Difficulty.getTickRate(match.difficulty));
      const pubsub = new PubSub();
      const dataBuffer = Buffer.from(matchStr);
      await pubsub.topic("match-evaluation").publish(dataBuffer);
    }
  } catch (e) {
    console.error("PubSub message was not JSON", e);
  }
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
