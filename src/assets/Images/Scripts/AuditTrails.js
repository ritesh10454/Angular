var PRP_Department_List;
var table;
Timer();

var $ = jQuery.noConflict();

$(document).ready(function () {
    ChangeBreadCrumb("Report", "JR Audit Trails", "Report");
     $("#issueBody").addClass("sidebar-collapse");
    changeDate();
    userDetail();
});

function Timer() {
    var currdt = new Date();
    $("#txtTime").val(formatAMPM1(currdt));
    setTimeout(Timer, 500);
}

function changeDate() {
    var currdt = new Date();
    var mth = (currdt.getMonth()+1);
    var dy = currdt.getDate();
    var yr =Math.abs(currdt.getFullYear());
    if (mth < 10) {   mth = '0' + mth; }
    if (dy < 10) {   dy = '0' + dy; }
    var dt =mth + '/' + dy + '/' + yr;
    $("#txtDate").val(dy + '/' + mth + '/' + yr);
    $("[id*=hdfDate]").val(ChangeDateFormat(dt));
    $("#txtFroDat").val(dy + '/' + mth + '/' + yr);
    $("#txtToDat").val(dy + '/' + mth + '/' + yr);
}



function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function formatAMPM1(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var strTime = hours + ':' + minutes + ':' + seconds 
    return strTime;
}




function ChangeDateFormat(dt) {
    var formatted_date = "";
    if (dt == null || dt == "") return formatted_date;
    var d = new Date(dt);
    var month = d.getMonth();
    var date = d.getDate();
    var year =Math.abs(d.getFullYear());
    if (month < 10) {   month = '0' + month; }
    if (date < 10) {   date = '0' + date; }
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    // let current_datetime = new Date()
    var formatted_date = date + "-" + months[parseInt(month)] + "-" + year;
    return formatted_date;
}

String.format = function () {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
}


 $(".datepicker").datepicker({
    dateFormat: "dd-mm-yy",     // SET THE FORMAT.
    changeMonth: true,
    changeYear: true,
    yearRange: '1950:2100',
    inline: true,
    showAnim: 'fadeIn',
    showButtonPanel: true,
    closeText: 'Clear',
    beforeShow: function (input) 
	{
        setTimeout(function () 
		{
            var clearButton = $(input)
            .datepicker("widget")
            .find(".ui-datepicker-close");
            clearButton.unbind("click").bind("click", function () { $.datepicker._clearDate(input); });
        }, 1);
    },
    onClose: function (e) 
	{
		var ev = window.event;
		if (ev.srcElement.innerHTML == 'Clear')
		{
			this.value = "";
		}
    },
    closeText: 'Clear',
});


function DateInYYYYMMDD(date) 
{
    var dateOut = date.split(/[/,-]/); //  (/[!,?,/,-,.]/);  //    .toString().split("/").split("-");
    var resultDate = new Date(dateOut[2] + "/" + dateOut[1] + "/" + dateOut[0]);
    return resultDate; 
}


//-----------Department Dropdown Change Event--------------------//
async function drpDepartment_IndexChange()
{
    var ErrMsg=null;
    $(".loader").fadeIn();
    try
    {
        var ucd = await getSessionVariables();
        if (ucd.length == 0)
        {
            $("[id*=lblMessage]").text("Session is Expired , Please Login Again").css('color', '#ff0000'); // Red color 
            toastr.success( "Session is Expired , Please Login Again", {timeOut: 1000});
            setTimeout(window.location.href = "Account/Login.aspx", 10000);
        }

        if ($("[id*=drpdep] option:Selected").val() != "" )
        {            
            var res =await getEmployee($("[id*=drpdep] option:Selected").val());
            if (res.response == -1) {
                ErrMsg =(res.responseMsg);
                throw ErrMsg;
            }
            var objprpemployee= res.responseObjectList;

            var Employee=null; Employee ='<option value="0">--Select--</option>'
            $.each(objprpemployee,function(){
                Employee += '<option value="'+this["emp_cd"]+'">'+this["emp_nm"]+' </option>';
            });
            $("[id*=drpEmp]").empty();
            $("[id*=drpEmp]").append(Employee);

        }
        else 
        {
            ErrMsg="Select department first";
            throw ErrMsg;
        }
    }
    catch (err) 
    {
     $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
      toastr.error(err, {timeOut: 200});
    }
    finally
    {
      $(".loader").fadeOut();
    }
}


function getEmployee(deptcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getEmployee",
            data: "{'vardeptcd' : '" + deptcd + "' }",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}

function getJRAuditTrailsList(empcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getJRAuditTrailsList",
            data: "{'empcd' : '" + empcd + "' }",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}


async  function userDetail()
{
    var ErrMsg=null;
    try {
        $(".loader").fadeIn();
	    var usercd= await  getSessionVariables();
	    if (usercd.length ==0)
	    {
		    $("[id*=lblMessage]").text("Session Expired").css('color', '#ff0000'); // Red color
		    toastr.error("Session Expired", {timeOut: 200});
		    setTimeout(window.location.href = "Account/Login.aspx", 10000);
		    return;
	    }
        if (usercd.length >0) 
        {
            $("#hdfempcd").val(usercd.toString().trim());
            if (usercd.toString().trim() != "HRMB")
            {
                var res =  await getEmployeeDetail(usercd.toString().trim());
                if (res.response ==-1) {
                    ErrMsg =(res.responseMsg);
                    throw ErrMsg;
                }
                var objempprp= res.responseObject;
                 $("#hdfempcd").val($("#hdfempcd").val().toString().trim());
                 $("#hdfempnam").val(objempprp.emp_nm.toString().trim());
                 $("#hdfdept").val(objempprp.dept_nm.toString().trim());
                 $("#hdfdesig").val(objempprp.desig_nm.toString().trim());
            }


        ///////////////////////
            $("[id*=hdfUserID]").val(usercd.toString());

            var itmData=null; var myData=null // itms.responseObjectList;
         //   var myData = await GetUserRole();
            var obj = await getAllList();
            if (obj.response ==-1) {
                ErrMsg=  obj.responseMsg;
			    throw ErrMsg;
            }
            var myObj = obj.responseObject;

            PRP_Department_List = myObj.Department;

            Department=null; Department ='<option value="0">--Select--</option>'
            $.each(PRP_Department_List,function(){
                Department += '<option value="'+this["dept_cd"]+'">'+this["dept_nm"]+' </option>';
            });
            $("[id*=drpdep]").empty();
            $("[id*=drpdep]").append(Department);
        //////////////////////
        } 
        else
        {
            setTimeout(window.location.href = "Account/Login.aspx", 10000);
        }  
    } 
    catch (err) 
    {
      $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
    }
    finally
    {
     $(".loader").fadeOut();
    }

 }
 

////////Button Click Events/////////////
function btnSelect_Click(ctl)
{
    var ErrMsg=null;
    try 
    {
      $(".loader").fadeIn();
        var mytag = 30; var mytag1 = 7;
        var row=$(ctl).closest("tr");  //.find('td')[1].textContent
        var rowIndex= row[0].sectionRowIndex;  //  rowIndex;
        var cols= row.find('td');
        var lblmivno = $(cols[3]).text();
        var lblmivdt =ChangeDateFormat($(cols[4]).text());
        var lblMivTyp = $(cols[5]).text();
        var lblempcd = $(cols[0]).text();
        var lblstatus = $(cols[6]).text();
        var strUrl = String.format("JREntry.aspx?mivno={0}&mivdt={1}&empcd={2}&mytag={3}&mytag1={4}&a_status={5}&invtyp={6}",lblmivno,lblmivdt,lblempcd,mytag,mytag1,lblstatus,lblMivTyp);
        setTimeout(window.location.href = strUrl, 10000);    

    } 
    catch (err) 
    {
       $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
    }
    finally
    {
      $(".loader").fadeOut();
    }
}

function DateFormat(dt) {
    var formatted_date = "";
    if (dt == null || dt == "") return formatted_date;
//    var d = new Date(dt);
    var d = dt.split("/");
    var month = parseInt(d[1]);
    var date = parseInt(d[0]);
    var year =Math.abs(d[2]);
    if (month < 10) {   month = '0' + month; }
    if (date < 10) {   date = '0' + date; }
    // let current_datetime = new Date()
    var formatted_date = date + "/" + month + "/" + year;
    return formatted_date;
}

function DateFormat1(dt)
{
    var formatted_date = "";
    if (dt == null || dt == "") return formatted_date;
    var d = new Date(dt);
    var date = d.getDate();
    var month = parseInt(d.getMonth())+1;
    var year = Math.abs(d.getFullYear());
    if (month < 10) {   month = '0' + month; }
    if (date < 10) {   date = '0' + date; }
    // let current_datetime = new Date()
    var formatted_date = date + "/" + month + "/" + year;
    return formatted_date;
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}




async function btnPrint_Click(ctl)
{
    var ErrMsg=null;
    try 
    {
      $(".loader").fadeIn();
        var mytag = 30; var mytag1 = 7;
        var row=$(ctl).closest("tr");  //.find('td')[1].textContent
        var rowIndex= row[0].sectionRowIndex;  //  rowIndex;
        var cols= row.find('td');
        var lblmivno = $(cols[3]).text();
        var lblempcd = $(cols[1]).text();
        var jrId= parseInt($(cols[4]).text());

        var newRows = "";
        var tot=0;
        var tableHeading ="";var tableFooter="";
        var myData = await GetJRReportPrint(lblempcd);
        if (myData.response == -1) {
            alert(myData.responseMsg);
        }
       var reportData= myData.responseObject;
       var  _doj =  DateFormat(reportData.doj);   



        tableHeading="";

        /////----------------Header Section-------------------//
        tableHeading += '<div class="page-header" style="text-align: center;width:100%;">';
        tableHeading += '<table cellpadding="0" cellspacing="0" width="100%"><tr><td colspan="4" style="text-align: center;"><span style="font-size:20px; font-weight:bold"><img src="Images/logo.JPG" style="height: 57px;" alt="" />IOL CHEMICALS AND PHARMACEUTICALES LIMITED</span></td></tr>';
        tableHeading += '<tr><td colspan="4"><table width="100%"><tr><td style="text-align:left;">Ref: HR/SOP/013</td><td style="text-align:right;">Doc # : HR/F/065</td></tr></table></td></tr>';
//        tableHeading += '<tr><td colspan="3" style="text-align: left; font-family: "Times New Roman";font-size:12px; font-weight: bold;">Ref: HR/SOP/013</td><td colspan="4" style="text-align: right; font-family: "Times New Roman";font-size:12px; font-weight: bold;">Doc # : HR/F/065</td></tr>';
        tableHeading += '</table>';
        tableHeading += '</div>';
        /////-----------------------End----------------------//



        /////----------------Detail Section------------------//
        tableHeading += '<table cellpadding="0" cellspacing="0" width="100%">';
        tableHeading += '<thead>';
        tableHeading += '<tr>';
        tableHeading += '<td>';
        //<!--place holder for the fixed-position footer-->
        tableHeading += '<div class="page-header-space"></div>';
        //<!------------------------End------------------->
        tableHeading += '</td>';
        tableHeading += '</tr>';
        tableHeading += '</thead>';
        tableHeading += '<tbody>';
        tableHeading += '<tr>';
        tableHeading += '<td>';
        tableHeading += '<div class="page">';
        //<!------------------Report Detail---------------------------->
        tableHeading += '<table cellpadding="0" cellspacing="0" width="100%">';
        tableHeading += '<tr>';
        tableHeading += '<td style="text-align: center; font-weight: bold; font-size:larger">INDIVIDUAL JOB RESPONSIBILITIES</td>';
        tableHeading += '</tr>';
        tableHeading += '<tr>';
        tableHeading += '<td style="text-align: left;font-family: "Times New Roman";font-size:12px; font-weight: bold; line-height:2.8 ">';
        tableHeading += '<table cellpadding="0" cellspacing="0" width="100%">';
        tableHeading += '<tr>';
        tableHeading += '<td>';
        tableHeading += String.format('<table cellpadding="0" cellspacing="0" width="100%" border="true"><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">NAME</td><td style="white-space: initial;">{0}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">DESIGNATION / GRADE</td><td style="white-space: initial;">{1}  / {2}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">E. CODE</td><td style="white-space: initial;">{3}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">DATE OF JOINING</td><td style="white-space: initial;">{4}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">DEPARTMENT</td><td colspan="3" style="white-space: initial;">{5}</td></tr></table>',reportData.emp_nm,reportData.desig_nm,reportData.catg_nm,reportData.emp_cd,_doj,reportData.dept_nm);
//        tableHeading += String.format('<table cellpadding="0" cellspacing="0" width="100%" border="true"><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">Name</td><td style="white-space: initial;">{0}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">Designation / Grade</td><td style="white-space: initial;">{1}  / {2}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">E. Code</td><td style="white-space: initial;">{3}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">Date of Joining</td><td style="white-space: initial;">{4}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">Department</td><td colspan="3" style="white-space: initial;">{5}</td></tr></table>',toTitleCase(reportData.emp_nm),toTitleCase(reportData.desig_nm),reportData.catg_nm,reportData.emp_cd,_doj,toTitleCase(reportData.dept_nm.split('-')[0]));
        tableHeading += '</td>';
        tableHeading += '</tr>';
        tableHeading += '<tr>';
        tableHeading += '<td style="text-align: left; font-weight: bold; font-size: large">Job Responsibilities : -</td></tr>';
        tableHeading += String.format('<tr><td colspan="4" style="padding-left: 25px;"><table cellpadding="0" cellspacing="0" width="100%"></td><tr><td class="no" style="white-space: initial;width: 60px !important;">{0}</td></tr></table>',reportData.jr_detail);
        tableHeading += '<tr>';
        tableHeading += '<td>';
        tableHeading += '<table id="tblHistory" cellpadding="0" cellspacing="0" width="100%">';
        tableHeading += '<tr>';
        tableHeading += '<td style="text-align: left; font-weight: bold; font-size: large">Revision History : -</td>';
        tableHeading += '</tr>';
        tableHeading += '<tr>';
        tableHeading += '<td>';
        tableHeading += '<table cellpadding="0" cellspacing="0" width="100%" border="true">';
        tableHeading += '<tr>';
        tableHeading += '<td colspan="2" style="white-space: normal;text-align: center;">Revision Detail</td>';
        tableHeading += '<td rowspan="2" style="white-space: normal;text-align: center;">Supersede No.</td>';
        tableHeading += '<td rowspan="2" style="white-space: normal;text-align: center;">Reason For Revision</td>';
        tableHeading += '</tr>';
        tableHeading += '<tr>';
        tableHeading += '<td style="white-space: normal;text-align: center;">Revision No.</td>';
        tableHeading += '<td style="white-space: normal;text-align: center;">Effective date</td>';
        tableHeading += '</tr>';
        var newRows1='';

        var myData = await GetJRRevisionHistoryPrint(lblempcd);
        if (myData.response == -1) {
            alert(myData.responseMsg);
        }
        var reportData1= myData.responseObjectList;
        for (var k = 0; k < reportData1.length; k++) 
        {
            newRows1 +='<tr>';
            newRows1 +=  '<tr><td style="white-space: initial;text-align: center;">' + reportData1[k].revision_no + '</td>';
            newRows1 +=  '<td style="white-space: initial;text-align: center;">' + reportData1[k].revision_date + '</td>';
            newRows1 += '<td style="white-space: initial;text-align: center;">' + reportData1[k].supersede_no + '</td>';
            newRows1 += '<td style="white-space: initial;text-align: left;">' + reportData1[k].reason + '</td>' ;
            newRows1 +='</tr>'; 
        }
        tableHeading += newRows1
        tableHeading += '</table>';                                       
        tableHeading += '</td>';
        tableHeading += '</tr>';
        tableHeading += '</table>';                          
        tableHeading += '</td>';
        tableHeading += '</tr>';
        tableHeading += '</td>';
        tableHeading += '<tr><td>&nbsp;&nbsp;</td></tr>';
        tableHeading += '</table>';
        //<!------------------------End-------------------------------->
        tableHeading += '</div>';
        tableHeading += '</td>';
        tableHeading += '</tr>'; 
        tableHeading += '</tbody>';
        tableHeading += '<tfoot>';
        tableHeading += '<tr>';
        tableHeading += '<td>';
        //<!--place holder for the fixed-position footer-->
        tableHeading += '<div class="page-footer-space"></div>';
        <!------------------------End------------------->
        tableHeading += '</td>';
        tableHeading += '</tr>';
        tableHeading += '</tfoot>';
        tableHeading += '</table>';

        /////-----------------------End----------------------//



        /////----------------Footer Section------------------//
        tableHeading += '<div class="page-footer" style="width:100%;">';
        tableHeading += '<table cellpadding="0" cellspacing="0" width="100%" border="true">';
        tableHeading += '<tr><td>Prepared By:</td><td>Acknowledged By:</td><td>Verified By HOD:</td><td>Approved by HR:</td></tr>';
        tableHeading += '<tr style="line-height:30px;">';
        objFinal=null;
        objFinal= await getJRContents(jrId);
        if (objFinal.response == -1) 
        {
            ErrMsg =(objFinal.responseMsg);
            throw ErrMsg;
        }
        var objemp_cd = isEmpty(objFinal.responseObject.emp_cd)?"" : objFinal.responseObject.emp_cd;
        var objemp_nm = isEmpty(objFinal.responseObject.emp_nm)?"" : objFinal.responseObject.emp_nm;
        var objemp_app_dt = isEmpty(objFinal.responseObject.Emp_app_dt)?"" : objFinal.responseObject.Emp_app_dt;
        var objEmp_att_tm = isEmpty(objFinal.responseObject.Emp_att_tm)?"" : objFinal.responseObject.Emp_att_tm;
        var objfinalapp_id = isEmpty(objFinal.responseObject.finalapp_id)?"" : objFinal.responseObject.finalapp_id;
        var objfinalapp_nm = isEmpty(objFinal.responseObject.finalapp_nm)?"" : objFinal.responseObject.finalapp_nm;
        var objfinalapp_dt = isEmpty(objFinal.responseObject.finalapp_dt)?"" : objFinal.responseObject.finalapp_dt;
        var objfinalapp_tm = isEmpty(objFinal.responseObject.finalapp_tm)?"" : objFinal.responseObject.finalapp_tm;
        var objhr_finalapp_id = isEmpty(objFinal.responseObject.hr_finalapp_id)?"" : objFinal.responseObject.hr_finalapp_id;
        var objhr_finalapp_nm = isEmpty(objFinal.responseObject.hr_finalapp_nm)?"" : objFinal.responseObject.hr_finalapp_nm;
        var objhr_finalapp_dt = isEmpty(objFinal.responseObject.hr_finalapp_dt)?"" : objFinal.responseObject.hr_finalapp_dt;
        var objhr_finalapp_tm = isEmpty(objFinal.responseObject.hr_finalapp_tm)?"" : objFinal.responseObject.hr_finalapp_tm;
        var objprepapp_id = isEmpty(objFinal.responseObject.prepapp_id)?"" : objFinal.responseObject.prepapp_id;
        var objprepapp_nm = isEmpty(objFinal.responseObject.prepapp_nm)?"" : objFinal.responseObject.prepapp_nm;
        var objprepapp_dt = isEmpty(objFinal.responseObject.prepapp_dt)?"" : objFinal.responseObject.prepapp_dt;   
        var objprepapp_tm = isEmpty(objFinal.responseObject.prepapp_tm)?"" : objFinal.responseObject.prepapp_tm;           

        var prepapp_dt="";var _prepapp_dt=""; prepapp_tm="";
        var empapp_dt="";var _empapp_dt=""; empapp_tm="";
            var hr_finalapp_dt="";var _hr_finalapp_dt=""; hr_finalapp_tm="";
            var finalapp_dt="";var _finalapp_dt=""; finalapp_tm="";


        if(objprepapp_dt!="")
        {
            _prepapp_dt = DateFormat1(objprepapp_dt);
            prepapp_tm= objprepapp_tm;
        }
        if(objemp_app_dt!="")
        {
            _empapp_dt = DateFormat1(objemp_app_dt);
            empapp_tm= objEmp_att_tm;
        }
        if(objhr_finalapp_dt!="")
        {
            _hr_finalapp_dt = DateFormat1(objhr_finalapp_dt);
            hr_finalapp_tm=objhr_finalapp_tm;
        }
        if(objfinalapp_dt!="")
        {
            _finalapp_dt = DateFormat1(objfinalapp_dt);
            finalapp_tm= objfinalapp_tm;
        }

        if (objprepapp_nm !="" && prepapp_tm !="") {
            tableHeading += String.format('<td id="tdPrep" style="white-space: initial;"><img src="./Images/Chk.png" style="width:63px;position:relative;margin-bottom: -36px;opacity: 0.4;margin-left: 61px;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td>{0} : {1}</td></tr><tr><td>{2} {3}</td></tr></table></td>',objprepapp_nm,objprepapp_id,_prepapp_dt,prepapp_tm);
        }
        else 
        {
            tableHeading += '<td id="tdPrep" style="white-space: initial;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td></td></tr><tr><td></td></tr></table></td>';
        }

        if (objemp_nm !="" && empapp_tm !="") {
            tableHeading += String.format('<td id="tdAck" style="white-space: initial;"><img src="./Images/Chk.png" style="width:63px;position:relative;margin-bottom: -36px;opacity: 0.4;margin-left: 61px;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td>{0} : {1}</td></tr><tr><td>{2} {3}</td></tr></table></td>',objemp_nm,objemp_cd,_empapp_dt,empapp_tm);
        }
        else 
        {
            tableHeading += '<td id="tdAck" style="white-space: initial;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td></td></tr><tr><td></td></tr></table></td>';
        }

        if (objfinalapp_nm !="" && finalapp_tm !="") {
            tableHeading += String.format('<td id="tdHOD" style="white-space: initial;"><img src="./Images/Chk.png" style="width:63px;position:relative;margin-bottom: -36px;opacity: 0.4;margin-left: 61px;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td>{0} : {1}</td></tr><tr><td>{2} {3}</td></tr></table></td>',objfinalapp_nm,objfinalapp_id,_finalapp_dt,finalapp_tm);
        }
        else 
        {
            tableHeading += '<td id="tdHOD" style="white-space: initial;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td></td></tr><tr><td></td></tr></table></td>';
        }

        if (objhr_finalapp_nm !="" && hr_finalapp_tm !="") {
            tableHeading += String.format('<td id="tdHOD" style="white-space: initial;"><img src="./Images/Chk.png" style="width:63px;position:relative;margin-bottom: -36px;opacity: 0.4;margin-left: 61px;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td>{0} : {1}</td></tr><tr><td>{2} {3}</td></tr></table></td>',objhr_finalapp_nm,objhr_finalapp_id,_hr_finalapp_dt,hr_finalapp_tm);
        }
        else 
        {
            tableHeading += '<td id="tdHOD" style="white-space: initial;"><table cellpadding="0" cellspacing="0" width="100%"><tr><td></td></tr><tr><td></td></tr></table></td>';
        }
        tableHeading += '</tr>';
        tableHeading += '</table>';
        tableHeading += '<div style="text-align: Left;">Rev. # 02 (Effective date: 13.11.2018)</div>';
        tableHeading += '</div>';
        /////----------------------End-----------------------//


        $("[id*=OutputPrint]").css({"font-family": "Times New Roman"}); 


            document.getElementById("OutputPrint").innerHTML = tableHeading;
            $('#tablePrint td').css('white-space','initial');
            $("#ShowModalPrint").modal("toggle");


    } catch (err) {
       $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
    }
    finally
    {
      $(".loader").fadeOut();
    }
}

async function btnShow_Click()
{
    var par=null; var ErrMsg=null; var st=""; var tval=0;
    try 
    {
        $(".loader").fadeIn();
        var drpEmp = $("select[id*=drpEmp] option:Selected");
        res= await getJRAuditTrailsList(drpEmp.val());
        if (res.response == -1) 
		{
            $('#JRDetailTable').dataTable().fnClearTable();
            $(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
            $(".dataTables_filter").hide();   //--HIde Search label and textbox         });
            setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 100);
            ErrMsg= res.responseMsg;
            throw ErrMsg;
        }

        var myData = res.responseObjectList;
        var res = await createDataTable(myData);
        if (res != "OK") 
        {
            ErrMsg = "Error found during Populate Grid";
            $(".loader").fadeOut();
            throw ErrMsg;
        }    
         MakeDataTable();
         $(".loader").fadeOut();
//        var data =objPrpUsrLogDtl[0];
//        var res = await Save_UsrLogDtl(data);
//        if (res.response == -1) 
//        {
//            ErrMsg = res.responseMsg;
//            throw ErrMsg;
//        } 
    } 
    catch (err) 
    {
         $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
    }
    finally
    {
     $(".loader").fadeOut();
    }

}

function btnexit_click()
{
    var strUrl = 'Default.aspx';
    setTimeout(window.location.href = strUrl, 10000);
}


async function btnExport_click()
{
    var ErrMsg=null;
    try 
    {
        $(".loader").fadeIn();
        var txtFroDat =  $("input[id*=txtFroDat]");
        var txtToDat = $("input[id*=txtToDat]");
        var drpEmp = $("select[id*=drpEmp] option:Selected");
        var drpMIVTyp = $("select[id*=drpMIVTyp] option:Selected");
        var drpdep = $("select[id*=drpdep] option:Selected");
        var fromDate =  ChangeDateFormat(DateInYYYYMMDD(txtFroDat.val()));
        var ToDate = ChangeDateFormat(DateInYYYYMMDD(txtToDat.val()));
        var currdt= new Date();
       var objPrpUsrLogDtl= [];
       var row={};
       currdt = (currdt.getMonth()+1) + '/' + currdt.getDate() + '/' + Math.abs(currdt.getFullYear());
        
        if (drpMIVTyp.val() == "L" &&  txtFroDat.val() != "0" &&  txtToDat.val() != "0" && drpEmp.val() == "L"  && drpdep.val() == "L" ) 
        {
            par =15;
            row["emp_cd"] =$("[id*=hdfempcd]").val();
            row["login_dt"] = ChangeDateFormat(currdt);
            row["PACK_NAME"] = "OnLine Issue Voucher";
            row["rpt_name"] = "Report JR Detail";
            row["para_1"] = String.format("JR Detail Report From Date : {0} To Date : {1} Employee and JR Detail wiz",fromDate,ToDate);
            row["para_2"] = "JR Detail Report View - All Employee, All Department and JR Detail wiz";
            objPrpUsrLogDtl.push(row);
        }
        else if (drpMIVTyp.val() != "L" &&  txtFroDat.val() != "0" &&  txtToDat.val() != "0" && drpEmp.val() == "L"  && drpdep.val() == "L" ) 
        {
            par =16;
            row["emp_cd"] =$("[id*=hdfempcd]").val();
            row["login_dt"] = ChangeDateFormat(currdt);
            row["PACK_NAME"] = "OnLine Issue Voucher";
            row["rpt_name"] = "Report JR Detail";
            row["para_1"] =  String.format("MIV Detail Report From Date : {0} To Date : {1} Employee and MIV Type wiz",fromDate,ToDate);
            row["para_2"] = String.format("MIV Detail Report View - All Employee , All Department and {0} viz.", drpMIVTyp.text().trim()); 
            objPrpUsrLogDtl.push(row);
        } 
        else if (drpMIVTyp.val() == "L" &&  txtFroDat.val() != "0" &&  txtToDat.val() != "0" && drpEmp.val() != "L"  && drpdep.val() == "L" ) 
        {
            par =28;
            row["emp_cd"] =$("[id*=hdfempcd]").val();
            row["login_dt"] = ChangeDateFormat(currdt);
            row["PACK_NAME"] = "OnLine Issue Voucher";
            row["rpt_name"] = "Report MIV Detail";
            row["para_1"] =  String.format("MIV Detail Report From Date : {0} To Date : {1} Employee and MIV Type wiz",fromDate,ToDate);
            row["para_2"] = String.format("MIV Detail Report View - All Department and MIV Type wiz and MIV Owner:{0}",drpEmp.text());
            objPrpUsrLogDtl.push(row);
        }  
        else if (drpMIVTyp.val() != "L" &&  txtFroDat.val() != "0" &&  txtToDat.val() != "0" && drpEmp.val() != "L"  && drpdep.val() == "L" ) 
        {
            par =29;
            row["emp_cd"] =$("[id*=hdfempcd]").val();
            row["login_dt"] = ChangeDateFormat(currdt);
            row["PACK_NAME"] = "OnLine Issue Voucher";
            row["rpt_name"] = "Report MIV Detail";
            row["para_1"] =  String.format("MIV Detail Report From Date : {0} To Date : {1} Employee and MIV Type wiz",fromDate,ToDate);
            row["para_2"] = String.format("MIV Detail Report View - all department, MIV owner : {0}, MIV type : {1} ",drpEmp.text(), drpMIVTyp.text());
            objPrpUsrLogDtl.push(row);
        }  
        else if (drpMIVTyp.val() == "L" &&  txtFroDat.val() != "0" &&  txtToDat.val() != "0" && drpEmp.val() == "L"  && drpdep.val() != "L" ) 
        {
            par =33;
            row["emp_cd"] =$("[id*=hdfempcd]").val();
            row["login_dt"] = ChangeDateFormat(currdt);
            row["PACK_NAME"] = "OnLine Issue Voucher";
            row["rpt_name"] = "Report MIV Detail";
            row["para_1"] =  String.format("MIV Detail Report From Date : {0} To Date : {1} Employee and MIV Type wiz.  and For Dept : {2}",fromDate,ToDate,drpdep.text());
            row["para_2"] = String.format("MIV Detail Report View - all department, MIV owner : {0}, MIV type : {1}",drpEmp.text(), drpMIVTyp.text());
            objPrpUsrLogDtl.push(row);
        }   
        else if (drpMIVTyp.val() != "L" &&  txtFroDat.val() != "0" &&  txtToDat.val() != "0" && drpEmp.val() == "L"  && drpdep.val() != "L" ) 
        {
            par =34;
            row["emp_cd"] =$("[id*=hdfempcd]").val();
            row["login_dt"] = ChangeDateFormat(currdt);
            row["PACK_NAME"] = "JR MODULE";
            row["rpt_name"] = "Report MIV Detail";
            row["para_1"] =  String.format("MIV Detail Report From Date : {0} To Date : {1} Employee and MIV Type wiz.  and For Dept : {2}",fromDate,ToDate,drpdep.text());
            row["para_2"] = String.format("MIV Detail Report View - all department, MIV owner : {0}, MIV type : {1}",drpEmp.text(), drpMIVTyp.text());
            objPrpUsrLogDtl.push(row);
        }  
//        var data =objPrpUsrLogDtl[0];
//        var res = await Save_UsrLogDtl(data);
//        if (res.response == -1) 
//        {
//            ErrMsg = res.responseMsg;
//            throw ErrMsg;
//        }

        res=null;
        res= await getMIVReport(par,fromDate,ToDate, drpMIVTyp.val(),drpEmp.val(),drpdep.val());
        if (res.response == -1) 
		{
            ErrMsg= res.responseMsg;
            throw ErrMsg;
        }
        var myData = res.responseObjectList;
        var res = await getExportTable(myData);
        if(res !="OK")
        {
            ErrMsg=("Error during Export the Table");
            throw ErrMsg;
        }

         tableToExcel('MIVExportTable','test','TestExport');

    } 
    catch (err) 
    {
    
    }
    finally
    {
        $(".loader").fadeOut();
    }

}

function getExportTable(myData)
{
     return new Promise(function (resolve, reject) {
        var newRows = "";
        var tot=0;
        var tableHeading ='<table id="MIVExportTable"  border="0" cellpadding="0" cellspacing="0"  class ="table table-striped" style="width:100%;"><thead><tr><th>EmpCd</th><th>Emp Name</th><th>Department</th><th>MIV No.</th><th>MIV Date</th><th>Type</th><th>Status</th><th>Tot. Value</th></tr></thead><tbody>';
        newRows += tableHeading;
        for (var i = 0; i < myData.length; i++) 
        {
             newRows +=     '<tr><td>' + myData[i].emp_cdG + 
                            '</td><td>' + myData[i].emp_nmG + 
                            '</td><td>' + myData[i].dept_nmG +  
                            '</td><td>' + myData[i].miv_no + 
                            '</td><td>' + myData[i].miv_dt + 
                            '</td><td>' + myData[i].inv_typG + 
                            '</td><td>' + myData[i].statusG + 
                            '</td><td>' + myData[i].Tot_valG + '</td></tr>';
        }
        newRows +='</tbody>';
        newRows +='</table>';
        document.getElementById("DivExport").innerHTML = newRows;
        resolve("OK");
    });
}



 function getIEVersion()
// Returns the version of Windows Internet Explorer or a -1
// (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

function tableToExcel(table, sheetName, fileName) {
    

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        return fnExcelReport(table, fileName);
    }

    var uri = 'data:application/vnd.ms-excel;base64,',
        templateData = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
        base64Conversion = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
        formatExcelData = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

    $("tbody > tr[data-level='0']").show();

    if (!table.nodeType)
        table = document.getElementById(table)

    var ctx = { worksheet: sheetName || 'Worksheet', table: table.innerHTML }

    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/vnd.ms-excel;base64,' + base64Conversion(formatExcelData(templateData, ctx)));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    $("tbody > tr[data-level='0']").hide();
}

function fnExcelReport(table, fileName) {
    
    var tab_text = "<table border='2px'>";
    var textRange;

    if (!table.nodeType)
        table = document.getElementById(table)

    $("tbody > tr[data-level='0']").show();
    tab_text =  tab_text + table.innerHTML;

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    txtArea1.document.open("txt/html", "replace");
    txtArea1.document.write(tab_text);
    txtArea1.document.close();
    txtArea1.focus();
    sa = txtArea1.document.execCommand("SaveAs", false, fileName + ".xls");
    $("tbody > tr[data-level='0']").hide();
    return (sa);
}


/////////end////////////////////////////
//}

function getPmivReport(varmivno,varmivyr) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getPmivReport",
            data: "{'varmivno' : '" + varmivno + "', 'varmivyr' : '" + varmivyr + "' }",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}


function getJRContents(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getJRContents",
            data: "{'id' : '" + id + "'}",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}


function printData() {
var contents = $("#OutputPrint").html();
var frame1 = $('<iframe />');
frame1[0].name = "frame1";
frame1.css({ "position": "absolute", "top": "-1000000px" });
$("body").append(frame1);
var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
frameDoc.document.open();
//Create a new HTML document.
frameDoc.document.write('<html><head><title>INDIVIDUAL JOB RESPONSIBILITIES</title>');
frameDoc.document.write('</head><body>');
//////Append the external CSS file.
//frameDoc.document.write('<link rel="stylesheet" type="text/css" href="Styles/bootstrap.min.css" />');
//frameDoc.document.write('<link rel="stylesheet" type="text/css" href="Styles/headcss.css" />');
frameDoc.document.write('<link href="Styles/PrintNew.css" rel="stylesheet" type="text/css" />');
//Append the DIV contents.
frameDoc.document.write(contents);
frameDoc.document.write('</body></html>');
frameDoc.document.close();
setTimeout(function () {
window.frames["frame1"].focus();
window.frames["frame1"].print();
frame1.remove();
}, 500);

}

function isEmpty(val) {

// test results
//---------------
// [] true, empty array
// {} true, empty object
// null true
// undefined true
// "" true, empty string
// '' true, empty string
// 0 false, number
// true false, boolean
// false false, boolean
// Date false
// function false

if (val === undefined)
return true;

if (typeof (val) == 'function' || typeof (val) == 'number' || typeof (val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
return false;

if (val == null || val.length === 0) // null or 0 length array
return true;

if (typeof (val) == "object") {
// empty object

var r = true;

for (var f in val)
r = false;

return r;
}

return false;
}


function getMIVReport(varpar,varmivdatfro,varmivdatTo,varinvtyp,varempcd,vardeptcd ) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getMIVReport",
            data: "{'varpar' : '" +  varpar + "', 'varmivdatfro' : '" +  varmivdatfro + "', 'varmivdatTo' : '" +  varmivdatTo + "', 'varinvtyp' : '" +  varinvtyp + "', 'varempcd' : '" +  varempcd + "', 'vardeptcd' : '" +  vardeptcd + "'}",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}




function createDataTable(myData)
{
  return new Promise(function (resolve, reject) 
  {
        var newRows = "";
        var tot=0;
        var tableHeading='<table id="JRDetailTable"  border="0" cellpadding="0" cellspacing="0"  class ="table table-striped" style="width:100%;"><thead><tr><th class="id">ID</th><th class="reason">Reason</th><th class="activity">Activity</th><th class="updatedby">Updated By</th><th class="updatedon">Updated On</th></tr></thead><tbody>';
        newRows += tableHeading;
        for (var i = 0; i < myData.length; i++) 
        {
            
             newRows +=     '<tr><td class="id">' + myData[i].AT_Id + 
                            '</td><td class="reason">' + myData[i].AT_Reason + 
                            '</td><td class="activity">' + myData[i].AT_Activity +  
                            '</td><td class="updatedby">' + myData[i].AT_UpdatedBy + 
                            '</td><td class="updatedon">' +  myData[i].AT_UpdatedOn + 
                            '</td></tr>';
        }
        newRows +='</tbody>';
        newRows +='</table>';
        document.getElementById("jrDetailDIV").innerHTML = newRows;

        $("[id*=lblMessage]").text("");
            resolve("OK");
    });
}

function MakeDataTable()
{
 table=  $("#JRDetailTable").removeAttr("width").DataTable({
        "JQueryUI" : false,
        "paging": false,
        "processing": true,
        "deferRender" : true,
        "destroy": true,  
        "language": {
            "emptyTable": "No Data Found"
        },
        "fixedColumns": {
            "leftColumns": "3"
        },
        "scrollY": "400",
        "scrollX": "true",
        'order':[],
        'columnDefs': [{
            "targets": 0,
            "orderable": false
        }]
    });

    $(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
    $(".dataTables_filter").hide();   //--HIde Search label and textbox         });
    table.order( [ 4, 'desc' ] ).draw();
    setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 500);
}



function Save_UsrLogDtl(com) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            data: JSON.stringify({p: com}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}

function getSessionVariables() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getSessionVariables",
            data: "{}",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}


function getEmployeeDetail(empcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getEmployeeDetail",
            data: "{'varempcd' : '" +  empcd + "'}",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}

function getDepartment() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getAllList",
            data: "{}",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}

function getAllUsers() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getAllUsers",
            data: "{}",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}

function getAllList() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getAllList",
            data: "{}",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}

function GetJRReport(vardeptcd, vardatfro, vardatTo) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetJRReport",
            data: "{'vardeptcd' : '" + vardeptcd + "', 'vardatfro' : '" + vardatfro + "', 'vardatTo' : '" + vardatTo + "' }",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}

function GetJRReportPrint(varempcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetJRReportPrint",
            data: "{'varempcd' : '" + varempcd + "' }",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}
//19-07-2022----->
function GetJRRevisionHistoryPrint(varempcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetJRRevisionHistoryPrint",
            data: "{'varempcd' : '" + varempcd + "' }",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (mData) {
                var myData = mData.d;
                resolve(myData);
            },
            error: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            },
            failure: function (jqXHR, exception) {
                reject(jqXHR.responseJSON.Message);
            }
        });
    });
}
//19-07-2022-----<