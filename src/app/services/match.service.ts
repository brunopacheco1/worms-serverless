import { Injectable, NgZone } from "@angular/core";
import { AuthService } from "./auth.service";
import { HttpClient } from "@angular/common/http";
import { NewMatchPlayer } from "../model/new-match-player.model";
import { MatchInfo } from "../model/match-info.model";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { MatchMap } from "../model/ match-map.model";
import { Direction } from "../model/direction.enum";
import { PlayerAction } from "../model/player-action.model";
import { NewRandomMatchPlayer } from "../model/new-random-match-player.model";
import { AngularFireFunctions } from "@angular/fire/functions";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class MatchService {
  private static CURRENT_MATCH_FIELD = "CURRENT_MATCH";
  private readonly collectionName = "match";
  private collection: AngularFirestoreCollection<MatchInfo>;

  constructor(
    private functions: AngularFireFunctions,
    private router: Router,
    private authService: AuthService,
    private database: AngularFirestore
  ) {
    this.collection = this.database.collection<MatchInfo>(this.collectionName);
  }

  startRandomMatch(numberOfPlayers: number) {
    const player = this.authService.getUser();
    const playerMatch: NewRandomMatchPlayer = {
      playerId: player.uid,
      numberOfPlayers
    };

    const callable = this.functions.httpsCallable("match");
    callable(playerMatch).subscribe(matchInfo => {
      localStorage.setItem(
        MatchService.CURRENT_MATCH_FIELD,
        JSON.stringify(matchInfo)
      );
      this.router.navigate([`match/${matchInfo.id}`]);
    });
  }

  getMatchMapEvent(matchId: string): Observable<MatchInfo> {
    return this.collection.doc<MatchInfo>(matchId).valueChanges();
  }

  updatePlayerDirection(key: string, match: MatchInfo) {
    if (!match) {
      return;
    }

    let direction = null;
    switch (key) {
      case "ArrowUp":
        direction = Direction.UP;
        break;
      case "ArrowDown":
        direction = Direction.DOWN;
        break;
      case "ArrowLeft":
        direction = Direction.LEFT;
        break;
      case "ArrowRight":
        direction = Direction.RIGHT;
        break;
    }

    if (direction) {
      const player = this.authService.getUser();
      const matchPlayer = match.players.find(p => p.id === player.uid);
      if (matchPlayer) {
        matchPlayer.direction = direction;
        this.collection.doc(match.id).update({ players: match.players });
      }
    }
  }
}
