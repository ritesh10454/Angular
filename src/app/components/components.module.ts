import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { JREntryComponent } from './Main/jrentry/jrentry.component';
import { PasswordComponent } from './Main/password/password.component';
import { JRListComponent } from './Report/jrlist/jrlist.component';
import { HttpClientModule} from "@angular/common/http";
import { ReactiveFormsModule,FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
 import { NgxPaginationModule } from 'ngx-pagination';
 import { ToastrModule } from "ngx-toastr";
import { JRInboxComponent } from '../components/jrinbox/jrinbox.component';
import { JROutboxComponent } from './jroutbox/jroutbox.component';
import { JRRoleComponent } from './Main/jrrole/jrrole.component';
import { JRAccessRightComponent } from './Main/jraccess-right/jraccess-right.component';


@NgModule({
  declarations: [
    JREntryComponent,
    PasswordComponent,
    JRListComponent,
    JRInboxComponent,
    JROutboxComponent,
    JRRoleComponent,
    JRAccessRightComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    RouterModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-full-width'
    }),
  ]
})
export class ComponentsModule { }
