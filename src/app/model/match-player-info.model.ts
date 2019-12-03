import { MatchPlayerStatus } from "./match-player-status.enum";
import { Direction } from "./direction.enum";

export interface MatchPlayerInfo {
  id: string;
  nickname: String;
  status: MatchPlayerStatus;
  direction: Direction;
  wormLength: number;
}
