

var $ = jQuery.noConflict();

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
         var jrId =(getQueryVariable("jrId")==false) ? 0 : parseInt(getQueryVariable("jrId").toString()); 
        var btnSave =$("[id*=btnSave]");
        var btnCheck =$("[id*=btnCheck]");
        var btnaction =$("[id*=btnaction]");
        var btncancel =$("[id*=btncancel]");

        var lblempname =$("[id*=txtemployeename]");
        var arrayempname = lblempname.val().split('-');
        var lblonlyempname = arrayempname[0];
        var lblempcd =$("[id*=txtemployeecode]");
        var lblempdesig =$("[id*=txtDesignation]");
        var arrayempdesigname = lblempdesig.val().split('/');
        var lblempdesigname = arrayempdesigname[0];
        var lblempdoj =$("[id*=txtdateofjoining]");
        var lblemprevisionno =$("[id*=txtRevisionNo]");
        var lblemprevisiondate =$("[id*=txteffectivedate]");    
        var lblempsupersedeno =$("[id*=txtsupersedeno]");
        var lblempreason =$("[id*=txtreason]");


        var newRows = "";
        var tot=0;
        var tableHeading ="";var tableFooter="";
        var myData = await GetJRReportPrint(lblempcd.val());
        if (myData.response == -1) {
            alert(myData.responseMsg);
        }
       var reportData= myData.responseObject;
       var  _doj =  DateFormat1(reportData.doj);   



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
        tableHeading += String.format('<table cellpadding="0" cellspacing="0" width="100%" border="true"><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">NAME</td><td style="white-space: initial;">{0}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">DESIGNATION / GRADE</td><td style="white-space: initial;">{1}  / {2}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">E. CODE</td><td style="white-space: initial;">{3}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">DATE OF JOINING</td><td style="white-space: initial;">{4}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">DEPARTMENT</td><td colspan="3" style="white-space: initial;">{5}</td></tr></table>',reportData.emp_nm,reportData.desig_nm,reportData.catg_nm,reportData.emp_cd, _doj,reportData.dept_nm);
        //tableHeading += String.format('<table cellpadding="0" cellspacing="0" width="100%" border="true"><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">Name</td><td style="white-space: initial;">{0}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">Designation / Grade</td><td style="white-space: initial;">{1}  / {2}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">E. Code</td><td style="white-space: initial;">{3}</td><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">Date of Joining</td><td style="white-space: initial;">{4}</td></tr><tr><td style="text-align: Left;font-family: "Times New Roman";font-size:16px;">Department</td><td colspan="3" style="white-space: initial;">{5}</td></tr></table>',toTitleCase(reportData.emp_nm),toTitleCase(reportData.desig_nm),reportData.catg_nm,reportData.emp_cd,_doj,toTitleCase(reportData.dept_nm.split('-')[0]));
        tableHeading += '</td>';
        tableHeading += '</tr>';
        tableHeading += '<tr>';
        tableHeading += '<td style="text-align: left; font-weight: bold; font-size: large">Job Responsibilities : -</td></tr>';
        tableHeading += String.format('<tr><td colspan="4" style="padding-left: 25px; text-align:justify;"><table cellpadding="0" cellspacing="0" width="100%"></td><tr><td class="no" style="word-wrap: break-word;width: 60px !important;">{0}</td></tr></table>',reportData.jr_detail);
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
        tableHeading += '<td rowspan="2" style="word-wrap: break-word;text-align: center;">Reason For Revision</td>';
        tableHeading += '</tr>';
        tableHeading += '<tr>';
        tableHeading += '<td style="white-space: normal;text-align: center;">Revision No.</td>';
        tableHeading += '<td style="white-space: normal;text-align: center;">Effective date</td>';
        tableHeading += '</tr>';
        var newRows1='';

        var myData = await GetJRRevisionHistoryPrint(lblempcd.val());
        if (myData.response == -1) {
            alert(myData.responseMsg);
        }
        var reportData1= myData.responseObjectList;
        for (var k = 0; k < reportData1.length; k++) 
        {
            newRows1 +='<tr>';
            newRows1 +=  '<tr><td style="white-space: initial;text-align: center;">' + reportData1[k].revision_no + '</td>';
            newRows1 +=  '<td style="white-space: initial;text-align: center;">' +  reportData1[k].revision_date + '</td>';
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

function ChangeDateFormat1(dt) {
    var formatted_date = "";
    if (dt == null || dt == "") return formatted_date;
    //    var d = new Date(dt);
    var d = new Date(parseInt(dt.substr(0,11)).toString().trim());
    var date = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    // let current_datetime = new Date()
    var formatted_date = date + "-" + months[month] + "-" + year;
    return formatted_date;
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
//frameDoc.document.write('<link rel="stylesheet" href="Styles/headcss.css" type="text/css" />');
//frameDoc.document.write('<link rel="stylesheet" href="Styles/headcss.css" type="text/css" />');
frameDoc.document.write('<link href="Styles/PrintNew.css" rel="stylesheet" type="text/css"  />');
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
