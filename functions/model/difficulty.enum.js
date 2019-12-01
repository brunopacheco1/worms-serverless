module.exports = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",

  getTickRate: difficulty => {
    switch (difficulty) {
      case this.MEDIUM:
        return 500;
      case this.HARD:
        return 250;
      case this.EASY:
      default:
        return 1000;
    }
  }
};
