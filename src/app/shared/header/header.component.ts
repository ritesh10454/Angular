import { Component, OnInit } from '@angular/core';
import { JRService} from "../../Core/Services/jr.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  welcomeMessage!:string;
  errorMsg!:string;
  constructor(private httpService: JRService){}

  ngOnInit(): void {
    var empcd:string;
    empcd =JSON.parse(this.retrieve()).empcd;
    this.httpService.getWelcomeMessage(empcd).subscribe(data=>{
      if (data.response==-1){        
        this.errorMsg=data.responseMsg;
      }
      var mData=data.responseObject;
      this.welcomeMessage= mData.empnm;
     });    
  }

  private retrieve() {
    var usermeta:string |null;
    usermeta = sessionStorage.getItem('usermeta');
    if(!usermeta) throw 'no token found';
    return usermeta;
  }

}