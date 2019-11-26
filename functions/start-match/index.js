"use strict";

const admin = require("firebase-admin");

module.exports = async (request, response) => {
  const match = request.body;
  await admin
    .database()
    .ref("/match")
    .push(match);
  return response.sendStatus(201);
};
