"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const startMatch = require("./start-match");

admin.initializeApp(functions.config().firebase);

exports.startMatch = functions.https.onRequest(startMatch);
