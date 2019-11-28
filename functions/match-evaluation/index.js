const evaluator = require("./match.evaluator");

module.exports = message => {
  try {
    const match = message.json;
    const currentMap = {
      players: match.players.map(player => {
        return { ...player };
      })
    };
    evaluator(match, match.lastMap, currentMap);
    console.log(JSON.stringify(match));
  } catch (e) {
    console.error("PubSub message was not JSON", e);
  }
};
