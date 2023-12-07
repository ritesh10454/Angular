
var varitmnos=0
var PRP_Department_List;
var PRP_Employee_List;
var PRP_CostCentre_List;
var PRP_ConsumptionCentre_List;
var ConsumptionCentre;
var CostCentre;
var PRP_Items;
var prpMIVList;
var scrollPos=0;
var negChec=0;
var dtable = []; //Table object for Preserve row
var table;
var pmivhdr=[];

var $ = jQuery.noConflict();

$(document).ready(function()
{
    ChangeBreadCrumb("Action", "JREntry", "Action");    
    JREntry_Load();  
    SetTabs();  
    $("#issueBody").addClass("sidebar-collapse");
});

function SetTabs()
{
    $("[id*=txtRetRes]").attr('tabindex', -1);
    $("[id*=btnSearch]").attr('tabindex', -1);
    $("[id*=drpEmployee]").attr('tabindex', 1);
    $("[id*=txtitmCd]").attr('tabindex', 2);
    $("[id*=DropDownList2]").attr('tabindex', 3);
    $("[id*=txtReqireQty]").attr('tabindex', 4);
    $("[id*=drpConCen]").attr('tabindex', 5);
    $("[id*=drpCosCen]").attr('tabindex', 6);
    $("[id*=btnadd]").attr('tabindex', 7);
}


$(".myTab").change(function(){
    $("[id*=lblMessage]").text(""); 
    $(this).removeClass('tabcolor');
	var sta =(getQueryVariable("sta")==false) ? 0 : parseInt(getQueryVariable("sta").toString());
});


 $(".datepicker").datepicker({
    dateFormat: "dd/mm/yy",     // SET THE FORMAT.
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


function changeDate() {
    var currdt = new Date();
    var mth = (currdt.getMonth()+1);
    var dy = currdt.getDate();
    var yr =Math.abs(currdt.getFullYear());
    if (mth < 10) {   mth = '0' + mth; }
    if (dy < 10) {   dy = '0' + dy; }
    var dt =mth + '/' + dy + '/' + Math.abs(currdt.getFullYear());
    $("[id*=txteffectivedate]").val(ChangeDateFormat(dt));
}



function Convert_StringInDateFormat(dt) {
    var formatted_date = "";
    if (dt == null || dt == "") return formatted_date;
    var d = dt.split("/");
    var month = parseInt(d[1]);
    var date = parseInt(d[0]);
    var year =Math.abs(d[2]);
    if (month < 10) {   month = '0' + month; }
    if (date < 10) {   date = '0' + date; }
    var formatted_date = month + "/" + date + "/" + year;
    return formatted_date;
}

function Convert_DateInStringFormat(dt)
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

//function DateFormat1(dt)
//{
//    var formatted_date = "";
//    if (dt == null || dt == "") return formatted_date;
//    var d = new Date(dt);
//    var date = d.getDate();
//    var month = parseInt(d.getMonth())+1;
//    var year = Math.abs(d.getFullYear());
//    if (month < 10) {   month = '0' + month; }
//    if (date < 10) {   date = '0' + date; }
//    // let current_datetime = new Date()
//    var formatted_date = date + "/" + month + "/" + year;
//    return formatted_date;
//}

//function display_DateFormat(dt) {
//    var formatted_date = "";
//    if (dt == null || dt == "") return formatted_date;
//    var d = dt.split("/");
//    var month = parseInt(d[1]);
//    var date = parseInt(d[0]);
//    var year =Math.abs(d[2]);
//    if (month < 10) {   month = '0' + month; }
//    if (date < 10) {   date = '0' + date; }
//    var formatted_date = date + "/" + month + "/" + year;
//    return formatted_date;
//}


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


async function JREntry_Load() 
{
    var ErrMsg=null;
    var gridresult=null;
    var objFinal=null;
    var jrEmpcd=null; var jrDeptcd=null; var jrDesigncd=null;
    try 
    {
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
            $("[id*=hdfUserID]").val(usercd.toString());

            var itmData=null; var myData=null; var obj=null; var res=null;// itms.responseObjectList;

            var empcd = (getQueryVariable("empcd")==false) ? "" : getQueryVariable("empcd").toString().trim();
            var jrId =(getQueryVariable("jrId")==false) ? 0 : parseInt(getQueryVariable("jrId").toString()); 
            if(jrId!=0)
            {
                obj = await getDepartmentList(empcd.toString().trim());
            }
            else {
                obj = await getDepartmentListtoFirstAuthority(usercd.toString().trim());
            }
             
            if (obj.response ==-1) {
                ErrMsg=  obj.responseMsg;
			    throw ErrMsg;
            }
            var myObj = obj.responseObjectList;   //.responseObject;

            PRP_Department_List = myObj;   // myObj.Department;

            $("[id*=btnSave]").text("Save");
            Department=null; Department ='<option value="0">--Select--</option>'
            $.each(PRP_Department_List,function(){
                Department += '<option value="'+this["dept_cd"]+'">'+this["dept_nm"]+' </option>';
            });
            $("[id*=drpDepartment]").empty();
            $("[id*=drpDepartment]").append(Department);
            $("[id*=txtRevisionNo]").attr("disabled","disabled");
            $("[id*=txtsupersedeno]").attr("disabled","disabled");

            var currdt= new Date();
            $("[id*=txteffectivedate]").val(Convert_DateInStringFormat(currdt));

            var encStr =(getQueryVariable("tag")==false) ? 0 : getQueryVariable("tag").toString(); 
            var tag =null;
            if(encStr !=0)
            {
                tag= await decryptQueryString(encStr);
            }
            else 
            {
                tag=0;
            }

            var deptcd =(getQueryVariable("deptcd")==false) ? 0 : parseInt(getQueryVariable("deptcd").toString()); 
            
            if(jrId!=0)
            {
                $("[id*=btnSave]").text("Update");    
                $("[id*=drpDepartment] option:selected").removeAttr("selected");
                $("[id*=drpDepartment] option[value='" + deptcd +"']").attr('selected', 'selected');
                $("[id*=drpDepartment]").attr("disabled", "disabled");

                res =await GetEmployeeDetail(empcd.toString().trim());
                if (res.response == -1) {
                    ErrMsg =(res.responseMsg);
                    throw ErrMsg;
                }
                var objprpemployeedetail= res.responseObject;
                $("[id*=txtDesignation]").val(objprpemployeedetail.desig_nm);
                $("[id*=txtemployeename]").val(objprpemployeedetail.emp_nm);
                $("[id*=txtemployeecode]").val(objprpemployeedetail.emp_cd);
//                $("[id*=txtdateofjoining]").val(ChangeDateFormat(objprpemployeedetail.dt_join));
                $("[id*=txtdateofjoining]").val(objprpemployeedetail.dt_join);
                $("[id*=lbldeptcd]").text(objprpemployeedetail.dept_cd)
                $("[id*=lbldesigcd]").text(objprpemployeedetail.desig_cd)
                $("[id*=lblcatgcd]").text(objprpemployeedetail.catg_cd)
                $("[id*=lblcatgnm]").text(objprpemployeedetail.catg_nm)

                if ($("[id*=drpDepartment] option:Selected").val() != "0" )
                {            
                    var res =await getEmployee(drpDepartment.value);
                    if (res.response == -1) {
                        ErrMsg =(res.responseMsg);
                        throw ErrMsg;
                    }
                    var objprpemployee= res.responseObjectList;

                    var Employee=null; Employee ='<option value="0">--Select--</option>'
                    $.each(objprpemployee,function(){
                        Employee += '<option value="'+this["emp_cd"]+'">'+this["emp_nm"]+' </option>';
                    });
                    $("[id*=drpEmployee]").empty();
                    $("[id*=drpEmployee]").append(Employee);

                    $("[id*=drpEmployee] option:selected").removeAttr("selected");
                    $("[id*=drpEmployee] option[value='" + empcd +"']").attr('selected', 'selected');
                    $("[id*=drpEmployee]").attr("disabled", "disabled");  
                }

                if (tag==1) 
                {
                    $("[id*=btnaction]").show();
                    $("[id*=btnaction]").text(""); 
                    $("[id*=btnaction]").removeAttr("disabled");
                    $("[id*=btnaction]").hide();
                    objFinal=null;
                    objFinal= await getJRContents(jrId);
                    if (objFinal.response == -1) 
                    {
                        ErrMsg =(objFinal.responseMsg);
                        throw ErrMsg;
                    }
                    var firstapp_id = isEmpty(objFinal.responseObject.firstapp_id)?"" : objFinal.responseObject.firstapp_id;
                    if(firstapp_id !="") 
                    {
                            $("[id*=btnaction]").attr("disabled","disabled");
                    } 
                    else
                    {
                        $("[id*=btnaction]").removeAttr("disabled");
                    } 
                }
                else if(tag==2)
                {
                    $("[id*=btnSave]").hide();
                    $("[id*=txteffectivedate]").attr("disabled","disabled");
                    $("[id*=txtRevisionNo]").attr("disabled","disabled");
                    $("[id*=txtsupersedeno]").attr("disabled","disabled");
                    $("[id*=txtreason]").attr("disabled","disabled");
                    $("[id*=txtjobdesc]").summernote('disable');
                    $("[id*=btnaction]").show();
                    $("[id*=btnaction]").removeAttr("disabled");
                    $("[id*=btnaction]").text("Forward");
                    $("[id*=btnSave]").hide();
                    $("[id*=txteffectivedate]").attr("disabled","disabled");
                    $("[id*=txtRevisionNo]").attr("disabled","disabled");
                    $("[id*=txtsupersedeno]").attr("disabled","disabled");
                    $("[id*=txtreason]").attr("disabled","disabled");
                    $("[id*=txtjobdesc]").summernote('disable');
                    $("[id*=btncancel]").removeAttr("disabled"); 
                    $("[id*=btncancel]").show(); 
                    objFinal=null;
                    objFinal= await getJRContents(jrId);
                    if (objFinal.response == -1) 
                    {
                        ErrMsg =(objFinal.responseMsg);
                        throw ErrMsg;
                    }
                    var tra = isEmpty(objFinal.responseObject.tra)?"" : objFinal.responseObject.tra;
                    var sta = isEmpty(objFinal.responseObject.sta)?"" : objFinal.responseObject.sta;
                    if(tra=="F" && sta=="2")
                    {
                        $("[id*=btncancel]").attr("disabled","disabled");
                        $("[id*=btncancel]").hide(); 
                    }

                    var objemp_app_dt = isEmpty(objFinal.responseObject.Emp_app_dt)?"" : objFinal.responseObject.Emp_app_dt;
                    if(objemp_app_dt !="")
                    {
                        $("[id*=btnaction]").attr("disabled","disabled"); 
                        $("[id*=btncancel]").attr("disabled","disabled");
                        $("[id*=btncancel]").hide();                     
                    }
                    var objfinalapp_id = isEmpty(objFinal.responseObject.finalapp_id)?"" : objFinal.responseObject.finalapp_id;
                    if(objfinalapp_id !="") 
                    {
                            $("[id*=btnPrint]").removeAttr("disabled");
                            $("[id*=btnPrint]").show();
                            $("[id*=btncancel]").attr("disabled","disabled");
                            $("[id*=btncancel]").hide();  
                    }
                }
                else if(tag==3)
                {
                    $("[id*=btnaction]").show();
                    $("[id*=btnaction]").text("");    
                    $("[id*=btnaction]").hide();            
                    $("[id*=btnaction]").removeAttr("disabled");
                    if(usercd.toString().trim()=="P17036")
                    {
                        $("[id*=btnaction]").show();
                        $("[id*=btnaction]").text("Final Approve");
                        $("[id*=btnaction]").removeAttr("disabled");
                        $("[id*=btnSave]").hide();
                        $("[id*=txteffectivedate]").attr("disabled","disabled");
                        $("[id*=txtRevisionNo]").attr("disabled","disabled");
                        $("[id*=txtsupersedeno]").attr("disabled","disabled");
                        $("[id*=txtreason]").attr("disabled","disabled");
                        $("[id*=txtjobdesc]").summernote('disable');
                        objFinal=null;
                        objFinal= await getJRContents(jrId);
                        if (objFinal.response == -1) 
                        {
                            ErrMsg =(objFinal.responseMsg);
                            throw ErrMsg;
                        }
                        var finalID = isEmpty(objFinal.responseObject.hr_finalapp_id)?"" : objFinal.responseObject.hr_finalapp_id;
                        if(finalID !="") 
                        {
                             $("[id*=btnaction]").attr("disabled","disabled");
                        } 
                        else
                        {
                            $("[id*=btnaction]").removeAttr("disabled");
                        }                       
                    }              
                }
                else if(tag==4)
                {
                    $("[id*=btnaction]").show();
                    $("[id*=btnaction]").removeAttr("disabled");
                    $("[id*=btnaction]").text("Approve");
                    $("[id*=btncancel]").show();
                    $("[id*=btncancel]").removeAttr("disabled");
                    $("[id*=btnSave]").hide();
                    $("[id*=txteffectivedate]").attr("disabled","disabled");
                    $("[id*=txtRevisionNo]").attr("disabled","disabled");
                    $("[id*=txtsupersedeno]").attr("disabled","disabled");
                    $("[id*=txtreason]").attr("disabled","disabled");
                    $("[id*=txtjobdesc]").summernote('disable');
                    $("[id*=txteffectivedate]").val(Convert_DateInStringFormat(new Date()));
                    objFinal=null;
                    objFinal= await getJRContents(jrId);
                    if (objFinal.response == -1) 
                    {
                        ErrMsg =(objFinal.responseMsg);
                        throw ErrMsg;
                    }
                    var finalID = isEmpty(objFinal.responseObject.finalapp_id)?"" : objFinal.responseObject.finalapp_id;
                    if(finalID !="") 
                    {
                            $("[id*=btnaction]").attr("disabled","disabled");
                            $("[id*=btncancel]").attr("disabled","disabled");
                    }
                    else 
                    {
                          //  $("[id*=txteffectivedate]").removeAttr("disabled");
                            $("[id*=effectiveDt]").show();
                    }                  
                }
            } 
           
			//JR HDR Detail
            var res_jr=null;
            var jrId =(getQueryVariable("jrId")==false) ? 0 : parseInt(getQueryVariable("jrId").toString()); 
            if(jrId!=0)
            {
                var res_jr= await GetJRHdr($("[id*=txtemployeecode]").val(),$("[id*=lbldeptcd]").text(),$("[id*=lbldesigcd]").text(),jrId);

			    // var res_jr =await GetJRHdr(objprpemployeedetail.emp_cd,objprpemployeedetail.dept_cd,objprpemployeedetail.desig_cd,jrId);
			    if (res_jr.response == -1) {
				    //ControlBlank()
				    ControlBlank_Part();
				    ErrMsg =(res_jr.responseMsg);
				    throw ErrMsg;
			    }
			    var objprpjrhdr = res_jr.responseObject;
			    var entryexists = objprpjrhdr.EntryExists;
                if (tag==4 && finalID=="") {
                    objprpjrhdr.revision_date=Convert_DateInStringFormat(new Date());
                }

			    $("#txtjobdesc").summernote('code',objprpjrhdr.jr_detail);
			    $("[id*=txtRevisionNo]").val(objprpjrhdr.revision_no);
			    $("[id*=txteffectivedate]").val(objprpjrhdr.revision_date);
			    $("[id*=txtsupersedeno]").val(objprpjrhdr.supersede_no);
			    $("[id*=txtreason]").val(objprpjrhdr.reason);
			    $("[id*=lblf_hdr_id]").text(objprpjrhdr.f_hdr_id)

			    $("[id*=lblMessage]").text("");
			    //19-05-2022----->

			    var res= await  getJRRevision(objprpemployeedetail.emp_cd);
			    if (res.response ==-1) 
			    {
                    $('#JRRevisionTable').dataTable().fnClearTable();
               	    $(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
                    $(".dataTables_filter").hide();   //--HIde Search label and textbox         });
                    setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 100);
				    ErrMsg= res.responseMsg;
				    throw ErrMsg;
			    }
			    var myData = res.responseObjectList;
			    $("#loader").fadeOut();
			    populateGrid(myData).catch(function(reason) {ErrMsg="An Error found during populate the Grid";  throw ErrMsg;});
            } 
        }

        if (ErrMsg == null ) 
        {
            $("[id*=lblMessage]").text("");
            $("[id*=lblMessage2]").text("");
        }    
    } 
    catch (err) 
    {
        $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
        toastr.error(err, {timeOut: 200});;
        $(".loader").fadeOut();
    } 
    finally
    {
        $(".loader").fadeOut();
    }
}


function isNumberfloatKey(evt, element,afterDot) {
  var afterDot = afterDot+1;
  var charCode = (evt.which) ? evt.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57) && !(charCode == 46 || charCode == 8))
    return false;
  else 
  {
    var len = $(element).val().length;
    var index = $(element).val().indexOf('.');
    if (index > 0 && charCode == 46) 
    {
      return false;
    }
    if (index > 0) 
    {
      var CharAfterdot = (len + 1) - index;
      if (CharAfterdot > afterDot) 
      {
        return false;
      }
    }
  }
  return true;
}


function hideShowColumn(classnm,do_show)
 {
    var stl;
    if (do_show) stl = 'block'
    else         stl = 'none';
    var elems = document.getElementsByClassName(classnm);
    for(var i = 0; i<elems.length; i++) {
       // elems[i].style.display = "none";
       elems[i].style.display = do_show ? '' : 'none';
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

Array.prototype.remove = function (v) {
    if (this.indexOf(v) != -1) {
        this.splice(this.indexOf(v), 1);
        return true;
    }
    return false;
}

function ChangeDateFormat(dt)
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



function GetUserDetail(usercd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetUserDetail",
           data: "{'usercd' : '" + usercd + "'}",
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



function GetUserRole() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetUserRole",
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

//Sushil ----->
function getDepartmentList(empcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getDepartmentList",
            data: "{'empcd' : '" + empcd + "'}",
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

function getDepartmentListtoFirstAuthority(empcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getDepartmentListtoFirstAuthority",
            data: "{'empcd' : '" + empcd + "'}",
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







function GetEmployeeDetail(empcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetEmployeeDetail",
            data: "{'varempcd' : '" + empcd + "' }",
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


function GetJRHdr(empcd,deptcd,desigcd,jrID) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetJRHdr",
            data: "{'varempcd' : '" + empcd + "','vardeptcd' : '" + deptcd + "','vardesigcd' : '" + desigcd + "','jrID' : " + jrID + "}",
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

//Sushil -----<

// App variable to show the confirm response
function getQueryVariable(variable) {

    var query =window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function getDepartment() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getDepartment",
            data: "{}",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (response) {
                var myData = response.d;
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

function getEmployeeforJREntry(deptcd,empcd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getEmployeeforJREntry",
            data: "{'vardeptcd' : '" + deptcd + "','varempcd' : '" + empcd + "'}",
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




function SaveJREntry(com) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/SaveJREntry",
            data:  JSON.stringify({'p': com}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (response) {
                var myData = response.d;
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

function updateJREntry(com) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/UpdateJREntry",
            data:  JSON.stringify({'p': com}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (response) {
                var myData = response.d;
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

function JR_Approval(com) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/JR_Approval",
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




function ControlBlank()
{
    $("input[id*=txtemployeename]").val("");
    $("input[id*=txtemployeecode]").val("");
    $("input[id*=txtDesignation]").val("");
    $("input[id*=txtdateofjoining]").val(""); 
    $("input[id*=txtjobdesc]").val(""); //Summer note
    $("input[id*=txtRevisionNo]").val("");
    $("input[id*=txteffectivedate]").val("");
    $("input[id*=txtsupersedeno]").val("");
    $("input[id*=txtreason]").val("");    
}

function ControlBlank_Part()
{

    $("#txtjobdesc").summernote("code",""); //Summer note
    $("input[id*=txtRevisionNo]").val("");
    $("input[id*=txteffectivedate]").val("");
    $("input[id*=txtsupersedeno]").val("");
    $("input[id*=txtreason]").val("");    
}

//Sushil----->

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

        if ($("[id*=drpDepartment] option:Selected").val() != "" )
        {            
            var res =await getEmployeeforJREntry($("[id*=drpDepartment] option:Selected").val(),ucd.toString().trim());
//            var res =await getEmployee(drpDepartment.value);
            if (res.response == -1) {
                ErrMsg =(res.responseMsg);
                throw ErrMsg;
            }
            var objprpemployee= res.responseObjectList;

            var Employee=null; Employee ='<option value="0">--Select--</option>'
            $.each(objprpemployee,function(){
                Employee += '<option value="'+this["emp_cd"]+'">'+this["emp_nm"]+' </option>';
            });
            $("[id*=drpEmployee]").empty();
            $("[id*=drpEmployee]").append(Employee);

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


async function drpEmployee_IndexChange()
{
    var ErrMsg=null;
    var btnSave =$("[id*=btnSave]")
    $(".loader").fadeIn();
    try
    {
        getJRDetail();
	    btnSave.text("Save");
	    $("[id*=lblMessage]").text("");
	    $("#loader").fadeOut();
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

async function getJRDetail()
{
    var ErrMsg=null;
    try {
        if ($("[id*=drpEmployee] option:Selected").val() != "" )
        {
            //Employee Detail          
			 
            var res =await GetEmployeeDetail($("[id*=drpEmployee] option:Selected").val());
            if (res.response == -1) {
                ErrMsg =(res.responseMsg);
                throw ErrMsg;
            }
            var objprpemployeedetail= res.responseObject;

            $("[id*=txtDesignation]").val(objprpemployeedetail.desig_nm);
            $("[id*=txtemployeename]").val(objprpemployeedetail.emp_nm);
            $("[id*=txtemployeecode]").val(objprpemployeedetail.emp_cd);
//            $("[id*=txtdateofjoining]").val(ChangeDateFormat(objprpemployeedetail.dt_join));
            $("[id*=txtdateofjoining]").val(objprpemployeedetail.dt_join);
            
            $("[id*=lbldeptcd]").text(objprpemployeedetail.dept_cd);
            $("[id*=lbldesigcd]").text(objprpemployeedetail.desig_cd);
            $("[id*=lblcatgcd]").text(objprpemployeedetail.catg_cd);
            $("[id*=lblcatgnm]").text(objprpemployeedetail.catg_nm);
            $("#txtjobdesc").summernote('code',"");

            //JR HDR Detail
           // var jrId =(getQueryVariable("jrId")==false) ? 0 : parseInt(getQueryVariable("jrId").toString()); 
           // if(jrId!=0)
           var hdr_id =isEmpty($("[id*=lblf_hdr_id]").text())? 0: parseInt($("[id*=lblf_hdr_id]").text());
            //{
                var res_jr =await GetJRHdr($("[id*=drpEmployee] option:Selected").val(),objprpemployeedetail.dept_cd,objprpemployeedetail.desig_cd, hdr_id);
                if (res_jr.response == -1) {
                    //ControlBlank()
                    ControlBlank_Part();
                    $('#JRRevisionTable').dataTable().fnClearTable();
                    $(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
                    $(".dataTables_filter").hide();   //--HIde Search label and textbox         });
                    setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 100);
                    ErrMsg =res_jr.responseMsg;
                    throw ErrMsg;
                }
                var objprpjrhdr = res_jr.responseObject;
                var entryexists = objprpjrhdr.EntryExists;

                if (objprpjrhdr.EntryExists == 0)
                {
                    var res= await getConfirm("JR Data not Found for this Employee. Do you want to get the JR Detail from same Designation Employee within Same Department?");
                    if (res=="OK") 
                    {
                        $("#txtjobdesc").summernote('code',objprpjrhdr.jr_detail);
                        if (objprpjrhdr.jr_detail != "") 
                        {
                                $("#txtjobdesc").summernote('code',objprpjrhdr.jr_detail);
                        }
                        else 
                        {
                            toastr.error("JR Detail not Found", {timeOut: 200}); 
                        }
                    }


                   changeDate();
                    $("[id*=txtRevisionNo]").val(objprpjrhdr.revision_no);
    //                $("[id*=txteffectivedate]").val(ChangeDateFormat(objprpemployeedetail.dt_join));
                    $("[id*=txteffectivedate]").val(objprpemployeedetail.dt_join);
                    $("[id*=txtsupersedeno]").val('Nil');
                    $("[id*=txtreason]").val(objprpjrhdr.reason);
                    $("[id*=lblf_hdr_id]").text(objprpjrhdr.f_hdr_id);        
                }
                else
                {
                    $("#txtjobdesc").summernote('code',objprpjrhdr.jr_detail);
                    if($("[id*=btnSave]").is(":disabled"))
                    {
                        $("[id*=txtRevisionNo]").val(parseInt(objprpjrhdr.revision_no));
                        $("[id*=txtsupersedeno]").val((objprpjrhdr.supersede_no.toString().trim()=="-1")? "Nil" : objprpjrhdr.supersede_no.toString().trim());  //       parseInt((objprpjrhdr.supersede_no.toString().trim()=='Nil') ? "-1": objprpjrhdr.supersede_no.toString().trim())+1);
                    }
                    else 
                    {
                        $("[id*=txtRevisionNo]").val(parseInt(objprpjrhdr.revision_no)+1);
                        $("[id*=txtsupersedeno]").val(parseInt((objprpjrhdr.supersede_no.toString().trim()=='Nil') ? "-1": objprpjrhdr.supersede_no.toString().trim())+1);
                    }
                    
    //                $("[id*=txteffectivedate]").val(ChangeDateFormat(objprpjrhdr.revision_date));
                    $("[id*=txteffectivedate]").val(objprpjrhdr.revision_date);                    
                    $("[id*=txtreason]").val(objprpjrhdr.reason);
                    $("[id*=lblf_hdr_id]").text(objprpjrhdr.f_hdr_id);
                }
			    var res= await  getJRRevision(drpEmployee.value);
			    if (res.response ==-1) 
			    {
                    $('#JRRevisionTable').dataTable().fnClearTable();
               	    $(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
                    $(".dataTables_filter").hide();   //--HIde Search label and textbox         });
                    setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 100);
				    ErrMsg= res.responseMsg;
				    throw ErrMsg;
			    }
			    var myData = res.responseObjectList;
			    populateGrid(myData).catch(function(reason) {ErrMsg="An Error found during populate the Grid";  throw ErrMsg;});
            //}
        //19-05-2022-----<
        }
        else 
        {
            ErrMsg="Select employee first";
            throw ErrMsg;
        }
    
    } catch (err) {
        $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
        toastr.error(err, {timeOut: 200});    
    }
}








//02-12-2021
async function txtRevisionNo_Change()
{
    var ErrMsg=null;
    var btnSave =$("[id*=btnSave]");
    var txtRevisionNo = $("[id*=txtRevisionNo]");
    var deptcd = $("[id*=lbldeptcd]");
    var desigcd = $("[id*=lbldesigcd]");

    $(".loader").fadeIn();
    try
    {
        if ($("[id*=drpEmployee] option:Selected").val() != "" )
        {
            //JR HDR Detail
            var res_jr = await GetJRHdr($("[id*=drpEmployee] option:Selected").val(), deptcd.text(), desigcd.text());
            if (res_jr.response == -1) {
                //ControlBlank()
                //ControlBlank_Part()
                ErrMsg =(res_jr.responseMsg);
                throw ErrMsg;
            }
            var objprpjrhdr= res_jr.responseObject;
            if ( parseInt(objprpjrhdr.revision_no) <  parseInt(txtRevisionNo.val()))
            {
                //change caption 02-12-2021
                btnSave.text("Save");
                changeDate();

            }
            else
            {
                //change caption 02-12-2021                
                btnSave.text("Update");
            }


        $("[id*=lblMessage]").text("");

        }
        else 
        {
            ErrMsg="Select employee first";
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

function check_validation() 
{
    return new Promise(async function (resolve, reject) {
        var result="";
        $("[id*=lblMessage]").text("");
        if ($("[id*=txteffectivedate]").val() == "" ) 
        {
            $("[id*=txteffectivedate]").addClass('tabcolor');
            result="Select Effective Date";
            reject("Select Effective Date"); 
        }
        if ($("[id*=txtRevisionNo]").val() == "" ) 
        {
            $("[id*=txtRevisionNo]").addClass('tabcolor');
            result="Enter Revision No.";
            reject("Enter Revision No."); 
        }
        if ($("[id*=txtreason]").val() == "" ) 
        {
            $("[id*=txtreason]").addClass('tabcolor');
            result="Enter Reason";
            reject("Enter Reason"); 
        }
        if($('#txtjobdesc').summernote('code')=="")
        {
            $('#txtjobdesc').summernote('code').addClass('tabcolor');
            result="Enter JR Detail";
            reject("Enter JR Detail"); 
        }

        var getDoj =   Convert_StringInDateFormat($("[id*=txtdateofjoining]").val());
        var getEffectivedt = Convert_StringInDateFormat($("[id*=txteffectivedate]").val());



        if (new Date(getEffectivedt) < new Date(getDoj)) 
        {
            $("[id*=txteffectivedate]").addClass('tabcolor');
            result="Effective Date should not be less than Date of Joining";
            reject("Effective Date should not be less than Date of Joining "); 
        }

//        var doj= new Date(Convert_StringInDateFormat($("[id*=txtdateofjoining]").val()));
//        doj.setDate(doj.getDate() + 2);
//        var getDoj = (doj) ;
//        var getEffectivedt = Convert_StringInDateFormat($("[id*=txteffectivedate]").val());

//        if(new Date(getEffectivedt) > new Date(getDoj))
//        {
//            $("[id*=txteffectivedate]").addClass('tabcolor');
//            result="Preparation must be done with in 2 days of New entrant handover to department";
//            reject("Preparation must be done with in 2 days of New entrant handover to department"); 
//        }

        if (result=="") {
            resolve("VALID");
        }
    });
}



//02-12-2021
//Sushil-----<

async function btnaction_Click()
{
    var btnSave =$("[id*=btnSave]");
    var btnCheck =$("[id*=btnCheck]");
    var btnaction =$("[id*=btnaction]");
    var btncancel =$("[id*=btncancel]");
    var txtDesignation =$("[id*=txtDesignation]");
    var drpDepartment=$("[id*=drpDepartment] option:Selected");
    var drpEmployee=$("[id*=drpEmployee] option:Selected");
    var txtemployeecode =$("[id*=txtemployeecode]");
//    var lblempdesigname = txtDesignation.val().split('/')[0];
    var lblempdesigname = txtDesignation.val();
    var txtdateofjoining =$("[id*=txtdateofjoining]");
    var txtRevisionNo =$("[id*=txtRevisionNo]");
    var txteffectivedate =$("[id*=txteffectivedate]");    
    var txtsupersedeno =$("[id*=txtsupersedeno]");
    var txtreason =$("[id*=txtreason]")
    var get_jrdetail = $('#txtjobdesc').summernote('code');  
    var objMax=null;var objMaxRole=null;


    ////////current date////////////
    var currdt= new Date();
    currdt = (currdt.getMonth()+1) + '/' + currdt.getDate() + '/' + Math.abs(currdt.getFullYear());
    ///////////end/////////////////
    var res =null;
    var ErrMsg=null;
    var objMax=null;
    var varretno=0;
    try 
    {
        $(".loader").fadeIn(); 
        var ucd = await getSessionVariables();
        if (ucd.length == 0)
        {
            $("[id*=lblMessage]").text("Session is Expired , Please Login Again").css('color', '#ff0000'); // Red color 
            toastr.success( "Session is Expired , Please Login Again", {timeOut: 1000});
            setTimeout(window.location.href = "Account/Login.aspx", 10000);
        }


        $("[id*=hdfUserID]").val(ucd.toString().trim());
        if ($("[id*=btnaction]").text() == "Forward" || $("[id*=btnaction]").text() == "Approve" || $("[id*=btnaction]").text() == "Final Approve") 
        {   
            ///////////////////Forward Code//////////////////////
            var encStr =(getQueryVariable("tag")==false) ? 0 : getQueryVariable("tag").toString(); 
            var tag =null;
            if(encStr !=0)
            {
                tag= await decryptQueryString(encStr);
            }
            else 
            {
                tag=0;
            }

            var empcd = (getQueryVariable("empcd")==false) ? "" : getQueryVariable("empcd").toString().trim();
            var jrId =(getQueryVariable("jrId")==false) ? 0 : parseInt(getQueryVariable("jrId").toString()); 
            if (jrId!=0) 
            {
                var objJRHDR = new Object();
                objJRHDR.f_hdr_id = jrId;
                objJRHDR.emp_cd=  txtemployeecode.val();
//                if(tag==1)  //--- User Outbox ----------
//                {
////                    var objRole = await JR_getUserRole(empcd.toString().trim(), usercd.toString().trim());
////                    if (objRole.response == -1) {
////                        ErrMsg =(objRole.responseMsg);
////                        throw ErrMsg;
////                    }
////                    var objuserRole = objRole.responseObjectList;
////                    for (var i = 0; i < objuserRole.length; i++) 
////                    {
////                        if(objuserRole[i].RoleId==3)
////                        {
////                            objJRHDR.RoleId = 3; 
////                            objJRHDR.finalapp_id = ucd.toString().trim();  
////                            break;
////                        }                     
////                    }
//                    objJRHDR.RoleId = 3; 
//                    objJRHDR.finalapp_id = ucd.toString().trim();         
//                    objJRHDR.btnaction="FirstAuth_Approve"                
//                }  
                if(tag==2)  //--- User Outbox ----------
                {
                    objJRHDR.RoleId = 2; 
                    objJRHDR.finalapp_id = ucd.toString().trim();          
                    objJRHDR.btnaction="UserApprove";            
                }                         
                else if(tag==3)  //--- HR Inbox ----------
                {
                    objJRHDR.RoleId = 6; 
                    objJRHDR.finalapp_id = ucd.toString().trim();          
                    objJRHDR.btnaction="FinalAuth_Approve";              
                }
                else if(tag==4)  //--- HOD Inbox ----------
                {
                    $(".loader").fadeOut(); 
//                    var res = await getConfirm("Please verify Effective Date before approval. Is it Ok?");
//                    if(res=="OK")
//                    {
//                        objJRHDR.RoleId = 5; 
//                        objJRHDR.finalapp_id = ucd.toString().trim(); 
//                        objJRHDR.revision_date= Convert_StringInDateFormat(txteffectivedate.val());       
//                        objJRHDR.btnaction="Forward";
//                    }
//                    else
//                    {
//                        $("[id*=txteffectivedate]").addClass('tabcolor');
//                        ErrMsg="Verify Effective Date";
//                        throw ErrMsg;
//                    }
                        objJRHDR.RoleId = 5; 
                        objJRHDR.finalapp_id = ucd.toString().trim(); 
                        objJRHDR.revision_date= Convert_StringInDateFormat(txteffectivedate.val());       
                        objJRHDR.btnaction="Forward";
                 
                }                 
                var res=null;
                res=  await JR_Approval(objJRHDR);
                if (res.response == -1) {
                        ErrMsg =res.responseMsg;
                        throw ErrMsg;
                }
                var msgTxt = res.responseMsg;  //  "JR is Approved and forwarded to HR department Successfully.";
                $("[id*=lblMessage]").text(msgTxt).css('color', '#008000'); // Green color
                toastr.success(msgTxt, {timeOut: 200});
                btnaction.attr("disabled","disabled");    //    .Enabled = False
                btnCheck.attr("disabled","disabled");    //     Enabled = False 

                var strUrl =null;
                if (tag==1) 
                {
                    strUrl="JRInbox.aspx";
                }
                else if(tag==2)
                {
                    strUrl="JROutbox.aspx";
                }
                else if (tag==3) 
                {
                    strUrl="JRFinalApproval.aspx";
                }
                else if (tag==4) 
                {
                    strUrl="HODApproval.aspx";
                }

                setTimeout(window.location.href = strUrl, 5000);                 
            }
     
            /////////////////////////End///////////////////////////
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





async function btnSave_Click()
{
    var btnSave =$("[id*=btnSave]");
    var btnCheck =$("[id*=btnCheck]");
    var btnaction =$("[id*=btnaction]");
    var btncancel =$("[id*=btncancel]");

    var lblempname =$("[id*=txtemployeename]");
//    var arrayempname = lblempname.val().split('-');
    var arrayempname = lblempname.val();
//    var lblonlyempname = arrayempname[0];
    var lblonlyempname = arrayempname;
    var lblempcd =$("[id*=txtemployeecode]");
    var lblempdesig =$("[id*=txtDesignation]");
    var arrayempdesigname = lblempdesig.val().split('/');
    var lblempdesigname = arrayempdesigname[0];
    var lblempdoj =$("[id*=txtdateofjoining]");
    var lblemprevisionno =$("[id*=txtRevisionNo]");
    var lblemprevisiondate =$("[id*=txteffectivedate]");    
    var lblempsupersedeno =$("[id*=txtsupersedeno]");
    var lblempreason =$("[id*=txtreason]");


    //Sushil 05-10-2021
    var get_jrdetail = $('#txtjobdesc').summernote('code');  
    
    ////////current date////////////
    var currdt= new Date();
    currdt = (currdt.getMonth()+1) + '/' + currdt.getDate() + '/' + Math.abs(currdt.getFullYear());
    ///////////end/////////////////
    var res =null;
    var ErrMsg=null;
    var objPrpJREmphdr = new Object();
    try {

    var res = await check_validation(); 
	if (res != "VALID") 
	{
		ErrMsg= res;
		throw ErrMsg; 
	}
    else
    {
        $(".loader").fadeIn();
	    var usercd= await  getSessionVariables();
	    if (usercd.length ==0)
	    {
		    $("[id*=lblMessage]").text("Session Expired").css('color', '#ff0000'); // Red color
		    toastr.error("Session Expired", {timeOut: 200});
		    setTimeout(window.location.href = "Account/Login.aspx", 10000);
		    return;
	    }

        if (btnSave.text().trim() == "Save") 
        {
            //////////////////Save Button/////////////////////////
            res=null;    
            var currdt= new Date();
            currdt = (currdt.getMonth()+1) + '/' + currdt.getDate() + '/' + Math.abs(currdt.getFullYear());
        
            if ($("[id*=drpEmployee] option:Selected").val() != "" )
            {
                //Employee Detail            
                var res =await GetEmployeeDetail($("[id*=drpEmployee] option:Selected").val());
                if (res.response == -1) 
                {
                    ErrMsg =(res.responseMsg);
                    throw ErrMsg;
                }
                var objprpemployeedetail= res.responseObject;

                objPrpJREmphdr = new Object();

                objPrpJREmphdr.emp_cd =  lblempcd.val();
                objPrpJREmphdr.emp_nm = lblonlyempname;  
                objPrpJREmphdr.doj = Convert_StringInDateFormat(lblempdoj.val());  
                objPrpJREmphdr.dept_cd =$("[id*=drpDepartment] option:Selected").val();    
                objPrpJREmphdr.dept_nm =$("[id*=drpDepartment] option:Selected").text();   
                objPrpJREmphdr.desig_cd = objprpemployeedetail.desig_cd; 
                objPrpJREmphdr.desig_nm =lblempdesigname;  
                objPrpJREmphdr.catg_cd =objprpemployeedetail.catg_cd;  
                objPrpJREmphdr.catg_nm =objprpemployeedetail.catg_nm; 
                objPrpJREmphdr.revision_no = lblemprevisionno.val(); 
                objPrpJREmphdr.revision_date =Convert_StringInDateFormat(lblemprevisiondate.val()); 
                objPrpJREmphdr.supersede_no = (lblempsupersedeno.val()=='Nil') ? "-1": lblempsupersedeno.val();  
                objPrpJREmphdr.reason = lblempreason.val();  
                objPrpJREmphdr.luserId =usercd.toString().toUpperCase();  
                objPrpJREmphdr.JR_Detail=get_jrdetail;
                objPrpJREmphdr.isCurrent=1;
                objPrpJREmphdr.btnsave="Save";

                var res1=null; 
                //Save
                res1 = await SaveJREntry(objPrpJREmphdr);
                if (res1.response == -1) 
                {
                    ErrMsg =res1.responseMsg;
                    throw ErrMsg;
                }
                $("[id*=lblf_hdr_id]").text(res1.CheckID);
                $("[id*=lblMessage]").text(res1.responseMsg).css('color', '#008000'); // Green color
                toastr.success(res1.responseMsg, {timeOut: 200});
                btnSave.attr("disabled","disabled");
                $("[id*=drpEmployee] option:Selected").attr("disabled","disabled");
                $(".loader").fadeOut();
                getJRDetail();


                $("[id*=lblMessage]").text("");

            }
        

            ///////////////////end/////////////////////////
        }        
        else if (btnSave.text().trim() == "Update") 
        {
            res=null;
            if ($("[id*=drpEmployee] option:Selected").val() != "" )
            {
                //Employee Detail            
                var res =await GetEmployeeDetail($("[id*=drpEmployee] option:Selected").val());
                if (res.response == -1) 
                {
                    ErrMsg =(res.responseMsg);
                    throw ErrMsg;
                }
                var objprpemployeedetail= res.responseObject;

                objPrpJREmphdr = new Object();

                objPrpJREmphdr.emp_cd =  lblempcd.val();
                objPrpJREmphdr.emp_nm = lblonlyempname;  
                objPrpJREmphdr.doj = Convert_StringInDateFormat(lblempdoj.val());  
                objPrpJREmphdr.dept_cd =$("[id*=drpDepartment] option:Selected").val();    
                objPrpJREmphdr.dept_nm =$("[id*=drpDepartment] option:Selected").text();   
                objPrpJREmphdr.desig_cd = objprpemployeedetail.desig_cd; 
                objPrpJREmphdr.desig_nm =lblempdesigname;  
                objPrpJREmphdr.catg_cd =objprpemployeedetail.catg_cd;  
                objPrpJREmphdr.catg_nm =objprpemployeedetail.catg_nm; 
                objPrpJREmphdr.revision_no = lblemprevisionno.val(); 
                objPrpJREmphdr.revision_date =Convert_StringInDateFormat(lblemprevisiondate.val()); 
                objPrpJREmphdr.supersede_no = (lblempsupersedeno.val()=='Nil') ? "-1": lblempsupersedeno.val(); 
                objPrpJREmphdr.reason = lblempreason.val();  
                objPrpJREmphdr.luserId =usercd.toString().toUpperCase();  
                objPrpJREmphdr.JR_Detail=get_jrdetail;
                objPrpJREmphdr.f_hdr_id=$("[id*=lblf_hdr_id]").text();
                 objPrpJREmphdr.btnsave="Update";
                var res1=null; 
                //Save
                res1 = await SaveJREntry(objPrpJREmphdr);
                if (res1.response == -1) 
                {
                    ErrMsg =res1.responseMsg;
                    throw ErrMsg;
                }
                $("[id*=lblMessage]").text(res1.responseMsg).css('color', '#008000'); // Green color
                toastr.success(res1.responseMsg, {timeOut: 200});
                btnSave.attr("disabled","disabled");
                $("[id*=drpEmployee] option:Selected").attr("disabled","disabled");
                $(".loader").fadeOut();


                $("[id*=lblMessage]").text("");

            }
        }
        }//02-12
    } 
    catch (err) 
    {
          $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
          toastr.error(err, {timeOut: 200});
           $(".loader").fadeOut();
    }
    finally
    {
     $(".loader").fadeOut();
    }
}


//-----Event used for Move to Inbox--------------
async function btncancel_Click()
{
    var btnSave =$("[id*=btnSave]");
    var btnCheck =$("[id*=btnCheck]");
    var btnaction =$("[id*=btnaction]");
    var lblf_hdr_id =$("[id*=lblf_hdr_id]");

   var ErrMsg=null;
    try 
    {
        $(".loader").fadeIn(); 
        var encStr =(getQueryVariable("tag")==false) ? 0 : getQueryVariable("tag").toString(); 
        var tag =null;
        if(encStr !=0)
        {
            tag= await decryptQueryString(encStr);
        }
        else 
        {
            tag=0;
        }

        var empcd = (getQueryVariable("empcd")==false) ? "" : getQueryVariable("empcd").toString().trim();
        var jrId =(getQueryVariable("jrId")==false) ? 0 : parseInt(getQueryVariable("jrId").toString()); 
        if (jrId!=0) 
        {
                var objJRHDR = new Object();
                objJRHDR.f_hdr_id = jrId;
                if(tag==2)
                {
                    objJRHDR.RoleId = 2;
                    objJRHDR.move="Y";                
                }
                else if(tag==4)  //--- HOD Inbox ----------
                {
                    objJRHDR.RoleId = 5;
                    objJRHDR.move="Y";                 
                }                 
                var res=null;
                res=  await JR_MovetoInbox(objJRHDR);
                if (res.response == -1) {
                        ErrMsg =res.responseMsg;
                        throw ErrMsg;
                }
                var msgTxt ="JR has been Moved to First Aurhority Inbox for making Updation";  // res.responseMsg;  //  "JR is Approved and forwarded to HR department Successfully.";
                $("[id*=lblMessage]").text(msgTxt).css('color', '#008000'); // Green color
                toastr.success(msgTxt, {timeOut: 200});
                btnaction.attr("disabled","disabled");    //    .Enabled = False
                btnCheck.attr("disabled","disabled");    //     Enabled = False 
                if(tag==2)
                {
                    strUrl="JROutbox.aspx";
                } 
                if (tag==4) 
                {
                    strUrl="HODApproval.aspx";
                }
                setTimeout(window.location.href = strUrl, 5000);                      
        }
        if (ErrMsg == null) 
        {
            $("[id*=lblMessage]").text("");
        } 

    } 
    catch (err) 
    {
        $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
        toastr.error(err, {timeOut: 200});
        toastr.success(err, {timeOut: 200});       
    }
    finally
    {
      $(".loader").fadeOut(); 
    }
}


function JR_MovetoInbox(com) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/JR_MovetoInbox",
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

function CancelMailFunction(varmivno,varmivyr) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/CancelMailFunction",
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


$("[id*=txteffectivedate]").change(function(){
    var ErrMsg=null;
    try {
        var doj= new Date($("[id*=txtdateofjoining]").val());
        var getDoj = (doj.getMonth()+1) + '/' + doj.getDate() + '/' + Math.abs(doj.getFullYear());

        var effecdt= new Date(this.value);
        var geEffectDt = (effecdt.getMonth()+1) + '/' + effecdt.getDate() + '/' + Math.abs(effecdt.getFullYear());


        if (new Date(geEffectDt) < new Date(getDoj)) {
            ErrMsg="Effective Date should not be less than Date of Joining";
//            $(this).val('');
            throw ErrMsg;
        }
        if (ErrMsg==null) {
            $("[id*=lblMessage]").text("");
        } 
    
    } catch (err) {
        $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
        toastr.error(err, {timeOut: 200});
    }
});


//function MailFunction(varmivno,varmivyr) {
//    return new Promise(function (resolve, reject) {
//        $.ajax({
//            type: "POST",
//            url: "WebService.asmx/MailFunction",
//            data: "{'varmivno' : '" + varmivno + "', 'varmivyr' : '" + varmivyr + "' }",
//            contentType: "application/json;charset=utf-8",
//            dataType: "json",
//            async: false,
//            timeout: 5000,
//            success: function (mData) {
//                var myData = mData.d;
//                resolve(myData);
//            },
//            error: function (jqXHR, exception) {
//                reject(jqXHR.responseJSON.Message);
//            },
//            failure: function (jqXHR, exception) {
//                reject(jqXHR.responseJSON.Message);
//            }
//        });
//    });
//}


function getConfirm(message){
  return new Promise(function(resolve,reject) {
		$('#confirmation').modal("toggle");
        $('#modal-help-text').text(message);
		$('#confirmation .btn-ok').click(function(){
			resolve("OK");
		});
		$('#confirmation .btn-cancel').click(function(){
			resolve("CANCEL");
		});
	});
}










async function btnexit_click()
{
    var strUrl=null;
    var encStr =(getQueryVariable("tag")==false) ? 0 : getQueryVariable("tag").toString(); 
    var tag =null;
    if(encStr !=0)
    {
        tag= await decryptQueryString(encStr);
    }
    else 
    {
        tag=0;
    }

    var empcd = (getQueryVariable("empcd")==false) ? "" : getQueryVariable("empcd").toString().trim();
    var jrId =(getQueryVariable("jrId")==false) ? 0 : parseInt(getQueryVariable("jrId").toString()); 
    if (jrId!=0) 
    {
        if (tag==1) 
        {
            strUrl="JRInbox.aspx";
        }
        else if(tag==2)
        {
            strUrl="JROutbox.aspx";
        }
        else if (tag==3) 
        {
            strUrl="JRFinalApproval.aspx";
        }
        else if (tag==4) 
        {
            strUrl="HODApproval.aspx";
        }
    }
    else 
    {
        strUrl = 'Default.aspx';    
    }
    setTimeout(window.location.href = strUrl, 10000);
}

function validateFloatKeyPress(el, evt) 
{
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var number = el.value.split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) 
    {
        return false;
    }
    //just one dot
    if (number.length > 1 && charCode == 46) 
    {
        return false;
    }
    //get the carat position
    var caratPos = getSelectionStart(el);
    var dotPos = el.value.indexOf(".");
    if (caratPos > dotPos && dotPos > -1 && (number[1].length > 1)) 
    {
        return false;
    }
    return true;
}

function getSelectionStart(o) {
    if (o.createTextRange) 
    {
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


function decryptQueryString(str) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/decryptQueryString",
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



//function check_validation_OtherUsers() 
//{
//    return new Promise(async function(resolve, reject) 
//    {
//       var j=0;
//       var sta =(getQueryVariable("sta")==false) ? 0 : parseInt(getQueryVariable("sta").toString())
//	
//	   $("[id*=lblMessage]").text("");

//        if ($("[id*=txtMivDate]").val() == "" ) 
//        {
//            $("[id*=txtMivDate]").addClass('tabcolor');
//            reject("Select MIV Date"); 
//        }
//        if ($("[id*=txtMivDate]").val() !="" ) 
//        {
//            var mvdt=null;var curdt=null;
//            var mivdt = new Date($("[id*=txtMivDate]").val());
//            mvdt = (mivdt.getMonth()+1) + '/' + mivdt.getDate() + '/' + Math.abs(mivdt.getFullYear());
//            var currdt= new Date();
//            curdt = (currdt.getMonth()+1) + '/' + currdt.getDate() + '/' + Math.abs(currdt.getFullYear());
//            if (new Date(mvdt) > new Date(curdt)) 
//            {
//                $("[id*=txtMivDate]").addClass('tabcolor');
//                reject("Miv Date Can't be greater than Current Date");
//            }
//        }
//        if ($("[id*=drpEmployee] option:selected").val() =="0") 
//        {
//            $("[id*=drpEmployee]").addClass('tabcolor');
//            reject("Select MIV Type");
//        }
//        else 
//        {
//            if($("#MIVTable > tbody > tr").length >0)
//            {
//                $("#MIVTable > tbody > tr").each(function(index, tr)  
//                {
//                    if (parseFloat($(tr.cells[6]).text()) > parseFloat($(tr.cells[5]).text()))
//                    {
//                       $(tr.cells[6]).addClass('tabcolor');
//                        reject("Iss. Qty can not be greater than Stock Qty."); 
//                    }
//                    else if ($(tr.cells[1]).text().length ==0 ) 
//                    {
//                       $(tr.cells[5]).addClass('tabcolor');
//                        reject("Some of Item Code is Blank");                          
//                    }
//                    else if ($(tr.cells[1]).text().length  != 7 ) 
//                    {
//                        $(tr.cells[1]).addClass('tabcolor');
//                        reject("Item Code must be in 7 Character.");
//                    }
//                    else if ($(tr.cells[4]).text().length  <= 0 ) 
//                    {
//                        $(tr.cells[4]).addClass('tabcolor');   
//                        reject("PreStock Qty must greater than zero");                           
//                    }
//                    else if(parseFloat($(tr.cells[5]).text())  <= 0 ) 
//                    {
//                        if(sta < 1) 
//                        {
//                          $(tr.cells[5]).addClass('tabcolor');   
//                            reject("Req Qty must greater than zero");   
//                        }
//				    }
//                    else if (parseFloat($(tr.cells[5]).text()) > parseFloat($(tr.cells[4]).text())) 
//                    {
//                       $(tr.cells[5]).addClass('tabcolor');
//                       reject("Req Qty can not be greater thatn Stock Qty.");     
//                    }
//                    else if (parseFloat($(tr.cells[6]).text()) <= 0) 
//                    {
//                        if ($("[id*=hdfUserID]").val().toUpperCase() != "J16338") 
//                        {
//                            $(tr.cells[6]).addClass('tabcolor');
//                            reject("Iss Qty must greater than zero");    
//                        }
//                    }
//                    else if (parseFloat($(tr.cells[6]).text()) > parseFloat($(tr.cells[5]).text())) 
//                    {
//                        $(tr.cells[6]).addClass('tabcolor');
//                        reject("Iss Qty can not be greater thatn Req Qty");     
//                    }
//                    else if (parseFloat($(tr.cells[7]).text()) < 0) 
//                    {
//                        $(tr.cells[7]).addClass('tabcolor');
//                        reject("Item Rate can't be negative");         
//                    }
//                    else if (parseFloat($(tr.cells[8]).text()) < 0) 
//                    {
//                       $(tr.cells[8]).addClass('tabcolor');
//                        reject("Issue Value can't be negative");         
//                    }				
//                    else if ($(tr).find("[id*=txtcons_cd]").val() == 0) 
//                    {
//                       $(tr).find("[id*=txtcons_nm]").addClass('tabcolor');
//                        reject("Select Consumption Centre");     
//                    }
//                    else if ($(tr).find("[id*=txtcc_cd]").val() == 0) 
//                    {
//                       $(tr).find("[id*=txtcc_nm]").addClass('tabcolor');
//                        reject("This cost centre can't be selected.");        
//                    }
//                    else if ($(tr).find("[id*=txtcc_cd]").val() == "11220" || $(tr).find("[id*=txtcc_cd]").val() == "11930" || $(tr).find("[id*=txtcc_cd]").val() == "11937" || $(tr).find("[id*=txtcc_cd]").val() == "11940" || $(tr).find("[id*=txtcc_cd]").val() == "11941" || $(tr).find("[id*=txtcc_cd]").val() == "11942")                 
//                    {
//                        $(tr).find("[id*=txtcc_nm]").addClass('tabcolor');
//                        reject("This cost centre can't be selected.");       
//                    }
//                    else 
//                    {
//                        $(tr.cells[1]).removeClass('tabcolor');  
//                       $(tr.cells[5]).removeClass('tabcolor');  
//                       $(tr.cells[6]).removeClass('tabcolor');
//                        $(tr.cells[7]).removeClass('tabcolor');
//                        $(tr.cells[8]).removeClass('tabcolor');
//                        $(tr).find("[id*=txtcc_nm]").removeClass('tabcolor');
//                        $(tr).find("[id*=txtcons_nm]").removeClass('tabcolor');

//                        var fg=0;
//                        $("#MIVTable > tbody > tr").each(function(index1, tr1) 
//                        {
//                            if (($(tr.cells[1]).text() == $(tr1.cells[1]).text())  && ($(tr).find("[id*=txtcons_cd]").val() == $(tr1).find("[id*=drpConCen] option:Selected").val())  && ($(tr).find("[id*=txtcons_cd]").val() == $(tr1).find("[id*=drpConCen] option:Selected").val())) 
//                            {
//                                fg++;
//                            }
//                            if (fg > 1 &&  sta != 2) 
//                            {
//                               // $(tr.cells[1]).css('color', '#ff0000'); // Red color
//                               // $(tr).find("[id*=txtcons_nm]").css('backgroundColor', '#ff0000'); // Red color
//                               $(tr.cells[1]).addClass('tabcolor');
//                               $(tr).find("[id*=txtcons_nm]").addClass('tabcolor');
//                                reject("Same Item Can't be Selected For Same Cost/Consumption Centre Again.");  
//                            }
//                            else  
//                            {
////                                $(tr.cells[1]).css('color', '#000000'); // Black color
////                                $(tr).find("[id*=txtcons_nm]").css('backgroundColor', '#fff'); // white color
//                                $(tr.cells[1]).removeClass('tabcolor');
//                                $(tr).find("[id*=txtcons_nm]").removeClass('tabcolor');
//                            }                     
//                        }); 

//					    var io=0;
//					    j=0
//					    if ($(tr.cells[6]).text().length != 0 && $(tr.cells[7]).text().length !=0 ) 
//					    {
//						    if ($(tr.cells[6]).text().length > 0  && $(tr.cells[7]).text().length > 0  ) 
//						    {
//							    $(tr.cells[8]).text(parseFloat($(tr.cells[6]).text()) * parseFloat($(tr.cells[7]).text()));
//							    j += parseFloat($(tr.cells[8]).text());
//						    }
//					    }
////					    resolve("Record is Validated.");
//                        resolve("VALID");
//					    $('tfoot th:eq(8)').text(j);
//                       
//                    }
//			    });
//            }
////            else
////            {
////                reject("detail is empty");
////            }
//            if ($('#MIVTable tr').length < 0)
//            {
//                reject("No Item Detail in Voucher"); 
//            } 
//        }
//	});
//}






//function check_validation() 
//{
//    return new Promise(async function (resolve, reject) 
//    {
//       var j=0;
//       var sta =(getQueryVariable("sta")==false) ? 0 : parseInt(getQueryVariable("sta").toString())
//	
//	   $("[id*=lblMessage]").text("");

//        if ($("[id*=txtMivDate]").val() == "" ) 
//        {
//            $("[id*=txtMivDate]").addClass('tabcolor');
//            reject("Select MIV Date"); 
//        }
//        if ($("[id*=txtMivDate]").val() !="" ) 
//        {
//            var mvdt=null;var curdt=null;
//            var mivdt = new Date($("[id*=txtMivDate]").val());
//            mvdt = (mivdt.getMonth()+1) + '/' + mivdt.getDate() + '/' + Math.abs(mivdt.getFullYear());
//            var currdt= new Date();
//            curdt = (currdt.getMonth()+1) + '/' + currdt.getDate() + '/' + Math.abs(currdt.getFullYear());
//            if (new Date(mvdt) > new Date(curdt)) 
//            {
//                $("[id*=txtMivDate]").addClass('tabcolor');
//                reject("Miv Date Can't be greater than Current Date");
//            }
//        }
//        if ($("[id*=drpEmployee] option:selected").val() =="0") 
//        {
//            $("[id*=drpEmployee]").addClass('tabcolor');
//            reject("Select MIV Type");
//        }
//        else 
//        {
//            if($("#MIVTable > tbody > tr").length >0)
//            {
//                $("#MIVTable > tbody > tr").each(function(index, tr)  
//                {
//                    if (parseFloat($(tr).find("input[id*=txtIssQty]").val()) > parseFloat($(tr).find("input[id*=txtReqQty]").val()))
//                    {
//                        $(tr).find("input[id*=txtIssQty]").addClass('tabcolor');
////                        $(tr).find("input[id*=txtIssQty]").css('backgroundColor', '#FFB6C1');   //Light Pink
//                        reject("Iss. Qty can not be greater than Stock Qty."); 
//                    }
//                    else if ($(tr.cells[1]).text().length ==0 ) 
//                    {
////                        $(tr).find("input[id*=txtReqQty]").css('backgroundColor', '#FFB6C1');   //Light Pink
//                        $(tr).find("input[id*=txtReqQty]").addClass('tabcolor');
//                        reject("Some of Item Code is Blank");                          
//                    }
//                    else if ($(tr.cells[1]).text().length  != 7 ) 
//                    {
//                      //  $(tr.cells[1]).css('backgroundColor', '#FFB6C1');   //Light Pink
//                        $(tr.cells[1]).addClass('tabcolor');
//                        reject("Item Code must be in 7 Character.");
//                    }
//                    else if ($(tr.cells[4]).text().length  <= 0 ) 
//                    {
//                        $(tr.cells[4]).addClass('tabcolor');   
//                        reject("PreStock Qty must greater than zero");                           
//                    }
//                    else if(parseFloat($(tr).find("input[id*=txtReqQty]").val())  <= 0 ) 
//                    {
//                        if(sta < 1) 
//                        {
//                           //$(tr).find("input[id*=txtReqQty]").css('backgroundColor', '#FFB6C1');   //Light Pink
//                           $(tr).find("input[id*=txtReqQty]").addClass('tabcolor');   
//                            reject("Req Qty must greater than zero");   
//                        }
//				    }
//                    else if (parseFloat($(tr).find("input[id*=txtReqQty]").val()) > parseFloat($(tr.cells[4]).text())) 
//                    {
//                        //$(tr).find("input[id*=txtReqQty]").css('backgroundColor', '#FFB6C1');   //Light Pink
//                        $(tr).find("input[id*=txtReqQty]").addClass('tabcolor');
//                        reject("Req Qty can not be greater thatn Stock Qty.");     
//                    }
////                    else if (parseFloat($(tr).find("input[id*=txtIssQty]").val()) <= 0) 
////                    {
////                        if ($("[id*=hdfUserID]").val().toUpperCase() != "J16338") 
////                        {
////                            //$(tr).find("input[id*=txtIssQty]").css('backgroundColor', '#FFB6C1');   //Light Pink
////                            $(tr).find("input[id*=txtIssQty]").addClass('tabcolor');
////                            reject("Iss Qty must greater than zero");    
////                        }
////                    }
//                    else if (parseFloat($(tr).find("input[id*=txtIssQty]").val()) > parseFloat($(tr).find("input[id*=txtReqQty]").val())) 
//                    {
//                        //$(tr).find("input[id*=txtIssQty]").css('backgroundColor', '#FFB6C1');   //Light Pink
//                        $(tr).find("input[id*=txtIssQty]").addClass('tabcolor');
//                        reject("Iss Qty can not be greater thatn Req Qty");     
//                    }
//                    else if (parseFloat($(tr.cells[7]).text()) < 0) 
//                    {
//                       // $(tr.cells[7]).css('backgroundColor', '#FFB6C1');   //Light Pink
//                       $(tr.cells[7]).addClass('tabcolor');
//                        reject("Item Rate can't be negative");         
//                    }
//                    else if (parseFloat($(tr.cells[8]).text()) < 0) 
//                    {
//                       // $(tr.cells[8]).css('backgroundColor', '#FFB6C1');   //Light Pink
//                       $(tr.cells[8]).addClass('tabcolor');
//                        reject("Issue Value can't be negative");         
//                    }				
//                    else if ($(tr).find("[id*=drpConCen] option:Selected").val() == 0) 
//                    {
//                       // $(tr).find("[id*=drpConCen]").css('backgroundColor', '#FFB6C1');   //Light Pink
//                       $(tr).find("[id*=drpConCen]").addClass('tabcolor');
//                        reject("Select Consumption Centre");     
//                    }
//                    else if ($(tr).find("[id*=drpCosCen] option:Selected").val() == 0) 
//                    {
//                       // $(tr).find("[id*=drpCosCen]").css('backgroundColor', '#FFB6C1');   //Light Pink
//                       $(tr).find("[id*=drpCosCen]").addClass('tabcolor');
//                        reject("This cost centre can't be selected.");        
//                    }
//                    else if ($(tr).find("[id*=drpCosCen] option:Selected").val() == "11220" || $(tr).find("[id*=drpCosCen] option:Selected").val() == "11930" || $(tr).find("[id*=drpCosCen] option:Selected").val() == "11937" || $(tr).find("[id*=drpCosCen] option:Selected").val() == "11940" || $(tr).find("[id*=drpCosCen] option:Selected").val() == "11941" || $(tr).find("[id*=drpCosCen] option:Selected").val() == "11942")                 
//                    {
//                        //$(tr).find("[id*=drpCosCen]").css('backgroundColor', '#FFB6C1');   //Light Pink
//                        $(tr).find("[id*=drpCosCen]").addClass('tabcolor');
//                        reject("This cost centre can't be selected.");       
//                    }
//                    else 
//                    {
////                        $(tr.cells[1]).css('backgroundColor', '#fff');   
////                        $(tr).find("input[id*=txtReqQty]").css('backgroundColor', '#fff');   
////                        $(tr).find("input[id*=txtIssQty]").css('backgroundColor', '#fff');   
////                        $(tr.cells[7]).css('backgroundColor', '#fff'); 
////                        $(tr.cells[8]).css('backgroundColor', '#fff');   
////                        $(tr).find("[id*=drpCosCen]").css('backgroundColor', '#fff');   
////                        $(tr).find("[id*=drpConCen]").css('backgroundColor', '#fff');  
//                        $(tr.cells[1]).removeClass('tabcolor');  
//                        $(tr).find("input[id*=txtReqQty]").removeClass('tabcolor');  
//                        $(tr).find("input[id*=txtIssQty]").removeClass('tabcolor');
//                        $(tr.cells[7]).removeClass('tabcolor');
//                        $(tr.cells[8]).removeClass('tabcolor');
//                        $(tr).find("[id*=drpCosCen]").removeClass('tabcolor');
//                        $(tr).find("[id*=drpConCen]").removeClass('tabcolor');

//                        var fg=0;
//                        $("#MIVTable > tbody > tr").each(function(index1, tr1) 
//                        {
//                            if (($(tr.cells[1]).text() == $(tr1.cells[1]).text())  && ($(tr).find("[id*=drpConCen] option:Selected").val() == $(tr1).find("[id*=drpConCen] option:Selected").val())  && ($(tr).find("[id*=drpConCen] option:Selected").val() == $(tr1).find("[id*=drpConCen] option:Selected").val())) 
//                            {
//                                fg++;
//                            }
//                            if (fg > 1 &&  sta != 2) 
//                            {
//                               // $(tr.cells[1]).css('color', '#ff0000'); // Red color
//                               // $(tr).find("[id*=drpConCen]").css('backgroundColor', '#ff0000'); // Red color
//                               $(tr.cells[1]).addClass('tabcolor');
//                               $(tr).find("[id*=drpConCen]").addClass('tabcolor');
//                                reject("Same Item Can't be Selected For Same Cost/Consumption Centre Again.");  
//                            }
//                            else  
//                            {
////                                $(tr.cells[1]).css('color', '#000000'); // Black color
////                                $(tr).find("[id*=drpConCen]").css('backgroundColor', '#fff'); // white color
//                                $(tr.cells[1]).removeClass('tabcolor');
//                                $(tr).find("[id*=drpConCen]").removeClass('tabcolor');
//                            }                     
//                        }); 

//					    var io=0;
//					    j=0
//					    if ($(tr).find("input[id*=txtIssQty]").val().length != 0 && $(tr.cells[7]).text().length !=0 ) 
//					    {
//						    if ($(tr).find("input[id*=txtIssQty]").val().length > 0  && $(tr.cells[7]).text().length > 0  ) 
//						    {
//							    $(tr.cells[8]).text(parseFloat($(tr).find("input[id*=txtIssQty]").val()) * parseFloat($(tr.cells[7]).text()));
//							    j += parseFloat($(tr.cells[8]).text());
//						    }
//					    }
////					    resolve("Record is Validated.");
//                        resolve("VALID");
//					    $('tfoot th:eq(8)').text(j);
//                        
//                    }
//			    });
//            }
////            else
////            {
////                reject("detail is empty");
////            }
//            if ($('#MIVTable tr').length < 0)
//            {
//                reject("No Item Detail in Voucher"); 
//            } 
//        }
//	});
//}



////////////////////STart Control Events //////////////////////////////

async function btnCheck_Click()
{
    var ErrMsg=null;
    var txtjobdesc = $("[id*=txtjobdesc]").val();//sushil 23092021
    try 
    {
        $(".loader").fadeIn();
        var sta =(getQueryVariable("sta")==false) ? 0 : parseInt(getQueryVariable("sta").toString());
        var btncheck =$("[id*=btncheck]");
        var usercd= await  getSessionVariables();
        if (usercd.length ==0)
        {
            $("[id*=lblMessage]").text("Session Expired");
            toastr.error("Session Expired", {timeOut: 200});
            setTimeout(window.location.href = "Account/Login.aspx", 10000);
            return;
        }
        else if(usercd.length != 0)
        {
            $("[id*=hdfempcd]").val(usercd.toString().trim());
           
            var res=null;
            if (usercd.toString().trim().toUpperCase() == "J16338")
            {
                res = await check_validation();            
            }
            else
            {
                res= await check_validation_OtherUsers();
            }

            if (res != "VALID") 
            {
                ErrMsg= res;
                throw ErrMsg; 
            }
            else
            {
                $("[id*=JREntryDetail]").find("input,button,textarea,select").removeClass('tabcolor');
                var result="Record is Validated.";
                $("[id*=lblMessage]").text(result).css('color', '#008000'); // Green color
                toastr.success( result, {timeOut: 200});

                $("[id*=btnSave]").show();
                $("[id*=btnSave]").removeAttr("disabled");
                $("[id*=btnaction]").hide();
                if (sta == 1  && $("[id*=btnSave]").text() == "Update" && $("[id*=btnaction]").text() == "Approve") 
                {
                    $("[id*=btncancel]").show();
                }
                else 
                {
                    $("[id*=btncancel]").hide();
                }
         
            }
        }

        if (ErrMsg ==null) 
        {
            $("[id*=lblMessage]").text("");
        }
        $(".loader").fadeOut();    
    } 
    catch (err) 
    {
        if (err != null && err !== undefined) 
        {
//            $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color 
//            toastr.error( err, {timeOut: 200});
//            $(".loader").fadeOut(); 
        }
    }
}

function validationInAdd()
{
    return new Promise(function(resolve,reject){
         $("[id*=txtIssueQty]").val($("[id*=txtReqireQty]").val());
        if($("[id*=drpEmployee] option:Selected").val()=="0")
        {
           $("[id*=drpEmployee]").addClass('tabcolor');
            reject("Select Type");
        }
        else if ($("[id*=drpEmployee] option:Selected").val() == "P" && $("[id*=drpRetTyp] option:Selected").val() == "0") 
        {
            $("[id*=drpRetTyp]").addClass('tabcolor');
             reject("Select Nature.");     
        } 
        else if($("[id*=drpEmployee] option:Selected").val() == "P" && $("[id*=txtRetRes]").val().length ==0)
        {
            $("[id*=txtRetRes]").addClass('tabcolor');
            reject("Reason/Activity Name is required");
        }
        else if ($("input[id*=txtitmCd]").val().length == 0 || $("input[id*=txtitmCd]").val()=="0" ) 
        { 
            $("input[id*=txtitmCd]").addClass('tabcolor');
           reject("Item Code Can't be Blank.");
        }
        else if ($("[id*=txtReqireQty]").val() == 0) 
        {
           $("[id*=txtReqireQty]").addClass('tabcolor');
           reject("Requested Qty Can't be Blank.");     
        }
        else if ($("[id*=txtReqireQty]").val() <= 0) 
        {
           $("[id*=txtReqireQty]").addClass('tabcolor');
           reject("Requested Qty should be greated that zero.");     
        }  
        else if (parseFloat($("[id*=txtReqireQty]").val()) > parseFloat($("[id*=txtPreStk]").val())) 
        {
            $("[id*=txtReqireQty]").addClass('tabcolor');
            reject("Requested Qty Can't be greater than Stock Qty.");     
        }   
        else if ($("[id*=txtIssueQty]").val().length == 0) 
        {
            $("[id*=txtIssueQty]").addClass('tabcolor');
            reject("Issue Qty Can't be Blank.");       
        }         
        else if ($("[id*=txtIssueQty]").val().length <= 0) 
        {
             $("[id*=txtIssueQty]").addClass('tabcolor');
            reject("Issue Qty should be greated than zero.");      
        }   
        else if ($("[id*=txtIssueQty]").val() > $("[id*=txtReqireQty]").val()) 
        {
             $("[id*=txtIssueQty]").addClass('tabcolor');
            reject("Issue Qty Can't be greater than Req. Qty.");     
        }  
        else if ($("[id*=drpConCen] option:Selected").val() == "0") 
        {
             $("[id*=drpConCen]").addClass('tabcolor'); 
            reject("Select Consumption Centre.");      
        }   
        else if ($("[id*=drpCosCen] option:Selected").val() == "0") 
        {
            $("[id*=drpCosCen]").addClass('tabcolor'); 
            reject("Select cost Centre.");      
        }    
        else if ($("[id*=drpCosCen] option:Selected").val() == "11220" || $("[id*=drpCosCen] option:Selected").val() == "11929" || $("[id*=drpCosCen] option:Selected").val() == "11930" || $("[id*=drpCosCen] option:Selected").val() == "11937" || $("[id*=drpCosCen] option:Selected").val() == "11940" || $("[id*=drpCosCen] option:Selected").val() == "11941" || $("[id*=drpCosCen] option:Selected").val() == "11942")                 
        {
            $("[id*=drpCosCen]").addClass('tabcolor'); 
            reject("This cost centre can't be selected.");  
        }   
        else 
        {
            if ($("[id*=drpCosCen] option:Selected").val() == "12048" && $("[id*=txtRemark]").val().length ==0 ) 
            {
                $("[id*=drpCosCen]").addClass('tabcolor'); 
                reject("Please give remark in case Rejected Material Return");    
            }
         }           
        resolve("Validate");
    });
}


async function btnadd_Click()
{
	var usercd= await  getSessionVariables();
	if (usercd.length ==0)
	{
        $("[id*=JREntryDetail]").find("input,button,textarea,select").removeClass('tabcolor');
		$("[id*=lblMessage]").text("Session Expired").css('color', '#ff0000'); // Red color
		toastr.error("Session Expired", {timeOut: 200});
		setTimeout(window.location.href = "Account/Login.aspx", 10000);
		return;
	}

    $(".loader").fadeIn();
    $("[id*=lblMessage]").text(""); 
    validationInAdd().then(async function(result)
    {
        $("[id*=JREntryDetail]").find("input,button,textarea,select").removeClass('tabcolor');
        $("[id*=lblMessage]").text(""); 

        
    }).catch(function(error)
    {

        $("[id*=lblMessage]").text(error).css('color', '#ff0000'); // Red color
        toastr.error( error, {timeOut: 200});
        $(".loader").fadeOut();  
    });  

}



//19-05-2022----->

function getJRRevision(usercd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/getJRRevision",
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



function JR_MaxgetUserRole(usercd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/JR_MaxgetUserRole",
            data: "{'emp_cd' : '" + usercd + "'}",
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

function JR_getUserRole(usercd,auth_cd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/JR_getUserRole",
            data: "{'emp_cd' : '" + usercd + "', 'auth_cd' : '" + auth_cd + "'}",
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
    $("#loader").fadeIn();
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
            
            var res= await  getJRRevision(usercd);
            if (res.response ==-1) 
            {
               // ShowEmptyTable();
               $('#JRRevisionTable').dataTable().fnClearTable();
               	$(".dataTables_length").hide();       //  -----Hide Show Number of Entry 
                $(".dataTables_filter").hide();   //--HIde Search label and textbox         });
                setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 100);
                ErrMsg= res.responseMsg;
                throw ErrMsg;
            }
            var myData = res.responseObjectList;
            $("#loader").fadeOut();
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
        $("#loader").fadeOut();
    }
    finally
    {
         // Hide image container
        $("#loader").fadeOut();   
    }
}



function populateGrid(myData)
{
    return new Promise(function(resolve,reject)
    {
        var table = $('#JRRevisionTable').removeAttr("width").DataTable({
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
                { 'data': 'catg_cd' },
                { 'data': 'revision_no' },
                { 'data': 'revision_date','visible': false},
                { 'data': 'supersede_no' },
                { 'data': 'reason' },
            ],
            "language": {
                "emptyTable": "No Data Found"
            },
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
      //  table.order( [ 4, 'desc' ] ).draw();
        setTimeout(function(){$.fn.dataTable.tables( { visible: false, api: true } ).columns.adjust().fixedColumns().relayout();}, 1000);                   
    
    });
}


function ShowEmptyTable()
{
   // $('#PendingJRTable').removeAttr("width").DataTable({
   $('#JRRevisionTable').removeAttr("width").DataTable({
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

//19-05-2022----->



////////////////////End Control Events/////////////////////////////////


