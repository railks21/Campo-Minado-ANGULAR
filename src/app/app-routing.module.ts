import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JogoComponent } from './views/mine/jogo/jogo.component';
import { LoginComponent } from './views/mine/login/login.component';
import { RegistarComponent } from './views/mine/registar/registar.component';
import { ScoreboardComponent } from './views/mine/scoreboard/scoreboard.component';


const routes: Routes = [
  {path: 'mine/jogo', component:JogoComponent},
  {path: 'mine/login', component:LoginComponent},
  {path: 'mine/registar', component:RegistarComponent},
  {path: 'mine/scoreboard', component:ScoreboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
