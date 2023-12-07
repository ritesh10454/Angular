var table;
Timer();

$(document).ready(function () {
    changeDate();
     ChangeBreadCrumb("Main", "Change Password", "Main"); 
      $("#issueBody").addClass("sidebar-collapse");
    userDetail();
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
        }
        else
        {
            $("#hdfempcd").val("");
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

 function checkPassword(varempcd,varoldpwd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/checkPassword",
            data: "{'varempcd' : '" +  varempcd + "', 'varoldpwd' : '" +  varoldpwd + "'}",
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


 function UpdatePassword(varempcd,varseccd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/UpdatePassword",
            data: "{'varempcd' : '" +  varempcd + "', 'varseccd' : '" +  varseccd + "'}",
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




///////////////Start BUtton click Events////////////////////////
function btnexit_click()
{
    var strUrl = 'Default.aspx';
    setTimeout(window.location.href = strUrl, 10000);
}

async function btnChange_click()
{
    var ErrMsg=null;
    try 
    {
        $(".loader").fadeIn();
        var txtCurPas =$("input[id*=txtCurPas]");
        var txtChaPas =$("input[id*=txtChaPas]");
        var txtConPas =$("input[id*=txtConPas]");
        var txtempcd =$("input[id*=txtempcd]");
        if (txtempcd.val().length ==0) {
            ErrMsg ="Please Enter User Name";
            throw ErrMsg;
        }    
        if (txtCurPas.val().length ==0) {
            ErrMsg ="Please Enter Current Password";
            throw ErrMsg;
        }
        if (txtChaPas.val().length ==0) {
            ErrMsg ="Please Enter Change Password";
            throw ErrMsg;
        }
        if (txtConPas.val().length ==0) {
            ErrMsg ="Please Enter Confirm Password";
            throw ErrMsg;
        }
        if (txtConPas.val() != txtChaPas.val()) {
            ErrMsg ="New Password is not Matching";
            throw ErrMsg;
        }

        var res=null; var result=null;
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
            res = await checkPassword(usercd.toString().trim(),txtCurPas.val());
            var result = parseInt(res.slipNo);
            if(result != 1) 
            {
                ErrMsg="Current Password is Wrong";
                throw ErrMsg;
            }
            else 
            {
                var objprpempsec= new Object();
                objprpempsec.emp_cd =usercd.toString().trim();
                objprpempsec.sec_cd = txtChaPas.val().trim();
                var result = await UpdatePassword(objprpempsec.emp_cd, objprpempsec.sec_cd)
                if (result.response == -1) {
                    ErrMsg = result.responseMsg;
                    throw ErrMsg; 
                }
                $("[id*=lblMessage]").text(result.responseMsg);
                toastr.success(result.responseMsg, {timeOut: 500});
                $("[id*=btnChange]").prop("disabled",true);
            }
        }
    } 
    catch (err) 
    {
        $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
        $(".loader").fadeOut();
    }
    finally
    {
      $(".loader").fadeOut();
    }

}

///////////////End BUtton click Events////////////////////////