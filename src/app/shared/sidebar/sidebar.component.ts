import { AfterViewInit, Component, OnInit,Input,HostBinding, OnDestroy} from '@angular/core';
import { IMenu} from "src/app/Entities/imenu";
import { Observable, Subject } from "rxjs";
import { JRService} from '../../Core/Services/jr.service';
import { Router,NavigationEnd,RouterEvent } from "@angular/router";
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public menuList!:Observable<IMenu[]>;

  errorMsg!:string;
 constructor(private httpService:JRService,public router: Router) { }
 
  ngOnInit(): void {
   var empcd:string;
   empcd =JSON.parse(this.retrieve()).empcd;
   this.menuList  = this.httpService.getJRMenus(`${empcd}`); 
 }

 private retrieve() {
   var usermeta:string |null;
   usermeta = sessionStorage.getItem('usermeta');
   if(!usermeta) throw 'no token found';
   return usermeta;
 }
}
