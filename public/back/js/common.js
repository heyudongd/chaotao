$(function(){
    // 二级导航栏切换
    $(".category").on("click",function(){
        $(".nav .child").stop().slideToggle();
        
    });

     // 二级导航栏切换 点击高亮


     //点击弹出模态框
     $(".icon_right").on("click",function(){
        
        $('#myModal').modal('show');
     })


      // 4. 在外面注册 logoutBtn 退出按钮, 点击事件
      $("#logoutBtn").on("click",function(){
        //   
        $.ajax({
            url:"/employee/employeeLogout",
            type:"get",
            dataType:"json",
            success:function( res ){
                console.log( res );
                
            }
        });
      })

})