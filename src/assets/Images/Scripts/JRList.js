var PRP_Department_List;
var table;
Timer();

var $ = jQuery.noConflict();

$(document).ready(function () {
    ChangeBreadCrumb("Report", "JR List", "Report");
     $("#issueBody").addClass("sidebar-collapse");
    changeDate();
//    userDetail();
    BindGrid();
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

function getQueryVariable(variable) {

    var query =window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
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






//async  function userDetail()
//{
//    var ErrMsg=null;
//    try {
//        $(".loader").fadeIn();
//	    var usercd= await  getSessionVariables();
//	    if (usercd.length ==0)
//	    {
//		    $("[id*=lblMessage]").text("Session Expired").css('color', '#ff0000'); // Red color
//		    toastr.error("Session Expired", {timeOut: 200});
//		    setTimeout(window.location.href = "Account/Login.aspx", 10000);
//		    return;
//	    }
//        if (usercd.length >0) 
//        {
//            $("#hdfempcd").val(usercd.toString().trim());
//            if (usercd.toString().trim() != "HRMB")
//            {
//                var res =  await getEmployeeDetail(usercd.toString().trim());
//                if (res.response ==-1) {
//                    ErrMsg =(res.responseMsg);
//                    throw ErrMsg;
//                }
//                var objempprp= res.responseObject;
//                 $("#hdfempcd").val($("#hdfempcd").val().toString().trim());
//                 $("#hdfempnam").val(objempprp.emp_nm.toString().trim());
//                 $("#hdfdept").val(objempprp.dept_nm.toString().trim());
//                 $("#hdfdesig").val(objempprp.desig_nm.toString().trim());
//            }


//        ///////////////////////
//            $("[id*=hdfUserID]").val(usercd.toString());

//            var itmData=null; var myData=null // itms.responseObjectList;
//         //   var myData = await GetUserRole();
//            var obj = await getAllList();
//            if (obj.response ==-1) {
//                ErrMsg=  obj.responseMsg;
//			    throw ErrMsg;
//            }
//            var myObj = obj.responseObject;

//            PRP_Department_List = myObj.Department;

//            Department=null; Department ='<option value="0">--Select--</option>'
//            $.each(PRP_Department_List,function(){
//                Department += '<option value="'+this["dept_cd"]+'">'+this["dept_nm"]+' </option>';
//            });
//            $("[id*=drpdep]").empty();
//            $("[id*=drpdep]").append(Department);
//        //////////////////////
//        } 
//        else
//        {
//            setTimeout(window.location.href = "Account/Login.aspx", 10000);
//        }  
//    } 
//    catch (err) 
//    {
//      $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
//    }
//    finally
//    {
//     $(".loader").fadeOut();
//    }

// }
 

 
async function BindGrid() 
{
    var ErrMsg=null;
    // Hide image container
    $("#loader2").fadeIn();
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
            var tag =(getQueryVariable("tag")==false) ? 0 : parseInt(getQueryVariable("tag").toString()); 
            if(tag!=0)
            {
                if(tag==1){$("[id*=jrListID]").text("Completed JR List");  } else if(tag==2){$("[id*=jrListID]").text("Pending JR List"); }
            
                var res= await  getJRLists(usercd,tag);
                if (res.response ==-1) 
                {
                    ShowEmptyTable();
                    ErrMsg= res.responseMsg;
                    throw ErrMsg;
                }
                var myData = res.responseObjectList;
                $("#loader2").fadeOut();
                populateGrid(myData).catch(function(reason) {ErrMsg="An Error found during populate the Grid";  throw ErrMsg;});
            }

        }
                
        // Hide image container
        if(ErrMsg ==null)
        {
            lblMessage.text("");
        }
    
    } 
    catch (err) 
    {
        lblMessage.text(err).css('color', '#ff0000'); // Red color
        // Hide image container
        $("#loader2").fadeOut();
    }
    finally
    {
          //Hide image container
        $("#loader2").fadeOut();   
    }
}

function btnexit_click()
{
    var strUrl = 'Default.aspx';
    setTimeout(window.location.href = strUrl, 10000);
}


function populateGrid(myData)
{
    return new Promise(function(resolve,reject)
    {
        var table = $('#PendingJRTable').removeAttr("width").DataTable({
            "JQueryUI" : false,
            "paging": false,
            "processing": true,
            "deferRender" : true,
            "destroy": true,  
			"language": 
            {
				"emptyTable": "No Data Found"
			},
            data: myData,
            columns:
            [
                { 'data': 'revision_no' },
                { 'data': 'emp_cd' },
                { 'data': 'emp_nm' },
                { 'data': 'dept_cd' },
                { 'data': 'dept_nm' },
                { 'data': 'desig_nm' },

                
            ],
            "language": {
                "emptyTable": "No Data Found"
            },
            "fixedColumns": {
                "leftColumns": "2"
            },
            "scrollY": "500",
//            "scrollX": "true",
            'order':[],
            'columnDefs': [{
                "targets": 0,
                "orderable": false
            }]
        });
        $(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
        $(".dataTables_filter").hide();   //--HIde Search label and textbox         });
      //  table.order( [ 4, 'desc' ] ).draw();
        setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 1000);                   
    
    });
}


function ShowEmptyTable()
{
    $('#PendingJRTable').removeAttr("width").DataTable({
	    "processing": true,
	    "language": 
        {
		    "emptyTable": "No Data Found"
	    },
    });
	$(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
	$(".dataTables_filter").hide();   //--HIde Search label and textbox         });
    setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 100);
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



function getJRLists(empcd,tag) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getJRLists",
            data: "{'empcd' : '" + empcd + "','tag' : " + tag + "}",
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

