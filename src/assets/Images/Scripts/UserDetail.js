var table;
Timer();

$(document).ready(function () {
    changeDate();
     ChangeBreadCrumb("Administrator", "New User Entry Screen", "Administrator"); 
      $("#issueBody").addClass("sidebar-collapse");
    getuserDetail();
});

function Timer() {
    var currdt = new Date();
    $("#txtTime").val(formatAMPM(currdt));
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
    $("#txtDate").val(ChangeDateFormat(dt));
    $("#txtFroDat").val(ChangeDateFormat(dt));
    $("#txtToDat").val(ChangeDateFormat(dt));
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


function DateInYYYYMMDD(date) 
{
    var dateOut = date.split(/[/,-]/); //  (/[!,?,/,-,.]/);  //    .toString().split("/").split("-");
    var resultDate = new Date(dateOut[2] + "/" + dateOut[1] + "/" + dateOut[0]);
    return resultDate; 
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

function validateFloatKeyPress(el, evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var number = el.value.split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    //just one dot
    if (number.length > 1 && charCode == 46) {
        return false;
    }
    //get the carat position
    var caratPos = getSelectionStart(el);
    var dotPos = el.value.indexOf(".");
    if (caratPos > dotPos && dotPos > -1 && (number[1].length > 1)) {
        return false;
    }
    return true;
}

function getSelectionStart(o) {
    if (o.createTextRange) {
        var r = document.selection.createRange().duplicate()
        r.moveEnd('character', o.value.length)
        if (r.text == '') return o.value.length
        return o.value.lastIndexOf(r.text)
    }
    else return o.selectionStart
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

function getID_Detail(emp_cd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getID_Detail",
            data: "{'emp_cd' : '" +  emp_cd + "'}",
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





async  function getuserDetail()
{
    var ErrMsg=null; var res=null; var userList=null; var allUsers=null;
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
        if(usercd.length > 0)
        {
            $("#hdfempcd").val(usercd.toString().trim());
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
            $("#txtempcd").val($("#hdfempcd").val());
            $("#txtempnm").val(objempprp.emp_nm.toString().trim());


            //-------Populate Select Employee and TPI DropdownList-----//
            res=null;
            res = await getAllUsers();
            if (res.response == -1) 
            {
                ErrMsg =(res.responseMsg);
                throw ErrMsg;
            }
            userList=null; userList =res.responseObjectList;
            allUsers =null; allUsers ='<option value="0">--Select--</option>';
            $.each(userList,function(){
                allUsers += '<option value="'+this["emp_cd"]+'">'+this["emp_nm"]+' </option>';
            });
            $("[id*=drpempcd]").empty();
            $("[id*=drpempcd]").append(allUsers);
             //----------------end-------------------------------//
        }
    } 
    catch (err) 
    {
//      $("[id*=lblMessage]").text(err);
        toastr.error("UserDetail", err, {timeOut: 1000});
    }
    finally
    {
     $(".loader").fadeOut();
    }
 }

 // App variable to show the confirm response
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}


 function createDataTable(myData)
{
  return new Promise(function (resolve, reject) 
  {
           var table = $('#UserDetailTable').removeAttr("width").DataTable({
                "processing": true,
                "language": 
                {
                    "emptyTable":  "My Record Found"
                },
                destroy: true,
                data: myData,
                columns:
                [
                    { 'data': 'srno' },
                    { 'data': 'emp_cd' },
                    { 'data': 'emp_nm' },
                    { 'data': 'desig_nm' },
                    { 'data': 'dept_nm' },
                    { 'data': 'rpt' },
                    { 'data': 'apr_emp_nm' },
                    { 'data': 'tpiid' },
                    { 'data': 'tpi' },
					{
						"data": null,
						"defaultContent": '<input type="button" id="btnSelect" class="btn btn-primary" value="Select" />'
					}
                ],
                "language": {
                    "emptyTable": "No Data Found"
                },
                "fixedColumns": {
                    "leftColumns": "4"
                },
                "scrollY": "400",
                "scrollX": "true",
                "columnDefs": [
                    {
                        "width": "20%",
                        "targets": "0"
                    }
                ]
            });
            $(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
            $(".dataTables_filter").hide();   //--HIde Search label and textbox 

            ////////Table Select BUtton Click Event//////////////////////////////
			$('#UserDetailTable').on('click', 'tbody tr #btnSelect', async function()
			{    
			        arr=$('#UserDetailTable').dataTable().fnGetData($(this).parents('tr'));
                    var  mytag = 20;
			        lblempcdg = arr["emp_cd"]; 
                    var strUrl =null;
    //                if (getQueryVariable("myt").toString() == "100") 
    //                {
    //                    strUrl = String.format("IndentorRole.aspx?mytag={0}&empcd={1}",mytag,lblempcdg.toString().trim());
    //                }
    //                else
    //                {
    //                    strUrl = String.format("NewIssueID.aspx?mytag={0}&empcd={1}",mytag,lblempcdg.toString().trim());
    //                }
                    strUrl = String.format("NewIssueID.aspx?mytag={0}&empcd={1}",mytag,lblempcdg.toString().trim());
                    setTimeout(window.location.href = strUrl, 10000);              
                      
             });
            //////////////////////end////////////////////////////////////////////
                  
            resolve("OK");
  });

}



 /////////////Start Control Events ///////////////////////
 async function btnshow_click()
 {
    var ErrMsg=null;
    try 
    {
        $(".loader").fadeIn();
        var btnshow = $("[id*=btnshow]");
        var drpempcd = $("select[id*=drpempcd] option:Selected");

        var res = await getID_Detail(drpempcd.val());
        if (res.response == -1) 
        {
            ErrMsg = res.responseMsg;
            throw ErrMsg;
        }
        var myData = res.responseObjectList;   
        var res = await createDataTable(myData);
        if (res != "OK") 
        {
            ErrMsg = "Error found during Populate Grid";
            throw ErrMsg;
        }     
    } 
    catch (err) 
    {
        toastr.error("UserDetail", err, {timeOut: 1000});
        $(".loader").fadeOut();
    }
    finally
    {
     $(".loader").fadeOut();
    }     
 }

 async function btnexport_click()
 {
        var drpempcd = $("select[id*=drpempcd] option:Selected");

        var res = await getID_Detail(drpempcd.val());
        if (res.response == -1) 
        {
            ErrMsg = res.responseMsg;
            throw ErrMsg;
        }
        var myData = res.responseObjectList; 
        var res = await getExportTable(myData);
        if(res !="OK")
        {
            ErrMsg=("Error during Export the Table");
            throw ErrMsg;
        }
         tableToExcel('UserDetailExportTable','test','TestExport');
 }


 ///////////////////end//////////////////////////////////



 function getExportTable(myData)
{
     return new Promise(function (resolve, reject) {
        var newRows = "";
        var tot=0;
        var tableHeading='<table id="UserDetailExportTable"  border="0" cellpadding="0" cellspacing="0"  class ="table table-striped"style="width:100%;"><thead><tr><th>Sr No.</th><th>Emp Cod</th><th>Employee Name</th><th>Designation</th><th>Department</th><th>AprCod</th><th>Approver</th><th>Tpicod</th><th>TPI</th></tr></thead><tbody>';
        newRows += tableHeading;
        for (var i = 0; i < myData.length; i++) 
        {
            newRows +=  '<tr><td>' + myData[i].srno + 
                        '</td><td>' + myData[i].emp_cd + 
                        '</td><td>' + myData[i].emp_nm +  
                        '</td><td>' + myData[i].desig_nm + 
                        '</td><td>' + myData[i].dept_nm + 
                        '</td><td>' + myData[i].rpt + 
                        '</td><td>' + myData[i].apr_emp_nm + 
                        '</td><td>' + myData[i].tpiid + 
                        '</td><td>' + myData[i].tpi + 
                        '</td></tr>';
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