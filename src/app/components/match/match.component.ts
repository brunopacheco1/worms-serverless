import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener
} from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { MatchService } from "src/app/services/match.service";
import { Subscription } from "rxjs";
import { MatchInfo } from "src/app/model/match-info.model";
import { MatchMap } from "src/app/model/ match-map.model";
import { MatchMapPlayer } from "src/app/model/match-map-player.model";
import { MatchPlayerStatus } from "src/app/model/match-player-status.enum";
import { User } from "src/app/model/user.model";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-match",
  host: {
    "(document:keypress)": "keyEvent($event)"
  },
  templateUrl: "./match.component.html",
  styleUrls: ["./match.component.scss"]
})
export class MatchComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  mapSubscription: Subscription;

  match: MatchInfo;
  matchPlayer: MatchMapPlayer;
  loggedPlayer: User;

  @ViewChild("canvascontainer", { static: true })
  canvasContainer: ElementRef<HTMLCanvasElement>;

  @ViewChild("canvas", { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private heightLimit: number;
  private widthLimit: number;
  private squareSize: number;
  private wallLimit: number;
  private ctx: CanvasRenderingContext2D;

  ngOnInit() {
    this.canvas.nativeElement.height =
      this.canvasContainer.nativeElement.offsetHeight - 64;
    this.canvas.nativeElement.width = this.canvasContainer.nativeElement.offsetWidth;
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.loggedPlayer = this.authService.getUser();
    this.route.paramMap.subscribe(params => {
      const matchId = params.get("id");
      this.mapSubscription = this.matchService
        .getMatchMapEvent(matchId)
        .subscribe(match => {
          this.match = match;
          this.initializeMap();
          this.clearMap(true);
          console.log(match);
          this.updateMap(match.lastMap);
        });
    });
  }

  ngOnDestroy() {
    this.mapSubscription.unsubscribe();
  }

  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    this.matchService.updatePlayerDirection(event.key, this.match);
  }

  onPanLeft(event) {
    this.matchService.updatePlayerDirection("ArrowLeft", this.match);
  }
  onPanRight(event) {
    this.matchService.updatePlayerDirection("ArrowRight", this.match);
  }
  onPanUp(event) {
    this.matchService.updatePlayerDirection("ArrowUp", this.match);
  }
  onPanDown(event) {
    this.matchService.updatePlayerDirection("ArrowDown", this.match);
  }

  private updateMap(map: MatchMap) {
    if (!map) {
      return;
    }
    this.matchPlayer = map.players.find(
      player => player.id === this.loggedPlayer.uid
    );

    this.clearMap(false);

    map.players.forEach(player => {
      let color = "yellow";
      if (player.id === this.loggedPlayer.uid) {
        color = "purple";
      }
      if (player.status !== MatchPlayerStatus.DEAD) {
        player.position.forEach(point => {
          this.drawSquare(point.x, point.y, color);
        });
      }
    });

    this.drawSquare(map.foodPosition.x, map.foodPosition.y, "red");
  }

  private drawSquare(x: number, y: number, color: string) {
    const fixedX = x * this.squareSize + this.widthLimit;
    const fixedY =
      (this.match.mapSize - y - 1) * this.squareSize + this.heightLimit;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(fixedX, fixedY, this.squareSize, this.squareSize);
  }

  private clearMap(initialMap: boolean) {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(
      this.widthLimit,
      this.heightLimit,
      this.wallLimit,
      this.wallLimit
    );
    if (initialMap) {
      this.ctx.fillStyle = "black";
      this.ctx.font = "10px Arial";
      this.ctx.fillText(
        "Waiting for players...",
        this.widthLimit + 10,
        this.heightLimit + 10
      );
    }
  }

  private initializeMap() {
    const canvas = this.ctx.canvas;
    this.wallLimit = Math.min(canvas.height, canvas.width);
    this.widthLimit = (canvas.width - this.wallLimit) / 2;
    this.heightLimit = (canvas.height - this.wallLimit) / 2;
    this.squareSize = this.wallLimit / this.match.mapSize;
  }
}
