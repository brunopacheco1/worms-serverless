import { MatchPlayerInfo } from "./match-player-info.model";
import { MatchStatus } from "./match-status.enum";
import { Wall } from "./wall.enum";
import { OpponentBody } from "./opponent-body.enum";
import { Difficulty } from "./difficulty.enum";
import { PlayMode } from "./play-mode.enum";
import { MatchMap } from "./ match-map.model";

export interface MatchInfo {
  id: string;
  status: MatchStatus;
  wall: Wall;
  opponentBody: OpponentBody;
  difficulty: Difficulty;
  playMode: PlayMode;
  numberOfPlayers: number;
  mapSize: number;
  players: MatchPlayerInfo[];
  lastMap: MatchMap;
}
