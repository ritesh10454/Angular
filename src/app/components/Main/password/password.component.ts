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
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  empcd:string="";
  headingMenu:string="";
  mainMenu:string="";
  currMenu:string="";
  errorMsg:string="";
  visCurrMenu:boolean=false;
  PasswordForm!:FormGroup;
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
  empcdDisable:boolean=true;
  empnmDisable:boolean=true;
  objprpemployeedetail!: any;

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
    this.mainMenu="Change Password"
    this.currMenu="Action"
    this.visCurrMenu=true;
    this.Timer();
    this.changeDate();
    this.PasswordForm=this.formbuilder.group({
      emp_cd:[''],
      emp_nm:[''], 
      currpass:['',Validators.required],
      userpass:['',Validators.required],
      confpass:['',Validators.required]
    });
    
    this.httpService.GetEmployeeDetail(this.empcd).subscribe(res=>{
      if(res.response==-1){
        this.errorMsg=res.responseMsg;
        return;
      }
      this.objprpemployeedetail=res.responseObject;
      this.PasswordForm.controls['emp_nm'].setValue(this.objprpemployeedetail.emp_nm);
      this.PasswordForm.controls['emp_cd'].setValue(this.objprpemployeedetail.emp_cd);
      this.span_empcd=this.objprpemployeedetail.emp_cd;
      this.span_empnam=this.objprpemployeedetail.emp_nm;
      this.span_dept=this.objprpemployeedetail.dept_cd;
      this.span_desig=this.objprpemployeedetail.desig_cd;
      this.span_UserID=this.empcd;
    });    
  }

  btnChange_click()
  {
       let err= this.CheckValidation();
       if(err==0)
       {
          let passmsg=this.checkPasswordAuthentication(this.PasswordForm.controls['userpass'].value.toString().trim());
          if(passmsg==0)
          {
              this.httpService.checkPassword(this.empcd.toString().trim(),  this.PasswordForm.controls['currpass'].value.toString().trim() ).subscribe(res=>{
                  let result= parseInt(res.responseObject.outres);
                  if(result!=1)
                  {
                    this.errorMsg='Current Password is Wrong';
                    this.toastr.showError("Error",this.errorMsg);
                    return;
                  }
                  let jrEmployee=this.PasswordForm.value;
                  this.httpService.UpdatePassword(jrEmployee).subscribe(res1=>{
                    if(res1.response==-1)
                    {
                      this.errorMsg=res1.responseMsg;
                      this.toastr.showError("Error",this.errorMsg);
                      return;
                    }
                    this.toastr.showSuccess("Success",res1.responseMsg);
                  });
              });  
          }
       }
  }

  CheckValidation() : number
  {
    let err=0;
    if(this.empcd.toString().trim().length==0)
    {
      this.errorMsg='Please Enter User Name';
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    }
    else if(this.PasswordForm.controls['currpass'].value.toString().trim().length==0)
    {
      this.errorMsg='Please Enter Current Password';
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    }
    else if(this.PasswordForm.controls['userpass'].value.toString().trim().length==0)
    {
      this.errorMsg='Please Enter Change Password';
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    }    
    else if(this.PasswordForm.controls['confpass'].value.toString().trim().length==0)
    {
      this.errorMsg='Please Enter Confirm Password';
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    }
    else if(this.PasswordForm.controls['userpass'].value.toString().trim() != this.PasswordForm.controls['confpass'].value.toString().trim())
    {
      this.errorMsg='New Password is not Matching';
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    } 
    return err;
  }

  checkPasswordAuthentication(value:any): number
  {
    let err=0;
    var isNonWhiteSpace=/^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
        this.errorMsg= "Password must not contain Whitespaces.";
        this.toastr.showError("Error",this.errorMsg);
        err=1;
    }
    var isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
      this.errorMsg= "Password must have at least one Uppercase Character.";
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    }

    var isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
      this.errorMsg= "Password must have at least one Lowercase Character.";
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    }

    var isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
      this.errorMsg= "Password must contain at least one Digit.";
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    }

    var isContainsSymbol =  /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(value)) {
      this.errorMsg= "Password must contain at least one Special Symbol.";
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    }

    var isValidLength = /^.{10,16}$/;
    if (!isValidLength.test(value)) {
      this.errorMsg= "Password must be 10-16 Characters Long.";
      this.toastr.showError("Error",this.errorMsg);
      err=1;
    }
    return err;
}



  btnexit_click()
  {
    this.router.navigate(['app/dashboard']);
  }

  printData()
  {

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
}
