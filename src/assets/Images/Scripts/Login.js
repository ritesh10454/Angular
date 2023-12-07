$(document).ready(function () {
//    LoginFormSet();
Login_Load();
});

$(document).bind('keypress', function(e) {
    if(e.keyCode==13){
            $('#btnSignIn').trigger('click');
        }
});



//$(document).keypress(function(e) {
//    if(e.which == 13) {
//        $(document.activeElement).next().focus();
//    }
//});

async function Login_Load() 
{
    var lblMessage = $("[id*=lblMessage]");
    var txtusrnam = $("input[id*=txtusrnam]");
    var txtusrpwd = $("input[id*=txtusrpwd]");
    var lblhitcou = $("input[id*=lblhitcou]");
    var ErrMsg = null;
    try {
//        txtusrnam.focus();
        $("[id*=profile-img]").focus();
        var res= await getHIT_Counter();
        if (res.response == -1) 
        {
            ErrMsg = res.responseMsg;
            throw ErrMsg;   
        }
        var counter =res.responseObject;
        lblhitcou.text(counter.hit_cou);
        var res1 =await save_LV_Emp_Detail(counter);
        if (res1.response == -1) 
        {
            ErrMsg = res1.responseMsg;
            throw ErrMsg;   
        }
        if(ErrMsg== null)
        {
            lblMessage.text("");
        }
    } 
    catch (err) 
    {
        lblMessage.text(err).css('color', '#ff0000'); // Red color
    }
}


async function btnsignin_click() 
{
//    var lblSts = $("[id*=lblSts]");
    var lblMessage = $("[id*=lblMessage]");
    var txtusrnam = $("input[id*=txtusrnam]");
    var txtusrpwd = $("input[id*=txtusrpwd]");
    var ErrMsg = null;
    try 
    {
        if (txtusrnam.val().length == 0) {
            ErrMsg = "Please Enter User Name";
            txtusrnam.focus();
            throw ErrMsg;
        }
        else if (txtusrpwd.val().length == 0) {
            ErrMsg = "Please Enter Password";
            txtusrpwd.focus();
        }
        var res = await Check_Login(txtusrnam.val().toUpperCase(),txtusrpwd.val())
        if(res.response == -1)
        {
            ErrMsg=res.responseMsg;
            throw ErrMsg;
        }
        if(res.response ==1)
        {
            sessionStorage.setItem("usrnam", txtusrnam.val().trim().toUpperCase());
            setTimeout(window.location.href = "../Default.aspx", 10000);
        }
        else if(res.response != -1 && res.response !=1)
        {
            ErrMsg=res.responseMsg;
            throw ErrMsg;            
        }


        if(ErrMsg== null)
        {
            lblMessage.text("");
        }
    }
    catch (err) 
    {
        lblMessage.text(err).css('color', '#ff0000'); // Red color
    }
}


function getHIT_Counter() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/getHIT_Counter",
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

function save_LV_Emp_Detail(com) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/save_LV_Emp_Detail",
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


function Check_Login(usernm,pwd) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/Check_Login",
            data: "{'usernm' : '" + usernm + "', 'pwd' : '" + pwd + "' }",
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





//function LoginFormSet() {
//    $(".nav-item").hide();
//    $('body').addClass("sidebar-collapse");
//    $("#libreadcrumbItems").hide();
//    $("body").addClass('sidebar-collapse');


//function OtherFormSet() {
//    $(".nav-item").show();
//    $('body').removeClass("sidebar-collapse");
//    $("#libreadcrumbItems").show();
//    //ChangeBreadCrumb("", "", "");
//}