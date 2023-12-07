import { Component, OnInit, Inject, Input } from '@angular/core';
import { IQueryResonse,IJR_Dashboard, IDepartment, IEmployee, IEmployeeDetail,PRP_JRHdr, IJRHdr, IJRLogin } from "../../../Entities/imenu";
import { JRService } from "../../../Core/Services/jr.service";
import { FormGroup, FormControl, Validators, FormBuilder,UntypedFormBuilder} from '@angular/forms';
import { from, isEmpty, Observable, Subject, subscribeOn, switchMap, takeUntil,interval } from "rxjs";
import { DOCUMENT } from '@angular/common';
import { ConfirmationDialogService } from "../../../Settings/ConfirmationDialog/confirmation-dialog.service";
import { ToastrMotificationService } from "../../../Settings/Notification/toastr-motification.service";
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-jrrole',
  templateUrl: './jrrole.component.html',
  styleUrls: ['./jrrole.component.css']
})
export class JRRoleComponent implements OnInit {
  empcd:string="";
  headingMenu:string="";
  mainMenu:string="";
  currMenu:string="";
  errorMsg:string="";
  visCurrMenu:boolean=false;
  span_empcd:string="";
  span_empnam:string="";
  span_dept:string="";
  span_desig:string="";
  span_RetNo:string="";
  span_UserID:string="";
  currTime:any;
  txtDate:any;
  hdfDate:any;
  txtFroDat:any;
  txtToDat:any;
  jrEmployeeRole:any;
  constructor(private httpService:JRService,private router:Router, private actRoute: ActivatedRoute, private formbuilder:FormBuilder,@Inject(DOCUMENT) private document:Document,private confirmationDialogService:ConfirmationDialogService, private toastr: ToastrMotificationService) { 
    interval(500).subscribe((func => {
      this.Timer();
    }))
    this.empcd =JSON.parse(this.retrieve()).empcd;
  }

  private retrieve() {
    var usermeta:string |null;
    usermeta = sessionStorage.getItem('usermeta');
    if(!usermeta) throw 'no token found';
    return usermeta;
  }

  ngOnInit(): void {
    this.headingMenu="Main";
    this.mainMenu="JRRole"
    this.currMenu="Main"
    this.visCurrMenu=true;
    this.Timer();
    this.changeDate();
    this.httpService.getJRRole().subscribe(res=>{
      if(res.response==-1)
      {
        this.errorMsg=res.responseMsg;
        return;
      }
      this.jrEmployeeRole=res.responseObjectList;
    });
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

  btnexit_click()
  {
    this.router.navigate(['app/dashboard']);
  }

  printData()
  {

  }
}
