var datatable;
var $ = jQuery.noConflict();

$(function () {
    ChangeBreadCrumb("Action", "Outbox", "Action");
    $("#issueBody").addClass("sidebar-collapse");
    BindGrid();
});




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




function getOutboxData(usercd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
			url: "WebService.asmx/getJROutBox",
			data: "{'empcd' : '" + usercd + "'}",
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
            
            var res= await  getOutboxData(usercd.toString().trim());
            if (res.response ==-1) 
            {
                ShowEmptyTable();
                ErrMsg= res.responseMsg;
                throw ErrMsg;
            }
             $("#loader2").fadeOut();
            var myData = res.responseObjectList;
            populateGrid(myData).catch(function(reason) {ErrMsg="An Error found during populate the Grid";  throw ErrMsg;});
//            var res1= await  populateGrid(myData);
//            if (res1 != "OK") 
//            {
//                ErrMsg="An Error found during populate the Grid";
//                throw ErrMsg;
//            }
        }
        // Hide image container
        $("#loader2").fadeOut();
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
         // Hide image container
        $("#loader2").fadeOut();   
    }
}


function populateGrid(myData)
{
  return new Promise(async function(resolve,reject)
  {
		var table = $('#OutboxTable').removeAttr("width").DataTable({
            "JQueryUI" : false,
            "paging": false,
            "processing": true,
            "deferRender" : true,
            "destroy": true,  
			"language": 
            {
				"emptyTable": "No Data Found"
			},
			"destroy": true,
			data: myData,
			columns:
			[
////                { 'data' : 'sno' },
//				{ 'data': 'Miv_No' },
//				{
//					'data': 'Miv_dt', 'render': function (date) 
//					{
//						var date = new Date(parseInt(date.substr(6)));
//						var month = date.getMonth() + 1;
//                        var newDt=month + "/" + date.getDate() + "/" + date.getFullYear();
////						return  (  date.getDate() + "/" + month + "/" + date.getFullYear());
//                        return (ChangeDateFormat1(newDt));
//					}
//				},
//				{ 'data': 'inv_typ' },
//				{ 'data': 'Emp_Cd' },
//				{ 'data': 'emp_nm' },
//				{ 'data': 'dept_nm' },
//				{ 'data': 'apr_sta' },
//				{ 'data': 'aut_sta' },
////                    { 'data': 'id' },
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

//                        { 'data': 'Sta' },
//                        { 'data': 'Tra' },
//				{
//					"data": null,
//					"defaultContent": '<input type="button" id="btnPrint" class="btn btn-primary gridButton" value="Print" />'
//				}
//                    { 'data': 'status' },
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
        setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 500);
        


//		var arr=null;var lblmivno='';var lblmivdt='';var lblsta='';var lblempcd='';var lblinvtyp='';var id=0;var mytag=0;var mivyr=0;
//					 
//		$('#OutboxTable').on('click', 'tbody tr #btnPrint', async function()
//		{     
//		    arr=$('#OutboxTable').dataTable().fnGetData($(this).parents('tr'));
//		    lblmivno = arr["Miv_No"];
//		    lblmivdt =ChangeDateFormat(arr["Miv_dt"]);
//		    lblsta  = arr["Sta"].toString();
//		    lblempcd  = arr["Emp_Cd"].toString();
//		    lblinvtyp  = arr["inv_typ"].toString();
//		    mivyr= Math.abs(new Date(lblmivdt).getFullYear());
//		    id  = arr["id"].toString();
//		    var newRows = "";
//		    var tot=0;
//		    var tableHeading='<table id="MIVPrintTable"  border="0" cellpadding="0" cellspacing="0"  class ="table table-striped" style="width:100%;"><thead><tr><th class="no">No.</th><th class="itmcd">Item Code</th><th class="itmnm">Item Name</th><th class="uom">UOM</th><th class="stock" style="text-align: right;">Stock</th><th class="issqty" style="text-align: right;">Iss. Qty</th><th class="rate" style="text-align: right;">Rate</th><th class="totval" style="text-align: right;">Issue Val</th><th class="consumpcent">Consumption Centre</th><th class="costcent">Cost Centre</th></tr></thead><tbody>';
//		    newRows += tableHeading;
//		    var myData = await getPmivReport(lblmivno,mivyr);
//		    if (myData.response == -1) {
//				    ErrMsg= myData.responseMsg;
//                    throw ErrMsg;
//		    }
//            var reportData= myData.responseObjectList;
//            for (var i = 0; i < reportData.length; i++) 
//            {
//	            if(i==0){
//		            $("#td_mivtype").text(reportData[i].inv_typ);
//			            $("#td_Mivno").text(reportData[i].miv_no);
//			            $("#td_generateby").text(reportData[i].emp_nm);
//			            $("#td_mivdt").text(reportData[i].miv_dt);
//			            $("#td_dept_nm").text(reportData[i].dept_nm);
//			            $("#td_appauth").text(reportData[i].app_nm);
//		            break;
//	            }             
//            }

//		    for (var i = 0; i < reportData.length; i++) 
//		    {
//			    tot += parseFloat(reportData[i].iss_val);
//			    newRows +=  '<tr><td class="no" style="white-space: initial;width: 60px !important;">' + reportData[i].itm_sno + 
//						    '</td><td class="itmcd" style="white-space: initial;width: 80px !important;">' + reportData[i].itm_cd + 
//						    '</td><td class="itmnm" style="white-space: initial;width: 135px !important;">' + reportData[i].itm_desc + 
//						    '</td><td class="uom" style="white-space: initial;width: 40px !important;">' + reportData[i].stk_uom + 
//						    '</td><td class="stock" style="white-space: initial;width: 80px !important;text-align: right;">' + reportData[i].pre_stk_qty + 
//						    '</td><td class="issqty" style="white-space: initial;width: 100px !important;text-align: right;">' + reportData[i].iss_qty + 
//						    '</td><td class="rate" style="white-space: initial;text-align: right;width: 80px !important;">' + reportData[i].iss_rt + 
//						    '</td><td class="totval" style="white-space: initial;text-align: right;width: 120px !important;">' + reportData[i].iss_val + 
//						    '</td><td class="consumpcent">' + reportData[i].cons_desc + 
//						    '</td><td class="costcent">' + reportData[i].cc_desc +  '</td></tr>';
//		    }
//		    newRows +='</tbody>';
//		    newRows += '<tfoot><tr><th class="no"></th><th class="itmcd"></th><th class="itmnm">Grand Total</th><th class="uom"></th><th class="stock"></th></th><th class="issqty"></th><th class="rate"></th><th class="totval" style="text-align: right;">Tot Val</th><th class="consumpcent"></th><th class="costcent"></th></tr></tfoot>';
//		    newRows +='</table>';
//		    document.getElementById("mivDetailDIV").innerHTML = newRows;
//		    $('#MIVPrintTable tfoot th:eq(7)').text(tot.toFixed(2));
//		    $('#MIVPrintTable td').css('white-space','initial');
//		    $("#ShowModalPrint").modal("toggle");
//		});

		$('#OutboxTable').on('click', 'tbody tr #btnSelect', async function()
        {
			//arr = $('#OutboxTable').dataTable().fnGetData("tbody tr");  
			arr=$('#OutboxTable').dataTable().fnGetData($(this).parents('tr'));
            var lbljrId = arr["Id"];
            var lblempcd = arr["emp_cd"].toString();
             var lbldeptcd =arr["Dept_Cd"].toString();
//			lblmivno = arr["Miv_No"];
//			lblmivdt =ChangeDateFormat(arr["Miv_dt"]);
//			lblsta  = arr["Sta"].toString();
//			lblempcd  = arr["Emp_Cd"].toString();
//			lblinvtyp  = arr["inv_typ"].toString();
//			id  = arr["id"].toString();
//			mytag = 30;
//			var strUrl = String.format("MIVEntry.aspx?mivno={0}&mivdt={1}&sta={2}&mytag={3}&empcd={4}&invtyp={5}",lblmivno,lblmivdt,lblsta,mytag,lblempcd,lblinvtyp);
            var encTag= await encryptQueryString("2");
            var strUrl = String.format('JREntry.aspx?jrId={0}&tag={1}&deptcd={2}&empcd={3}', lbljrId,encTag,lbldeptcd,lblempcd);
			setTimeout(window.location.href = strUrl, 10000);
		});
  });
}

function ShowEmptyTable()
{
    $('#OutboxTable').removeAttr("width").DataTable({
	    "processing": true,
	    "language": 
        {
		    "emptyTable": "No Data Found"
	    },
    });
	$(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
	$(".dataTables_filter").hide();   //--HIde Search label and textbox         });
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
frameDoc.document.write('<html><head><title>Material Issue Voucher</title>');
frameDoc.document.write('</head><body>');
////Append the external CSS file.
frameDoc.document.write('<link rel="stylesheet" type="text/css" href="Styles/bootstrap.min.css" />');
frameDoc.document.write('<link rel="stylesheet" type="text/css" href="Styles/headcss.css" />');
//frameDoc.document.write('<link href="code/theme/css/TableStyle.css" rel="stylesheet" type="text/css" />');
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



function ChangeDateFormat(dt) {
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
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    // let current_datetime = new Date()
    var formatted_date = day + "-" + months[month] + "-" + year;
    return formatted_date;
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


