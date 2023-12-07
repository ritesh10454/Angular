import { Component, Inject } from '@angular/core';
//import { FormGroup, FormControl, Validators, FormBuilder, FormsModule,AbstractControl, }  from '@angular/forms';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Observable } from "rxjs";
import { JRService } from '../../Core/Services/jr.service';
import { IUsers,IQueryResonse } from "src/app/Entities/imenu";
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public LoginForm!:FormGroup;
  private _userData!:Observable<IQueryResonse<IUsers>>;
  errorMsg!:string;

  constructor(private _httpService:JRService,private router:Router,public formBuilder:FormBuilder, @Inject(DOCUMENT) private document:Document) { }
  ngOnInit(): void {
    this.LoginForm=   this.formBuilder.group({
      txtusrnam:['',Validators.required],
      txtusrpwd:['',Validators.required]
    });
    // this.LoginForm= new FormGroup({
    //   txtusrnam:new FormControl('',[Validators.required]),
    //   txtusrpwd:new FormControl('',[Validators.required])
    // });


   // this.document.body.classList.add("loginbody");
   this.document.body.style.setProperty('height','100%');
   this.document.body.style.setProperty('background-repeat',' no-repeat');
   this.document.body.style.setProperty('background-image','linear-gradient(rgb(104, 145, 162), rgb(12, 97, 33))');
  }

  // getuserData(usercd:string,password:string) {
  //   this.clearData();
  //   this._userData= this._httpService.getLogin(usercd,password);
  //   this._userData.subscribe(data=>{
  //     if (data.response==-1){        
  //       this.errorMsg=data.responseMsg;
  //     }
  //     data.responseObject.empcd=usercd;
  //     var mData=data.responseObject;
  //     sessionStorage.setItem('usermeta' , JSON.stringify(data.responseObject));
  //     this.router.navigate(['app/dashboard']);
  //     // this.router.navigate(['component/menu/jrinbox'])
  //   });
  
  // }
  
  onSignIn(){
    this.clearData();
    const login=this.LoginForm.value;  
    this.errorMsg="";
    //this.getuserData(login.txtusrnam,login.txtusrpwd);
    this._userData= this._httpService.getLogin(login.txtusrnam,login.txtusrpwd);
    this._userData.subscribe(data=>{
      if (data.response==-1){        
        this.errorMsg=data.responseMsg;
        return;
      }
      data.responseObject.empcd=login.txtusrnam;
      var mData=data.responseObject;
      sessionStorage.setItem('usermeta' , JSON.stringify(data.responseObject));
      this.router.navigate(['app/dashboard']);
    });
  }
  
  clearData() {
    this._userData!=null;
    localStorage.clear();
  }

}