export interface IMenu {
    Roles:string,
    emp_cd:string,
    emp_nm:string,
    MenuId:string,
    Title:string,
    Url:string,
    icon:string,
    submenus:IMenu[]
}

export interface IQueryResonse<T>{
    CheckID:number,
    currentMivNo:number,
    preStock:number,
    response:number,
    responseMsg:string,
    responseObject:T,
    TotalRecords:number,
    empcd:string,
    empnm:string,
    outres:number,
    token:string,
    responseObjectList:T[],
    responseSet:string,
    responseTableList:string
    slipNo:number
}

export interface IUsers {
    TotalRecords: number,
    empcd: string,
    empnm:string,
    outres:string,
    token:string
}

export interface IJR_Dashboard
{
    JR_count:number,
    tabname:string,
    url:string,
    color:string,
    angularUrl:string
}

export interface IDepartment{
    dept_cd:string,
    dept_nm:string,
    empcd:string
}

export interface IEmployee
{
    emp_cd:string,
    emp_nm:string
}

export interface IJRHdr
{
    TotalRecords:string,
    move:string,
    sta:string,
    tra:string,
    btnaction:string,
    btnsave:string,
    RoleId:string,
    EntryExists:string,
    firstapp_id:string,
    firstapp_nm:string,
    firstapp_dt:string,
    firstapp_tm:string,
    finalapp_id:string,
    finalapp_nm:string,
    finalapp_dt:string,
    finalapp_tm:string,
    hr_finalapp_id:string,
    hr_finalapp_nm:string,
    hr_finalapp_dt:string,
    hr_finalapp_tm:string,
    prepapp_id:string,
    prepapp_nm:string,
    prepapp_dt:string,
    prepapp_tm:string,
    emp_cd:string,
    emp_nm:string,
    Emp_app_dt:string,
    Emp_att_tm:string,
    dept_cd:string,
    dept_nm:string,
    desig_cd:string,
    desig_nm:string,
    catg_cd:string,
    catg_nm:string,
    doj:string,
    revision_no:string,
    revision_date:string,
    supersede_no:string,
    reason:string,
    jr_detail:string,
    isCurrent:string,
    f_hdr_id:string,
    Id:string,
    userpass:string,
    luserId:string
}

export interface IEmployeeDetail
{
    emp_cd:string,
    emp_nm:string,
    dept_cd:string,
    dept_nm:string,
    desig_cd:string,
    desig_nm:string,
    catg_cd:string,
    catg_nm:string,
    dt_join:string
}

export interface IJRInbox
{
    Id:number,
    emp_cd:string,
    emp_nm:string,
    Dept_Cd:string,
    Dept_Nm:string,
    Desig_Nm:string,
    final_auth_cd_dept:string,
    final_auth_cd_hr:string
}

export interface PRP_JRHdr
{
    Department:string,
    Employee:string,
    btnsave:string,
    catg_cd:string,
    catg_nm:string,
    dept_cd:string,
    dept_nm:string,
    desig_cd:string,
    desig_nm:string,
    doj:string,
    emp_cd:string,
    emp_nm:string,
    isCurrent:string,
    jr_detail:string,
    luserId:string,
    reason:string,
    revision_date:string,
    revision_no:string,
    supersede_no:string
}


export interface IJRLogin
{
    comp_cd:string,
    locn_cd:string,
    emp_cd:string,
    dept_cd :string,
    present:string,
    userpass :string,
    dec_userpass:string,
    enc_userpass:string,
    start_date :string,
    end_date:string,
    outres :string
}

export interface IJRRole
{
    emp_cd:string,
    emp_nm:string,
    RoleId:number,
    Roles:string
}

export interface IJRAccessRights
{
    accessRights:string,
    isAdmin:boolean,
    isHR:boolean,
    isFinalAuth:boolean,
    isFirstAuth:boolean,
    isUser:boolean
}
