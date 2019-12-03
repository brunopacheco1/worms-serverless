"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const match = require("./match");
const matchEvaluation = require("./match-evaluation");

admin.initializeApp(functions.config().firebase);

exports.match = functions.region("europe-west1").https.onRequest(match);

exports.matchEvaluation = functions
  .region("europe-west1")
  .pubsub.topic("match-evaluation")
  .onPublish(matchEvaluation);
