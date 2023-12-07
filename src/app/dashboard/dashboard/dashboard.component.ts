import { Component, OnInit } from '@angular/core';
import { IJR_Dashboard,IQueryResonse } from "src/app/Entities/imenu";
import { JRService} from "../../Core/Services/jr.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  headingMenu!:string;
  mainMenu!:string;
  currMenu!:string;
  errorMsg!:string;
  visCurrMenu!:boolean;
  jrDashboardTabs!: Observable<IJR_Dashboard[]>;
  constructor(private httpService:JRService) { }

  ngOnInit(): void {
    var empcd:string;
    empcd =JSON.parse(this.retrieve()).empcd;
    this.jrDashboardTabs= this.httpService.getJRDashboard(empcd);
    this.headingMenu="Home";
    this.mainMenu="Dashboard"
    this.visCurrMenu=false;   
    if (!localStorage.getItem('foo')) 
    { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } 
    else 
    {
      localStorage.removeItem('foo') 
    } 
  }

  private retrieve() {
    var usermeta:string |null;
    usermeta = sessionStorage.getItem('usermeta');
    if(!usermeta) throw 'no token found';
    return usermeta;
  }

}