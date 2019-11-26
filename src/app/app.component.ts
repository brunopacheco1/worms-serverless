import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private authService: AuthService) {
    authService.handleAuthentication();
  }

  get isLogged(): boolean {
    return this.authService.isAuthenticated();
  }

  get username(): string {
    return this.authService.getUsername();
  }

  get userProfileImage(): string {
    return this.authService.getProfileImage();
  }

  public login(): void {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
