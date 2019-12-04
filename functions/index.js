"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const match = require("./match");
const matchEvaluation = require("./match-evaluation");

admin.initializeApp(functions.config().firebase);

exports.match = functions.https.onRequest(match);

exports.matchEvaluation = functions.pubsub
  .topic("match-evaluation")
  .onPublish(matchEvaluation);
