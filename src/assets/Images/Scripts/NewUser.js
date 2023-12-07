var table;
Timer();

$(document).ready(function () {
    changeDate();
     ChangeBreadCrumb("Administrator", "New User Entry Screen", "Administrator"); 
      $("#issueBody").addClass("sidebar-collapse");
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
//    $("#txtDate").val(ChangeDateFormat(dt));
//    $("#txtFroDat").val(ChangeDateFormat(dt));
//    $("#txtToDat").val(ChangeDateFormat(dt));
    $("#txtDate").val(dy + '/' + mth + '/' + yr);
    $("#txtFroDat").val(dy + '/' + mth + '/' + yr);
    $("#txtToDat").val(dy + '/' + mth + '/' + yr);
}
txtDate


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    if (seconds < 10) {seconds = "0"+seconds;}
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


function getAllEmployee_notExistinJRSys() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getAllEmployee_notExistinJRSys",
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


function getAllEmployee_ExistinJRSys() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getAllEmployee_ExistinJRSys",
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
                    { 'data': 'ID' },
                    { 'data': 'Emp_cd' },
                    { 'data': 'Emp_nm' },
                    { 'data': 'desig_nm' },
                    { 'data': 'Dept_nm' },
                    { 'data': 'catg_nm' },
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
//                    var  mytag = 20;
                    //lblempcdg = arr["emp_cd"]; 
                    var dept_cd = arr["Dept_cd"].toString().trim(); 
                   // var is_DTC= (arr["is_DTC"].toString().trim()=="Y")? "Yes" : "NO"; 
                    var res=null;
                    res = await getAllEmployee_ExistinJRSys();  //   getEmployeeNames();
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
                    $("[id*=drpEmployee]").empty();
                    $("[id*=drpEmployee]").append(allUsers);
                    
                    
                    resetModalControls();
                    $("[id*=hdfID]").val(arr["ID"].toString());
                    // document.getElementById("drpEmployee").value =arr["emp_cd"].toString().trim();
                    // $("[id*=drpEmployee]").val(arr["emp_cd"].toString().trim());
                    $("[id*=drpEmployee] option[value='" + arr["Emp_cd"].toString().trim() +  "']").attr('selected', 'selected');
                    $("[id*=drpEmployee]").attr("disabled","disabled");
                    $("[id*=txtEmpnm]").val(arr["Emp_nm"].toString().trim());
                    $("[id*=txtDept]").val(arr["Emp_nm"].toString().trim());
                    $("[id*=hdfSeldeptcd]").val(arr["Dept_cd"].toString());
                    $("[id*=hdfSelempcd]").val(arr["Emp_cd"].toString());
                    $("[id*=hdflocn_cd]").val(arr["locn_cd"].toString());
                    $("[id*=txtDept]").val(arr["Dept_nm"].toString());
                    $("[id*=drpCheckDTC] option[value='" + arr["is_DTC"].toString().trim() +  "']").attr('selected', 'selected');
                    $("[id*=btnsave]").text("Update");  
                    $("[id*=btnsave]").removeAttr("disabled");
                    $("#showModalAddEditUser").modal("toggle");
//                    var strUrl =null;
//    //                if (getQueryVariable("myt").toString() == "100") 
//    //                {
//    //                    strUrl = String.format("IndentorRole.aspx?mytag={0}&empcd={1}",mytag,lblempcdg.toString().trim());
//    //                }
//    //                else
//    //                {
//    //                    strUrl = String.format("NewIssueID.aspx?mytag={0}&empcd={1}",mytag,lblempcdg.toString().trim());
//    //                }
//                    strUrl = String.format("NewIssueID.aspx?mytag={0}&empcd={1}",mytag,lblempcdg.toString().trim());
//                    setTimeout(window.location.href = strUrl, 10000);              
                      
             });
            //////////////////////end////////////////////////////////////////////
                  
            resolve("OK");
  });
}


function resetModalControls()
{
    $("[id*=drpEmployee]").prop('selectedIndex', 0);
    $("[id*=txtEmpnm]").val("");
    $("[id*=txtDept]").val("");
    $("[id*=hdfID]").val("");
    $("[id*=hdfSelempcd]").val("");
    $("[id*=hdfSeldeptcd]").val("");
     $("[id*=hdflocn_cd]").val("");
   
}


 async function btnshow_click()
 {
    var ErrMsg=null;
    try 
    {
        $(".loader").fadeIn();
        var btnshow = $("[id*=btnshow]");
        var drpempcd = $("select[id*=drpempcd] option:Selected");

        var res = await GetSelectedEXisting_EmployeeDetails(drpempcd.val());
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









async  function userDetail()
{
    var ErrMsg=null; var res=null; var userList=null; var allUsers=null;
    try {
        $(".loader").fadeIn();
//        var txtindempnm = $("input[id*=txtindempnm]");
        var hdfinddep = $("[id*=hdfinddep]");
        var hdfdepcd = $("[id*=hdfdepcd]");
        var txtindepcd = $("input[id*=txtDept]");
        var drpindempcd = $("select[id*=drpEmployee] option:Selected");
//        var drpapr = $("select[id*=drpapr] option:Selected");
//        var drpTPI = $("select[id*=drpTPI] option:Selected");
//        var drpSta = $("select[id*=drpSta] option:Selected");
        var btnSave= $("[id*=btnsave]");
        var btnCheck= $("[id*=btncheck]");
         var usercd = await getSessionVariables();
	    if (usercd.length ==0)
	    {
		    $("[id*=lblMessage]").text("Session Expired").css('color', '#ff0000'); // Red color
		    toastr.error("Session Expired", {timeOut: 200});
		    setTimeout(window.location.href = "Account/Login.aspx", 10000);
		    return;
	    }
        else if(usercd.length >0)
        {
            var res =  await getEmployeeDetail(usercd.toString().trim());
            if (res.response ==-1) {
                ErrMsg =(res.responseMsg);
                throw ErrMsg;
            }
            var objempprp= res.responseObject;
            $("[id*=hdfempcd]").val(objempprp.emp_cd.toString().trim());
            $("[id*=hdfempnam]").val(objempprp.emp_nm.toString().trim());
            $("[id*=hdfdept]").val(objempprp.dept_nm.toString().trim());
            $("[id*=hdfdesig]").val(objempprp.desig_nm.toString().trim()); 
            $("[id*=txtempcd]").val(objempprp.emp_cd.toString().trim());
            $("[id*=txtempnm]").val(objempprp.emp_nm.toString().trim());


            //-------Populate Select Employee DropdownList-----//

            refreshEmployeeDropdown();
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

 async function refreshEmployeeDropdown()
 {
    var res=null;
    res = await getAllEmployee_ExistinJRSys(); 
    if (res.response == -1) 
    {
        ErrMsg =(res.responseMsg);
        throw ErrMsg;
    }
    var userList=null; userList =res.responseObjectList;
    var allUsers =null; allUsers ='<option value="0">--Select--</option>';
    $.each(userList,function(){
        allUsers += '<option value="'+this["emp_cd"]+'">'+this["emp_nm"]+' </option>';
    });
    $("[id*=drpempcd]").empty();
    $("[id*=drpempcd]").append(allUsers);
 }



  function getCheckID(emp_cd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getCheckID",
            data: "{'emp_cd' : '" + emp_cd + "'}",
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


  function GetEmployeeDetails(emp_cd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetEmployeeDetails",
            data: "{'emp_cd' : '" + emp_cd + "'}",
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


  function GetSelectedEXisting_EmployeeDetails(emp_cd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetSelectedEXisting_EmployeeDetails",
            data: "{'emp_cd' : '" + emp_cd + "'}",
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






 function getEmployeeNames() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getEmployeeNames",
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


function getIndentory_indropdown() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getIndentory_indropdown",
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

function getEmployee_Name(emp_cd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getEmployee_Name",
            data: "{'emp_cd' : '" + emp_cd + "'}",
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


function check_validation() {
    return new Promise(async function (resolve, reject) {
        var drpEmployee = $("select[id*=drpEmployee] option:Selected");
        if (drpEmployee.val() == "0" ) 
        {
            $("[id*=drpEmployee]").addClass('tabcolor');
            reject("Select Employee");
        }
        else 
        {
           resolve("Record is Validated.");
        }
    });
}

function Save_JRAccessUser(com) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/Save_JRAccessUser",
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

function Update_JRAccessUser(com) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/Update_JRAccessUser",
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


async function btnCreate_click()
{
            var res=null;
            res = await getAllEmployee_notExistinJRSys();  //   getEmployeeNames();
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
            $("[id*=drpEmployee]").empty();
            $("[id*=drpEmployee]").append(allUsers);
            $("[id*=drpEmployee]").removeAttr("disabled");
            $("[id*=btnsave]").text("Save");  
            resetModalControls();

            $("#showModalAddEditUser").modal("toggle");
}







///////////////Start BUtton click Events////////////////////////
function btnexit_click()
{
    var strUrl = 'Default.aspx';
    setTimeout(window.location.href = strUrl, 10000);
}

async function btnCheck_click()
{    
    $(".loader").fadeIn();
    var btncheck =$("[id*=btncheck]");
    check_validation().then(function(result)
    {
        toastr.success( result, {timeOut: 1000});
//        btncheck.Attr("disabled","disabled");
        $(".loader").fadeOut();  
    }).catch(function(error)
    {
//        $("[id*=lblMessage]").text(error); 
//        $("[id*=lblMessage]").css('color', '#ff0000'); // Red color
        toastr.error( error, {timeOut: 1000});
        $(".loader").fadeOut();  
    });


}


$(".myTab").change(function(){
    $("[id*=lblMessage]").text(""); 
    $(this).removeClass('tabcolor');
});


async function btnSave_click()
{
    var ErrMsg;
	var usercd= await  getSessionVariables();
	if (usercd.length ==0)
	{
		$("[id*=lblMessage]").text("Session Expired").css('color', '#ff0000'); // Red color
		toastr.error("Session Expired", {timeOut: 200});
		setTimeout(window.location.href = "Account/Login.aspx", 10000);
		return;
	}

    try 
    {
        $(".loader").fadeIn();
        var drpEmployee = $("select[id*=drpEmployee] option:Selected");
        var drpCheckDTC = $("[id*=drpCheckDTC]");
        var hdfSelempcd = $("[id*=hdfSelempcd]");
        var hdfSeldeptcd = $("[id*=hdfSeldeptcd]");
        var hdflocn_cd = $("[id*=hdflocn_cd]");

        var btnSave= $("[id*=btnsave]");
        var btnCheck= $("[id*=btncheck]");
        var ObjJREmp= new Object();
        ObjJREmp.emp_cd = drpEmployee.val().trim();
        ObjJREmp.dept_cd = hdfSeldeptcd.val().trim();
        ObjJREmp.is_DTC= drpCheckDTC.val().trim();
        ObjJREmp.locn_cd= hdflocn_cd.val().trim();
        if (btnSave.text() == "Save") 
        {
            var res = await Save_JRAccessUser(ObjJREmp);
            if (res.response == -1) 
            {
                ErrMsg =(res.responseMsg);
                throw ErrMsg;
            }
            toastr.success( "JR Access ID is created Sucessfully.", {timeOut: 500});
            refreshEmployeeDropdown();
            $(".loader").fadeOut();  
            btnCheck.prop("disabled",true);
            btnSave.prop("disabled",true);
        }
        else if (btnSave.text() == "Update") 
        {
            ObjJREmp.ID= $("[id*=hdfID]").val();
            var res = await Update_JRAccessUser(ObjJREmp);
            if (res.response == -1) 
            {
                ErrMsg =(res.responseMsg);
                throw ErrMsg;
            }
            toastr.success( "JR Access ID is updated Sucessfully.", {timeOut: 500});
            refreshEmployeeDropdown();
            $(".loader").fadeOut();  
            btnCheck.prop("disabled",true);
            btnSave.prop("disabled",true);
//            btnSave.val("Update");   
        }    
    } 
    catch (err) 
    {
        toastr.error("Validation", err, {timeOut: 500});
        $(".loader").fadeOut();    
    }
    finally
    {
       $(".loader").fadeOut();    
    }






}

async function drpEmployee_IndexChanged()
{
	var usercd= await  getSessionVariables();
	if (usercd.length ==0)
	{
		$("[id*=lblMessage]").text("Session Expired").css('color', '#ff0000'); // Red color
		toastr.error("Session Expired", {timeOut: 200});
		setTimeout(window.location.href = "Account/Login.aspx", 10000);
		return;
	}
    var ErrMsg=null;
    var drpEmployee = $("select[id*=drpEmployee] option:Selected");
    $("[id*=txtEmpnm]").val("");
    $("[id*=txtDept]").val("");
    $("[id*=hdfID]").val("");
    $("[id*=hdfSelempcd]").val("");
    $("[id*=hdfSeldeptcd]").val("");
     $("[id*=hdflocn_cd]").val(""); 


    var txtEmpnm = $("input[id*=txtEmpnm]");
    var hdfinddep = $("[id*=hdfinddep]");
    var hdfdepcd = $("[id*=hdfdepcd]");
    var txtDept = $("input[id*=txtDept]");
    var hdfSelempcd= $("input[id*=hdfSelempcd]");
     var hdfSeldeptcd = $("input[id*=hdfSeldeptcd]");
    var hdflocn_cd= $("input[id*=hdflocn_cd]");
    try 
    {
        var res= await GetEmployeeDetails(drpEmployee.val());
        if (res.response == -1) 
        {
            ErrMsg =res.responseMsg;
            throw ErrMsg;
        }
        var objempprp= res.responseObjectList[0];  //   res.responseObject;
        hdfinddep.val(objempprp.Dept_nm.toString().trim());
        hdfdepcd.val( objempprp.Dept_cd);
        hdfSeldeptcd.val( objempprp.Dept_cd);
        txtDept.val(objempprp.Dept_nm.toString().trim());
        txtEmpnm.val(objempprp.Emp_nm.toString().trim());
        hdfSelempcd.val(objempprp.Emp_cd);
        hdflocn_cd.val(objempprp.locn_cd);
//        var m = parseInt(res.CheckID);
//        if (m >0) 
//        {
//             ErrMsg ="Id is already Exist.";
//             throw ErrMsg;    
//        }
//        else 
//        {
//            $("[id*=lblMessage]").text("");
//            var res1= await getEmployee_Name(txtEmpnm.val());
//            if (res1.response == -1) 
//            {
//                ErrMsg =res1.responseMsg;
//                throw ErrMsg;
//            }
//            var objempprp= res1.responseObject;
//            txtEmpnm.val(objempprp.emp_nm1);
//            hdfinddep.val(objempprp.dept_nm);
//            hdfdepcd.val( objempprp.dept_cd);
//            txtDept.val(objempprp.dept_nm);
//        }
    
    } 
    catch (err) 
    {
//       $("[id*=lblMessage]").text(err); 
        toastr.error("Validation", err, {timeOut: 1000});
        txtEmpnm.val("");
        hdfinddep.val("");
        hdfdepcd.val("");
        txtDept.val("");
        hdfSelempcd.val("");
    }
}


///////////////End BUtton click Events////////////////////////