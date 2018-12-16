//进入页面判断是否登入
$.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    dataType:"json",
    success:function( res ){
        // console.log( res );
        if(res.error==400){
            location.href="login.html";
        }
        if(res.success){
            console.log("登入成功");
            
        }
        
    }

})