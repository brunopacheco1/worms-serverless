import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "../model/user.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private user: User;

  constructor(public afAuth: AngularFireAuth, public router: Router) {}

  public hasScopes(scopes: string[]): boolean {
    return true;
  }

  public login(): void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  public handleAuthentication(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = {
          uid: user.uid,
          username: user.displayName,
          profileImage: user.photoURL
        };
        this.router.navigate(["start-match"]);
      } else {
        this.user = null;
        this.router.navigate(["/"]);
      }
    });
  }

  public isAuthenticated(): boolean {
    return !!this.user;
  }

  public getUsername(): string {
    return !!this.user ? this.user.username.split(/\s/)[0] : null;
  }

  public getProfileImage(): string {
    return !!this.user ? this.user.profileImage : null;
  }

  public getUserUid(): string {
    return !!this.user ? this.user.uid : null;
  }

  public getUser(): User {
    return this.user;
  }

  public logout(): void {
    this.afAuth.auth.signOut();
  }
}
