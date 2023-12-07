import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { JRService } from '../../Core/Services/jr.service';
import { interval, Observable } from "rxjs";
import { IJRHdr } from "../../Entities/imenu";
import { DOCUMENT } from '@angular/common';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-jrinbox',
  templateUrl: './jrinbox.component.html',
  styleUrls: ['./jrinbox.component.css']
})
export class JRInboxComponent implements OnInit {

  headingMenu!:string;
  mainMenu!:string;
  currMenu!:string;
  errorMsg!:string;
  empcd:string="";
  InboxData!:any;
  visCurrMenu!:boolean;
  currTime:any;
  txtDate:any;
  hdfDate:any;
  txtFroDat:any;
  txtToDat:any;
  p:number = 1;
  count:number = 10;
  jrInboxHeader!:string;

  constructor(private httpService:JRService,@Inject(DOCUMENT) private document:Document, private route: ActivatedRoute,private formbulider: UntypedFormBuilder, private router:Router){
    this.empcd =JSON.parse(this.retrieve()).empcd;
    interval(500).subscribe((func => {
      this.Timer();
    }));
  }

  ngOnInit(): void {
    this.headingMenu="Action";
    this.mainMenu="Inbox";
    this.currMenu="Action";
    this.jrInboxHeader="Inbox";
    this.document.body.classList.add("sidebar-collapse");
    this.Timer();
    this.changeDate();
    this.BindGrid();
  }

  BindGrid(){
    if(this.empcd.length>0){
      this.httpService.GetJRInbox(this.empcd).subscribe(res=>{
        if(res.response==-1){
          this.errorMsg=res.responseMsg;
          return;
        }
        this.InboxData=res.responseObjectList;
      });
    }
  }


  private retrieve() {
    var usermeta:string |null;
    usermeta = sessionStorage.getItem('usermeta');
    if(!usermeta) throw 'no token found';
    return usermeta;
  }

  Timer() {
    var currdt = new Date();
    this.currTime= this.formatAMPM1(currdt);
  }

  changeDate() {
    var currdt = new Date();
    var mth:any = (currdt.getMonth()+1);
    var dy:any = currdt.getDate();
    var yr:any =Math.abs(currdt.getFullYear());
    if (mth < 10) {   mth = '0' + mth; }
    if (dy < 10) {   dy = '0' + dy; }
    var dt =mth + '/' + dy + '/' + yr;
    this.txtDate=dy + '/' + mth + '/' + yr;
    this.hdfDate=this.ChangeDateFormat(dt);
    this.txtFroDat=dy + '/' + mth + '/' + yr;
    this.txtToDat=dy + '/' + mth + '/' + yr;
}



formatAMPM(date:Date) {
  var hours:any = date.getHours();
  var minutes:any = date.getMinutes();
  var ampm:string = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

formatAMPM1(date:Date) {
  var hours:any = date.getHours();
  var minutes:any = date.getMinutes();
  var seconds:any = date.getSeconds();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  var strTime = hours + ':' + minutes + ':' + seconds;
  return strTime;
}

ChangeDateFormat(dt:any) {
  var formatted_date = "";
  if (dt == null || dt == "") return formatted_date;
  var d:any = new Date(dt);
  var month:any = d.getMonth();
  var date:any = d.getDate();
  var year =Math.abs(d.getFullYear());
  if (month < 10) {   month = '0' + month; }
  if (date < 10) {   date = '0' + date; }
  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var formatted_date = date + "-" + months[parseInt(month)] + "-" + year;
  return formatted_date;
}

btnexit_click(){
  this.router.navigate(['app/dashboard']);
  return;
}  

btnSelect_click(){
  
}

}