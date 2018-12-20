

$(function(){
    var currentPage=1;
    var currentSize=5;
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/user/queryUser",
            data:{
                "page":currentPage,
                "pageSize":currentSize
            },
            dataType:"json",
            success:function( info ){
                // console.log( info );
                var strHtml=template("usrtip",info);
                // console.log(strHtml);
                $("tbody").html(strHtml);
              
                $("#paginator").bootstrapPaginator({
                   
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:currentPage,//当前页
                    totalPages:Math.ceil(info.total / info.size),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,page){
                      //为按钮绑定点击事件 page:当前点击的按钮值
                      currentPage=page;

                      render();
                        
                    }
                  });
                
            }
        })
    }


    // 模态框
    $("tbody").on("click",".btn",function(){
        //显示模态框
        $('#myModal').modal('show')
        //拿到对应的id
        var id=$(this).parent().data("id");
        //判断是什么状态
        var isDelete=$(this).hasClass("btn-success")?1:0;
        // console.log(isDelete);
        //点击确定时 发送ajax请求 改变状态重新渲染
        $('#submitBtn').on("click", function() {

        $.ajax({
            url:"/user/updateUser",
            type:"POST",
            dataType:"json",
            data:{
                id:id,
                isDelete:isDelete
            },
            success:function( info ){
                // console.log(info);
                if( info.success ){
                    $("#myModal").modal("hide");
                    //重新渲染
                    render();
                }
                
            }
        })
        // console.log(id);
    }); 
    })
   
   
})