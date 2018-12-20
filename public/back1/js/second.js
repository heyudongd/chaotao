
$(function () {
    var currentPage = 1;
    var currentSize = 5;
    render();
    function render() {
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            dataType: "json",
            data: {
                page: currentPage,
                pageSize: currentSize
            },
            success: function (info) {
                // console.log(info);

                var strHtml = template("secondTip", info);
                $("tbody").html(strHtml);
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: currentPage,//当前页
                    totalPages: Math.ceil(info.total / info.size),//总页数
                    size: "small",//设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, page) {
                        currentPage = page;
                        render();
                    }
                });

                //点击发送ajax 变显示摸德框
                $("#addTwoCbtn").on("click", function () {
                    $("#addTwoModal").modal("show");
                    $.ajax({
                        type: "get",
                        url: "/category/queryTopCategoryPaging",
                        data: {
                            "page": 1,
                            "pageSize": 100
                        },
                        dataType: "json",
                        success: function (info) {
                            // console.log( info );
                            var strHtml = template("firstTwoTip", info);
                            $(".dropdown-menu").html(strHtml);

                        }
                    })
                })

            }
        })
    }

    //文件上传fileupload
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            //   console.log(data.result.picAddr);
            $("#imgs").attr("src", data.result.picAddr)
            $('[name="brandLogo"]').val(data.result.picAddr)
              // 重置校验状态
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
        }
    });

    //下拉宽选中显示对应内容
    $("#ulli").on("click", "a", function () {
        var tex = $(this).text();
        var id = $(this).data("id");

        //给隐藏域添加vaule
        $('[name="categoryId"]').val(id);
        // console.log(id);

        $("#dropdownText").text(tex);
         // 重置校验状态
         $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
    })
    //表单验证
    $("#form").bootstrapValidator({
         //excluded:[":hidden",":disabled",":not(visible)"] ,//bootstrapValidator的默认配置
    // excluded:[":disabled"],//关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证
        excluded: [],
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 校验的字段
        fields: {
            brandName: {
                // 校验规则
                validators: {
                    // 非空检验
                    notEmpty: {
                        // 提示信息
                        message: "请输入二级分类名称"
                    }
                }
            },
            // 一级分类的id
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            // 图片的地址
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }

        }
    });
    $('#form').on("success.form.bv", function (e) {
        // 阻止默认的提交
        e.preventDefault();
       $.ajax({
        url: "/category/addSecondCategory",
        type: "post",
        data: $('#form').serialize(),
        dataType:"json",
        success:function(info){
            // console.log(info);
            //关闭模态框
            $("#addTwoModal").modal("hide")
            // 重置表单里面的内容和校验状态
        $('#form').data("bootstrapValidator").resetForm( true );

        // 重新渲染第一页
        currentPage = 1;
        render();
        //重置文本
        $("#dropdownText").text("请选择一级分类");


         // 找到图片重置
         $('#imgs').attr("src", "images/none.png")
        }
       })
    })
})