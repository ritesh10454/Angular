import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from "./shared/main/main.component";

const routes: Routes = [
  {
    path:'auth',
    loadChildren:()=>import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path:'component',
    component:MainComponent,
    children:[
      {
        path:'menu',
        loadChildren:()=>import('./components/components.module').then(m=>m.ComponentsModule)
      },
      
    ]
  },
  {
    path:'app',
    component:MainComponent,
    children:[
      {
        path:'dashboard',
        loadChildren:()=>import('./dashboard/dashboard.module').then(m=>m.DashboardModule)
      }
    ]
  },
  {  path: '',  redirectTo: 'auth/login',  pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
