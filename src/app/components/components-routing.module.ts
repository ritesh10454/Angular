import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JRInboxComponent } from '../components/jrinbox/jrinbox.component';
import { JREntryComponent } from "./Main/jrentry/jrentry.component";
import { JRListComponent } from "./Report/jrlist/jrlist.component";
import { JROutboxComponent } from "./jroutbox/jroutbox.component";
import { PasswordComponent } from "../components/Main/password/password.component";
import { JRRoleComponent } from "../components/Main/jrrole/jrrole.component";
import { JRAccessRightComponent } from "../components/Main/jraccess-right/jraccess-right.component";

const routes: Routes = [
  {
    path:'jrentry',
    component:JREntryComponent
  },
  {
    path:'password',
    component:PasswordComponent
  },
  {
    path:'jrrole',
    component:JRRoleComponent
  },
  {
    path:'jraccessright',
    component:JRAccessRightComponent
  },
  {
    path:'jrlist/:tag',
    component:JRListComponent
  },
  {
    path:'jrinbox',
    component:JRInboxComponent
  },
  {
    path:'jroutbox',
    component:JROutboxComponent
  },
  {
    path:'jrentry/:jrId/:tag/:deptcd/:empcd',
    component:JREntryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
