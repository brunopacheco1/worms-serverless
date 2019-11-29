module.exports = {
  SOLID: "SOLID",
  GHOST: "GHOST",
  FINISHED: "FINISHED",

  getEvaluator: opponentBody => {
    switch (opponentBody) {
      case this.SOLID:
        return "SolidOpponentEvaluator()";
      case this.GHOST:
        return "GhostOpponentEvaluator()";
    }
  }
};
