import { Component, OnInit, Inject, Input } from '@angular/core';
import { IQueryResonse,IJR_Dashboard, IDepartment, IEmployee, IEmployeeDetail,PRP_JRHdr, IJRHdr } from "../../../Entities/imenu";
import { JRService } from "../../../Core/Services/jr.service";
import { FormGroup, FormControl, Validators, FormBuilder,UntypedFormBuilder, NgModel} from '@angular/forms';
import { from, isEmpty, Observable, Subject, subscribeOn, switchMap, takeUntil } from "rxjs";
import { DOCUMENT } from '@angular/common';
import { ConfirmationDialogService } from "../../../Settings/ConfirmationDialog/confirmation-dialog.service";
import { ToastrMotificationService } from "../../../Settings/Notification/toastr-motification.service";
import { PrintJRService } from "../../../Settings/PrintDialog/print-jr.service";
import { ActivatedRoute,Router, ParamMap, Resolve } from '@angular/router';

import  'jquery';
import { ThisReceiver } from '@angular/compiler';
import { HttpParams } from '@angular/common/http';
declare var $:any;



@Component({
  selector: 'app-jrentry',
  templateUrl: './jrentry.component.html',
  styleUrls: ['./jrentry.component.css']
})
export class JREntryComponent implements OnInit {
    empcd:string="";
    headingMenu!:string;
    mainMenu!:string;
    currMenu!:string;
    errorMsg!:string;
    visCurrMenu!:boolean;
    jrDepartment!: any;  
    selJrDepartment!:string;
    JrEmployee!:any;
    selJrEmployee!:string;
    objprpemployeedetail!: any;
    objprpjrhdr!:any;
    obj_jrHdr!:any;
    // JRForm!:FormGroup;
    dept_cd:string="";
    span_Departmentcd:string="";
    span_Designationcd:string="";
    span_CategoryCd:string="";
    span_Categorynm:string="";
    span_ID:string="";
    revisionDetail!:any;
    btnSaveText:string="";    
    saveButtonShow:boolean=false;
    actionButtonShow:boolean=false;
    cancelButtonShow:boolean=false;
    printButtonShow:boolean=false;
    effectivedtShow:boolean=false;
    btnActionText:string="";
    btnsaveDisabled:boolean=false;
    btnActionDisabled:boolean=false;
    btnCancelDisabled:boolean=false;
    btnPrintDisabled:boolean=false;
    jrDetailDisable:boolean=false;
    
    encStr:any;
    jrId:number=0;
    tag:number=0;
    selectedEmpcd:string="";
    selectedDeptcd:string="";
    jrEmployeeForm!:FormGroup;

    tableHeading:string="";
    newRows1:String="";


  constructor(private httpService:JRService,private router:Router, private actRoute: ActivatedRoute, private formbuilder:FormBuilder,@Inject(DOCUMENT) private document:Document,private confirmationDialogService:ConfirmationDialogService, private toastr: ToastrMotificationService, private printService:PrintJRService) { 
    this.empcd =JSON.parse(this.retrieve()).empcd;
  }


    ngOnInit():void{
    this.jrEmployeeForm=this.formbuilder.group({
      emp_cd:[''],
      emp_nm:[''], 
      doj:[''],
      dept_cd:[''],   
      dept_nm:[''],  
      desig_cd:[''],
      desig_nm:[''],
      catg_cd:[''],
      catg_nm:[''],
      revision_no:[''],
      revision_date:[''],
      supersede_no:[''],
      reason:[''], 
      luserId:[''], 
      jr_detail:[''],
      isCurrent:[''],
      btnsave:[''],
      Id:[''],
      Department:[''],
      Employee:['']
    });


    this.btnSaveText="Save";
    this.document.body.classList.add("sidebar-collapse");
    this.effectivedtShow=false;

    this.headingMenu="Main";
    this.mainMenu="JR Entry"
    this.currMenu="Action"
    this.visCurrMenu=true;
    this.jrEmployeeForm.controls["Department"].setValue(0);
    this.jrEmployeeForm.controls["Employee"].setValue(0);

    $(".summernote").summernote({'height':'250px'});
    this.selectedEmpcd= (this.actRoute.snapshot.params['empcd']==null)?"":  this.actRoute.snapshot.params['empcd'].toString();
    this.jrId = (this.actRoute.snapshot.params['jrId']==null)? 0 :  parseInt(this.actRoute.snapshot.params['jrId'].toString());
    this.selectedDeptcd = (this.actRoute.snapshot.params['deptcd']==null)?0:  this.actRoute.snapshot.params['deptcd'];
    this.encStr = (this.actRoute.snapshot.params['tag']==null)?0:  this.actRoute.snapshot.params['tag'];

    var obj:any;
    this.saveButtonShow=true;
    this.actionButtonShow=false;
    this.btnActionText="Forward";
    this.btnActionDisabled=false;
    
    if(this.jrId!=0)
    {
      this.httpService.getDepartmentList(this.selectedEmpcd).subscribe(obj=>{
        if(obj.response==-1){
          this.errorMsg=obj.responseMsg;
          return
        }
        this.jrDepartment= obj.responseObjectList;
        this.getEmployeeJRDetail();
      });
    }
    else
    {
      this.httpService.getDepartmentListtoFirstAuthority(this.empcd as string).subscribe(obj=>{
        if(obj.response==-1){
          this.errorMsg=obj.responseMsg;
          return
        }
        this.jrDepartment= obj.responseObjectList;
        this.getEmployeeJRDetail();
      });      
    }
  }

  getEmployeeJRDetail()
  {
    let finalID:string="";
    let firstapp_id:string="";
    if(this.encStr!=0)
    {
      this.httpService.decryptQueryString(this.encStr.toString()).subscribe(decTag=>{
        this.tag= parseInt(decTag);
        this.jrEmployeeForm.controls['revision_no'].disable();
        this.jrEmployeeForm.controls['supersede_no'].disable();
        this.jrEmployeeForm.controls['Department'].patchValue(this.selectedDeptcd.toString().trim());
        this.jrEmployeeForm.controls['Department'].disable();
        this.jrEmployeeForm.controls['revision_date'].setValue(this.Convert_DateInStringFormat1(new Date()));
        if(this.jrId!=0)
        {
          this.btnSaveText="Update";
          this.httpService.GetEmployeeDetail(this.selectedEmpcd).subscribe(res=>{
            if(res.response==-1){
              this.errorMsg=res.responseMsg;
              return;
            }
            this.objprpemployeedetail=res.responseObject;
            this.jrEmployeeForm.controls['dept_cd'].setValue(this.objprpemployeedetail.dept_cd);
            this.jrEmployeeForm.controls['dept_nm'].setValue(this.objprpemployeedetail.dept_nm);
            this.jrEmployeeForm.controls['emp_nm'].setValue(this.objprpemployeedetail.emp_nm);
            this.jrEmployeeForm.controls['emp_cd'].setValue(this.objprpemployeedetail.emp_cd);
            this.jrEmployeeForm.controls['desig_cd'].setValue(this.objprpemployeedetail.desig_cd);
            this.jrEmployeeForm.controls['desig_nm'].setValue(this.objprpemployeedetail.desig_nm);
            this.jrEmployeeForm.controls['doj'].setValue(this.objprpemployeedetail.dt_join);
            this.jrEmployeeForm.controls['catg_cd'].setValue(this.objprpemployeedetail.catg_cd);
            this.jrEmployeeForm.controls['catg_nm'].setValue(this.objprpemployeedetail.catg_nm);   
            if(this.jrEmployeeForm.controls['Department'].value.toString().trim()!="0")
            {
              this.httpService.getEmployee(this.selectedDeptcd).subscribe(res=>{
                if(res.response==-1){
                  this.errorMsg=res.responseMsg;
                  return;
                }
                this.JrEmployee=res.responseObjectList;
                this.jrEmployeeForm.controls["Employee"].patchValue(this.selectedEmpcd.toString().trim());
                this.jrEmployeeForm.controls['Employee'].disable(); 
                if(this.tag==1){
                  this.actionButtonShow=true;
                  this.btnActionText="";
                  this.btnActionDisabled=false;
                  this.actionButtonShow=false;
                  this.httpService.getJRContents(this.jrId.toString()).subscribe(objFinal=>{
                    if(objFinal.response==-1){
                      this.errorMsg=objFinal.responseMsg;
                      return;
                    }
                    firstapp_id=(objFinal.responseObject.firstapp_id==null)?"":objFinal.responseObject.firstapp_id.toString();
                    if(firstapp_id!=""){
                      this.btnActionDisabled=true;              
                    }
                    else{
                      this.btnActionDisabled=false;
                    }
                  });
                }
                else if(this.tag==2){
                  this.saveButtonShow=false;
                  this.jrEmployeeForm.controls['revision_date'].disable();
                  this.jrEmployeeForm.controls['revision_no'].disable();
                  this.jrEmployeeForm.controls['supersede_no'].disable();
                  this.jrEmployeeForm.controls['reason'].disable();
                  this.actionButtonShow=true;
                  this.btnActionDisabled=false;
                  this.btnActionText="Forward";
                  this.printButtonShow=false;
                //  this.jrEmployeeForm.controls['jr_detail'].disable();
                this.jrDetailDisable=false;
                // $('.note-editable').attr('contenteditable', false);
                // $('.note-control-selection').remove();
                // $(". summernote").siblings(".note-editor").find(".note-editable").attr("contenteditable","false");

                 $(".summernote").summernote("disable");
                  this.cancelButtonShow=true;
                  this.httpService.getJRContents(this.jrId.toString()).subscribe(objFinal=>{
                    if(objFinal.response==-1){
                      this.errorMsg=objFinal.responseMsg;
                      return;
                    }
                    let tra = (objFinal.responseObject.tra==null)?"" : objFinal.responseObject.tra.toString().trim();
                    let sta = (objFinal.responseObject.sta==null)?"" : objFinal.responseObject.sta.toString().trim();
                    if(tra=="F" && sta=="2"){
                      this.btnCancelDisabled=true;
                      this.cancelButtonShow=false;
                    }
                    let objemp_app_dt=(objFinal.responseObject.Emp_app_dt==null)?"" : objFinal.responseObject.Emp_app_dt.toString().trim();
                    if(objemp_app_dt !=""){
                      this.btnActionDisabled=true;
                      this.btnCancelDisabled=true;
                      this.cancelButtonShow=false;
                    }
                    let objfinalapp_id=(objFinal.responseObject.finalapp_id==null)?"" : objFinal.responseObject.finalapp_id.toString().trim();
                    if(objfinalapp_id !="") {
                      this.btnPrintDisabled=false;
                      this.printButtonShow=true;
                      this.btnCancelDisabled=true;
                      this.cancelButtonShow=false;
                    }
                  });
                }
                else if(this.tag==3){
                  this.actionButtonShow=false;
                  this.btnActionDisabled=false;
                  this.httpService.checkJRAuth(this.empcd.toString().trim()).subscribe(hrAuth=>{
                    if(hrAuth.response==1){
                      this.actionButtonShow=true;
                      this.btnActionText="Final Approval";
                      this.btnActionDisabled=false;
                      this.saveButtonShow=false;
                      this.jrEmployeeForm.controls['revision_date'].disable();
                      this.jrEmployeeForm.controls['revision_no'].disable();
                      this.jrEmployeeForm.controls['supersede_no'].disable();
                      this.jrEmployeeForm.controls['reason'].disable(); 
                      $(".summernote").summernote("disabled");     
                      this.jrEmployeeForm.controls['revision_date'].setValue(this.Convert_DateInStringFormat1(new Date())); 
                      this.httpService.getJRContents(this.jrId.toString()).subscribe(objFinal=>{
                        if(objFinal.response==-1){
                          this.errorMsg=objFinal.responseMsg;
                          return;
                        }
                        finalID=(objFinal.responseObject.hr_finalapp_id==null)?"" : objFinal.responseObject.hr_finalapp_id.toString().trim();
                        if(finalID !="") {
                          this.btnActionDisabled=true;
                        }
                        else{
                          this.btnActionDisabled=false;
                          this.effectivedtShow=true;
                        }
                      });
                    }
                  });
                }
                else if(this.tag==4){
                  this.actionButtonShow=true;
                  this.btnActionDisabled=false;
                  this.btnActionText="Approve";
                  this.cancelButtonShow=true;
                  this.btnCancelDisabled=false;
                  this.saveButtonShow=false;
                  this.jrEmployeeForm.controls['revision_date'].disable();
                  this.jrEmployeeForm.controls['revision_no'].disable();
                  this.jrEmployeeForm.controls['supersede_no'].disable();
                  this.jrEmployeeForm.controls['reason'].disable(); 
                  $(".summernote").summernote("disabled"); 
                  this.httpService.getJRContents(this.jrId.toString()).subscribe(objFinal=>{
                    if(objFinal.response==-1){
                      this.errorMsg=objFinal.responseMsg;
                      return;
                    }
                    finalID=(objFinal.responseObject.finalapp_id==null)?"" : objFinal.responseObject.finalapp_id.toString().trim();
                    if(finalID !="") {
                      this.btnActionDisabled=true;
                      this.btnCancelDisabled=true;
                    } 
                  });    
                } 
  
                if(this.jrId!=0)
                {
                  this.span_Departmentcd=this.jrEmployeeForm.get('dept_cd')?.value as string;
                  this.span_Designationcd=this.jrEmployeeForm.get('desig_cd')?.value as string;
                  this.span_CategoryCd=this.jrEmployeeForm.get('catg_cd')?.value as string;
                  this.span_Categorynm=this.jrEmployeeForm.get('catg_nm')?.value as string;
                  this.span_ID=this.jrEmployeeForm.get('Id')?.value as string;
  
                  this.httpService.GetJRHdr(this.selectedEmpcd.toString().trim(),this.selectedDeptcd.toString().trim(),this.span_Designationcd.toString().trim(),this.jrId.toString().trim()).subscribe(res_jr=>
                  {
                    if(res_jr.response==-1){
                      this.errorMsg=res_jr.responseMsg;
                      return;
                    }
                    this.objprpjrhdr=res_jr.responseObject;
                    let entryexists=this.objprpjrhdr.EntryExists;
                    if(this.tag==3 && finalID==""){
                       this.objprpjrhdr.revision_date=this.Convert_DateInStringFormat1(new Date());
                    }
                    this.jrEmployeeForm.controls['jr_detail'].setValue(this.objprpjrhdr.jr_detail);
                    $(".summernote").summernote('code',this.objprpjrhdr.jr_detail); 
                    this.jrEmployeeForm.controls['revision_no'].setValue(this.objprpjrhdr.revision_no);
                    this.jrEmployeeForm.controls['supersede_no'].setValue(this.objprpjrhdr.supersede_no);
                    this.jrEmployeeForm.controls['revision_date'].setValue(this.objprpjrhdr.revision_date);    
                    this.jrEmployeeForm.controls['reason'].setValue(this.objprpjrhdr.reason);      
                    this.jrEmployeeForm.controls['Id'].setValue(this.objprpjrhdr.f_hdr_id); 
                    this.span_ID=this.objprpjrhdr.f_hdr_id;
                    this.jrEmployeeForm.controls['isCurrent'].setValue(this.objprpjrhdr.iscurrent); 
                    this.jrEmployeeForm.controls["luserId"].setValue(this.empcd.toString().trim());
                    this.errorMsg="";
                    this.httpService.getJRRevision(this.objprpemployeedetail.emp_cd).subscribe(res=>{
                      if(res.response==-1){
                        this.errorMsg=res.responseMsg;
                        return;
                      }
                      this.revisionDetail=res.responseObjectList;
                    });
            
                  }); 
                }
              });
            }                   
          });
        } 
      });
    }
    else
    {
      this.tag=0;
    }  
  }





  btnSave_Click()
  {
      const jrEmployee=this.jrEmployeeForm.value;
      jrEmployee.emp_cd = this.jrEmployeeForm.controls['emp_cd'].value;
      jrEmployee.emp_nm=   this.jrEmployeeForm.controls['emp_nm'].value;  
      jrEmployee.doj= this.Convert_DateInStringFormat(this.jrEmployeeForm.controls['doj'].value);  
      jrEmployee.dept_cd=this.jrEmployeeForm.controls['dept_cd'].value;    
      jrEmployee.dept_nm=this.jrEmployeeForm.controls['dept_nm'].value;   
      jrEmployee.desig_cd=this.span_Designationcd; 
      jrEmployee.desig_nm=this.jrEmployeeForm.controls['desig_nm'].value;  
      jrEmployee.catg_cd=this.jrEmployeeForm.controls['catg_cd'].value;  
      jrEmployee.catg_nm=this.jrEmployeeForm.controls['catg_nm'].value; 
      jrEmployee.revision_no=this.jrEmployeeForm.controls['revision_no'].value; 
      jrEmployee.revision_date=this.Convert_DateInStringFormat(this.jrEmployeeForm.controls['revision_date'].value); 
      jrEmployee.supersede_no=(this.jrEmployeeForm.controls['supersede_no'].value=='Nil' ? "-1": this.jrEmployeeForm.controls['supersede_no'].value);  
      jrEmployee.reason=this.jrEmployeeForm.controls['reason'].value;  
      jrEmployee.luserId=this.empcd.toString().toUpperCase();  
      jrEmployee.jr_detail=this.jrEmployeeForm.controls['jr_detail'].value;
      jrEmployee.isCurrent="1";
      jrEmployee.btnsave="Save";   
      jrEmployee.Id= (this.span_ID.toString()=="")?"0":this.span_ID.toString();
      this.SaveAndUpdate(jrEmployee);
  }

  SaveAndUpdate(jrEmployee:PRP_JRHdr)
  {

    if(this.btnSaveText=="Save"){
      if(jrEmployee.emp_cd !=""){
        this.httpService.checkDuplicate(jrEmployee.emp_cd.toString().trim()).subscribe(dupemp=>{
          if(dupemp.response==-1){
            this.errorMsg=dupemp.responseMsg;
            this.toastr.showError(dupemp.responseMsg,"Error");
            return;
          }
          this.httpService.GetEmployeeDetail(jrEmployee.emp_cd.toString().trim()).subscribe(res=>{
            if(res.response==-1){
              this.errorMsg=res.responseMsg;
              this.toastr.showError(res.responseMsg,"Error");
              return;
            }


            this.httpService.SaveJREntry(jrEmployee).subscribe(res1=>{
              if(res1.response==-1){
                this.errorMsg=res1.responseMsg;
                return;
              }
              this.span_ID=res1.CheckID.toString();
              this.errorMsg=res1.responseMsg;
              this.toastr.showSuccess(res1.responseMsg,"Success");
              this.btnsaveDisabled=true;
              this.jrEmployeeForm.controls['Employee'].disable();
            });

          });
        });
      }
    }
    else if(this.btnSaveText=="Update"){

    }


  }


  btnaction_Click(){
    this.jrEmployeeForm.controls["Employee"].disable();
  }

  btncancel_Click(){

  }

  btnPrint_Click(){
    this.httpService.JRReportPrint(this.empcd).subscribe(res=>{
      if(res.response==-1)
      {
        this.errorMsg=res.responseMsg;
        return;
      }
      let reportData= res.responseObject;
      let  _doj =  this.Convert_DateInStringFormat1(reportData.doj); 
      this.tableHeading='<div class="page-header" style="text-align: center;width:100%;">';
      this.tableHeading += '<table  cellpadding="0" cellspacing="0" width="100%"><tr><td colspan="4" style="text-align: center;"><span style="font-size:20px; font-weight:bold"><img src="../../../../assets/Images/logo.JPG" style="height: 57px;" alt="" />IOL CHEMICALS AND PHARMACEUTICALES LIMITED</span></td></tr>';
      this.tableHeading += '<tr><td colspan="4"><table  width="100%"><tr><td style="text-align:left;">Ref: HRM/SOP/013</td><td style="text-align:right;">Doc # : HRM/F/065</td></tr></table></td></tr>';
      this.tableHeading += '</table>'
      this.tableHeading += '</div>';

      /////----------------Detail Section------------------//
      this.tableHeading += '<table  cellpadding="0" cellspacing="0" width="100%">';
      this.tableHeading += '<thead>';
      this.tableHeading += '<tr>';
      this.tableHeading += '<td>';
      this.tableHeading += '<div class="page-header-space"></div>';
      //<!------------------------End------------------->
      this.tableHeading += '</td>';
      this.tableHeading += '</tr>';
      this.tableHeading += '</thead>';
      this.tableHeading += '<tbody>';
      this.tableHeading += '<tr>';
      this.tableHeading += '<td>';
      this.tableHeading += '<div class="page">';
       //<!------------------Report Detail---------------------------->
       this.tableHeading += '<table  cellpadding="0" cellspacing="0" width="100%">';
       this.tableHeading += '<tr>';
       this.tableHeading += '<td style="text-align: center; font-weight: bold; font-size:larger">INDIVIDUAL JOB RESPONSIBILITIES</td>';
       this.tableHeading += '</tr>';
       this.tableHeading += '<tr>';
       this.tableHeading += '<td style="text-align: left;font-family: "Times New Roman";font-size:12px; font-weight: bold; line-height:2.8 ">';
       this.tableHeading += '<table   cellpadding="0" cellspacing="0" width="100%">';
       this.tableHeading += '<tr>';
       this.tableHeading += '<td>';
       this.tableHeading += `<table  cellpadding="0" cellspacing="0" width="100%" border="true"><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">NAME</td><td style="white-space: initial;">${reportData.emp_nm}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">DESIGNATION / GRADE</td><td style="white-space: initial;">${reportData.desig_nm}  / ${reportData.catg_nm}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">E. CODE</td><td style="white-space: initial;">${reportData.emp_cd}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">DATE OF JOINING</td><td style="white-space: initial;">${reportData.dept_nm}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">DEPARTMENT</td><td colspan="3" style="white-space: initial;">${reportData.dept_nm}</td></tr></table>`;   // 1,2,3,4,5,6);//,reportData.emp_nm,reportData.desig_nm,reportData.catg_nm,reportData.emp_cd, _doj,reportData.dept_nm
       this.tableHeading += '</td>';
       this.tableHeading += '</tr>';
       this.tableHeading += '<tr>';
       this.tableHeading += '<td style="text-align: left; font-weight: bold; font-size: large">Job Responsibilities : -</td></tr>';
       this.tableHeading += `<tr><td colspan="4" style="padding-left: 25px; text-align:justify;"><table  cellpadding="0" cellspacing="0" width="100%"></td><tr><td class="no" style="word-wrap: break-word;width: 60px !important;">${reportData.jr_detail}</td></tr></table>`;
       this.tableHeading += '<tr>';
       this.tableHeading += '<td>';
       this.tableHeading += '<table  id="tblHistory" cellpadding="0" cellspacing="0" width="100%">';
       this.tableHeading += '<tr>';
       this.tableHeading += '<td style="text-align: left; font-weight: bold; font-size: large">Revision History : -</td>';
       this.tableHeading += '</tr>';
       this.tableHeading += '<tr>';
       this.tableHeading += '<td>';
       this.tableHeading += '<table  cellpadding="0" cellspacing="0" width="100%" border="true">';
       this.tableHeading += '<tr>';
       this.tableHeading += '<td colspan="2" style="white-space: normal;text-align: center;">Revision Detail</td>';
       this.tableHeading += '<td rowspan="2" style="white-space: normal;text-align: center;">Supersede No.</td>';
       this.tableHeading += '<td rowspan="2" style="word-wrap: break-word;text-align: center;">Reason For Revision</td>';
       this.tableHeading += '</tr>';
       this.tableHeading += '<tr>';
       this.tableHeading += '<td style="white-space: normal;text-align: center;">Revision No.</td>';
       this.tableHeading += '<td style="white-space: normal;text-align: center;">Effective date</td>';
       this.tableHeading += '</tr>';
       let newRows1='';
      let gData:any;
       this.httpService.JRRevisionHistoryPrint(this.empcd).subscribe(resData=>{
          if(resData.response==-1)
          {
            this.errorMsg=resData.responseMsg;
           // return;
          }
          resData.responseObjectList.forEach(reportData1=>{
            newRows1 +='<tr>';
            newRows1 +=  `<tr><td style="white-space: initial;text-align: center;"> ${reportData1.revision_no}</td>`;
            newRows1 +=  `<td style="white-space: initial;text-align: center;"> ${reportData1.revision_date}</td>`;
            newRows1 += `<td style="white-space: initial;text-align: center;"> ${reportData1.supersede_no}</td>`;
            newRows1 += `<td style="white-space: initial;text-align: left;"> ${reportData1.reason}</td>`;
            newRows1 +='</tr>'; 
          });
          
          this.tableHeading += newRows1
       this.tableHeading += '</table>';                                       
       this.tableHeading += '</td>';
       this.tableHeading += '</tr>';
       this.tableHeading += '</table>';                          
       this.tableHeading += '</td>';
       this.tableHeading += '</tr>';
       this.tableHeading += '</td>';
       this.tableHeading += '<tr><td>&nbsp;&nbsp;</td></tr>';
       this.tableHeading += '</table>';
       //<!------------------------End------------------------------>
       this.tableHeading += '</div>';
       this.tableHeading += '</td>';
       this.tableHeading += '</tr>'; 
       this.tableHeading += '</tbody>';
       this.tableHeading += '<tfoot>';
       this.tableHeading += '<tr>';
       this.tableHeading += '<td>';
       //<!--place holder for the fixed-position footer-->
       this.tableHeading += '<div class="page-footer-space"></div>';
      //<!------------------------End-------------------------------->
      this.tableHeading += '</td>';
      this.tableHeading += '</tr>';
      this.tableHeading += '</tfoot>';
      this.tableHeading += '</table>';
      //<!------------------------End-------------------------------->

      //<!----------------------Footer Section----------------------->
      this.tableHeading += '<div class="page-footer" style="width:100%;">';
      this.tableHeading += '<table  cellpadding="0" cellspacing="0" width="100%" border="true">';
      this.tableHeading += '<tr><td>Prepared By:</td><td>Acknowledged By:</td><td>Verified By HOD:</td><td>Approved by HRM:</td></tr>';
      this.tableHeading += '<tr style="line-height:30px;">';
      
      this.httpService.getJRContents(this.jrId.toString()).subscribe(objFinal=>{
        if(objFinal.response==-1)
        {
          this.errorMsg=objFinal.responseMsg;
          return;
        }
        let objemp_cd = (objFinal.responseObject.emp_cd==null)?"" : objFinal.responseObject.emp_cd;
        let objemp_nm = (objFinal.responseObject.emp_nm==null)? "" : objFinal.responseObject.emp_nm;
        let objemp_app_dt = (objFinal.responseObject.Emp_app_dt==null)? "" : objFinal.responseObject.Emp_app_dt;
        let objEmp_att_tm = (objFinal.responseObject.Emp_att_tm==null)? "" : objFinal.responseObject.Emp_att_tm;
        let objfinalapp_id = (objFinal.responseObject.finalapp_id==null)? "" : objFinal.responseObject.finalapp_id;
        let objfinalapp_nm = (objFinal.responseObject.finalapp_nm==null)? "" : objFinal.responseObject.finalapp_nm;
        let objfinalapp_dt = (objFinal.responseObject.finalapp_dt==null)? "" : objFinal.responseObject.finalapp_dt;
        let objfinalapp_tm = (objFinal.responseObject.finalapp_tm==null)? "" : objFinal.responseObject.finalapp_tm;
        let objhr_finalapp_id = (objFinal.responseObject.hr_finalapp_id==null)? "" : objFinal.responseObject.hr_finalapp_id;
        let objhr_finalapp_nm = (objFinal.responseObject.hr_finalapp_nm==null)? "" : objFinal.responseObject.hr_finalapp_nm;
        let objhr_finalapp_dt = (objFinal.responseObject.hr_finalapp_dt==null)? "" : objFinal.responseObject.hr_finalapp_dt;
        let objhr_finalapp_tm = (objFinal.responseObject.hr_finalapp_tm==null)? "" : objFinal.responseObject.hr_finalapp_tm;
        let objprepapp_id = (objFinal.responseObject.prepapp_id==null)? "" : objFinal.responseObject.prepapp_id;
        let objprepapp_nm = (objFinal.responseObject.prepapp_nm==null)? "" : objFinal.responseObject.prepapp_nm;
        let objprepapp_dt = (objFinal.responseObject.prepapp_dt==null)? "" : objFinal.responseObject.prepapp_dt;   
        let objprepapp_tm = (objFinal.responseObject.prepapp_tm==null)? "" : objFinal.responseObject.prepapp_tm;

        let prepapp_dt:string="";let _prepapp_dt:string=""; let prepapp_tm:string="";
        let empapp_dt:string="";let _empapp_dt:string=""; let empapp_tm:string="";
        let hr_finalapp_dt:string="";let _hr_finalapp_dt:string=""; let hr_finalapp_tm:string="";
        let finalapp_dt:string="";let _finalapp_dt:string=""; let finalapp_tm:string="";

        if(objprepapp_dt!="")
        {
            _prepapp_dt = this.Convert_DateInStringFormat1(objprepapp_dt);
            prepapp_tm= objprepapp_tm;
        }
        if(objemp_app_dt!="")
        {
            _empapp_dt = this.Convert_DateInStringFormat1(objemp_app_dt);
            empapp_tm= objEmp_att_tm;
        }
        if(objhr_finalapp_dt!="")
        {
            _hr_finalapp_dt = this.Convert_DateInStringFormat1(objhr_finalapp_dt);
            hr_finalapp_tm=objhr_finalapp_tm;
        }
        if(objfinalapp_dt!="")
        {
            _finalapp_dt = this.Convert_DateInStringFormat1(objfinalapp_dt);
            finalapp_tm= objfinalapp_tm;
        }

        if (objprepapp_nm !="" && prepapp_tm !="") {
          this.tableHeading += `<td id="tdPrep" style="white-space: initial;"><img src="../../../../assets/Images/Chk.png" style="width:63px;position:relative;margin-bottom: -36px;opacity: 0.4;margin-left: 61px;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td>${objprepapp_nm} : ${objprepapp_id}</td></tr><tr><td>${_prepapp_dt} ${prepapp_tm}</td></tr></table></td>`;
        }
        else 
        {
          this.tableHeading += '<td id="tdPrep" style="white-space: initial;"><table  cellpadding="0" cellspacing="0" width="100%"><tr><td></td></tr><tr><td></td></tr></table></td>';
        }

        if (objemp_nm !="" && empapp_tm !="") {
          this.tableHeading += `<td id="tdAck" style="white-space: initial;"><img src="../../../../assets/Images/Chk.png" style="width:63px;position:relative;margin-bottom: -36px;opacity: 0.4;margin-left: 61px;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td>${objemp_nm} : ${objemp_cd}</td></tr><tr><td>${_empapp_dt} ${empapp_tm}</td></tr></table></td>`;
        }
        else 
        {
          this.tableHeading += '<td id="tdAck" style="white-space: initial;"><table  cellpadding="0" cellspacing="0" width="100%"><tr><td></td></tr><tr><td></td></tr></table></td>';
        }

        if (objfinalapp_nm !="" && finalapp_tm !="") {
          this.tableHeading += `<td id="tdHOD" style="white-space: initial;"><img src="../../../../assets/Images/Chk.png" style="width:63px;position:relative;margin-bottom: -36px;opacity: 0.4;margin-left: 61px;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td>${objfinalapp_nm} : ${objfinalapp_id}</td></tr><tr><td>${_finalapp_dt} ${finalapp_tm}</td></tr></table></td>`;
        }
        else 
        {
          this.tableHeading += '<td id="tdHOD" style="white-space: initial;"><table  cellpadding="0" cellspacing="0" width="100%"><tr><td></td></tr><tr><td></td></tr></table></td>';
        }

        if (objhr_finalapp_nm !="" && hr_finalapp_tm !="") {
          this.tableHeading += `<td id="tdHOD" style="white-space: initial;"><img src="../../../../assets/Images/Chk.png" style="width:63px;position:relative;margin-bottom: -36px;opacity: 0.4;margin-left: 61px;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td>${objhr_finalapp_nm} : ${objhr_finalapp_id}</td></tr><tr><td>${_hr_finalapp_dt} ${hr_finalapp_tm}</td></tr></table></td>`;
        }
        else 
        {
          this.tableHeading += '<td id="tdHOD" style="white-space: initial;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td></td></tr><tr><td></td></tr></table></td>';
        }
        this.tableHeading += '</tr>';
        this.tableHeading += '</table>';
        this.tableHeading += '<div style="text-align: Left;">Rev. # 04 (Effective date: 15.04.2023)</div>';
        this.tableHeading += '</div>';
        //<!------------------------End-------------------------------->     
        this.printService.confirm("Indivisual Job Responsibilities",this.tableHeading,"Print","Cancel");

      });
     


      });
      
    });
  }



  

  btnexit_click(){
    this.router.navigate(['app/dashboard']);
  } 

  geEncryptTag():any{
    return new Promise((resolve, reject) => {
      let encStr = (this.actRoute.snapshot.params['tag']==null)?0:  this.actRoute.snapshot.params['tag'];
      if(encStr!=0){
        this.httpService.decryptQueryString(encStr.toString()).subscribe(response=>{resolve(response);})
      }
    });
  }

  Convert_DateInStringFormat(dt:any): string
  {
      // var formatted_date = "";
      // if (dt == null || dt == "") return formatted_date;
      // var date = dt.split()   new Date().getDate().toString();  
      // var month = new Date().getMonth().toString() + 1; 
      // var year = Math.abs(new Date().getFullYear());
      // if ( parseInt(month) < 10) {   month = '0' + month; }
      // if (parseInt(date) < 10) {   date = '0' + date; }
      // var formatted_date = date + "/" + month + "/" + year;
      // return formatted_date;
      var d = dt.split("/");
      var month = parseInt(d[1]).toString();
      var date = parseInt(d[0]).toString();
      var year =Math.abs(d[2]).toString();
      if (parseInt(month)  < 10) {   month = '0' + month; }
      if (parseInt(date)  < 10) {   date = '0' + date; }
      var formatted_date = month + "/" + date + "/" + year;
      return formatted_date;     
  }

  Convert_DateInStringFormat1(dt:any): string
  {
      var formatted_date = "";
      if (dt == null || dt == "") return formatted_date;
      var date = new Date().getDate().toString();  
      var month = (new Date().getMonth() + 1).toString(); 
      var year = Math.abs(new Date().getFullYear());
      if ( parseInt(month) < 10) {   month = '0' + month; }
      if (parseInt(date) < 10) {   date = '0' + date; }
      var formatted_date = date + "/" + month + "/" + year;
      return formatted_date;   
  }
  


  private retrieve() {
    var usermeta:string |null;
    usermeta = sessionStorage.getItem('usermeta');
    if(!usermeta) throw 'no token found';
    return usermeta;
  }

  drpDepartment_IndexChange(event: any)  {
    this.selJrDepartment= event.target.value;
    if(this.selJrDepartment!="")
    {
      var empcd:string;
      empcd =JSON.parse(this.retrieve()).empcd;
      this.httpService.getEmployeeforJREntry(this.selJrDepartment.toString().trim(), empcd).subscribe(data=>{
        if(data.response==-1){
          this.errorMsg=data.responseMsg;
          return;
        }
        this.JrEmployee= data.responseObjectList;
      });
    }
  }

    
  drpEmployee_IndexChange(event:any) {
    this.selJrEmployee=event.target.value;
    if (this.selJrEmployee!="")
    {
      this.getJRDetail(this.selJrDepartment.toString().trim(),this.selJrEmployee.toString().trim());
    }
  }

  getJRDetail(deptcd:string,empcd:string){
    this.httpService.GetEmployeeDetail(empcd).subscribe(data=>{
      if(data.response==-1){
        this.errorMsg=data.responseMsg;
        return;
      }
      this.objprpemployeedetail= data.responseObject ;
      this.jrEmployeeForm.controls['dept_cd'].setValue(this.objprpemployeedetail.dept_cd);
      this.jrEmployeeForm.controls['dept_nm'].setValue(this.objprpemployeedetail.dept_nm);
      this.jrEmployeeForm.controls['emp_nm'].setValue(this.objprpemployeedetail.emp_nm);
      this.jrEmployeeForm.controls['emp_cd'].setValue(this.objprpemployeedetail.emp_cd);
      this.jrEmployeeForm.controls['desig_cd'].setValue(this.objprpemployeedetail.desig_cd);
      this.jrEmployeeForm.controls['desig_nm'].setValue(this.objprpemployeedetail.desig_nm);
      this.jrEmployeeForm.controls['doj'].setValue(this.objprpemployeedetail.dt_join);
      this.jrEmployeeForm.controls['catg_cd'].setValue(this.objprpemployeedetail.catg_cd);
      this.jrEmployeeForm.controls['catg_nm'].setValue(this.objprpemployeedetail.catg_nm);
    

      this.span_Departmentcd=this.jrEmployeeForm.get('dept_cd')?.value as string;
      this.span_Designationcd=this.jrEmployeeForm.get('desig_cd')?.value as string;
      this.span_CategoryCd=this.jrEmployeeForm.get('catg_cd')?.value as string;
      this.span_Categorynm=this.jrEmployeeForm.get('catg_nm')?.value as string;
      this.span_ID=this.jrEmployeeForm.get('Id')?.value as string;

      let hdr_id:string = (this.span_ID.toString()=="")?"0":  this.span_ID.toString();

      $(".summernote").summernote('code','');

      this.httpService.GetJRHdr(empcd,this.jrEmployeeForm.get('dept_cd')?.value as string,this.jrEmployeeForm.get('desig_cd')?.value as string,hdr_id as string).subscribe(res_jr=>{
        if(res_jr.response==-1)
        {
          this.errorMsg=res_jr.responseMsg;
          return;
        }
        this.objprpjrhdr=res_jr.responseObject;
        const EntryExists=this.objprpjrhdr.EntryExists;
        if(EntryExists==0)
        {
          this.confirmationDialogService.confirm('Please confirm..', 'JR Data not Found for this Employee. Do you want to get the JR Detail from same Designation Employee within Same Department?')
          .then((confirmed) => this.ConfirmDialog(this.objprpjrhdr)
          )
          .catch(() => alert("error")
          );
          this.jrEmployeeForm.controls['revision_no'].setValue(this.objprpjrhdr.revision_no);
          this.jrEmployeeForm.controls['supersede_no'].setValue(this.objprpjrhdr.supersede_no);
          this.jrEmployeeForm.controls['revision_date'].setValue(this.objprpjrhdr.revision_date);    
          this.jrEmployeeForm.controls['reason'].setValue(this.objprpjrhdr.reason);      
          this.jrEmployeeForm.controls['Id'].setValue(this.objprpjrhdr.f_hdr_id);  
          this.span_ID=this.objprpjrhdr.f_hdr_id ;
        }
        else
        {
          this.jrEmployeeForm.controls['jr_detail'].setValue(this.objprpjrhdr.jr_detail);
          $(".summernote").summernote('code',this.objprpjrhdr.jr_detail); 
          if($("[id*=btnSave]").is(":disabled"))
          {
            this.jrEmployeeForm.controls['revision_no'].setValue(this.objprpjrhdr.revision_no);
            this.jrEmployeeForm.controls['supersede_no'].setValue((this.objprpjrhdr.supersede_no.toString()=="-1")?"Nil" : this.objprpjrhdr.supersede_no.toString());
          }
          else
          {
            this.jrEmployeeForm.controls['revision_no'].disable();
            this.jrEmployeeForm.controls['supersede_no'].disable();
            this.jrEmployeeForm.controls['revision_no'].setValue(parseInt(this.objprpjrhdr.revision_no)+1);
            this.jrEmployeeForm.controls['supersede_no'].setValue( parseInt((this.objprpjrhdr.supersede_no as string=="Nil")?"-1" : this.objprpjrhdr.supersede_no.toString())+1);          
          }
          this.jrEmployeeForm.controls['revision_date'].setValue(this.objprpjrhdr.revision_date);  
          this.jrEmployeeForm.controls['reason'].setValue(this.objprpjrhdr.reason); 
          this.jrEmployeeForm.controls['Id'].setValue(this.objprpjrhdr.f_hdr_id);  
          this.span_ID=this.objprpjrhdr.f_hdr_id ;                  
        }
        this.httpService.getJRRevision(empcd).subscribe(res=>{
          if(res.response==-1){
            this.errorMsg=res.responseMsg;
            return;
          }
          this.revisionDetail=res.responseObjectList;
        });
 
      });
    });
  }

  ConfirmDialog(obj:any){
    if (obj.jr_detail != "") 
    {
            this.jrEmployeeForm.controls['jr_detail'].setValue(obj.jr_detail);
            $(".summernote").summernote('code',obj.jr_detail);
    }
    else 
    {
        this.toastr.showError("JR Detail not Found","")
    }
  }


}


