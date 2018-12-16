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
                if(res.success){
                    location.href="login.html";
                }
                
            }
        });
      })

    //左边菜单掩藏
    $(".icon_left").on("click",function(){
        $(".lt_aside").toggleClass("hidemenu")
        $(".lt_main").toggleClass("hidemenu")
        $('.lt_topbar').toggleClass("hidemenu");
    })


})
NProgress.configure({ showSpinner: false });
//// 开启进度条
//NProgress.start();
//
//setTimeout(function() {
//  // 关闭进度条
//  NProgress.done();
//}, 500)


// ajaxStart 所有的 ajax 开始调用
$(document).ajaxStart(function() {
    NProgress.start();
  });
  
  
  // ajaxStop 所有的 ajax 结束调用
  $(document).ajaxStop(function() {
    // 模拟网络延迟
    setTimeout(function() {
      NProgress.done();
    }, 500)
  });