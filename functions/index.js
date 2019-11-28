"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const match = require("./match");
const matchEvaluator = require("./match-evaluator");

admin.initializeApp(functions.config().firebase);

exports.match = functions.https.onRequest(match);

exports.matchEvaluator = functions.pubsub
  .topic("match-evaluator")
  .onPublish(matchEvaluator);
