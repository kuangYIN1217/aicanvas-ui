import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkEditorComponent } from './network-editor.component';
const routes: Routes = [
 // { path: 'network-editor', component: NetworkEditorComponent },
 // { path: 'dashboard',  component: DashboardComponent },
 // { path: 'detail/:id', component: HeroDetailComponent },
 // { path: 'heroes',     component: HeroesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }