$(document).ready(function () {
BindMenu();
getSetWelcomeMessage();

});

async function getSetWelcomeMessage()
{
    var ErrMsg=null;
    var userName_Link= $("[id*=userName_Link]");
    try 
    {
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
            var res= await Set_Welcome_Message(usercd.toString().trim());
            if (res.response ==-1) {
                ErrMsg = res.responseMsg;
                throw ErrMsg;
            }        
            userName_Link.text(String.format("Welcome, {0}", res.responseObject.empnm));
            userName_Link.removeAttr("href");
            userName_Link.css('color', '#6f42c1');       
        }
        if(ErrMsg ==null)
        {
            $("[id*=lblMessage]").text("");
        }
    } 
    catch (err) 
    {
        $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
    // Hide image container
    $("#loader").fadeOut();   
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

async function populateMenu(myData) {
    var ErrMsg=null;
    try {
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
            var navrows =null;
            var menuBar = $("[id*=navigation1]");
            navrows = '<li class="nav-item menu-open"><a href="Default.aspx" class="nav-link active" ><i class="nav-icon fas fa-tachometer-alt"></i><p>Home<i class="right fas fa-angle-left"></i></p></a></li>';
            menuBar.append(navrows);
            var reportData= myData;
            for (var i = 0; i < reportData.length; i++) 
            {
                navrows =null;
                navrows =  String.format('<li class ="nav-item"><a href="{0}" class="nav-link"><i class="nav-icon fas fa-edit"></i><p>{1}<i class="fas fa-angle-left right"></i></p></a>{2}',(isEmpty(reportData[i].Url))?"#":reportData[i].Url.toString().trim(),reportData[i].Title.toString().trim(), (isEmpty(reportData[i].Url)) ? '<ul class="nav nav-treeview">' : '</li>' );
    //            menuBar.append(navrows);
            
                var res= await getJRMenus(parseInt(reportData[i].RoleId.toString()),parseInt(reportData[i].MenuId.toString()), usercd.toString().trim());
                if(res.response!=-1)
                {
                    var resdata= res.responseObjectList;
                    for (var c = 0; c < resdata.length;c++) 
                    {
                        if(c==resdata.length)
                        {
                            navrows += String.format('<li class="nav-item"><a href="{0}" class="nav-link"><i class="far fa-circle nav-icon"></i><p>{1}</p></a></li></ul></li>',(isEmpty(resdata[c].Url))?"#":resdata[c].Url.toString().trim(),resdata[c].Title.toString().trim());
                        }
                        else 
                        {
                            navrows +=String.format('<li class="nav-item"><a href="{0}" class="nav-link"><i class="far fa-circle nav-icon"></i><p>{1}</p></a></li>',(isEmpty(resdata[c].Url))?"#":resdata[c].Url.toString().trim(),resdata[c].Title.toString().trim());
                        }
                    }
                } 
                menuBar.append(navrows);                  
            }
            navrows =null;
            navrows ='<li class ="nav-item"><a href="#" class="nav-link" onclick="ClickLogout();"><i class="nav-icon fas fa-question-circle"></i><p>Log Out<i class="fas fa-angle-left right"></i></p></a></li>';
            menuBar.append(navrows);  
        }          
    } catch (err) {
        $("[id*=lblMessage]").text(err).css('color', '#ff0000'); // Red color
        toastr.error(err, {timeOut: 200});;
    }
}



async function ClickLogout()
{
var res= await clearSession();
if(res != "OK")
{
    
}
    setTimeout(window.location.href = "Account/Login.aspx", 10000);
}

function clearSession() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/clearSession",
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



function Set_Welcome_Message(usercd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/Set_Welcome_Message",
             data: "{'usercd' : '" + usercd + "' }",
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

function getUserRole(usercd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetUserRole",
            data: "{'usercd' : '" + usercd + "' }",
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

function getMenuRole(usercd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "WebService.asmx/GetMenuRole",
            data: "{'usercd' : '" + usercd + "' }",
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






function getJRMenus(roleID,parentID,usercd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
			url: "WebService.asmx/getJRMenus",
			data: "{'roleID' : " + roleID + ",'parentID' : " + parentID + ",'usercd' : '" + usercd + "'}",
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



async function BindMenu() {
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
//            var res1= await getUserRole(usercd.toString().trim());
//            if (res1.response == -1) 
//            {
//                ErrMsg= res1.responseMsg;
//                throw ErrMsg;               
//            }
//            
//            var isUser=false, isDTC=false, isFirstAuth=false, isFinalAuth=false, isHRAuth=false;
//            var  _RoleId0 =0, _RoleId1 =0, _RoleId2 =0, _RoleId3 =0, _RoleId4 =0;
//            var roleData= res1.responseObjectList;
//            for (var i = 0; i < roleData.length; i++) 
//            {
//                if (parseInt(roleData[i].RoleId.toString())==2) {
//                    isUser=true; _RoleId0=2;
//                }
//                if (parseInt(roleData[i].RoleId.toString())==3) {
//                    isFirstAuth=true; _RoleId1=3;
//                }
//                if (parseInt(roleData[i].RoleId.toString())==4) {
//                    isDTC=true; _RoleId2=4;
//                }
//                if (parseInt(roleData[i].RoleId.toString())==5) {
//                    isFinalAuth=true; _RoleId3=5;
//                }
////                if (parseInt(roleData[i].RoleId.toString())==6) {
////                    isHRAuth=true; _RoleId4=6;
////                }
//            }
//            var res=null;
//            if(isUser==true && isDTC==true && isFirstAuth==true && isFinalAuth==true)   // && isHRAuth==true)
//            {
//                res= await  getJRMenus(_RoleId3,0);
//            }
//            else if(isUser==true && isDTC==false && isFirstAuth==true && isFinalAuth==true)
//            {
//                res= await  getJRMenus(_RoleId3,0);
//            }
//            else if(isUser==true && isDTC==false && isFirstAuth==false && isFinalAuth==true)
//            {
//                 res= await  getJRMenus(_RoleId3,0);          
//            }
//            else if(isUser==true && isDTC==false && isFirstAuth==true && isFinalAuth==false)
//            {
//                 res= await  getJRMenus(_RoleId1,0);          
//            }
//            else if(isUser==true && isDTC==false && isFirstAuth==false && isFinalAuth==false)
//            {
//                 res= await  getJRMenus(_RoleId0,0);          
//            }
//            else if(isUser==true && isDTC==true && isFirstAuth==false && isFinalAuth==false)
//            {
//                 res= await  getJRMenus(_RoleId2,0);          
//            }
            
           // var res= await  getJRMenus(res1.responseObject.RoleId,0);

            var res1 = await getMenuRole(usercd.toString().trim());
            if (res1.response == -1) 
            {
                ErrMsg= res1.responseMsg;
                throw ErrMsg;               
            }

            var res= await  getJRMenus(res1.responseObject.RoleId,0,usercd.toString().trim(),usercd.toString().trim());
            if (res.response ==-1) 
            {
                ErrMsg= res.responseMsg;
                throw ErrMsg;
            }
            $("#loader").fadeOut();
            var myData = res.responseObjectList;
            populateMenu(myData).catch(function(reason){ErrMsg="An Error found during populate the Menu";  throw ErrMsg;}); 
        }
        // Hide image container
        $("#loader").fadeOut();
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