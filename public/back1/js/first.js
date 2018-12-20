

$(function(){
    var currentPage=1;
    var currentSize=5;
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                "page":currentPage,
                "pageSize":currentSize
            },
            dataType:"json",
            success:function( info){
                // console.log( info );
                var strHtml=template("firstTip",info);
                // console.log(strHtml);
                
                $("tbody").html(strHtml);
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:currentPage,//当前页
                    totalPages:Math.ceil(info.total / info.size),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,page){
                        currentPage=page;
                        render();
                    }
                  });
                
            }
    })
}

// 模态宽
$("#addCbtn").on("click",function(){
    
    $("#addModal").modal('show');
    //点击添加时发送ajax

   

})


//文本宽验证
$("#form").bootstrapValidator({

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 校验的字段
    fields: {
      categoryName: {
        // 校验规则
        validators: {
          // 非空检验
          notEmpty: {
            // 提示信息
            message: "请输入一级分类名称"
          }
        }
      }
    }
  });
 /*
  * 2. 注册表单校验成功事件, 在校验成功时, 会触发
  *    在事件中阻止默认的提交(会跳转), 通过ajax进行提交(异步)
  * */
 $('#form').on("success.form.bv", function( e ){
     //阻止默认提交
        e.preventDefault();
        
            $.ajax({
                url:"/category/addTopCategory",
                type:"post",
                data:$("#form").serialize(),
                dataType:"json",
                success:function( info ){
                 //    console.log( info );
                    if(info.success){
                        $("#addModal").modal("hide");
                         currentPage=1;
                        //重新渲染
                        render();

                        //重置表单
                        $("#form").data('bootstrapValidator').resetForm(true);
                    }
                    
                }
            })
         })


})