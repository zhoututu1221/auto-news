$(function () {

    $.ajax({
        url: "/isLogin",
        type: 'POST',
        data: {
        },
        success: function(result){
            if(result == 0){
                window.open("/admin/adminLogin.html","_self");
            }
        },
        error:function(e){
            console.log(e.status);
        }
    });

});