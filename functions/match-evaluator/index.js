module.exports = message => {
  try {
    const match = message.json;
    console.log(match);
  } catch (e) {
    console.error("PubSub message was not JSON", e);
  }
};
