var $ = jQuery.noConflict();

$(document).ready(function () {
    ChangeBreadCrumb("Home", "Dashboard", "Home");    
//      $("#issueBody").addClass("sidebar-collapse");
    Default_Load();
    // $("#issueBody").removeClass("sidebar-collapse");
     //BindGrid();
});


async function Default_Load()
{
    var ErrMsg=null;
    try {
        var usercd= await  getSessionVariables();
        if (usercd.length ==0)
        {
            $("[id*=lblMessage]");("Session Expired").css('color', '#ff0000'); // Red color
            toastr.error("Session Expired", {timeOut: 200});
            setTimeout(window.location.href = "Account/Login.aspx", 10000);
            return;
        }
        $("#loader2").fadeIn();
        var res= await GetDashboardTabs();
        if(res.response==-1)
        {
            ErrMsg=res.responseMsg;
            throw ErrMsg;
        }
        var cardcap="";
        var myData = res.responseObjectList;
        for (var k = 0; k < myData.length; k++) 
        {
            cardcap += String.format('<div class="col-lg-3 col-6"><a href="{0}" class="small-box-footer"><div class="{1}"><div class="inner"><h3 style="color:white;">{2}</h3><p style="color:white;font-size:1.25rem;">{3}</p></div></div></a></div>',myData[k].url,myData[k].color,myData[k].JR_count, myData[k].tabname);
        }
        document.getElementById("cardbox").innerHTML = cardcap;
         $("#loader2").fadeOut();
    
    } catch (err) {
       $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
    }
    finally
    {
      $("#loader2").fadeOut();
    }


}


function GetDashboardTabs() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetDashboardTabs",
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

//07-02-2022----->

function getPendingJR(usercd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getPendingJR",
            data: "{'varempcd' : '" + usercd + "'}",
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

async function BindGrid() 
{
    var ErrMsg=null;
    // Hide image container
   // $("#loader2").fadeIn();
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
            
            var res= await  getPendingJR(usercd);
            if (res.response ==-1) 
            {
                ShowEmptyTable();
                ErrMsg= res.responseMsg;
                throw ErrMsg;
            }
            var myData = res.responseObjectList;
           // $("#loader2").fadeOut();
            populateGrid(myData).catch(function(reason) {ErrMsg="An Error found during populate the Grid";  throw ErrMsg;});

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
      //  $("#loader2").fadeOut();
    }
    finally
    {
         // Hide image container
      //  $("#loader2").fadeOut();   
    }
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
            "scrollY": "300",
            "scrollX": "true",
            'order':[],
            'columnDefs': [{
                "targets": 0,
                "orderable": false
            }]
        });
        $(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
        $(".dataTables_filter").hide();   //--HIde Search label and textbox         });
      //  table.order( [ 4, 'desc' ] ).draw();
        setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 100);                   
    
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

//07-02-2022----->