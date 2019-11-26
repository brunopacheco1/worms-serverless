"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const match = require("./match");

admin.initializeApp(functions.config().firebase);

exports.match = functions.https.onRequest(match);
