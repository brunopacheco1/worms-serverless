module.exports = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",

  getTickRate: difficulty => {
    switch (difficulty) {
      case this.EASY:
        return 1000;
      case this.MEDIUM:
        return 500;
      case this.HARD:
        return 250;
    }
  }
};
