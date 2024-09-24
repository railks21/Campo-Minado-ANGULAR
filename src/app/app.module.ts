import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { FirestoreModule } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JogoComponent } from './views/mine/jogo/jogo.component';
import { LoginComponent } from './views/mine/login/login.component';
import { RegistarComponent } from './views/mine/registar/registar.component';
import { ScoreboardComponent } from './views/mine/scoreboard/scoreboard.component';


@NgModule({
  declarations: [
    AppComponent,
    JogoComponent,
    LoginComponent,
    RegistarComponent,
    ScoreboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
