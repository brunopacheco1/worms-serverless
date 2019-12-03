import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  AngularFireFunctionsModule,
  FUNCTIONS_ORIGIN
} from "@angular/fire/functions";
import {
  MatInputModule,
  MatCardModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./components/login/login.component";
import { StartMatchComponent } from "./components/start-match/start-match.component";
import { MatchComponent } from "./components/match/match.component";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StartMatchComponent,
    MatchComponent
  ],
  imports: [
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireFunctionsModule
  ],
  exports: [],
  providers: [
    { provide: FUNCTIONS_ORIGIN, useValue: environment.functionsOrigins }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
