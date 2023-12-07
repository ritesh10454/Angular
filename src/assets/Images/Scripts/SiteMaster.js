$(document).ready(function(){
    SetMenu();
    $("#issueBody").removeClass("sidebar-mini");
    $("#issueBody").removeClass("layout-fixed");
    function disableBack() {window.history.forward()}

    window.onload = disableBack();
    window.onpageshow = function (evt) {if (evt.persisted) disableBack()}   

});


//window.onbeforeunload  = function () {
//  e.preventDefault()
//  return (e.returnValue = 'Are you sure you want to close?')
//}


//$(window).on('beforeunload',function(e) {
//e.stopPropogation();
//e.preventDefault();
//  alert("Hello");
//    e = e || window.event;
////  e.preventDefault();
////  var localStorageTime = localStorage.getItem('usrnam')
////  if(localStorageTime!=null && localStorageTime!=undefined){
////  	var currentTime 	= new Date().getTime(),
////				timeDifference 	= currentTime - localStorageTime;
////  	
////    if(timeDifference<25){
////     	//Browser Closed
////      console.log('Browser Closed')
////      localStorage.removeItem('usrnam')
////    }else{
////    	//Browser Tab Closed
////      console.log('Browser Tab Closed');
////      localStorage.setItem('usrnam',new Date().getTime());
////    }
////  
////  }else{
////  	localStorage.setItem('usrnam',new Date().getTime());
////  }
//})



async function SetMenu() {
    var adminMenu = $("#mnu_Admin");
    var mainMenu = $("#mnu_Main");
    var actionMenu = $("#mnu_Action");
    var reportMenu = $("#mnu_Report");
    var usercd= await  getSessionVariables();
    if (usercd.length ==0)
    {
        $("[id*=lblMessage]").text("Session Expired").css('color', '#ff0000'); // Red color
        toastr.error("Session Expired", {timeOut: 200});
        setTimeout(window.location.href = "Account/Login.aspx", 10000);
//        var strUrl = 'login.aspx';
//        setTimeout(window.location.href = strUrl, 10000); 
        return;
    }
    if(usercd.length > 0)
    {
        if(usercd.toUpperCase() != "H21083") 
        {
            adminMenu.hide();
        }
    }
//    var sess = await getSessionVariables();
//    var usercd=sess.toString();
//    if (isEmpty(usercd.toString())) {
//        var strUrl = 'login.aspx';
//        setTimeout(window.location.href = strUrl, 10000);    
//    }
//    else if(usercd.toUpperCase() != "H21083") {
//        adminMenu.hide();
//    }
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