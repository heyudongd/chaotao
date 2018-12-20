$(function () {
    var currentPage = 1;
    var pageSize = 3;
    var picArr = []; // 专门用来保存图片对象
    render();
    function render() {
        $.ajax({
            url: "/product/queryProductDetailList",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                var htmlStr = template("productTip", info);
                $("tbody").html(htmlStr);

                $('#pagintor').bootstrapPaginator({
                    // 指定版本
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    // 给下面的页码添加点击事件
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                });

            }
        });
    }


    // 点击显示模态框 便发送ajax请求显示数据
    $("#addproCbtn").on("click", function () {
        $("#addProModal").modal("show");
        // 便发送ajax请求二级显示数据
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                // console.log( info );

                var htmlStr = template("secondTip", info);
                $(".dropdown-menu").html(htmlStr);

            }
        })
    })

    // 给下拉列表注册事件点击时改变文本内容
    $(".dropdown-menu").on("click", "a", function () {
        //获取内容
        var text = $(this).text();
        //修改内容
        $("#dropdownText").text(text);

        //获取ID
        var id = $(this).data("id");
        // 把对应的id赋值给掩藏域
        // 设置隐藏域
        $('[name="brandId"]').val(id);
    });
    // 4. 配置上传图片回调函数
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            // console.log(data);
            // 获取图片地址对象
            var picObj = data.result;
            //获取图片路径
            var picAddr = picObj.picAddr;
            // console.log(picAddr);

            //把获取的文件对象添加到数组的第一项
            picArr.unshift(picObj)

            // console.log(picArr);
            
            //把获取的文件添加到 imgBox 盒子里
            $('#imgBox').prepend('<img src="' + picAddr + '" width="100">');

            //判断是否有三张图片如果有删除最后一张 把页面重新渲染
            if (picArr.length > 3) {
                //删除最后一项
                picArr.pop();

                $("#imgBox img:last-of-type").remove();
            }
            // 如果处理后, 图片数组的长度为 3, 说明已经选择了三张图片, 可以进行提交
            // 需要将表单 picStatus 的校验状态, 置成 VALID
            if (picArr.length === 3) {
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID")
            }


        }
    });
      // 5. 配置表单校验
  $('#form').bootstrapValidator({
    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 配置校验字段
    fields: {
      // 二级分类id, 归属品牌
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      // 商品名称
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      // 商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      // 商品库存
      // 要求: 必须是非零开头的数字, 非零开头, 也就是只能以 1-9 开头
      // 数字: \d
      // + 表示一个或多个
      // * 表示零个或多个
      // ? 表示零个或1个
      // {n} 表示出现 n 次
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 32-40'
          }
        }
      },
      // 商品价格
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      // 商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      // 标记图片是否上传满三张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });

    // 6. 注册校验成功事件
    $("#form").on("success.form.bv", function( e ) {
        // 阻止默认的提交
        e.preventDefault();
    
        // 表单提交得到的参数字符串
        var params = $('#form').serialize();
    
        // 拼接上所有的图片参数
        params += "&picArr=" + JSON.stringify( picArr );
    
        // 通过 ajax 进行添加请求
        $.ajax({
          url: "/product/addProduct",
          type: "post",
          data: params,
          success: function( info ) {
            // console.log( info )
            if (info.success) {
              // 关闭模态框
              $('#addProModal').modal("hide");
              // 重置校验状态和文本内容
              $('#form').data("bootstrapValidator").resetForm(true);
              // 重新渲染第一页
              currentPage = 1;
              render();
    
              // 手动重置, 下拉菜单
              $('#dropdownText').text("请选择二级分类")
    
              // 删除结构中的所有图片
              $('#imgBox img').remove();
              // 重置数组 picArr
              picArr = [];
    
            }
          }
        })
      })
})