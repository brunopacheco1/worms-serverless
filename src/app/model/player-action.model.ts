import { Direction } from "./direction.enum";

export interface PlayerAction {
  playerId: String;
  direction: Direction;
}
