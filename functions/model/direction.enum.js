module.exports = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",

  isOpposite: otherDirection => {
    switch (otherDirection) {
      case this.LEFT:
        return otherDirection === this.RIGHT;
      case this.RIGHT:
        return otherDirection === this.LEFT;
      case this.UP:
        return otherDirection === this.DOWN;
      case this.DOWN:
        return otherDirection === this.UP;
    }
  }
};
