var datatable;
var $ = jQuery.noConflict();

$(function () {
    ChangeBreadCrumb("Action", "Inbox", "Action");
      $("#issueBody").addClass("sidebar-collapse");
    BindGrid();
});


function populateGrid(myData)
{
    return new Promise(async function(resolve,reject){
    $(document).ready(function() {
        var table = $('#InboxTable').DataTable(
        {
            "JQueryUI" : false,
            "paging": false,
            "processing": true,
            "deferRender" : true,
            "destroy": true,  
		    "language": 
            {
			    "emptyTable": "No Data Found"
		    },
            "data": myData,
            "columns":
            [
                { 'data': 'Id'},
                { 'data': 'emp_cd'},
                { 'data': 'emp_nm' },
                { 'data': 'Dept_Cd' },
                { "data": "Dept_Nm" },
                { "data": "Desig_Nm" },
                { "data": "final_auth_cd_dept" },
                { "data": "final_auth_cd_hr" },
                {
                    "data": null,
                    "defaultContent": '<input type="button" id="btnSelect" class="btn btn-primary gridButton" value="Select" />'
                }
            ],
            "fixedColumns": {
                "leftColumns": "2"
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
        $(".pagination").hide();
//         table.order([ 0, "desc" ] , [ 1, "desc" ] ).draw();
         setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 500);


        $('#InboxTable').on('click', 'tbody tr #btnSelect',async function () {
            var mytag = 20;
            var arr = $('#InboxTable').dataTable().fnGetData($(this).parents('tr'));
            var lbljrId = arr["Id"];
            var lblempcd = arr["emp_cd"].toString();
            var lbldeptcd =arr["Dept_Cd"].toString();
             var encTag= await encryptQueryString("1");
            var strUrl = String.format('JREntry.aspx?jrId={0}&tag={1}&deptcd={2}&empcd={3}', lbljrId,encTag,lbldeptcd,lblempcd);
            setTimeout(window.location.href = strUrl, 10000);
        });  
        resolve("OK");
    });
    });
}

function getInboxData(empcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetJRInbox",
            data: "{'empcd' : '" + empcd + "'}",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 500,
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
            type: "GET",
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




async function BindGrid() {
    var ErrMsg=null;
    // Hide image container
    $("#loader1").fadeIn();
    var lblMessage = $("[id*=lblMessage]");
    try 
    {
        var usercd= await  getSessionVariables();
        if (usercd.length ==0)
        {
            $("[id*=lblMessage]");("Session Expired").css('color', '#ff0000'); // Red color
            toastr.error("Session Expired", {timeOut: 200});
            setTimeout(window.location.href = "Account/Login.aspx", 10000);
            return;
        }
        if(usercd.length > 0)
        {
            var res= await getInboxData(usercd.toString().trim());
            if (res.response ==-1) 
            {
                ShowEmptyTable();
                ErrMsg= res.responseMsg;
                throw ErrMsg;
            }
            var myData = res.responseObjectList;
            populateGrid(myData).catch(function(reason) {ErrMsg="An Error found during populate the Grid";  throw ErrMsg;});
        }
        // Hide image container
        $("#loader1").fadeOut();

        if(ErrMsg ==null)
        {
            $("[id*=lblMessage]").text("");
        }

    
    } 
    catch (err) 
    {
        lblMessage.text(err).css('color', '#ff0000'); // Red color
        // Hide image container
      $("#loader1").fadeOut();
    }
    finally
    {
         // Hide image container
       $("#loader1").fadeOut();   
    }
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



function ChangeDateFormat(dt)
{
    var formatted_date = "";
    if (dt == null || dt == "") return formatted_date;
//    var d = new Date(dt);
    var d = new Date(parseInt(dt.substr(6)));
    var date = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    // let current_datetime = new Date()
    var formatted_date = date + "-" + months[month] + "-" + year;
    return formatted_date;
}

function ChangeDateFormat1(dt)
{
    var formatted_date = "";
    if (dt == null || dt == "") return formatted_date;
    var d = new Date(dt);
//    var d = new Date(parseInt(dt.substr(6)));
    var date = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    // let current_datetime = new Date()
    var formatted_date = date + "-" + months[month] + "-" + year;
    return formatted_date;
}




function ShowEmptyTable()
{
    $('#InboxTable').removeAttr("width").DataTable({
	    "processing": true,
	    "language": 
        {
		    "emptyTable": "No Data Found"
	    },
    });
	$(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
	$(".dataTables_filter").hide();   //--HIde Search label and textbox         });
}


function encryptQueryString(str) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/encryptQueryString",
            data: "{'str' : '" + str + "'}",
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



