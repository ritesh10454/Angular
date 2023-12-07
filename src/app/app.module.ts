import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmationComponent } from './Settings/ConfirmationDialog/confirmation/confirmation.component';
import { SharedModule } from "./shared/shared.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { LoadingInterceptor } from "./Settings/Loader/loading.interceptor";
import { SpinnerComponent } from './Settings/Loader/Spinner/spinner/spinner.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { PrintJRComponent } from './Settings/PrintDialog/print-jr/print-jr.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationComponent,
    SpinnerComponent,
    PrintJRComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-full-width'
    }),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }