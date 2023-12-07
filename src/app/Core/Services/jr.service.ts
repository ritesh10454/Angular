import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, lastValueFrom, Observable,Subject,throwError  } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { IQueryResonse,IUsers,IMenu,IJR_Dashboard, IDepartment,IEmployee, IJRHdr, IEmployeeDetail, IJRInbox, PRP_JRHdr, IJRLogin,IJRRole, IJRAccessRights } from 'src/app/Entities/imenu';

@Injectable({
  providedIn: 'root'
})
export class JRService {
 //API_URL='http://192.168.9.191:1007/JRService';
 //API_URL='http://localhost:63133/JRService';


API_URL='http://localhost:52771/api/JR';
 //API_URL='http://localhost:62818/Service1';
  httpOptions= {headers: new HttpHeaders({'Content-Type':'application/json'})};


  constructor(private _httpClient:HttpClient) { }
 
  getJRMenus(usercd:string):Observable<IMenu[]>{
    return  this._httpClient.get<IMenu[]>(`${this.API_URL}/JRMenusAngular/${usercd}`);
  }

  getLogin(usercd:string,password:string):Observable<IQueryResonse<IUsers>>{
    return this._httpClient.get<IQueryResonse<IUsers>>(`${this.API_URL}/CheckLogin/${usercd}/${password}`);
  }

  getWelcomeMessage(usercd:string): Observable<IQueryResonse<IUsers>>{
    return this._httpClient.get<IQueryResonse<IUsers>>(`${this.API_URL}/WelcomeMessage/${usercd}`);
  }

  getJRDashboard(usercd:string):Observable<IJR_Dashboard[]>{
    return this._httpClient.get<IJR_Dashboard[]>(`${this.API_URL}/DashboardTabs/${usercd}`);
  }

  getDepartment(usercd:string):Observable<IQueryResonse<IDepartment>>{
    return this._httpClient.get<IQueryResonse<IDepartment>>(`${this.API_URL}/DepartmentList/${usercd}`);
  }

  getEmployeeforJREntry(deptcd:string,usercd:string):Observable<IQueryResonse<IEmployee>>{
    return this._httpClient.get<IQueryResonse<IEmployee>>(`${this.API_URL}/EmployeeforJREntry/${deptcd}/${usercd}`);
  }

  getJRLists(usercd:string,tag:number):Observable<IQueryResonse<IJRHdr>>{
    return this._httpClient.get<IQueryResonse<IJRHdr>>(`${this.API_URL}/JRLists/${usercd}/${tag}`);
  }

  GetEmployeeDetail(usercd:string):Observable<IQueryResonse<IEmployeeDetail>>{
    return this._httpClient.get<IQueryResonse<IEmployeeDetail>>(`${this.API_URL}/EmployeeDetail/${usercd}`);
  }

  GetJRHdr(empcd:string,deptcd:string,designcd:string,JRId:string):Observable<IQueryResonse<IJRHdr>>{
    return this._httpClient.get<IQueryResonse<IJRHdr>>(`${this.API_URL}/JRHdr/${empcd}/${deptcd}/${designcd}/${JRId}`);
  }

  getJRRevision(empcd:string):Observable<IQueryResonse<IJRHdr>>{
    return this._httpClient.get<IQueryResonse<IJRHdr>>(`${this.API_URL}/JRRevision/${empcd}`);
  }

  getDepartmentList(empcd:string):Observable<IQueryResonse<IDepartment>>{
     return this._httpClient.get<IQueryResonse<IDepartment>>(`${this.API_URL}/DepartmentList/${empcd}`);
  }

  getDepartmentListtoFirstAuthority(empcd:string):Observable<IQueryResonse<IDepartment>>{
    return this._httpClient.get<IQueryResonse<IDepartment>>(`${this.API_URL}/FirstAuthorityDepartmentList/${empcd}`);
  }

  decryptQueryString(str:string):Observable<string>{
    return this._httpClient.get<string>(`${this.API_URL}/DecryptString/${str}`);
  }

  encryptQueryString(str:string):Observable<string>{
    return this._httpClient.get<string>(`${this.API_URL}/EncryptString/${str}`);
  }

  getJRAccessrights():Observable<IQueryResonse<IJRAccessRights>>{
    return this._httpClient.get<IQueryResonse<IJRAccessRights>>(`${this.API_URL}/JRAccessRights`);
  }
  
  getJRRole():Observable<IQueryResonse<IJRRole>>{
    return this._httpClient.get<IQueryResonse<IJRRole>>(`${this.API_URL}/JRRoles`);
  }

  getEmployee(deptcd:string):Observable<IQueryResonse<IEmployee>>{
    return this._httpClient.get<IQueryResonse<IEmployee>>(`${this.API_URL}/Employee/${deptcd}`);
  }

  getJRContents(id:string):Observable<IQueryResonse<IJRHdr>>{
    return this._httpClient.get<IQueryResonse<IJRHdr>>(`${this.API_URL}/JRContents/${id}`);
  }

  GetJRInbox(empcd:string):Observable<IQueryResonse<IJRInbox>>{
    return this._httpClient.get<IQueryResonse<IJRInbox>>(`${this.API_URL}/JRInbox/${empcd}`);
  }
  
  getJROutBox(empcd:string):Observable<IQueryResonse<IJRInbox>>{
    return this._httpClient.get<IQueryResonse<IJRInbox>>(`${this.API_URL}/JROutBox/${empcd}`);
  }

  checkJRAuth(empcd:string):Observable<IQueryResonse<IEmployee>>{
    return this._httpClient.get<IQueryResonse<IEmployee>>(`${this.API_URL}/checkJRAuth/${empcd}`);
  }

  checkPassword(empcd:string,pass:string):Observable<IQueryResonse<IJRLogin>>{
    return this._httpClient.get<IQueryResonse<IJRLogin>>(`${this.API_URL}/checkPassword/${empcd}/${pass}`);
  }

  UpdatePassword(jrPassword:IJRLogin):Observable<IQueryResonse<IJRLogin>>{
   //let body=JSON.stringify(jrPassword);
    const url=`${this.API_URL}/UpdatePassword`;
    return this._httpClient.put<IQueryResonse<IJRLogin>>(url,jrPassword,this.httpOptions);
  }

  checkDuplicate(empcd:string):Observable<IQueryResonse<string>>{
    return this._httpClient.get<IQueryResonse<string>>(`${this.API_URL}/checkDuplicate/${empcd}`);
  }

  SaveJREntry(JrEmployee:PRP_JRHdr):Observable<IQueryResonse<PRP_JRHdr>>{
    const url=`${this.API_URL}/SaveJREntry`;
    return this._httpClient.post<IQueryResonse<PRP_JRHdr>>(url,JrEmployee,this.httpOptions);
  }

  JRReportPrint(empcd:string):Observable<IQueryResonse<PRP_JRHdr>>{
    return this._httpClient.get<IQueryResonse<PRP_JRHdr>>(`${this.API_URL}/JRReportPrint/${empcd}`);
  }

  JRRevisionHistoryPrint(empcd:string):Observable<IQueryResonse<PRP_JRHdr>>{
    return this._httpClient.get<IQueryResonse<PRP_JRHdr>>(`${this.API_URL}/JRRevisionHistoryPrint/${empcd}`);
  }
  private extractData(res: any) 
  {
    let body = res;
    return body;
  }

  private handleErrorObservable(error: any) 
  {
      console.error(error.message || error);
      return throwError(error);
  }
}