module.exports = {
  SURVIVAL: "SURVIVAL",
  LONGEST_WORM: "LONGEST_WORM",

  getEvaluator: playMode => {
    switch (playMode) {
      case this.SURVIVAL:
        return "SurvivalModeEvaluator()";
      case this.LONGEST_WORM:
        return "LongestWormModeEvaluator()";
    }
  }
};
