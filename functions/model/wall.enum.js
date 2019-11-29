module.exports = {
  SOLID: "SOLID",
  MIRROR: "MIRROR",

  getEvaluator: playMode => {
    switch (playMode) {
      case this.SOLID:
        return "SolidWallEvaluator()";
      case this.MIRROR:
        return "MirrorWallEvaluator()";
    }
  }
};
